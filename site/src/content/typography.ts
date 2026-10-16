const NBSP = " ";
// Espace ordinaire avant une ponctuation double (? ! : ;) ou avant %.
const BEFORE_DOUBLE_PUNCT = / (?=[?!:;%])/g;

const fix = (s: string): string => s.replace(BEFORE_DOUBLE_PUNCT, NBSP);

function walk<T>(value: T): T {
  if (typeof value === "string") return fix(value) as T;
  if (Array.isArray(value)) return value.map(walk) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)])) as T;
  }
  return value;
}

/** Copie du contenu avec les espaces insécables de la typographie française. */
export function frenchSpacing<T>(content: T): T {
  return walk(content);
}
