import React from "react";
import { getLatestLogs } from "../services/log.services";
import { createLogHubConnection } from "../services/hub.services";
import type { RequestLog } from "../data/types/requestLog.data";
import { LogsFilterComponent } from "../components/logsUi/LogsFilterComponent";
import AvailableMethodsComponent from "../components/methods/AvailableMethodsComponent";
import ThemeToggleComponent from "../components/layout/ThemeToggleComponent";

const mergeLogs = (current: RequestLog[], incoming: RequestLog[]): RequestLog[] => {
  const byId = new Map(current.map((log) => [log.id, log]));
  incoming.forEach((log) => byId.set(log.id, log));
  return Array.from(byId.values()).sort((a, b) => b.id - a.id);
};

const HomePage: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = React.useState<number | null>(null);
  const [logs, setLogs] = React.useState<RequestLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = React.useState(true);
  const [logsError, setLogsError] = React.useState<string | null>(null);
  const [isHubConnected, setIsHubConnected] = React.useState(false);
  const [hideSensitiveInfo, setHideSensitiveInfo] = React.useState(false);

  React.useEffect(() => {
    let isActive = true;

    getLatestLogs()
      .then((res) => {
        if (isActive) {
          setLogs((current) => mergeLogs(current, res));
          setLogsError(null);
        }
      })
      .catch(() => {
        if (isActive) setLogsError("Unable to load request logs.");
      })
      .finally(() => {
        if (isActive) setIsLogsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  React.useEffect(() => {
    const connection = createLogHubConnection();
    let isDisposed = false;
    let isConnecting = false;
    let retryTimer: number | undefined;
    const handleLogUpdate = (log: RequestLog) => {
      setLogs((current) => mergeLogs(current, [log]));
      setLogsError(null);
      setIsLogsLoading(false);
    };

    connection.on("LogUpdate", handleLogUpdate);
    connection.onreconnecting(() => {
      if (!isDisposed) setIsHubConnected(false);
    });
    connection.onreconnected(() => {
      if (!isDisposed) setIsHubConnected(true);
    });
    connection.onclose(() => {
      if (!isDisposed) setIsHubConnected(false);
    });
    const startConnection = async () => {
      try {
        isConnecting = true;
        await connection.start();
        if (!isDisposed) setIsHubConnected(true);
      } catch (error: unknown) {
        setIsHubConnected(false);
        if (isDisposed) return;
        console.error("Unable to connect to the log updates hub; retrying in 5 seconds:", error);
        retryTimer = window.setTimeout(() => void startConnection(), 5000);
      } finally {
        isConnecting = false;
      }

      if (isDisposed && connection.state !== "Disconnected") {
        await connection.stop();
      }
    };

    void startConnection();

    return () => {
      isDisposed = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      connection.off("LogUpdate", handleLogUpdate);
      setIsHubConnected(false);
      if (isConnecting) return;
      connection.stop().catch((error: unknown) => {
        console.error("Unable to stop the log updates hub:", error);
      });
    };
  }, []);

  const handleOriginSelection = (origin: number | null) => {
    if (selectedOrigin === origin) return;

    setSelectedOrigin(origin);
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">P</span>
          <div>
            <p className="eyebrow">PROXYFLOW / OBSERVABILITY</p>
            <h1>Request dashboard</h1>
            <p className="dashboard-subtitle">Inspect API traffic and webhook activity as it happens.</p>
          </div>
        </div>
        <div className="dashboard-controls">
          <button
            className="theme-toggle"
            type="button"
            aria-pressed={hideSensitiveInfo}
            onClick={() => setHideSensitiveInfo((hidden) => !hidden)}
          >
            <span aria-hidden="true">{hideSensitiveInfo ? "◉" : "◌"}</span>
            {hideSensitiveInfo ? "Show sensitive info" : "Hide sensitive info"}
          </button>
          <ThemeToggleComponent />
        </div>
      </header>

      <section className="overview-grid" aria-label="Dashboard overview">
        <article className="overview-card">
          <span className="overview-label">Captured requests</span>
          <strong>{logs.length}</strong>
          <span className="overview-note">Stored request records</span>
        </article>
        <article className="overview-card">
          <span className="overview-label">API requests</span>
          <strong>{logs.filter((log) => log.serviceOrigin === 1).length}</strong>
          <span className="overview-note">Origin: API</span>
        </article>
        <article className="overview-card">
          <span className="overview-label">Webhook requests</span>
          <strong>{logs.filter((log) => log.serviceOrigin === 0).length}</strong>
          <span className="overview-note">Origin: webhook</span>
        </article>
        <article className="overview-card live-card">
          <span className="overview-label">Live updates</span>
          <strong><span className={`live-indicator ${isHubConnected ? "" : "live-indicator-offline"}`} />
            {isHubConnected ? "Connected" : "Reconnecting"}
          </strong>
          <span className="overview-note">Updates stream through SignalR</span>
        </article>
      </section>

      <section className="dashboard-section methods-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DISCOVERY</p>
            <h2>Available methods</h2>
          </div>
          <span className="section-caption">Routes exposed by the backend</span>
        </div>
        <AvailableMethodsComponent />
      </section>

      <section className="dashboard-section activity-section">
        <div className="section-heading activity-heading">
          <div>
            <p className="eyebrow">ACTIVITY</p>
            <h2>Request logs</h2>
          </div>
          <div className="origin-tabs" role="group" aria-label="Filter logs by origin">
            {[
              { label: "All traffic", value: null },
              { label: "API", value: 1 },
              { label: "Webhooks", value: 0 },
            ].map(({ label, value }) => (
              <button
                key={label}
                type="button"
                className="origin-tab"
                aria-pressed={selectedOrigin === value}
                onClick={() => handleOriginSelection(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <LogsFilterComponent
          logs={logs}
          selectedOrigin={selectedOrigin}
          itemsPerPage={8}
          isLoading={isLogsLoading}
          error={logsError}
          hideSensitiveInfo={hideSensitiveInfo}
        />
      </section>
    </main>
  );
};

export default HomePage;