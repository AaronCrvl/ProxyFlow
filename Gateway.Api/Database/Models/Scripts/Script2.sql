ALTER TABLE logschema."RequestLogs" ADD COLUMN IF NOT EXISTS "ServiceOrigin" BIGINT NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_requestlogs_service ON logschema."RequestLogs" ("ServiceOrigin");
COMMENT ON COLUMN logschema."RequestLogs"."ServiceOrigin" IS 'Origin of the service';