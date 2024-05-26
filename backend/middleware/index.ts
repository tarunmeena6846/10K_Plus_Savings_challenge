import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const secretKey = process.env.JWT_SCERET; // Adjust the type based on your actual environment variable type
export interface AuthenticatedRequest extends Request {
  user?: string; // Define the type of user property based on your user object structure
}
export function detokenizeAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (secretKey) {
      let detokenizedUser = jwt.verify(token, secretKey) as JwtPayload;
      console.log("detokenizedUser", detokenizedUser);
      if (detokenizedUser.role === "user") {
        console.log(" username after detoken" + detokenizedUser.email);
        req.user = detokenizedUser.email;
        //   currentUserId = user.username;
        next();
      } else if (detokenizedUser.role === "admin") {
        console.log(" username after detoken" + detokenizedUser.email);
        req.user = detokenizedUser.email;
        next();
      } else {
        res.status(500).json("Unauthorised");
      }
    } else {
      // Handle the case when secretKey is undefined
      console.error(
        "JWT_SECRET environment variable is not set. Unable to sign JWT."
      );
    }
  }
}
