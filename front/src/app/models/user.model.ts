export interface User {
  id?: number;
  username: string;
  email: string;
  bio?: string;
  profilePictureUrl?: string;
  createdAt?: Date;
  followedThemeIds?: number[];
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  identifier: string; // peut être email ou username
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
}
