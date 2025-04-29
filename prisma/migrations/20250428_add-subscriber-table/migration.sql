CREATE TABLE "Subscriber" (
  "id"        SERIAL PRIMARY KEY,
  "email"     TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
