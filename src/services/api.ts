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
    console.log('Request Interceptor - URL:', config.url);
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log('Request Interceptor - Token exists:', !!token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Request Interceptor - Error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request Interceptor - Rejected:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor - Success:', response.config.url);
    return response;
  },
  async (error) => {
    console.log('Response Interceptor - Error:', error.config?.url, error.response?.status);
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Response Interceptor - Attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log('Response Interceptor - Refresh token exists:', !!refreshToken);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await api.post(endpoints.auth.refreshToken, { refreshToken });
        console.log('Response Interceptor - Token refresh response:', response.data.success);
        
        if (response.data.success) {
          console.log("NEW RESPONSE: ", response.data)
          // Store new tokens
          await AsyncStorage.setItem('token', response.data.data.accessToken);
          await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
          
          // Update the failed request's authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Response Interceptor - Token refresh failed:', refreshError);
        // If refresh token fails, clear tokens and handle logout
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    // Handle other error cases
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Response Interceptor - Access forbidden');
          break;
        case 404:
          console.error('Response Interceptor - Resource not found');
          break;
        case 500:
          console.error('Response Interceptor - Server error');
          break;
        default:
          console.error('Response Interceptor - API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Response Interceptor - Network Error: No response received');
    } else {
      console.error('Response Interceptor - Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    register: '/users/register',
    login: '/users/login',
    forgotPassword: '/users/forgot-password',
    resetPassword: '/users/reset-password',
    verify: '/users/verify',
    verifyResetToken: '/users/verify-reset-token',
    logout: '/users/logout',
    refreshToken: '/users/refresh-token'
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
  verificationCode?: string;
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
  accountId: string;
  password: string;
}

// Types for auth responses
export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
  source?: 'mobile' | 'web';
}

export interface ForgotPasswordResponse {
  message: string;
  verificationCode?: string;
}

export interface VerifyResetTokenRequest {
  email: string;
  verificationCode: string;
}

export interface VerifyResetTokenResponse {
  userId: string;
}

export interface ResetPasswordRequest {
  userId: string;
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

  export interface LogoutRequest {
    token: string;
  }

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth service functions
export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    try {
      const response = await api.post(endpoints.auth.register, data);

      // Check if response has the expected structure
      if (!response.data || typeof response.data !== 'object') {
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
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
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
      
      // Store tokens
      await AsyncStorage.setItem('token', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      
      return {
        success: true,
        data: response.data,
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

  logout: async (data: LogoutRequest): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post(endpoints.auth.logout, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error during logout:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> => {
    try {
      const response = await api.post(endpoints.auth.forgotPassword, data);
      return {
        success: true,
        data: {
          message: response.data.message
        },
      };
    } catch (error:any) {
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

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> => {
    try {
      const response = await api.post(endpoints.auth.resetPassword, data);
      return {
        success: true,
        data: { message: response.data.message }
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

  verifyResetToken: async (data: VerifyResetTokenRequest): Promise<ApiResponse<VerifyResetTokenResponse>> => {
    try {
      const response = await api.post(endpoints.auth.verifyResetToken, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to verify reset token',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    try {
      const response = await api.post(endpoints.auth.refreshToken, data);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to refresh token',
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }
};
// Add these functions after the authService object
export const getStoredTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('token');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // Decode the JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    return exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  const { accessToken } = await getStoredTokens();
  return isTokenValid(accessToken);
}; 