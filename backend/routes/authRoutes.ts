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
// import { Resend } from "resend";
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Bad request", success: false });
      return;
    }
    const bIsAdminPresent: Admin | null = await AdminModel.findOne({
      username: username,
      password: password,
    });
    console.log("bIsAdminPresent" + bIsAdminPresent);
    if (!bIsAdminPresent) {
      // const obj = { username: req.body.username, password: req.body.password };
      // console.log(obj);

      // currentUserId = newAdmin.username;
      console.log(secretKey);
      if (secretKey) {
        let token = jwt.sign(
          {
            username: req.body.username,
            role: "admin",
          },
          secretKey,
          { expiresIn: "24h" }
        );
        const newAdmin: Admin = new AdminModel({
          username: username,
          password: password,
          verificationToken: token,
        });
        newAdmin.save();
        console.log(newAdmin._id);
        sendEmail(username, "Email Verification", getWelcomeEmail(token));
        // const resend = new Resend(process.env.RESEND_KEY);
        // // // awaitcons handleSubscriptionCreated(session, subscription);
        // console.log("before resend call");
        // resend.emails.send({
        //   from: "delivered@resend.dev",
        //   // to: session.customer_email as string,
        //   to: username as string,
        //   subject: "Email Verification",
        //   html: `<p>Please click <a href="http://localhost:5173/verify-email/${token}">here</a> to verify your email.</p>`,
        // });
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
      // const userInfo = jwt.verify(req.params.token, secretKey) as JwtPayload;
      // console.log("tarun id", userInfo);
      // if (!userInfo) return res.status(400).send({ message: "Invalid token" });
      // const user = await AdminModel.findOne({ username: userInfo.username });
      // if (!user) return res.status(400).send({ message: "Invalid link" });
      // console.log("user ", user);

      // if (user.verificationToken  != "") {
      if (secretKey) {
        // user.verified = true;
        // user.verificationToken = "";
        // await user.save();
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
// TODO add the below logic to a common place for the autentcation
router.post("/login", async (req: Request, res: Response) => {
  console.log(
    "tarun email and pas",
    req.headers.username,
    req.headers.password
  );
  const bIsAdminPresent = await AdminModel.findOne({
    username: req.headers.username,
    password: req.headers.password,
  });

  if (bIsAdminPresent) {
    // currentUserId = bIsAdminPresent.username;
    if (secretKey) {
      const token = jwt.sign(
        { username: req.headers.username, role: "admin" },
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
  } else {
    res.status(401).send({ message: "unauthorised", success: false });
  }
});

router.post("/change-user_details", detokenizeAdmin, async (req, res) => {
  const { username, newPassword, imageUrl } = req.body;

  try {
    // Find admin by username
    const bIsAdminPresent = await AdminModel.findOne({ username: username });

    if (!bIsAdminPresent) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (newPassword) {
      bIsAdminPresent.password = newPassword;
    }

    // if (imageUrl) {
    bIsAdminPresent.imageUrl = imageUrl;
    // }
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
});
export default router;
