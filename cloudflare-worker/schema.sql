CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  event_type TEXT NOT NULL,
  visitor_id TEXT,
  session_id TEXT,
  page_path TEXT,
  page_url TEXT,
  referrer TEXT,
  language TEXT,
  country TEXT,
  as_organization TEXT,
  user_agent TEXT,
  question TEXT,
  answer TEXT,
  status TEXT,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events (created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type_created_at
  ON analytics_events (event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id
  ON analytics_events (visitor_id);
