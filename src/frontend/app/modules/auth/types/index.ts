export type AuthStore = {
  accessToken?: string;
  userEmail?: string;
  loginError?: string;
  registerError?: string;
};

export type LoginResponse = {
  accessToken?: string;
};

export type RegisterResponse = {
  userId: string;
};
