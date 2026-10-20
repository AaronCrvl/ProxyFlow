import { HubConnectionBuilder } from "@microsoft/signalr";
import { API_BASE_URL, getAccessToken } from "./api.services";

export const createLogHubConnection = () => {
        const hubUrl = new URL("/hubs/logs", API_BASE_URL).toString();

        return new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: getAccessToken,
            })
            .withAutomaticReconnect()
            .build();
}