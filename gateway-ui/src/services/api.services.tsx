import axios from "axios";

const API_BASE_URL = "http://localhost:5025/api";

const TOKEN_KEYS = {
    TOKEN: "token",
    REFRESH_TOKEN: "refreshToken",
    EXPIRES_IN: "expiresIn",
    SAVED_AT: "savedAt"
} as const;

const hasValidToken = (): boolean => {
    const token = localStorage.getItem(TOKEN_KEYS.TOKEN);
    if (!token || token === "" || token.length <= 10) return false;
    
    const expiresIn = localStorage.getItem(TOKEN_KEYS.EXPIRES_IN);
    const savedAt = localStorage.getItem(TOKEN_KEYS.SAVED_AT);
    
    if (!savedAt || !expiresIn) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenAge = currentTime - parseInt(savedAt);
    
    return tokenAge < parseInt(expiresIn);
};

const clearTokenData = (): void => {
    localStorage.removeItem(TOKEN_KEYS.TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.EXPIRES_IN);
    localStorage.removeItem(TOKEN_KEYS.SAVED_AT);
};

const saveTokenData = (response: any): void => {
    localStorage.setItem(TOKEN_KEYS.TOKEN, response.data.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    localStorage.setItem(TOKEN_KEYS.EXPIRES_IN, response.data.expiresIn);
    localStorage.setItem(TOKEN_KEYS.SAVED_AT, Math.floor(Date.now() / 1000).toString());
};

const refreshToken = async (config: any): Promise<any> => {
    const response = await axios.post(API_BASE_URL + "/Auth/GetToken");
    if (response.status === 200) {
        saveTokenData(response);
        config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
    }
    return config;
};

const onRequest = (config: any): any => {
    if (hasValidToken()) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem(TOKEN_KEYS.TOKEN)}`;
        return config;
    }
    
    clearTokenData();
    return refreshToken(config);
};

const setupDefaultInterceptors = (AxiosInstance: any) => {
    AxiosInstance.interceptors.request.use(onRequest);
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