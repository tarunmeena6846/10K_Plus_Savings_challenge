import express, { Response, Router } from "express";
import { AuthenticatedRequest, detokenizeAdmin, isAdmin } from "../middleware";
import EventModal from "../models/eventSchema";
import { sendEmail } from "../emails";
import { AdminModel, NotificationModel } from "../models/admin";
import { eventNotificationEmail } from "../emails/eventNotification";
import corn from "node-cron";
import { weeklyPortalReminder } from "../emails/weeklyPortalUpdateReminder";
import mongoose from "mongoose";
import { getAdminPostNotificationTemp } from "../emails/adminPost";
import { getUserPostNotificationTemp } from "../emails/userPost";
import { getSWOTAnalysisTemp } from "../emails/swotAnalysis";
const router: Router = express.Router();

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

const scheduleWeeklyReminderEmail = async () => {
  console.log("schedular called");
  corn.schedule("* * * * 0", async (params: any) => {
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
};

const scheduleMonthlySWOTEmail = async () => {
  console.log("schedular called");
  corn.schedule("* * * * 0", async (params: any) => {
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
};

scheduleMonthlySWOTEmail();
scheduleWeeklyReminderEmail();

export default router;
