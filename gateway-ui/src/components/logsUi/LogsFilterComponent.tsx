import React from "react";
import type { RequestLog } from "../../data/types/requestLog.data";
import { PaginatedItemComponent } from "../layout/PaginatedItemComponent";

interface LogsFilterComponentProps {
  logs: RequestLog[];
  selectedOrigin: number | null;
  itemsPerPage?: number;
  isLoading: boolean;
  error: string | null;
  hideSensitiveInfo: boolean;
}

export const LogsFilterComponent: React.FC<LogsFilterComponentProps> = ({
  logs,
  selectedOrigin,
  itemsPerPage = 8,
  isLoading,
  error,
  hideSensitiveInfo,
}) => {
  const [method, setMethod] = React.useState("all");
  const [statusCode, setStatusCode] = React.useState("all");
  const [path, setPath] = React.useState("");

  const availableLogs = React.useMemo(
    () => selectedOrigin === null
      ? logs
      : logs.filter((log) => log.serviceOrigin === selectedOrigin),
    [logs, selectedOrigin],
  );

  const methods = React.useMemo(
    () => Array.from(new Set(availableLogs.map((log) => log.method || "").filter(Boolean))).sort(),
    [availableLogs],
  );
  const statusCodes = React.useMemo(
    () => Array.from(new Set(availableLogs.map((log) => log.responseStatusCode))).sort((a, b) => a - b),
    [availableLogs],
  );

  const filteredLogs = React.useMemo(() => {
    const normalizedPath = path.trim().toLocaleLowerCase();
    return availableLogs.filter((log) =>
      (method === "all" || (log.method || "") === method) &&
      (statusCode === "all" || String(log.responseStatusCode ?? "") === statusCode) &&
      (!normalizedPath || (log.url || "").toLocaleLowerCase().includes(normalizedPath)),
    );
  }, [availableLogs, method, path, statusCode]);

  const resetFilters = () => {
    setMethod("all");
    setStatusCode("all");
    setPath("");
  };

  return (
    <div className="logs-panel">
      <div className="logs-toolbar">
        <div>
          <h3>Traffic</h3>
          <p className="panel-caption">
            Showing {filteredLogs.length} of {availableLogs.length} {availableLogs.length === 1 ? "request" : "requests"}
          </p>
        </div>
        <button className="text-button" type="button" onClick={resetFilters}>
          Clear filters
        </button>
      </div>

      <div className="filter-grid" aria-label="Filter request logs">
        <label className="filter-field">
          <span>Method</span>
          <select value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="all">All methods</option>
            {methods.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-field">
          <span>Status</span>
          <select value={statusCode} onChange={(event) => setStatusCode(event.target.value)}>
            <option value="all">All statuses</option>
            {statusCodes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-field path-filter">
          <span>Path contains</span>
          <input
            type="search"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            placeholder="/api/orders"
          />
        </label>
      </div>

      <div className="logs-content">
        {isLoading ? (
          <div className="skeleton-list" role="status" aria-label="Loading request logs">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="skeleton-log-card" key={index} aria-hidden="true">
                <span className="skeleton skeleton-line skeleton-line-wide" />
                <span className="skeleton skeleton-line" />
                <span className="skeleton skeleton-line skeleton-line-short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="state-message" role="alert">{error}</p>
        ) : availableLogs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">↗</span>
            <strong>No requests yet</strong>
            <p>Requests handled by the gateway will appear here.</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <strong>No matching requests</strong>
            <p>Try changing your filters or clear them to see all traffic.</p>
            <button className="secondary-button" type="button" onClick={resetFilters}>Clear filters</button>
          </div>
        ) : (
          <PaginatedItemComponent
            pItems={filteredLogs}
            itemsPerPage={itemsPerPage}
            dataType="logs"
            hideSensitiveInfo={hideSensitiveInfo}
          />
        )}
      </div>
    </div>
  );
};
