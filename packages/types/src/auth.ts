import { JwtPayload, VerifyErrors } from "jsonwebtoken";
export type TokenPayload = {
  id: string;
  username: string;
  role: string;
};

export type TokenFormat = {
  accessToken: string;
  refreshToken: string;
};

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
  role: string;
}

export type TokenCallback = (
  error: VerifyErrors | null,
  decoded: CustomJwtPayload | string | undefined,
) => void;

export type VerifyResult = Promise<{
  success: boolean;
  decoded?: CustomJwtPayload;
  error?: string;
}>;


