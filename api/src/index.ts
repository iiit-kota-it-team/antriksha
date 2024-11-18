import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import { query } from "@fest/db";
import {
  createTokens,
  generatePasswordHash,
  getToken,
  validatePassword,
  verifyToken,
} from "@fest/auth";
import { User, TokenFormat, TokenPayload } from "@fest/types";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(cors());
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
    await query(createSql, [username, password_hash, "user"]);
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
        const tokens: TokenFormat = createTokens(payload);

        const updateSql = "UPDATE users SET token = $1 WHERE id = $2;";
        await query(updateSql, [tokens.refreshToken, response.rows[0].id]);

        res.status(200).json(payload);
      } else {
        res.status(400).json({ todo: "error package" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/token", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const sql = `SELECT * from users where token = $1;`;
    const resp = await query(sql, [refreshToken]);

    if (resp.rows.length > 0) {
      // call the auth package to decrypt it and check if valid
      // if valid in the auth package generate a new access token and return it
    }
  } catch (err) {}
});

app.listen(PORT, () => {
  console.log(`[SERVER]: listening on PORT ${PORT}`);
});
