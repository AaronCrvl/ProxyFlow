import api from "./api.services";

export const getLatestLogs = () => {
    return api.get('log/getLatest')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching latest logs:', error);
            throw error;
        });
}