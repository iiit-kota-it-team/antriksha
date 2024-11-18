declare module "@fest/auth" {
  import { TokenPayload, TokenFormat } from "@fest/types";
  import { ServerError } from "@fest/types";
  import { VerifyCallback } from "jsonwebtoken";

  export function createTokens(data: TokenPayload): TokenFormat;

  export function validatePassword(
    provided_password: string,
    actual_password: string,
  ): Promise<boolean | ServerError>;

  export function generatePasswordHash(
    plain_password: string,
  ): Promise<string | ServerError>;

  export function getToken(data: TokenPayload, options: any): string;

  export function verifyToken(token: string, secretKey: string, callBack: any);
}
