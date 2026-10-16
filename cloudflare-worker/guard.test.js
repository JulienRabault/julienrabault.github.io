// node --test cloudflare-worker/guard.test.js
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  BODY_LIMITS,
  issuePass,
  memoryLimited,
  networkKey,
  overBurst,
  passValid,
  PASS_MAX_AGE_MS,
  readBoundedJson,
  switchedOff,
  tokenMatches,
  verifyTurnstile,
} from "./guard.js";
import worker from "./worker.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const post = (body, headers = {}) =>
  new Request("https://worker.test/x", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body });

describe("readBoundedJson", () => {
  it("lit un objet, refuse le reste", async () => {
    assert.deepEqual(await readBoundedJson(post('{"a":1}'), 100), { a: 1 });
    assert.deepEqual(await readBoundedJson(post(""), 100), {});
    await assert.rejects(readBoundedJson(post("[1]"), 100), { status: 400 });
    await assert.rejects(readBoundedJson(post("{oops"), 100), { status: 400 });
  });

  it("refuse un corps trop gros, annoncé ou non", async () => {
    await assert.rejects(readBoundedJson(post("{}", { "Content-Length": "999999" }), 100), { status: 413 });
    const stream = new ReadableStream({
      start(controller) {
        for (let i = 0; i < 5; i++) controller.enqueue(new TextEncoder().encode("x".repeat(40)));
        controller.close();
      },
    });
    const chunked = new Request("https://worker.test/x", { method: "POST", body: stream, duplex: "half" });
    await assert.rejects(readBoundedJson(chunked, 100), { status: 413 });
  });
});

describe("networkKey", () => {
  it("garde l'IPv4 et regroupe une IPv6 par /64", () => {
    assert.equal(networkKey("203.0.113.7"), "203.0.113.7");
    assert.equal(networkKey("2001:db8:85a3:12::1"), "2001:db8:85a3:12::/64");
    assert.equal(networkKey("2001:db8:85a3:12:aaaa:bbbb:cccc:dddd"), "2001:db8:85a3:12::/64");
    assert.equal(networkKey("2001:db8::7"), "2001:db8:0:0::/64");
    assert.equal(networkKey(""), "unknown");
    assert.equal(networkKey("::ffff:198.51.100.4"), "198.51.100.4");
  });
});

describe("limites de rafale", () => {
  it("bloque au-delà de la limite et oublie après une minute", () => {
    const key = `test:${Math.random()}`;
    const t = 1_000_000;
    assert.equal(memoryLimited(key, 2, t), false);
    assert.equal(memoryLimited(key, 2, t + 1), false);
    assert.equal(memoryLimited(key, 2, t + 2), true);
    assert.equal(memoryLimited(key, 2, t + 61_000), false);
  });

  it("préfère le binding Cloudflare et retombe sur la mémoire s'il échoue", async () => {
    assert.equal(await overBurst({ limit: async () => ({ success: false }) }, "k", 100), true);
    assert.equal(await overBurst({ limit: async () => ({ success: true }) }, "k", 0), false);
    const key = `broken:${Math.random()}`;
    const broken = {
      limit: async () => {
        throw new Error("down");
      },
    };
    assert.equal(await overBurst(broken, key, 1), false);
    assert.equal(await overBurst(broken, key, 1), true);
  });
});

describe("jetons", () => {
  it("compare le jeton admin sans se tromper", async () => {
    assert.equal(await tokenMatches("abc", "abc"), true);
    assert.equal(await tokenMatches("abd", "abc"), false);
    assert.equal(await tokenMatches("", "abc"), false);
    assert.equal(await tokenMatches("abc", undefined), false);
  });

  it("un laissez-passer vaut pour son réseau et pour deux heures", async () => {
    const now = Date.now();
    const pass = await issuePass("s3cret", "203.0.113.7", now);
    assert.equal(await passValid("s3cret", "203.0.113.7", pass, now + 1000), true);
    assert.equal(await passValid("s3cret", "198.51.100.1", pass, now + 1000), false);
    assert.equal(await passValid("other", "203.0.113.7", pass, now + 1000), false);
    assert.equal(await passValid("s3cret", "203.0.113.7", pass, now + PASS_MAX_AGE_MS + 1), false);
    assert.equal(await passValid("s3cret", "203.0.113.7", "zz.forged", now), false);
  });

  it("vérifie Turnstile : succès, action et domaine", async () => {
    let sent;
    globalThis.fetch = async (_url, init) => {
      sent = init.body;
      return Response.json({ success: true, action: "chat", hostname: "julienrabault.github.io" });
    };
    assert.equal(await verifyTurnstile("secret", "tok", "203.0.113.7", ["julienrabault.github.io"]), true);
    assert.equal(sent.get("remoteip"), "203.0.113.7");
    assert.equal(await verifyTurnstile("secret", "tok", "", ["example.com"]), false, "jeton émis sur un autre domaine");
    assert.equal(await verifyTurnstile("secret", "", "", ["julienrabault.github.io"]), false);
    globalThis.fetch = async () => Response.json({ success: false });
    assert.equal(await verifyTurnstile("secret", "tok", "", ["julienrabault.github.io"]), false);
  });

  it("lit les interrupteurs", () => {
    assert.equal(switchedOff("true"), true);
    assert.equal(switchedOff(" 1 "), true);
    assert.equal(switchedOff("false"), false);
    assert.equal(switchedOff(undefined), false);
  });
});

describe("routeur du worker", () => {
  const SITE = "https://julienrabault.github.io";
  const env = { ALLOWED_ORIGIN: SITE, ADMIN_TOKEN: "admin-token" };
  const ctx = { waitUntil: () => {} };
  const call = (path, init = {}) => worker.fetch(new Request(`https://worker.test${path}`, init), env, ctx);

  it("refuse les autres origines, même pour le suivi des visites", async () => {
    const response = await call("/events", { method: "POST", headers: { Origin: "https://evil.example" }, body: "{}" });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  });

  it("refuse un corps de suivi trop gros", async () => {
    const body = JSON.stringify({ eventType: "page_view", pageUrl: "x".repeat(BODY_LIMITS.events) });
    const response = await call("/events", { method: "POST", headers: { Origin: SITE, "CF-Connecting-IP": "192.0.2.50" }, body });
    assert.equal(response.status, 413);
  });

  it("refuse un chat v2 qui n'est pas du JSON, et respecte l'interrupteur", async () => {
    const headers = { Origin: SITE, "Content-Type": "text/plain", "CF-Connecting-IP": "192.0.2.51" };
    assert.equal((await call("/v2/chat", { method: "POST", headers, body: "{}" })).status, 415);
    const off = await worker.fetch(
      new Request("https://worker.test/v2/chat", { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: "{}" }),
      { ...env, CHAT_DISABLED: "true" },
      ctx,
    );
    assert.equal(off.status, 503);
    assert.equal(off.headers.get("Vary"), "Origin");
  });

  it("n'accepte le jeton admin que dans l'en-tête, et freine les essais", async () => {
    const ip = { "CF-Connecting-IP": "192.0.2.60" };
    assert.equal((await call("/admin/stats?token=admin-token", { headers: ip })).status, 401);
    for (let i = 0; i < 9; i++) await call("/admin/stats", { headers: { ...ip, Authorization: "Bearer wrong" } });
    assert.equal((await call("/admin/stats", { headers: { ...ip, Authorization: "Bearer admin-token" } })).status, 429);
    const other = await call("/admin/stats", { headers: { "CF-Connecting-IP": "192.0.2.61", Authorization: "Bearer admin-token" } });
    assert.equal(other.status, 503, "bon jeton, mais pas de base en test");
  });

  it("interdit d'encadrer le tableau de bord", async () => {
    const response = await call("/admin");
    assert.equal(response.headers.get("X-Frame-Options"), "DENY");
    assert.match(response.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/);
  });
});
