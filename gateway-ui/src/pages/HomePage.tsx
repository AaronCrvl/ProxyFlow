import React from "react";
import { createLogHubConnection, getLatestLogs, getLatestLogsByServiceOrigin } from "../services/log.services";
import type { RequestLog } from "../data/types/requestLog.data";
import { LogsFilterComponent } from "../components/logsUi/LogsFilterComponent";
import AvailableMethodsComponent from "../components/methods/AvailableMethodsComponent";
import { ThemeProvider } from "../contexts/themeContext";

const HomePage: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = React.useState<number | null>(null);
  const selectedOriginRef = React.useRef<number | null>(null);
  const [logs, setLogs] = React.useState<RequestLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = React.useState(true);
  const [logsError, setLogsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isActive = true;

    const request = selectedOrigin === null
      ? getLatestLogs()
      : getLatestLogsByServiceOrigin(selectedOrigin);

    request
      .then((res) => {
        if (isActive) {
          setLogs((current) => {
            const byId = new Map(current.map((log) => [log.id, log]));
            res.forEach((log) => byId.set(log.id, log));
            return Array.from(byId.values()).sort((a, b) => b.id - a.id);
          });
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
  }, [selectedOrigin]);

  React.useEffect(() => {
    const connection = createLogHubConnection();
    let isDisposed = false;
    let retryTimer: number | undefined;
    const handleLogUpdate = (log: RequestLog) => {
      const origin = selectedOriginRef.current;
      if (origin !== null && log.serviceOrigin !== origin) return;

      setLogs((current) =>
        [log, ...current.filter((existing) => existing.id !== log.id)]
          .sort((a, b) => b.id - a.id)
      );
    };

    connection.on("LogUpdate", handleLogUpdate);
    const startConnection = async () => {
      try {
        await connection.start();
        if (isDisposed) await connection.stop();
      } catch (error: unknown) {
        if (isDisposed) return;
        console.error("Unable to connect to the log updates hub; retrying in 5 seconds:", error);
        retryTimer = window.setTimeout(() => void startConnection(), 5000);
      }
    };

    void startConnection();

    return () => {
      isDisposed = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      connection.off("LogUpdate", handleLogUpdate);
      connection.stop().catch((error: unknown) => {
        console.error("Unable to stop the log updates hub:", error);
      });
    };
  }, []);

  const handleOriginSelection = (origin: number | null) => {
    if (selectedOrigin === origin) return;

    selectedOriginRef.current = origin;
    setLogs([]);
    setIsLogsLoading(true);
    setLogsError(null);
    setSelectedOrigin(origin);
  };

  return (
    <ThemeProvider>
      <div className="home-page">
        <h1>Welcome to the Home Page</h1>

        {/* METHODS */}
        <div className="flex flex-wrap">
          <AvailableMethodsComponent />
        </div>

        {/* LOG CONTENT */}
        <div className="bg-red-200 p-2 mt-4 mb-10">
          {/* Tab Selection */}
          <div className="inline">
            <button
              className="p-2 bg-blue-500 text-white rounded mr-4"
              aria-pressed={selectedOrigin === null}
              onClick={() => handleOriginSelection(null)}
            >
              All
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded mr-4"
              aria-pressed={selectedOrigin === 1}
              onClick={() => handleOriginSelection(1)}
            >
              API
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              aria-pressed={selectedOrigin === 0}
              onClick={() => handleOriginSelection(0)}
            >
              WEBHOOK
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex flex-wrap">
            <LogsFilterComponent
              logs={logs}
              itemsPerPage={5}
              isLoading={isLogsLoading}
              error={logsError}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;