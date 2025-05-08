import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class BaseApiService {
  protected readonly api: AxiosInstance;
  protected static instance: BaseApiService;

  protected constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  protected setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 429:
              console.error('Rate limit exceeded');
              break;
            case 500:
              console.error('Server error');
              break;
            default:
              console.error(`API Error: ${status}`);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }
}

export default BaseApiService;