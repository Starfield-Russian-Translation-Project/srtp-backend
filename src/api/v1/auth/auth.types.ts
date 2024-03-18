export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface User {
  username: string;
  password: string;
  role: number;
}

export interface JwtPayload {
  username: string;
  permissions: number;
}