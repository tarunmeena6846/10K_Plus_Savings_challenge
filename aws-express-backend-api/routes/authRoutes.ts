import express, { Router, Request, Response } from "express";
import { UserModel, User } from "../models/dynamodb/User";
import { detokenizeAdmin, secretKey } from "../middleware/index";
import jwt, { JwtPayload } from "jsonwebtoken";
const router: Router = express.Router();
import { AuthenticatedRequest } from "../middleware/index";
import { sendEmail } from "../emails";
import { getWelcomeEmail } from "../emails/welcomeEmail";
import { PostModel } from "../models/dynamodb/Post";
import { CommentModel } from "../models/dynamodb/Comment";
import { resetPassword } from "../emails/ResetPassword";
import bcrypt from "bcrypt";
import corn from "node-cron";
// import { Resend } from "resend";
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password, email, secretePhrase } = req.body;
    console.log(email, username);
    let isAdmin = false;
    if (!username || !password || !email) {
      res.status(400).json({ error: "Bad request", success: false });
      return;
    }
    if (secretePhrase != "") {
      if (process.env.ADMIN_SECRET_PHRASE === secretePhrase) {
        isAdmin = true;
      }
    }
    // Check if user already exists by email or username
    console.time("findByEmail");
    const existingUserByEmail = await UserModel.findByEmail(email);
    console.timeEnd("findByEmail");
    console.time("findByUsername");
    const existingUserByUsername = await UserModel.findByUsername(username);
    console.timeEnd("findByUsername");
    console.log("existingUserByEmail", existingUserByEmail, existingUserByUsername);
    if (existingUserByEmail || existingUserByUsername) {
      res
        .status(200)
        .send({ content: "User already registered", success: false });
      return;
    }

    console.log(secretKey);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (secretKey) {
      let token = jwt.sign(
        {
          email: email,
          role: isAdmin === true ? "admin" : "user",
        },
        secretKey,
        { expiresIn: "1h" }
      );
      const newUser = await UserModel.create({
        username: username,
        email: email,
        password: hashedPassword,
        verificationToken: token,
        isAdmin: isAdmin,
        verified: false,
      });

      console.log("New user created:", newUser.PK);
      console.log("token", token);

      await sendEmail(email, "Email Verification", getWelcomeEmail(token));
      res.status(201).send({
        message: "An Email sent to your account please verify",
        success: true,
      });
    } else {
      console.error(
        "JWT_SECRET environment variable is not set. Unable to sign JWT."
      );
      res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  } catch (error: any) {
    console.error("Error in admin signup:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
});

router.get("/verify-email/:token", async (req: Request, res: Response) => {
  console.log("key", req.params.token);
  try {
    if (secretKey) {
      const userInfo = jwt.verify(req.params.token, secretKey) as JwtPayload;
      console.log("user info", userInfo);
      if (!userInfo) return res.status(400).send({ message: "Invalid token" });

      const user = await UserModel.findByEmail(userInfo.email);
      if (!user) return res.status(400).send({ message: "Invalid link" });
      console.log("user ", user);

      if (user?.verificationToken && user?.verificationToken !== "") {
        await UserModel.update(user.PK, {
          verified: true,
          verificationToken: "",
        });

        res.status(200).send({ message: "Email verified successfully" });
      } else {
        res.status(400).send({ message: "Invalid link" });
      }
    }
  } catch (e) {
    res.status(400).send("error");
  }
});

router.get(
  "/me",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user) {
        const user = await UserModel.findByEmail(req.user);
        console.log(" user at /me route", user);
        if (user) {
          res.status(200).send({
            success: true,
            userData: user,
          });
        } else {
          res
            .status(404)
            .send({ success: false, message: "user not present in db" });
        }
      } else {
        res.status(404).send({ success: false, message: "req.user is null" });
      }
    } catch (error: any) {
      console.error("Error in /me route:", error);
      res.status(500).json({ error: "Internal server error", success: false });
    }
  }
);
router.post(
  "/request-reset-password",
  async (req: AuthenticatedRequest, resp: Response) => {
    const { email } = req.body;
    console.log(email);
    try {
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return resp
          .status(400)
          .send({ message: "User not found", success: false });
      }

      if (secretKey) {
        const token = jwt.sign({ email: email }, secretKey, {
          expiresIn: 300,
        });

        await UserModel.update(user.PK, {
          resetPasswordToken: token,
          resetPasswordTokenUsed: false,
        });

        const resetLink = `${process.env.RETURN_CLIENT_URL}/reset-password/${token}`;
        console.log("token", token);
        await sendEmail(
          email,
          "Reset password link",
          resetPassword(resetLink, email)
        );

        resp.status(201).send({
          message: "An Email sent to your email with reset link",
          success: true,
        });
      } else {
        console.error(
          "JWT_SECRET environment variable is not set. Unable to sign JWT."
        );
        resp
          .status(500)
          .json({ message: "Internal server error", success: false });
      }
    } catch (error) {
      resp
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
);
router.post(
  "/reset-password",
  async (req: AuthenticatedRequest, resp: Response) => {
    const { token, newPassword } = req.body;

    try {
      if (secretKey) {
        const isValidtoken = jwt.verify(token, secretKey) as JwtPayload;
        if (isValidtoken) {
          const email = isValidtoken.email;

          const user = await UserModel.findByEmail(email);

          if (
            !user ||
            user.resetPasswordToken !== token ||
            user.resetPasswordTokenUsed
          ) {
            return resp
              .status(404)
              .json({ message: "Invalid token", success: false });
          }

          // Hash the new password before saving it
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await UserModel.update(user.PK, {
            password: hashedPassword,
            resetPasswordToken: "",
            resetPasswordTokenUsed: true,
          });

          return resp
            .status(200)
            .json({ message: "Password has been reset", success: true });
        } else {
          return resp
            .status(400)
            .json({ message: "Invalid token", success: false });
        }
      } else {
        return resp
          .status(500)
          .json({ message: "Server error", success: false });
      }
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ message: "Server error", success: false });
    }
  }
);
router.post("/login", async (req: Request, res: Response) => {
  console.log("email and password", req.headers.email, req.headers.password);
  const { email, password } = req.headers;
  const user = await UserModel.findByEmail(email as string);

  if (!user) {
    res
      .status(400)
      .json({ error: "Invalid username or password", success: false });
    return;
  }

  const isMatch = await bcrypt.compare(
    password as string,
    user.password
  );
  console.log("is match ", isMatch);
  if (!isMatch) {
    res
      .status(400)
      .json({ error: "Invalid username or password", success: false });
    return;
  }

  if (secretKey) {
    const token = jwt.sign(
      {
        email: req.headers.email,
        role: user.isAdmin ? "admin" : "user",
      },
      secretKey,
      { expiresIn: "1h" }
    );

    if (user.verified) {
      res.status(200).send({
        content: "Login successfully",
        token,
        success: true,
        verified: true,
      });
    } else {
      sendEmail(
        user.email,
        "Email Verification",
        getWelcomeEmail(token)
      );

      res.status(201).send({
        message: "An Email sent to your account please verify",
        success: true,
        verified: false,
      });
    }
  } else {
    console.error(
      "JWT_SECRET environment variable is not set. Unable to sign JWT."
    );
    res.status(500).json({ error: "Internal server error", success: false });
  }
});

router.post(
  "/set-my-why-data",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, resp: Response) => {
    const { data } = req.body;
    console.log("data at set my data", data);
    try {
      const user = await UserModel.findByEmail(req.user!);
      console.log("user at set my data", user);
      if (user) {
        await UserModel.update(user.PK, { myWhy: data });
        resp.status(200).send({ success: true });
      }
    } catch (error) {
      resp.status(400).send({ message: "Internal server error", error });
    }
  }
);
router.post(
  "/change-user_details",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const { newPassword } = req.body;
    console.log("at change user details", req?.user, newPassword);
    try {
      // Find user by email
      const user = await UserModel.findByEmail(req?.user!);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update(user.PK, { password: hashedPassword });
      }

      return res
        .status(200)
        .json({ message: "User Details changed successfully", success: true });
    } catch (error) {
      console.error("Error changing details:", error);
      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  }
);
export default router;
