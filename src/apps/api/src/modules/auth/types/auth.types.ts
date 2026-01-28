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
  roles: string[];
  email?: string;
  jti?: string;
  sid?: string;
  iat?: number;
  exp?: number;
}

export type JwtUser = {
  userId: string;
  roles: string[];
};

export interface Context {
  user: JwtPayload;
}
