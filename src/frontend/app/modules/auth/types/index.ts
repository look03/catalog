export type AuthStore = {
  accessToken?: string;
  userEmail?: string;
  loginError?: string;
};

export type LoginResponse = {
  accessToken?: string;
};

export type RegisterResponse = {
  userId: string;
};
