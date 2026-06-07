import React from "react";
import { getLatestLogs } from "../services/log.services";
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

  React.useEffect(() => {
    if (log === null) {
      getLatestLogs().then((res) => setLogs(res as unknown as RequestLog[]));      
    }
  }, [log]);

  return (
    <div className="home-page">
      <h1>Welcome to the Home Page</h1>
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
          {(logsByMethod && logsByMethod.length > 0) ? logsByMethod.map((entry: RequestLog) => (
            <div key={entry.id} className="log-entry">
              <p><strong>Header:</strong> {entry.header}</p>
              <p><strong>Body:</strong> {entry.body}</p>
              <p><strong>Method:</strong> {entry.method}</p>
              <p><strong>Timestamp:</strong> {entry.timestamp}</p>
            </div>

          )) : <p>No logs for selected method.</p>}
        </div>
      </div>
      <div className="p-2 bg-blue-200">
        <div className="p-1 text-xl">Log Overview</div>
        <PaginatedItemComponent pItems={log || []} itemsPerPage={5} dataType="logs" />
      </div>
    </div>
  );
}

export default HomePage;