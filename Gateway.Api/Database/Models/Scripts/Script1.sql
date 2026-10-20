CREATE SCHEMA IF NOT EXISTS logschema;
GRANT ALL ON SCHEMA logschema TO dbo;
GRANT USAGE, CREATE ON SCHEMA logschema TO dbo;
ALTER DEFAULT PRIVILEGES IN SCHEMA logschema GRANT ALL ON TABLES TO dbo;
ALTER DEFAULT PRIVILEGES IN SCHEMA logschema GRANT ALL ON SEQUENCES TO dbo;

CREATE TABLE IF NOT EXISTS logschema."RequestLogs" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Headers" TEXT NOT NULL DEFAULT '',
    "Body" TEXT NOT NULL DEFAULT '',
    "Method" VARCHAR(255) NOT NULL DEFAULT '',
    "TimeStamp" VARCHAR(255) NOT NULL DEFAULT '',
    "ResponseStatusCode" BIGINT NOT NULL DEFAULT 0,
    "ResponseBody" TEXT NOT NULL DEFAULT '',
    "Url" VARCHAR(500) NOT NULL DEFAULT '',
    "ClientIp" VARCHAR(100) NOT NULL DEFAULT '',
    "ServiceOrigin" BIGINT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_requestlogs_timestamp ON logschema."RequestLogs" ("TimeStamp");
CREATE INDEX IF NOT EXISTS idx_requestlogs_method ON logschema."RequestLogs" ("Method");
CREATE INDEX IF NOT EXISTS idx_requestlogs_statuscode ON logschema."RequestLogs" ("ResponseStatusCode");
CREATE INDEX IF NOT EXISTS idx_requestlogs_clientip ON logschema."RequestLogs" ("ClientIp");
CREATE INDEX IF NOT EXISTS idx_requestlogs_url ON logschema."RequestLogs" ("Url");
CREATE INDEX IF NOT EXISTS idx_requestlogs_service ON logschema."RequestLogs" ("ServiceOrigin");
GRANT ALL ON logschema."RequestLogs" TO dbo;
GRANT ALL ON SEQUENCE logschema."RequestLogs_Id_seq" TO dbo;