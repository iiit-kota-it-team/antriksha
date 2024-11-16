import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import { query } from "@fest/db";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  try {
    const response = await query(`SELECT * from test;`);
    console.log("done with response", response);
    res.status(200).send(response);
  } catch (err) {
    console.log("an error occured");
    console.log(err);
    res.send(400).send("bad request");
  }
  console.log("HIT");
});

app.listen(PORT, () => {
  console.log(`[SERVER]: listening on PORT ${PORT}`);
});
