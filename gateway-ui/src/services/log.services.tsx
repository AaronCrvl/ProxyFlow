import type { RequestLog } from "../data/types/requestLog.data";
import api from "./api.services";
import * as signalR from "@microsoft/signalr";

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

export const hubLatestLogs = (service: number): Promise<RequestLog[]> => {
    const conn = new signalR.HubConnectionBuilder()
        .withUrl(service === 1 ? "log/getLatest" : "log/getLatestByServiceOrigin?originId=2")
        .withAutomaticReconnect()
        .build();

    return new Promise((resolve, reject) => {
        conn.on("ReceiveMessage", (logs: RequestLog[]) => {
            console.log("Received message:", logs);
            resolve(logs);
        });

        conn.start().catch((error) => {
            console.error("Error connecting to latest logs hub:", error);
            reject(error);
        });
    });
};