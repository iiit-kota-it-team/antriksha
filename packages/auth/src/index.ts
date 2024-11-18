import { TokenPayload, TokenFormat, ServerError } from "@fest/types";
import { sign, verify, VerifyCallback } from "jsonwebtoken";
import { genSalt, hash, compare } from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

export function createTokens(data: TokenPayload): TokenFormat {
  const accessToken = getToken(data, { expiresIn: "1h" }); // add the key in the .env variables
  const refreshToken = getToken(data, { expiresIn: "12h" }); // add the key in the .env variables

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

export async function verifyToken(
  token: string,
  secretKey: string,
  callBack: any,
) {
  try {
    verify(token, secretKey, callBack);
  } catch (err) {
    console.log(err);
  }
}

export function getToken(data: TokenPayload, options: any): string {
  return sign(data, "dss", options);
}
