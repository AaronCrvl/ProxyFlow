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

  // RETRY WEBHOOK CALL
  const [retryReponse, setRetryResponse] = React.useState<any>(null);
  const handleRetry = async (entry: RequestLog) => {
    const res = await fetch(entry.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry.body)
    }).then(response => response.json());
    setRetryResponse(res);
  };

  // CURL COPY
  const handleCopyCurl = (entry: RequestLog) => {
    const curlCommand = `curl -X ${entry.method} ${entry.url} \
    -H 'Content-Type: application/json' \
    -d '${JSON.stringify(entry.body)}'`;
    
    navigator.clipboard.writeText(curlCommand)
      .then(() => {
        console.log('CURL command copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy CURL command: ', err);
      });
  }

  const renderContent = () => {
    switch (dataType) {
      case "logs":
        return (currentViewItems as RequestLog[]).map((entry) => (
          <div key={entry.id} className="log-entry">
            <p><strong>Header:</strong> {JSON.stringify(entry.headers)}</p>
            <div className="invisible transition delay-150 duration-300 ease-in-out hover:visible">
              <p className="text-sm text-black bg-gray-200 p-2 flex-wrap"><strong>Body:</strong> {JSON.stringify(entry.body)}</p>
              <p><strong>Method:</strong> {entry.method}</p>
              <p><strong>Timestamp:</strong> {entry.timestamp}</p>
              <p><strong>Path:</strong> {entry.url}</p>
              <p><strong>Origin:</strong> {entry.serviceOrigin}</p>
              {
                entry.serviceOrigin === 1 &&
                <button className="bg-blue-500 text-white p-2 rounded mt-2"
                  onClick={() => handleRetry(entry)}>Retry</button>
              }
              {
                retryReponse && entry.serviceOrigin === 1 &&
                <p className="text-sm text-black bg-gray-200 p-2 flex-wrap"><strong>Body:</strong> {retryReponse}</p>
              }
              <button className="bg-green-500 text-white p-2 rounded mt-2"
                onClick={() => handleCopyCurl(entry)}>Copy as CURL</button>
            </div>
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