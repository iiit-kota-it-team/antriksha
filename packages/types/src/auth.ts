export type TokenPayload = {
  id: string;
  username: string;
  role: string;
};

export type TokenFormat = {
  accessToken: string;
  refreshToken: string;
};
