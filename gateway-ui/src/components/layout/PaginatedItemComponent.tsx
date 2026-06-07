import React from "react";
import type { RequestLog } from "../../data/types/requestLog.data";

type dataType = "logs";

interface PaginatedItemProps {
  pItems: any[];
  itemsPerPage: number;
  dataType: dataType;
}

export const PaginatedItemComponent = ({ 
  pItems, 
  itemsPerPage, 
  dataType 
}: PaginatedItemProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const currentViewItems = React.useMemo(() => {
    return pItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [currentPage, pItems, itemsPerPage]);

  const totalPages = Math.ceil(pItems.length / itemsPerPage);

  const renderContent = () => {
    switch (dataType) {
      case "logs":
        return (currentViewItems as RequestLog[]).map((entry) => (
          <div key={entry.id} className="log-entry">
            <p><strong>Header:</strong> {entry.header}</p>
            <p><strong>Body:</strong> {entry.body}</p>
            <p><strong>Method:</strong> {entry.method}</p>
            <p><strong>Timestamp:</strong> {entry.timestamp}</p>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="paginated-item">
      <div>{renderContent()}</div>
      <div className="p-2 bg-blue-400">Page {currentPage}</div>
      <div>
        <button 
          onClick={() => setCurrentPage(p => p - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button 
          onClick={() => setCurrentPage(p => p + 1)} 
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};