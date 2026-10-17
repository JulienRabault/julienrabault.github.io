// Défenses en amont du modèle : taille des corps, rafales, interrupteur, défi anti-robot, jeton admin.
// Le quota du jour (chat.js, D1) borne la dépense ; ce module empêche qu'un robot l'épuise à la place des visiteurs.

const encoder = new TextEncoder();

// ─── Cryptographie partagée ───

export function toBase64Url(buffer) {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparaison en temps constant pour deux chaînes de même longueur. */
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Les deux jetons sont hachés d'abord : la comparaison ne dit rien de la longueur du secret. */
export async function tokenMatches(given, expected) {
  if (typeof given !== "string" || !given || typeof expected !== "string" || !expected) return false;
  const [a, b] = await Promise.all([sha256Hex(given), sha256Hex(expected)]);
  return safeEqual(a, b);
}

// ─── Corps de requête ───

// Trois réponses signées de 6 000 caractères tiennent dans 32 Kio, accents compris.
// Six échanges d'historique, à 10 000 caractères au plus par réponse.
export const BODY_LIMITS = { chat: 96 * 1024, legacyChat: 4 * 1024, events: 4 * 1024 };

export class BodyError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

/**
 * Lit un objet JSON d'au plus `maxBytes` octets. Un Content-Length trop grand est refusé sans lecture ;
 * la taille est revérifiée en lisant, puisqu'un client peut mentir ou envoyer par morceaux.
 */
export async function readBoundedJson(request, maxBytes) {
  const declared = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyError(413, "too_large");
  if (!request.body) return {};

  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new BodyError(413, "too_large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const text = new TextDecoder().decode(bytes);
  if (!text.trim()) return {};

  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new BodyError(400, "invalid");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new BodyError(400, "invalid");
  return value;
}

export const isJsonRequest = (request) => (request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json");

// ─── Qui demande ───

/**
 * Clé réseau d'un visiteur : l'adresse IPv4 entière, ou le préfixe /64 d'une IPv6.
 * Un abonné reçoit souvent tout un /64 : sans ce regroupement, il changerait d'adresse à chaque question.
 */
export function networkKey(ip) {
  if (typeof ip !== "string" || !ip) return "unknown";
  if (!ip.includes(":")) return ip;
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  if (mapped) return mapped[1];
  const [head, tail = ""] = ip.toLowerCase().split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill("0"), ...right] : left;
  return `${groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
}

export const clientKey = (request) => networkKey(request.headers.get("CF-Connecting-IP") || "");

// ─── Rafales ───

const MEMORY_WINDOW_MS = 60_000;
const MEMORY_MAX_KEYS = 5000;
const memory = new Map();

/** Limite par minute dans la mémoire de l'instance : approximative (une instance par région), mais sans dépendance. */
export function memoryLimited(key, maxPerMinute, now = Date.now()) {
  const recent = (memory.get(key) || []).filter((t) => now - t < MEMORY_WINDOW_MS);
  if (recent.length >= maxPerMinute) {
    memory.set(key, recent);
    return true;
  }
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > MEMORY_MAX_KEYS) {
    for (const [k, stamps] of memory) if (!stamps.some((t) => now - t < MEMORY_WINDOW_MS)) memory.delete(k);
  }
  return false;
}

/** Nombre d'entrées de la dernière minute, sans en ajouter. */
export const memoryCount = (key, now = Date.now()) => (memory.get(key) || []).filter((t) => now - t < MEMORY_WINDOW_MS).length;

/**
 * La limite de Cloudflare (binding Rate Limiting) est partagée entre instances d'un même lieu : on la préfère.
 * Si elle manque ou tombe, la limite en mémoire prend le relais plutôt que de tout laisser passer.
 */
export async function overBurst(binding, key, maxPerMinute) {
  if (binding && typeof binding.limit === "function") {
    try {
      const { success } = await binding.limit({ key });
      return !success;
    } catch (error) {
      console.error("Rate limiter failed", error);
    }
  }
  return memoryLimited(key, maxPerMinute);
}

export const switchedOff = (value) => ["1", "true", "on", "yes"].includes(String(value ?? "").trim().toLowerCase());

// ─── Défi anti-robot (Cloudflare Turnstile) ───

/** Un défi réussi vaut un laissez-passer de deux heures pour ce réseau : le visiteur ne repasse pas le défi à chaque question. */
export const PASS_MAX_AGE_MS = 2 * 60 * 60 * 1000;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const TURNSTILE_ACTION = "chat";

export const challengeEnabled = (env) => Boolean(env.TURNSTILE_SECRET);

export async function issuePass(secret, network, issuedAt = Date.now()) {
  return `${issuedAt.toString(36)}.${await hmac(secret, `pass\n${network}\n${issuedAt}`)}`;
}

export async function passValid(secret, network, pass, now = Date.now()) {
  if (!secret || typeof pass !== "string" || pass.length > 200) return false;
  const [stamp, signature] = pass.split(".");
  const issuedAt = Number.parseInt(stamp, 36);
  if (!Number.isFinite(issuedAt) || now - issuedAt > PASS_MAX_AGE_MS || issuedAt - now > 5 * 60 * 1000) return false;
  return safeEqual(await hmac(secret, `pass\n${network}\n${issuedAt}`), signature);
}

/** Vérifie un jeton Turnstile auprès de Cloudflare : succès, bonne action, et page servie par un domaine autorisé. */
export async function verifyTurnstile(secret, token, ip, allowedHosts) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
    if (!response.ok) return false;
    const result = await response.json();
    if (result?.success !== true) return false;
    if (result.action && result.action !== TURNSTILE_ACTION) return false;
    return !result.hostname || allowedHosts.includes(result.hostname);
  } catch (error) {
    console.error("Turnstile unreachable", error);
    return false;
  }
}
