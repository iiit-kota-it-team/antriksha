import { verifyToken } from "@fest/auth";
import { NextFunction, Request, Response } from "express";

export async function adminMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies["token"];

    if (!token) {
      res.status(401).json({
        error: "package",
      });
      return;
    }
    const verificationResult = await verifyToken(
      token,
      process.env.REFRESH_TOKEN_SECRET || "",
      (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(401).json({
            errors: "pcakg",
          });
          return;
        }
      },
    );
    if (!verificationResult) {
      res.status(401).json({
        erro: "package",
      });
      return;
    }

    if (verificationResult.decoded?.role != undefined) {
      console.log(verificationResult.decoded.role);
      if (verificationResult.decoded.role == "admin") {
        res.status(200).json({ tat: "ok" });
      } else {
        res.status(401).json({ error: "not a admin" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err,
    });
  }
}

function getCookie(req: Request) {
  var cookie: any = req.headers.cookies;
  return cookie.split("; ");
}
