import React from "react";
import type { availableMethods } from "../../data/types/availableMethods.data";
import { getAvailableMethods } from "../../services/methods.services";

const AvailableMethodsComponent: React.FC = () => {
    var [methods, setMethods] = React.useState<availableMethods[]>([]);

    React.useEffect(() => {
        if(methods === undefined || methods.length == 0){
            var data = getAvailableMethods();
            data.then((res) => setMethods(res as unknown as availableMethods[]));
        }
    }, []);

    return (
        <div className="available-methods-component">
            <h2>Available Methods</h2>
            <ul>
                {methods.map((method, index) => (
                    <li key={index}> {method.groupName} - {method.method} - {method.path}</li>
                ))}
            </ul>
        </div>
    );
}

export default AvailableMethodsComponent;