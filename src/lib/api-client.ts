import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION 
      : process.env.NEXT_PUBLIC_API_URL;

    // Debug: Log de configuración
    console.log('🔧 API Client Configuration:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_URL_PRODUCTION: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
      selectedBaseURL: baseURL
    });

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para agregar token de autorización
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Debug: Log de la request
        console.log('🔍 API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL || ''}${config.url || ''}`,
          headers: config.headers,
          data: config.data
        });
        
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor para manejar errores globales
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Debug: Log de la response exitosa
        console.log('✅ API Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        return response;
      },
      (error: AxiosError) => {
        // Debug: Log del error
        console.error('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        if (error.response?.status === 401) {
          // Solo limpiar y redirigir si no estamos haciendo login
          const isLoginRequest = error.config?.url?.includes('/auth/login');
          if (!isLoginRequest) {
            this.clearAuthToken();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('fintrackUser');
    }
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }

  // Método para actualizar token
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }
}

export const apiClient = new ApiClient();
