export interface RegisterResponse {
  successful: boolean;
  verificationCode?: string;
}

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