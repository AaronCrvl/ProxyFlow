import React from "react";
import type { RequestLog } from "../../data/types/requestLog.data";
import { API_BASE_URL } from "../../services/api.services";

interface PaginatedItemProps {
  pItems: RequestLog[];
  itemsPerPage: number;
  dataType: "logs";
  hideSensitiveInfo: boolean;
}

export const PaginatedItemComponent: React.FC<PaginatedItemProps> = ({
  pItems,
  itemsPerPage,
  hideSensitiveInfo,
}) => {
  const [pagination, setPagination] = React.useState({ signature: "", page: 1 });
  const signature = pItems.map((item) => item.id).join(",");
  const [retryMessage, setRetryMessage] = React.useState<{ id: number; text: string } | null>(null);
  const [retryingId, setRetryingId] = React.useState<number | null>(null);
  const totalPages = Math.ceil(pItems.length / itemsPerPage);
  const currentPage = pagination.signature === signature ? pagination.page : 1;
  const visiblePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const currentItems = React.useMemo(
    () => pItems.slice((visiblePage - 1) * itemsPerPage, visiblePage * itemsPerPage),
    [visiblePage, pItems, itemsPerPage],
  );

  const handleRetry = async (entry: RequestLog) => {
    setRetryingId(entry.id);
    setRetryMessage(null);

    try {
      if (!entry.url) throw new Error("This log has no recorded request path to retry.");

      const apiOrigin = new URL(API_BASE_URL).origin;
      const path = entry.url.startsWith("/") ? entry.url : `/${entry.url}`;
      const url = new URL(path, apiOrigin);
      if (url.origin !== apiOrigin) {
        throw new Error("The recorded request path does not belong to this API.");
      }
      const method = entry.method.toUpperCase() || "POST";
      const bodyAllowed = method !== "GET" && method !== "HEAD";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: bodyAllowed && entry.body ? entry.body : undefined,
      });
      const responseBody = await response.text();
      setRetryMessage({
        id: entry.id,
        text: response.ok
          ? `Retry succeeded (${response.status}).${responseBody ? ` ${responseBody}` : ""}`
          : `Retry failed (${response.status}).${responseBody ? ` ${responseBody}` : ""}`,
      });
    } catch (error: unknown) {
      console.error("Unable to retry webhook request:", error);
      setRetryMessage({
        id: entry.id,
        text: error instanceof Error ? `Retry failed: ${error.message}` : "Retry failed. Check the browser console for details.",
      });
    } finally {
      setRetryingId(null);
    }
  };

  const handleCopyCurl = async (entry: RequestLog) => {
    const url = new URL(entry.url, API_BASE_URL).toString();
    const command = [
      `curl -X ${entry.method || "GET"} '${url}'`,
      `-H 'Content-Type: application/json'`,
      entry.body ? `--data '${entry.body.replaceAll("'", "'\\''")}'` : "",
    ].filter(Boolean).join(" \\\n  ");

    try {
      await navigator.clipboard.writeText(command);
      setRetryMessage({ id: entry.id, text: "cURL command copied." });
    } catch (error: unknown) {
      console.error("Unable to copy cURL command:", error);
      setRetryMessage({ id: entry.id, text: "Could not copy the cURL command." });
    }
  };

  return (
    <div className="request-list">
      {currentItems.map((entry) => (
        <article className="request-card" key={entry.id}>
          <div className="request-card-heading">
            <span className={`method-badge method-${(entry.method || "").toLowerCase()}`}>{entry.method || "HTTP"}</span>
            <span className={`status-badge ${entry.responseStatusCode >= 400 ? "status-error" : "status-success"}`}>
              {entry.responseStatusCode || "—"}
            </span>
            <code className="request-path" title={entry.url || ""}>
              {hideSensitiveInfo && entry.url?.includes("?")
                ? `${entry.url.split("?")[0]}?••••`
                : entry.url || "Unknown route"}
            </code>
            <time className="request-time">{entry.timestamp}</time>
          </div>
          <details className="request-details">
            <summary>View request and response</summary>
            <div className="details-grid">
              <div>
                <h4>Request headers</h4>
                <pre>{hideSensitiveInfo ? "••••••••••" : entry.headers || "No headers captured."}</pre>
              </div>
              <div>
                <h4>Request body</h4>
                <pre>{hideSensitiveInfo ? "••••••••••" : entry.body || "No request body."}</pre>
              </div>
              <div>
                <h4>Response body</h4>
                <pre>{hideSensitiveInfo ? "••••••••••" : entry.responseBody || "No response body."}</pre>
              </div>
              <div className="request-metadata">
                <span><strong>Client IP</strong>{hideSensitiveInfo ? "••••••••" : entry.clientIp || "—"}</span>
                <span><strong>Origin</strong>{entry.serviceOrigin === 0 ? "Webhook" : "API"}</span>
                <span><strong>Duration</strong>{entry.timestamp || "—"}</span>
              </div>
            </div>
            <div className="request-actions">
              {entry.serviceOrigin === 0 && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => void handleRetry(entry)}
                  disabled={retryingId === entry.id || !entry.url}
                  title={!entry.url ? "This log has no recorded request path." : undefined}
                >
                  {retryingId === entry.id ? "Retrying…" : "Retry webhook"}
                </button>
              )}
              <button className="secondary-button" type="button" onClick={() => void handleCopyCurl(entry)}>
                Copy cURL
              </button>
              {retryMessage?.id === entry.id && <span className="action-feedback" role="status">{retryMessage.text}</span>}
            </div>
          </details>
        </article>
      ))}
      {pItems.length > 0 && (
        <nav className="pagination" aria-label="Request log pages">
          <span>Page {visiblePage} of {totalPages}</span>
          <div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setPagination({ signature, page: Math.max(1, visiblePage - 1) })}
              disabled={visiblePage === 1}
            >
              Previous
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setPagination({ signature, page: Math.min(totalPages, visiblePage + 1) })}
              disabled={visiblePage === totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
