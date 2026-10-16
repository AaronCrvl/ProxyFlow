import type { RequestLog } from "../data/types/requestLog.data";
import { HubConnectionBuilder } from "@microsoft/signalr";
import api, { API_BASE_URL, getAccessToken } from "./api.services";

export const getLatestLogs = (): Promise<RequestLog[]> => {
    return api.get('log/getLatest')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching latest logs:', error);
            throw error;
        });
}

export const getLatestLogsByServiceOrigin = (serviceOrigin: number): Promise<RequestLog[]> => {
    return api.get(`log/getLatestByServiceOrigin?originId=${serviceOrigin}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching latest logs:', error);
            throw error;
        });
}

export const createLogHubConnection = () => {
        const hubBaseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

        return new HubConnectionBuilder()
            .withUrl(`${hubBaseUrl}/hubs/logs`, {
                accessTokenFactory: getAccessToken,
            })
            .withAutomaticReconnect()
            .build();
}