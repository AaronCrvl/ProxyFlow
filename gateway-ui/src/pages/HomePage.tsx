import React from "react";
import { getLatestLogs, getLatestLogsByServiceOrigin } from "../services/log.services";
import type { RequestLog } from "../data/types/requestLog.data";
import { PaginatedItemComponent } from "../components/layout/PaginatedItemComponent";

const HomePage: React.FC = () => {
  const [log, setLogs] = React.useState<RequestLog[] | null>(null);

  const [methodFilter, setMethodFilter] = React.useState<string>("all");
  const [logsByMethod, setLogsByMethod] = React.useState<RequestLog[]>([]);

  const handleMethodFilterChange = (method: string) => {
    setMethodFilter(method);

    if (method === "all") {
      setLogsByMethod(log || []);
    } else {
      const filteredLogs = log?.filter((entry) => entry.method === method) || [];
      setLogsByMethod(filteredLogs);
    }
  };

  const handleTabSelection = (tab: number) => {
    tab == 1 ?
      getLatestLogs().then((res) => setLogs(res as unknown as RequestLog[]))
      : getLatestLogsByServiceOrigin(2).then((res) => setLogs(res as unknown as RequestLog[]));
  };

  React.useEffect(() => {
    if (log === null) {
      getLatestLogs().then((res) => setLogs(res as unknown as RequestLog[]));
    }
  }, [log]);

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>

      <div className="bg-red-200 p-2 mt-4 mb-10">
        {/* Tab Selection */}
        <div className="inline">
          <button
            className="p-2 bg-blue-500 text-white rounded mr-4"
            onClickCapture={() => handleTabSelection(1)}>
            API
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClickCapture={() => handleTabSelection(2)}>
            WEBHOOK
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex flex-wrap">
          <div className="p-2 bg-red-200 mt-4 mb-10">
            <div className="p-1 text-xl">Logs By Method</div>
            <select
              value={methodFilter}
              onChange={(e) => { handleMethodFilterChange(e.target.value) }}
              className="p-2 border rounded"
            >
              <option value="all">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <div className="mt-4">
              <PaginatedItemComponent pItems={logsByMethod || []} itemsPerPage={5} dataType="logs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;