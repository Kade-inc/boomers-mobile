import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.100.49:5001/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          await AsyncStorage.removeItem('token');
          // You might want to trigger a navigation to login screen here
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error: No response received');
    } else {
      // Other errors
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    register: '/users/register',
    login: '/users/login',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verify: '/users/verify'
  },
  // Add more endpoint categories as needed
} as const;

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Types for auth responses
export interface RegisterResponse {
  successful: boolean;
  verificationCode: string;
}

// Types for auth requests
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  source: 'web' | 'mobile';
}

export interface VerifyRequest {
  accountId: string;
  verificationCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Types for auth responses
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Auth service functions
export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    try {
      console.log('Sending register request with data:', data);
      const response = await api.post(endpoints.auth.register, data);
      console.log('Register response:', response.data);

      // Check if response has the expected structure
      if (!response.data || typeof response.data !== 'object') {
        console.error('Unexpected response format:', response.data);
        return {
          success: false,
          error: 'Invalid response format from server',
        };
      }

      // Handle the successful registration response
      if (response.data.successful) {
        return {
          success: true,
          data: {
            successful: true,
            verificationCode: response.data.verificationCode
          }
        };
      }

      return {
        success: false,
        error: 'Registration failed',
      };
    } catch (error) {
      console.error('Register error details:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
        console.error('Axios error response:', error.response?.data);
        return {
          success: false,
          error: errorMessage,
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post(endpoints.auth.login, data);
      const { token, user } = response.data.data;
      
      // Store token
      await AsyncStorage.setItem('token', token);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Login failed',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post(endpoints.auth.forgotPassword, { email });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to process forgot password request',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await api.post(endpoints.auth.resetPassword, { token, password });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to reset password',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  verify: async (data: VerifyRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post(endpoints.auth.verify, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Verification failed',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },
}; 