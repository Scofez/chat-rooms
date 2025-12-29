import axios, { isAxiosError, type AxiosInstance, type AxiosRequestConfig, type Method } from 'axios';

import AuthQueryHandler from './AuthQueryHandler';

interface ResponseError {
    message: string;
    error: unknown;
}

class QueryHandler {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        // Create axios instance
        this.axiosInstance = axios.create({
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        // Add token to all requests
        this.axiosInstance.interceptors.request.use((config) => {
            const token = AuthQueryHandler.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }
    
    /**
     * Queries the API
     * 
     * @param {string} route the route to query
     * @param {Method} method the HTTP method to use 
     * @param {unknown} payload the payload to send
     * @param {AxiosRequestConfig} config additional config to send
     *  
     * @returns Promise<T> the response data
     */
    public async query<T>(route: string, method: Method, payload: unknown = null, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.request<T>({
                url: route,
                method,
                data: payload,
                ...config
            });
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError<ResponseError>(error)) {
                const errorMessage = error.response?.data?.message || error.message || error;
                console.error(`API Error [${method} ${route}]:`, errorMessage);
                throw error;
            }
            console.error('Unknown QueryHandler error', error);
            throw error;
        }
    }
}

export default new QueryHandler();