import api from "./api.services";

export const getLatestLogs = () => {
    return api.get('log/getLatest')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching latest logs:', error);
            throw error;
        });
}

export const getLatestLogsByServiceOrigin = (serviceOrigin: number) => {
    return api.get(`log/getLatestByServiceOrigin?originId=${serviceOrigin}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching latest logs:', error);
            throw error;
        });
}