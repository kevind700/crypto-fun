import axios from 'axios';

// Mocks
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();

// Para probar los interceptores
let requestFulfilledCallback: Function;
let requestRejectedCallback: Function;
let responseFulfilledCallback: Function;
let responseRejectedCallback: Function;

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
    interceptors: {
      request: { 
        use: (fulfilledFn: Function, rejectedFn: Function) => {
          requestFulfilledCallback = fulfilledFn;
          requestRejectedCallback = rejectedFn;
          return mockRequestUse(fulfilledFn, rejectedFn);
        } 
      },
      response: { 
        use: (fulfilledFn: Function, rejectedFn: Function) => {
          responseFulfilledCallback = fulfilledFn;
          responseRejectedCallback = rejectedFn;
          return mockResponseUse(fulfilledFn, rejectedFn);
        } 
      }
    }
  }))
}));

// Importamos el código real de BaseApiService pero extendemos para pruebas
import BaseApiService from '../../services/BaseApiService';

class TestApiService extends BaseApiService {
  constructor() {
    super('https://test-api.com');
  }

  // Exponemos los métodos protegidos para probarlos
  public testGet<T>(url: string, config?: any): Promise<T> {
    return this.get<T>(url, config);
  }

  public testPost<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.post<T>(url, data, config);
  }
}

describe('BaseApiService', () => {
  let service: TestApiService;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    service = new TestApiService();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should create an axios instance with the correct config', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://test-api.com',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('setupInterceptors', () => {
    it('should set up request interceptors', () => {
      expect(mockRequestUse).toHaveBeenCalledTimes(1);
      expect(requestFulfilledCallback).toBeDefined();
      expect(requestRejectedCallback).toBeDefined();
    });

    it('should set up response interceptors', () => {
      expect(mockResponseUse).toHaveBeenCalledTimes(1);
      expect(responseFulfilledCallback).toBeDefined();
      expect(responseRejectedCallback).toBeDefined();
    });

    it('request fulfilled callback should return the config', () => {
      const config = { headers: { 'X-Test': 'value' } };
      const result = requestFulfilledCallback(config);
      expect(result).toBe(config);
    });

    it('request rejected callback should reject with the error', async () => {
      const error = new Error('Request error');
      await expect(requestRejectedCallback(error)).rejects.toThrow('Request error');
    });

    it('response fulfilled callback should return the response', () => {
      const response = { data: { test: 'value' } };
      const result = responseFulfilledCallback(response);
      expect(result).toBe(response);
    });

    it('should handle rate limit exceeded error', async () => {
      const error = { response: { status: 429 } };
      
      await expect(responseRejectedCallback(error)).rejects.toBe(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Rate limit exceeded');
    });

    it('should handle server error', async () => {
      const error = { response: { status: 500 } };
      
      await expect(responseRejectedCallback(error)).rejects.toBe(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Server error');
    });

    it('should handle other API errors', async () => {
      const error = { response: { status: 403 } };
      
      await expect(responseRejectedCallback(error)).rejects.toBe(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('API Error: 403');
    });

    it('should handle non-response errors', async () => {
      const error = new Error('Network error');
      
      await expect(responseRejectedCallback(error)).rejects.toBe(error);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    it('should call axios.get with the right parameters', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockGet.mockResolvedValueOnce({ data: mockData });

      const config = { params: { filter: 'test' } };
      const result = await service.testGet('/data', config);
      
      expect(mockGet).toHaveBeenCalledWith('/data', config);
      expect(result).toEqual(mockData);
    });

    it('should handle network errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'));

      await expect(service.testGet('/error')).rejects.toThrow('Network error');
    });
  });

  describe('post method', () => {
    it('should call axios.post with the right parameters', async () => {
      const requestData = { name: 'New Item' };
      const responseData = { id: 1, name: 'New Item' };
      const config = { headers: { 'X-Custom': 'value' } };

      mockPost.mockResolvedValueOnce({ data: responseData });

      const result = await service.testPost('/data', requestData, config);
      
      expect(mockPost).toHaveBeenCalledWith('/data', requestData, config);
      expect(result).toEqual(responseData);
    });

    it('should handle network errors on post', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      await expect(service.testPost('/error', {})).rejects.toThrow('Network error');
    });
  });
}); 