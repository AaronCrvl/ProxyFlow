import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";

export const API_BASE_URL = "http://localhost:5025/api";

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

const TOKEN_KEYS = {
    TOKEN: "token",
    REFRESH_TOKEN: "refreshToken",
    EXPIRES_IN: "expiresIn",
    SAVED_AT: "savedAt"
} as const;

const hasValidToken = (): boolean => {
    const token = localStorage.getItem(TOKEN_KEYS.TOKEN);
    if (!token || token === "") return false;
    
    const expiresIn = Number(localStorage.getItem(TOKEN_KEYS.EXPIRES_IN));
    const savedAt = Number(localStorage.getItem(TOKEN_KEYS.SAVED_AT));
    
    if (!Number.isFinite(savedAt) || !Number.isFinite(expiresIn)) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenAge = currentTime - savedAt;
    
    return tokenAge >= 0 && tokenAge < expiresIn;
};

const clearTokenData = (): void => {
    localStorage.removeItem(TOKEN_KEYS.TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.EXPIRES_IN);
    localStorage.removeItem(TOKEN_KEYS.SAVED_AT);
};

const saveTokenData = (response: AxiosResponse<TokenResponse>): void => {
    localStorage.setItem(TOKEN_KEYS.TOKEN, response.data.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    localStorage.setItem(TOKEN_KEYS.EXPIRES_IN, String(response.data.expiresIn));
    localStorage.setItem(TOKEN_KEYS.SAVED_AT, Math.floor(Date.now() / 1000).toString());
};

let accessTokenRequest: Promise<string> | null = null;

export const getAccessToken = (): Promise<string> => {
    if (hasValidToken()) {
        return Promise.resolve(localStorage.getItem(TOKEN_KEYS.TOKEN)!);
    }

    if (!accessTokenRequest) {
        accessTokenRequest = axios.post<TokenResponse>(API_BASE_URL + "/Auth/GetToken")
            .then((response) => {
                saveTokenData(response);
                const token = localStorage.getItem(TOKEN_KEYS.TOKEN);
                if (!token) throw new Error("The auth endpoint returned no access token.");
                return token;
            })
            .finally(() => {
                accessTokenRequest = null;
            });
    }

    return accessTokenRequest;
};

const refreshToken = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const response = await axios.post<TokenResponse>(API_BASE_URL + "/Auth/GetToken");
    if (response.status === 200) {
        saveTokenData(response);
        config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
    }
    return config;
};

const onRequest = (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig => {
    if (hasValidToken()) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem(TOKEN_KEYS.TOKEN)}`;
        return config;
    }
    
    clearTokenData();
    return refreshToken(config);
};

const setupDefaultInterceptors = (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(onRequest);
}

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
    },
});

setupDefaultInterceptors(api);
export default api;