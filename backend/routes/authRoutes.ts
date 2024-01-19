import express, { Router, Request, Response } from "express";
// import AdminModel from "../models/admin.model";
import AdminModel, { Admin } from "../models/admin";
import { detokenizeAdmin, secretKey } from "../middleware/index";
import jwt from "jsonwebtoken";
// const secretKey: string | undefined = process.env.JWT_SCERET; // Adjust the type based on your actual environment variable type
// import express,  from 'express';
// import { secretKey } from "../index";
// console.log("at authroutes", process.env.JWT_SCERET);
const router: Router = express.Router();
import { AuthenticatedRequest } from "../middleware/index";
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
      const newAdmin: Admin = new AdminModel({
        username: username,
        password: password,
      });
      newAdmin.save();
      console.log(newAdmin._id);
      // currentUserId = newAdmin.username;
      console.log(newAdmin);
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
        res.status(200).json({
          content: "Admin created successfully",
          token,
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
      res
        .status(200)
        .send({ content: "Login successfully", token, success: true });
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
