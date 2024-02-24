// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// import { secretKey } from "../index";
export const secretKey = process.env.JWT_SCERET; // Adjust the type based on your actual environment variable type
// console.log("secretkey", process.env.JWT_SCERET);
// console.log("JWT_SCERET:", process.env.JWT_SCERET);
// console.log("at authadmin", secretKey);
export interface AuthenticatedRequest extends Request {
  user?: string; // Define the type of user property based on your user object structure
}
export function detokenizeAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  // ... (your existing detokenizeAdmin middleware logic)
  const authHeader = req.headers.authorization;
  console.log("authheader", authHeader);
  // console.log("auth header ", authHeader);
  // console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (secretKey) {
      let detokenizedUser = jwt.verify(token, secretKey) as JwtPayload;
      console.log("detokenizedUser", detokenizedUser);
      if (detokenizedUser.role === "admin") {
        console.log(" username after detoken" + detokenizedUser.username);
        req.user = detokenizedUser.username;
        //   currentUserId = user.username;
        next();
      } else {
        res.status(403).send("Unauthorised");
      }
    } else {
      // Handle the case when secretKey is undefined
      console.error(
        "JWT_SECRET environment variable is not set. Unable to sign JWT."
      );
    }
  }
}
