import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { router } from 'expo-router';
import { UserProfile } from '@/entities/User';

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
          const originalRequest = error.config;
  
          if (!originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop
            try {
              const refresh_token = await AsyncStorage.getItem("refreshToken");
              if (!refresh_token) {
                throw new Error("No refresh token found");
              }
  
              const response = await api.post(
                "/users/refresh-token",
                {
                  refreshToken: refresh_token,
                }
              );
  
              const { accessToken, refreshToken } = response.data;
              
              await AsyncStorage.setItem('token', accessToken);
              await AsyncStorage.setItem('refreshToken', refreshToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return api.request(originalRequest);
            } catch (error) {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('refreshToken');
              router.replace('/(auth)/signin');
            }
          }
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
    forgotPassword: '/users/forgot-password',
    resetPassword: '/users/reset-password',
    verify: '/users/verify',
    verifyResetToken: '/users/verify-reset-token',
    logout: '/users/logout',
    getUserProfile: '/users'
  },
  team: {
    getUserTeams: '/teams',
    getRecommendations: '/teams/recommendations',
  },
  challenge: {
    getChallenges: '/challenges'
  },
  user: {
    getProfile: '/users'
  }
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
 
      await AsyncStorage.setItem('token', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      const decodedToken = await decodeToken();
      if (decodedToken?.aud) {
        await AsyncStorage.setItem('userId', decodedToken.aud);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log("ERROR: ", error)
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

  getUserProfile: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    try {
      console.log("ENDPOINT: ", `${endpoints.auth.getUserProfile}/${userId}/profile`)
      const response = await api.get(`${endpoints.auth.getUserProfile}/${userId}/profile`);
      console.log("RESPONSE: ", response);
      return {
        success: true,
        data: response.data.profile
      };
    } catch (error) {
      console.log("ERROR DETAILS: ", error);
      if (axios.isAxiosError(error)) {
        console.log("AXIOS ERROR RESPONSE: ", error.response?.data);
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to fetch user profile'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }
};

export const teamService = {
  getUserTeams: async (userId: string): Promise<ApiResponse<TeamsResponse>> => {
    try {
      const response = await api.get(endpoints.team.getUserTeams, {
        params: {
          userId
        }
      });
          return {
            success: true,
            data: response.data
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              success: false,
              error: error.response?.data?.message || 'Failed to fetch user teams'
            };
          }
          return {
            success: false,
            error: 'An unexpected error occurred'
          };
        }
      },
  getRecommendations: async (): Promise<ApiResponse<RecommendationsResponse>> => {
    try {
      const response = await api.get(endpoints.team.getRecommendations);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to fetch recommendations'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }
}

export const challengeService = {
  getChallenges: async (userId: string, valid: boolean): Promise<ApiResponse<ChallengesResponse>> => {
    try {
      const response = await api.get(endpoints.challenge.getChallenges, {
        params: {
          userId,
          valid
        }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to fetch challenges'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }
}

export const userService = {
  getUserProfile: async (userId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get(`${endpoints.user.getProfile}/${userId}/profile`);
      console.log("RESPONSEssss: ", response.data.profile);
      return {
        success: true,
        data: response.data.profile
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to fetch user profile'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
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

const decodeToken = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return null;
    }
    const decoded = jwtDecode(token);
    console.log("DECODED: ", decoded);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export interface Team {
  _id: string;
  owner_id: string;
  name: string;
  teamUsername: string;
  domain: string;
  subdomain: string;
  subdomainTopics: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  teamColor?: string;
}

export interface TeamsResponse {
  message: string;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
  data: Team[];
} 

export interface RecommendationsResponse {  
  data: Team[];
}

export interface Challenge {
  _id: string;
  owner_id: string;
  team_id: string;
  comments: any[];
  valid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  challenge_name: string;
  difficulty: number;
  due_date: string;
  description: string;
}

export interface ChallengesResponse {
  message: string;
  data: Challenge[];
}