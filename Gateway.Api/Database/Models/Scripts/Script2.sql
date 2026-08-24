-- Creating field to store service origin information
ALTER TABLE logschema."RequestLogs" ADD COLUMN IF NOT EXISTS "ServiceOrigin" INT;
CREATE INDEX IF NOT EXISTS idx_requestlogs_service ON logschema."RequestLogs" ("ServiceOrigin");
COMMENT ON COLUMN logschema."RequestLogs"."ServiceOrigin" IS 'Origin of the service (INT)';