export interface RequestWithUser {
  user: {
    userId: string;
  };
}

export interface ResponseCreateUser {
  userId: string;
  email: string;
}

export type UserByEmail = ResponseCreateUser & {
  roles: string[];
  passwordHash: string;
};

export interface Tokens {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export type JwtUser = ResponseCreateUser & {
  roles: string[];
};

export interface Context {
  user: JwtPayload;
}
