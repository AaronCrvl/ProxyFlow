import api from "./api.services";
import type { availableMethods } from "../data/types/availableMethods.data";

export const getAvailableMethods = () : Promise<availableMethods[]> => {
    return api.get('methods/GetAvailableMethods')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching available methods:', error);
            throw error;
        });
}   