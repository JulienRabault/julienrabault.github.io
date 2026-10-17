import assert from "node:assert/strict";
import { test } from "node:test";
import { purgeExpired } from "./retention.js";

function fakeDb() {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      return { bind: (...args) => ({ run: async () => (calls.push({ sql, args }), { meta: { changes: 1 } }) }) };
    },
  };
}

test("efface les événements de plus de 13 mois et les compteurs de la veille et avant", async () => {
  const db = fakeDb();
  const result = await purgeExpired(db, Date.parse("2026-10-16T03:00:00Z"));
  assert.deepEqual(result, { analytics: 1, usage: 1 });
  assert.match(db.calls[0].sql, /DELETE FROM analytics_events WHERE created_at < \?/);
  assert.equal(db.calls[0].args[0], "2025-09-16T03:00:00.000Z");
  assert.match(db.calls[1].sql, /DELETE FROM chat_usage WHERE day < \?/);
  assert.equal(db.calls[1].args[0], "2026-10-15");
});

test("ne fait rien sans base", async () => {
  assert.deepEqual(await purgeExpired(undefined), { analytics: 0, usage: 0 });
});
