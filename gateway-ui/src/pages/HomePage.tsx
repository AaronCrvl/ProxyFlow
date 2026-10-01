import React from "react";
import { getLatestLogs, getLatestLogsByServiceOrigin } from "../services/log.services";
import type { RequestLog } from "../data/types/requestLog.data";
import { LogsFilterComponent } from "../components/logsUi/LogsFilterComponent";
import AvailableMethodsComponent from "../components/methods/AvailableMethodsComponent";

const HomePage: React.FC = () => {
  const [logs, setLogs] = React.useState<RequestLog[]>([]);

  const handleTabSelection = (tab: number) => {
    const request = tab === 1 ? getLatestLogs() : getLatestLogsByServiceOrigin(2);
    request.then((res) => setLogs(res as unknown as RequestLog[]));
  };

  React.useEffect(() => {
    handleTabSelection(1);
  }, []);

  return (
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
            onClick={() => handleTabSelection(1)}
          >
            API
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => handleTabSelection(2)}
          >
            WEBHOOK
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex flex-wrap">
          <LogsFilterComponent logs={logs} itemsPerPage={5} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;