import {
  TokenPayload,
  TokenFormat,
  ServerError,
  VerifyResult,
  TokenCallback,
  CustomJwtPayload,
} from "@fest/types";
import { sign, verify, VerifyErrors, JwtPayload } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

export function createTokens(data: TokenPayload, key: string): TokenFormat {
  const accessToken = getToken(data, key, { expiresIn: "1h" }); // add the key in the .env variables
  const refreshToken = getToken(data, key, { expiresIn: "12h" }); // add the key in the .env variables

  return {
    accessToken,
    refreshToken,
  };
}

export async function validatePassword(
  provided_password: string,
  actual_password: string,
): Promise<boolean | ServerError> {
  try {
    const res = await compare(provided_password, actual_password);
    return res;
  } catch (err) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function generatePasswordHash(
  plain_password: string,
): Promise<string | ServerError> {
  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash(plain_password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("error in generatePasswordHash", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

function isCustomJwtPayload(payload: any): payload is CustomJwtPayload {
  return (
    typeof payload === "object" &&
    typeof payload.id === "string" &&
    typeof payload.username === "string" &&
    typeof payload.role === "string"
  );
}

export async function verifyToken(
  token: string,
  secretKey: string,
  callback?: TokenCallback,
): VerifyResult {
  try {
    if (callback) {
      return new Promise((resolve) => {
        verify(token, secretKey, (error, decoded) => {
          const customDecoded =
            typeof decoded === "object" && isCustomJwtPayload(decoded)
              ? decoded
              : undefined;

          callback(error, customDecoded);
          resolve({
            success: !error,
            decoded: customDecoded,
            error: error?.message,
          });
        });
      });
    }

    const decoded = await new Promise<CustomJwtPayload | undefined>(
      (resolve, reject) => {
        verify(token, secretKey, (error, decoded) => {
          const customDecoded =
            typeof decoded === "object" && isCustomJwtPayload(decoded)
              ? decoded
              : undefined;

          if (error) reject(error);
          else resolve(customDecoded);
        });
      },
    );

    return {
      success: true,
      decoded,
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      error: err.message,
    };
  }
}
export function getToken(
  data: TokenPayload,
  key: string,
  options: any,
): string {
  return sign(data, key, options);
}
