import React from "react";
import type { availableMethods } from "../../data/types/availableMethods.data";
import { getAvailableMethods } from "../../services/methods.services";

const AvailableMethodsComponent: React.FC = () => {
    const [methods, setMethods] = React.useState<availableMethods[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isActive = true;

        getAvailableMethods()
            .then((res) => {
                if (isActive) setMethods(res);
            })
            .catch(() => {
                if (isActive) setError("Unable to load available methods.");
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <div className="available-methods-component">
            {isLoading ? (
                <div className="skeleton-list" role="status" aria-label="Loading available methods">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div className="skeleton-row" key={index} aria-hidden="true">
                            <span className="skeleton skeleton-method" />
                            <span className="skeleton skeleton-path" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="state-message" role="alert">{error}</p>
            ) : methods.length === 0 ? (
                <p className="state-message">No API methods are available.</p>
            ) : (
                <div className="methods-table-wrap">
                <table className="methods-table">
                    <thead>
                        <tr><th>Method</th><th>Route</th><th>Group</th></tr>
                    </thead>
                    <tbody>
                    {methods.map((method, index) => (
                        <tr key={`${method.method}-${method.path}-${index}`}>
                            <td><span className={`method-badge method-${method.method.toLowerCase()}`}>{method.method || "HTTP"}</span></td>
                            <td><code>{method.path}</code></td>
                            <td>{method.groupName || "API"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
}

export default AvailableMethodsComponent;