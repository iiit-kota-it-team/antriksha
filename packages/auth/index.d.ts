declare module '@fest/auth' {
  import {
    TokenPayload,
    TokenFormat,
    TokenCallback,
    VerifyResult,
  } from '@fest/types';
  import { ServerError } from '@fest/types';
  import { SignOptions } from 'jsonwebtoken';

  export function createTokens(data: TokenPayload, key: string): TokenFormat;

  export function validatePassword(
    provided_password: string,
    actual_password: string,
  ): Promise<boolean | ServerError>;

  export function generatePasswordHash(
    plain_password: string,
  ): Promise<string | ServerError>;

  export function getToken(data: TokenPayload, options?: SignOptions): string;
  export function verifyToken(
    token: string,
    secretKey: string,
    callback?: TokenCallback,
  ): VerifyResult;
}
