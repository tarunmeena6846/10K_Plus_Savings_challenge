import express, { Router, Request, Response } from "express";
// import AdminModel from "../models/admin.model";
import AdminModel, { Admin } from "../models/admin";
import { detokenizeAdmin, secretKey } from "../middleware/index";
import jwt, { JwtPayload } from "jsonwebtoken";
// const secretKey: string | undefined = process.env.JWT_SCERET; // Adjust the type based on your actual environment variable type
// import express,  from 'express';
// import { secretKey } from "../index";
// console.log("at authroutes", process.env.JWT_SCERET);
const router: Router = express.Router();
import { AuthenticatedRequest } from "../middleware/index";
import { sendEmail } from "../emails";
import { getWelcomeEmail } from "../emails/welcomeEmail";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import { resetPassword } from "../emails/ResetPassword";
import bcrypt from "bcrypt";

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
    const bIsAdminPresent: Admin | null = await AdminModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    console.log("bIsAdminPresent" + bIsAdminPresent);
    if (!bIsAdminPresent) {
      // const obj = { username: req.body.username, password: req.body.password };
      // console.log(obj);

      // currentUserId = newAdmin.username;
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
        const newAdmin: Admin = new AdminModel({
          username: username,
          email: email,
          password: hashedPassword,
          verificationToken: token,
          isAdmin: isAdmin ? true : false,
        });
        newAdmin.save();
        console.log(newAdmin._id);
        console.log("token", token);
        await sendEmail(username, "Email Verification", getWelcomeEmail(token));
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
    } else {
      res
        .status(200)
        .send({ content: "Admin already registered", success: false });
    }
  } catch (error: any) {
    console.error("Error in admin signup:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
});

router.get("/verify-email/:token", async (req: Request, res: Response) => {
  // const authHeader = req.params.token;
  console.log("key", req.params.token);
  try {
    if (secretKey) {
      const userInfo = jwt.verify(req.params.token, secretKey) as JwtPayload;
      console.log("tarun id", userInfo);
      if (!userInfo) return res.status(400).send({ message: "Invalid token" });
      const user = await AdminModel.findOne({ username: userInfo.username });
      if (!user) return res.status(400).send({ message: "Invalid link" });
      console.log("user ", user);

      if (user.verificationToken != "") {
        // if (secretKey) {
        user.verified = true;
        user.verificationToken = "";
        await user.save();
        res.status(200).send({ message: "Email verified successfully" });
        // return res.redirect("http://localhost:5173/login");
      } else {
        res.status(400).send({ message: "Invalid link" });
      }
    }
    // res.status(200).send({ message: "Email verified successfully" });
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
        const bIsAdminPresent = await AdminModel.findOne({
          username: req.user,
        });
        console.log(" bIsAdminPresent at /me route", bIsAdminPresent);
        if (bIsAdminPresent) {
          res.status(200).send({
            userEmail: bIsAdminPresent.username,
            imageUrl: bIsAdminPresent.imageUrl,
            userData: bIsAdminPresent,
            // subscription: bIsAdminPresent.subscriptions,
          });
        } else {
          res.status(401).send("unauthorised");
        }
      } else {
        res.status(401).send("Unauthorised");
      }
    } catch (error: any) {
      console.error("Error in admin signup:", error);
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
      const isUserPresent = await AdminModel.findOne({ username: email });

      if (!isUserPresent) {
        return resp
          .status(400)
          .send({ mesage: "User not found", success: false });
      }

      if (secretKey) {
        const token = jwt.sign({ email: email }, secretKey, {
          expiresIn: 300,
        });
        isUserPresent.resetPasswordToken = token;
        isUserPresent.resetPasswordTokenUsed = false;
        await isUserPresent.save();
        const resetLink = `http://localhost:5173/reset-password/${token}`;
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

          const User = await AdminModel.findOne({ username: email });

          if (
            !User ||
            User.resetPasswordToken !== token ||
            User.resetPasswordTokenUsed
          ) {
            return resp
              .status(404)
              .json({ message: "Invalid token", success: false });
          }

          // Hash the new password before saving it
          // const hashedPassword = await bcrypt.hash(newPassword, 10);
          User.password = newPassword;
          User.resetPasswordToken = "";
          User.resetPasswordTokenUsed = true;
          await User.save();

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
// TODO add the below logic to a common place for the autentcation
router.post("/login", async (req: Request, res: Response) => {
  console.log("tarun email and pas", req.headers.email, req.headers.password);
  const { email, password } = req.headers;
  const bIsAdminPresent = await AdminModel.findOne({
    email: email,
    // password: req.headers.password,
  });

  if (!bIsAdminPresent) {
    res
      .status(400)
      .json({ error: "Invalid username or password", success: false });
    return;
  }
  const isMatch = await bcrypt.compare(
    password as string,
    bIsAdminPresent.password
  );
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
        role: bIsAdminPresent.isAdmin ? "admin" : "user",
      },
      secretKey,
      { expiresIn: "1h" }
    );
    if (bIsAdminPresent.verified) {
      res.status(200).send({
        content: "Login successfully",
        token,
        success: true,
        verified: true,
      });
    } else {
      sendEmail(
        req.headers.username as string,
        "Email Verification",
        getWelcomeEmail(token)
      );

      // const resend = new Resend(process.env.RESEND_KEY);
      // // // awaitcons handleSubscriptionCreated(session, subscription);
      // console.log("before resend call");
      // resend.emails.send({
      //   from: "delivered@resend.dev",
      //   // to: session.customer_email as string,
      //   to: bIsAdminPresent.username as string,
      //   subject: "Email Verification",
      //   html: `<p>Please click <a href="http://localhost:5173/verify-email/${token}">here</a> to verify your email.</p>`,
      // });
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
      const user = await AdminModel.findOne({ username: req.user });
      console.log("user at set my data", user);
      if (user) {
        user.myWhy = data;
        await user.save();
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
    const { newPassword, imageUrl } = req.body;
    console.log("at change user details", req?.user, newPassword, imageUrl);
    try {
      // Find admin by username
      const bIsAdminPresent = await AdminModel.findOne({ username: req?.user });

      if (!bIsAdminPresent) {
        return res.status(404).json({ error: "Admin not found" });
      }

      if (newPassword) {
        bIsAdminPresent.password = newPassword;
      }

      if (imageUrl) {
        bIsAdminPresent.imageUrl = imageUrl;
        await Post.updateMany(
          { author: req.user }, // Filter posts by user ID
          { userImage: imageUrl }
        );
        await Comment.updateMany(
          { author: req.user }, // Filter posts by user ID
          { imageLink: imageUrl }
        );
      }
      // Save the updated admin
      await bIsAdminPresent.save();
      return res
        .status(200)
        .json({ message: "User Deatils changed successfully", success: true });
    } catch (error) {
      console.error("Error changing details:", error);
      return res
        .status(500)
        .json({ error: "Internal server error", success: false });
    }
  }
);
export default router;
