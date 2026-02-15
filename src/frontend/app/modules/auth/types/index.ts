export type AuthStore = {
  accessToken?: string;
  userEmail?: string;
};

export type LoginResponse = {
  accessToken?: string;
};

export type RegisterResponse = {
  userId: string;
};
