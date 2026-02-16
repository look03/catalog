export type ApiOptions = {
  auth?: boolean;
  retry?: boolean;
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

export type User = {
  email?: string;
};

export type TabItemBase = {
  label: string;
  value?: string | number;
};
