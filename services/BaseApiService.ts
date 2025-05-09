/**
 * BaseApiService
 *
 * This is a base abstract class for API services that provides common HTTP request functionality.
 * It uses axios for making HTTP requests and includes:
 * - Request/response interceptors with error handling
 * - Common HTTP methods (GET, POST)
 * - Consistent response formatting
 *
 * This base service follows best practices for organizing API interactions in React Native
 * applications and can be extended by specific API services.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Abstract class for API services
 * Provides shared HTTP functionality for derived API service classes
 */
class BaseApiService {
  /** Axios instance for making HTTP requests */
  protected readonly api: AxiosInstance;

  /** Base instance for singleton pattern */
  protected static instance: BaseApiService;

  /**
   * Create a new API service
   * @param {string} baseURL - Base URL for API requests
   */
  protected constructor(baseURL: string) {
    // Initialize axios with common configuration
    this.api = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Set up request/response interceptors
    this.setupInterceptors();
  }

  /**
   * Configure axios interceptors for request and response handling
   * This handles common error cases and logging
   */
  protected setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => config, // Pass through config
      (error) => Promise.reject(error), // Reject on error
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response, // Pass through response
      (error) => {
        // Handle common error responses
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 429:
              console.error("Rate limit exceeded");
              break;
            case 500:
              console.error("Server error");
              break;
            default:
              console.error(`API Error: ${status}`);
          }
        }
        return Promise.reject(error); // Re-throw the error
      },
    );
  }

  /**
   * Perform a GET request
   * @param {string} url - The endpoint URL
   * @param {AxiosRequestConfig} config - Optional request configuration
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T The expected response data type
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  /**
   * Perform a POST request
   * @param {string} url - The endpoint URL
   * @param {any} data - The data to send in the request body
   * @param {AxiosRequestConfig} config - Optional request configuration
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T The expected response data type
   */
  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }
}

export default BaseApiService;
