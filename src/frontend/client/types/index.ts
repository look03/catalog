export type ApiOptions = {
  auth?: boolean;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
