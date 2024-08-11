import express, { Response, Router, Request } from "express";
import { AuthenticatedRequest, detokenizeAdmin, isAdmin } from "../middleware";
import EventModal from "../models/eventSchema";
import { sendEmail } from "../emails";
import { AdminModel, NotificationModel } from "../models/admin";
import { eventNotificationEmail } from "../emails/eventNotification";
import cron from "node-cron";
import { weeklyPortalReminder } from "../emails/weeklyPortalUpdateReminder";
import mongoose from "mongoose";
import { getAdminPostNotificationTemp } from "../emails/adminPost";
import { getUserPostNotificationTemp } from "../emails/userPost";
import { getSWOTAnalysisTemp } from "../emails/swotAnalysis";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import multerS3 from "multer-s3";
const router: Router = express.Router();

import dotenv from "dotenv";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
dotenv.config();
// console.log("aws access key", process.env.AWS_ACCESS_KEY);
// Configure the AWS SDK
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_KEY}`,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3 as S3Client,
    bucket: process.env.S3_BUCKET_NAME || "",
    key: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router.post(
  "/upload-user-profile",
  upload.single("avatar"),
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const s3Key = (req.file as any).key; // Get the S3 key of the uploaded file
    const s3Uri = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`; // Construct the S3 URI

    console.log(s3Key, s3Uri);
    try {
      const bIsAdminPresent = await AdminModel.findOne({ email: req?.user });

      if (!bIsAdminPresent) {
        return res.status(404).json({ error: "Admin not found" });
      }

      bIsAdminPresent.imageUrl = s3Uri;
      await Post.updateMany(
        { author: req.user }, // Filter posts by user ID
        { userImage: s3Uri }
      );
      await Comment.updateMany(
        { author: req.user }, // Filter posts by user ID
        { imageLink: s3Uri }
      );
      await bIsAdminPresent.save();

      //   const data = await s3.upload(params).promise();
      //   console.log("url after upload", data.Location);
      console.log("url of profile image", s3Uri);
      res.json({ url: s3Uri });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);
router.post(
  "/disabledashboardVideoPopup",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userFromDB = await AdminModel.findOneAndUpdate(
        { email: req.user },
        {
          videoModalSettings: { dashboardVideoModal: false },
        }
      );

      if (userFromDB) {
        return res.status(200).json({ success: true });
      }

      res.status(400).json({ success: false });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
);
router.post(
  "/updateNotification",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("inside notification", req.body.selectedNotifications);
    const { adminPost, groupPost, taskListReminder, monthlySwot } =
      req.body.selectedNotifications;

    console.log(adminPost, groupPost, taskListReminder, monthlySwot);
    try {
      const notificationInDb = await NotificationModel.findOneAndUpdate(
        { userEmail: req.user },
        {
          type: {
            taskListReminder: taskListReminder,
            adminPost: adminPost,
            groupPost: groupPost,
            monthlySwot: monthlySwot,
          },
        },
        { new: true, upsert: true }
      );

      console.log("notificationInDb", notificationInDb);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating notifications", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

export const sendAdminPostNotification = async (
  postId: string | mongoose.Types.ObjectId,
  name: string,
  title: string,
  isAdmin: Boolean
) => {
  const postIdString = postId.toString();

  console.log("inside send admin post ", postIdString, name, title);

  const subscribedUserArray = await NotificationModel.aggregate([
    {
      $match: isAdmin ? { "type.adminPost": true } : { "type.groupPost": true }, // Match documents where weeklyReminder is true
    },
    {
      $group: {
        _id: null,
        emails: { $addToSet: "$userEmail" },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the output
        emails: 1, // Include the emails field in the output
      },
    },
  ]);

  console.log("subscribedUserArray", subscribedUserArray);

  await sendEmail(
    subscribedUserArray[0].emails,
    `10K SAVINGS CHALLENGE: Notification of Community ${
      isAdmin ? "Admin" : "Group"
    } Post`,
    isAdmin
      ? getAdminPostNotificationTemp(name, title, postIdString)
      : getUserPostNotificationTemp(name, title, postIdString)
  );
};

// const scheduleWeeklyReminderEmail = async () => {
console.log("cron schedular called");
const weeklyReminderTask = cron.schedule("13 18 * * 0", async (params: any) => {
  console.log("here at weekly scheduler");
  const subscribedUserArray = await NotificationModel.aggregate([
    {
      $match: { "type.taskListReminder": true }, // Match documents where weeklyReminder is true
    },
    {
      $group: {
        _id: null,
        emails: { $addToSet: "$userEmail" },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the output
        emails: 1, // Include the emails field in the output
      },
    },
  ]);

  console.log("subscribedUserArray", subscribedUserArray);
  console.log("weekly schedular called");

  sendEmail(
    subscribedUserArray[0].emails,
    "10K SAVINGS CHALLENGE: Task List Reminder ",
    weeklyPortalReminder()
  );

  // await sendEmail();
});
// };

// const scheduleMonthlySWOTEmail = async () => {
console.log("schedular called");
const monthlySwotTask = cron.schedule("0 0 1 * *", async (params: any) => {
  const subscribedUserArray = await NotificationModel.aggregate([
    {
      $match: { "type.monthlySwot": true }, // Match documents where weeklyReminder is true
    },
    {
      $group: {
        _id: null,
        emails: { $addToSet: "$userEmail" },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the output
        emails: 1, // Include the emails field in the output
      },
    },
  ]);

  console.log("subscribedUserArray", subscribedUserArray);
  console.log("monthly schedular called");

  sendEmail(
    subscribedUserArray[0].emails,
    "10K SAVINGS CHALLENGE: Monthly SWOT Analysis ",
    getSWOTAnalysisTemp()
  );

  // await sendEmail();
});
// };

monthlySwotTask.start();
weeklyReminderTask.start();

export default router;
