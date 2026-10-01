import React from "react";
import type { RequestLog } from "../../data/types/requestLog.data";
import { PaginatedItemComponent } from "../layout/PaginatedItemComponent";

interface LogsFilterComponentProps {
  logs: RequestLog[];
  itemsPerPage?: number;
}

interface AppliedFilters {
  method: string;
  statusCode: string;
  path: string;
}

const METHODS = ["GET", "POST", "PUT", "DELETE"];
const STATUS_CODES = [
  { value: "200", label: "200 OK" },
  { value: "404", label: "404 Not Found" },
  { value: "500", label: "500 Internal Server Error" },
];

export const LogsFilterComponent: React.FC<LogsFilterComponentProps> = ({
  logs,
  itemsPerPage = 5,
}) => {

  const [methodFilter, setMethodFilter] = React.useState<string>("all");
  const [statusCodeFilter, setStatusCodeFilter] = React.useState<string>("all");
  const [pathFilter, setPathFilter] = React.useState<string>("all");

  const paths: string[] = logs.map(log => log.url);
  const [applied, setApplied] = React.useState<AppliedFilters>({
    method: "all",
    statusCode: "all",
    path: "all"
  });

  const filteredLogs = React.useMemo(() => {
    return logs.filter((entry) => {
      const matchesMethod =
        applied.method === "all" || entry.method === applied.method;
      const matchesStatus =
        applied.statusCode === "all" ||
        entry.statusCode === parseInt(applied.statusCode, 10);
      const matchesPath =
        applied.path === "all" || entry.url === applied.path;
      return matchesMethod && matchesStatus && matchesPath;
    });
  }, [logs, applied]);

  const handleSearch = () => {
    setApplied({ method: methodFilter, statusCode: statusCodeFilter, path: pathFilter });
  };

  return (
    <div className="p-2 bg-red-200 mt-4 mb-10">
      <div className="p-1 text-xl">Logs By Method</div>

      <select
        value={methodFilter}
        onChange={(e) => setMethodFilter(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Methods</option>
        {METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={statusCodeFilter}
        onChange={(e) => setStatusCodeFilter(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Status Codes</option>
        {STATUS_CODES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={pathFilter}
        onChange={(e) => setPathFilter(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Paths</option>
        {paths.map((s, index) => (
          <option key={index} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        className="p-2 bg-blue-500 text-white rounded ml-2"
        onClick={handleSearch}
      >
        Search
      </button>

      <div className="mt-4">
        <PaginatedItemComponent
          pItems={filteredLogs}
          itemsPerPage={itemsPerPage}
          dataType="logs"
        />
      </div>
    </div>
  );
};