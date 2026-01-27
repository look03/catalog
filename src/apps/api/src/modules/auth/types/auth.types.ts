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
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
}

export interface JwtSessions {
  jti: string;
  sid: string;
}

export type RefreshSession = JwtSessions & {
  userId: string;
  refreshToken: string;
  createdAt: number;
};

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  jti?: string;
  sid?: string;
  iat?: number;
  exp?: number;
}

export type JwtUser = ResponseCreateUser & {
  roles: string[];
};

export interface Context {
  user: JwtPayload;
}
