-- Accessing with pr Postgres com privilégios
sudo -u postgres psql

-- Iniciando Database no Postgres com 
postgres=# create database proxyflow;
postgres=# create user dbo with encrypted password 'p@ssw0rd';
postgres=# grant all privileges on database proxyflow to dbo;
postgres=# ALTER DATABASE proxyflow OWNER TO dbo;

-- Schema personalizado para logs
CREATE SCHEMA IF NOT EXISTS logschema;
GRANT ALL ON SCHEMA logschema TO dbo;
ALTER ROLE dbo SET search_path TO logschema;

GRANT USAGE, CREATE ON SCHEMA logschema TO dbo;

GRANT ALL ON ALL TABLES IN SCHEMA logschema TO dbo;
GRANT ALL ON ALL SEQUENCES IN SCHEMA logschema TO dbo;
ALTER DEFAULT PRIVILEGES IN SCHEMA logschema GRANT ALL ON TABLES TO dbo;
ALTER DEFAULT PRIVILEGES IN SCHEMA logschema GRANT ALL ON SEQUENCES TO dbo;

-- Create the RequestLogs table based on the image schema
CREATE TABLE IF NOT EXISTS logschema."RequestLogs" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Headers" TEXT,
    "Body" TEXT,
    "Method" VARCHAR(255),
    "TimeStamp" VARCHAR(255),
    "ResponseStatusCode" INT,
    "ResponseBody" TEXT,
    "Url" VARCHAR(500),
    "ClientIp" VARCHAR(100),    
);

-- Create indexes for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_requestlogs_timestamp ON logschema."RequestLogs" ("TimeStamp");
CREATE INDEX IF NOT EXISTS idx_requestlogs_method ON logschema."RequestLogs" ("Method");
CREATE INDEX IF NOT EXISTS idx_requestlogs_statuscode ON logschema."RequestLogs" ("ResponseStatusCode");
CREATE INDEX IF NOT EXISTS idx_requestlogs_clientip ON logschema."RequestLogs" ("ClientIp");
CREATE INDEX IF NOT EXISTS idx_requestlogs_url ON logschema."RequestLogs" ("Url");

-- Grant privileges on the table and its sequence
GRANT ALL ON logschema."RequestLogs" TO dbo;
GRANT ALL ON SEQUENCE logschema."RequestLogs_Id_seq" TO dbo;

-- Comment for documentation
COMMENT ON TABLE logschema."RequestLogs" IS 'Table to store proxy request and response logs';
COMMENT ON COLUMN logschema."RequestLogs"."Id" IS 'Auto-incrementing primary key (BIGSERIAL)';
COMMENT ON COLUMN logschema."RequestLogs"."Headers" IS 'Request headers (TEXT)';
COMMENT ON COLUMN logschema."RequestLogs"."Body" IS 'Request body (TEXT)';
COMMENT ON COLUMN logschema."RequestLogs"."Method" IS 'HTTP method (VARCHAR 255)';
COMMENT ON COLUMN logschema."RequestLogs"."TimeStamp" IS 'Timestamp of the request (VARCHAR 255)';
COMMENT ON COLUMN logschema."RequestLogs"."ResponseStatusCode" IS 'HTTP response status code (INT)';
COMMENT ON COLUMN logschema."RequestLogs"."ResponseBody" IS 'Response body (TEXT)';
COMMENT ON COLUMN logschema."RequestLogs"."Url" IS 'Request URL (VARCHAR 500)';
COMMENT ON COLUMN logschema."RequestLogs"."ClientIp" IS 'Client IP address (VARCHAR 100)';