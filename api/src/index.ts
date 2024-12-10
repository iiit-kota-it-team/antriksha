import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import { query } from "@fest/db";
import cookieParser from "cookie-parser";
import {
  createTokens,
  generatePasswordHash,
  getToken,
  validatePassword,
  verifyToken,
} from "@fest/auth";
import { User, TokenFormat, TokenPayload } from "@fest/types";
import cors from "cors";
import { adminMiddleWare } from "./middlewares";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.post("/register", async (req: Request, res: Response) => {
  // TODO: profile pic ??? NOT SURE ABOUT THIS FEATURE
  const { username, password } = req.body;
  // TODO: validate package

  try {
    const password_hash = await generatePasswordHash(password);
    const createSql = `INSERT INTO users (role, username, password_hash) VALUES ($1, $2, $3);`;
    await query(createSql, ["user", username, password_hash]);
    res.status(201).json({ status: "ok" });
  } catch (err) {
    console.log(err);
    // TODO: error package
  }
});

app.post("/login", async (req: Request, res: Response) => {
  // TODO: validation package

  const { username, password } = req.body;

  if (!username || !password) {
    // TODO: validation
  }

  const sql = `SELECT * from users where username = $1;`;

  try {
    const response = await query<User>(sql, [username]);

    if (response.rows.length > 0) {
      const valid = await validatePassword(
        password,
        response.rows[0].password_hash,
      );

      const payload: TokenPayload = {
        id: response.rows[0].id,
        username: response.rows[0].username,
        role: response.rows[0].role,
      };

      if (valid) {
        const tokens: TokenFormat = createTokens(
          payload,
          process.env.REFRESH_TOKEN_SECRET!,
        );

        const updateSql = "UPDATE users SET token = $1 WHERE id = $2;";
        await query(updateSql, [tokens.refreshToken, response.rows[0].id]);

        res.cookie("token", tokens.accessToken);
        res.status(201).json({ status: "ok" });
      } else {
        res.status(400).json({ todo: "error package" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/admin", adminMiddleWare);

app.post("/token", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    // Check if refresh token exists in database
    const sql = `SELECT * FROM users WHERE token = $1;`;
    const result = await query(sql, [refreshToken]);

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = result.rows[0] as User;

    // Verify the refresh token
    const verificationResult = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "",
      async (err, decoded) => {
        if (err) {
          await query("UPDATE users SET refresh_token = NULL WHERE id = $1", [
            user.id,
          ]);
          res.status(401).json({
            success: false,
            message: "Refresh token expired or invalid",
          });
        }
      },
    );

    if (!verificationResult.success) {
      res.status(401).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const newAccessToken = getToken(
      {
        id: verificationResult.decoded?.id!,
        username: verificationResult.decoded?.username!,
        role: verificationResult.decoded?.role!,
      },
      { expiresIn: "1h" },
    );

    res.status(201).json({ token: newAccessToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      error: error,
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER]: listening on PORT ${PORT}`);
});
