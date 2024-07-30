import express, { Response, Router, response } from "express";
import { AuthenticatedRequest, detokenizeAdmin } from "../middleware";
import { AdminModel } from "../models/admin";
import SwotDetailsModel, { SwotDetails, Task } from "../models/swotModel";
import { sendEmail } from "../emails";
import { reminderEmail } from "../emails/Reminder";
import mongoose, { Schema, SchemaTypeOptions, Types } from "mongoose";

const router = express.Router();

router.post(
  "/savetasklist",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const tasks: Task[] = req.body.tasks;
    const isReminderSet: boolean = req.body.isReminderSet;
    console.log("tasks in backend", user, tasks);
    try {
      // Find the admin user
      const admin = await AdminModel.findOne({ username: user });

      if (!admin) {
        return res.status(404).json({ message: "User not found." });
      }

      // Create or update SwotDetails document
      let swotDetails: SwotDetails | null = await SwotDetailsModel.findOne({
        userId: user,
      });
      console.log(swotDetails);
      if (!swotDetails) {
        swotDetails = new SwotDetailsModel({
          userId: user,
          tasks: tasks,
          isReminderSet: isReminderSet,
          email: admin.username,
        });
      } else {
        console.log(tasks);
        swotDetails.tasks.push(...tasks);
        console.log("swotDetails.tasks", swotDetails.tasks);
        swotDetails.isReminderSet = isReminderSet;
      }

      await swotDetails.save();

      // Update admin's swotDetails field with the ID of the saved SwotDetails document
      admin.swotTasksDetails = swotDetails._id as Schema.Types.ObjectId; // Use type assertion
      await admin.save();

      if (isReminderSet) {
        setIntervalForReminder(admin.username);
        // sendEmail(
        //   admin.username,
        //   "Weekly Reminder",
        //   reminderEmail(admin.username)
        // );
      }
      res.status(200).json({ message: "Task list saved successfully." });
    } catch (error) {
      console.error("Error saving task list:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.post(
  "/set-reminder",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, resp: Response) => {
    const email = req.body.email;
    const user = req?.user;
    try {
      const swotDetails = await SwotDetailsModel.findOne({ userId: user });

      if (swotDetails) {
        if (email) {
          swotDetails.email = email;
          await swotDetails.save();
          setIntervalForReminder(email);
        }
        resp.status(200).json({ success: true });
      } else {
        resp.status(200).json({ success: false });
      }
    } catch (error) {
      resp.status(400).json(error);
    }
  }
);
const setIntervalForReminder = (email: string) => {
  sendEmail(email, "Weekly Reminder", reminderEmail(email));
};
router.get(
  "/get-task-list",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, resp: Response) => {
    const user = req.user;
    try {
      const isUserPresent = await AdminModel.findOne({
        username: user,
      }).populate("swotTasksDetails");
      console.log("isUserPresent", isUserPresent);
      if (isUserPresent?.swotTasksDetails) {
        resp.status(200).json({
          success: true,
          data: isUserPresent.swotTasksDetails,
        });
      } else {
        resp.status(400).json({ success: false, data: null });
      }
    } catch (error) {
      console.log("Error while fetching tasklist", error);
      resp.status(400).json({ success: false, data: error });
    }
  }
);
router.put(
  "/bulk-update",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, resp: Response) => {
    const { type, taskIds } = req.body;
    const user = req.user;
    console.log(user, type, taskIds);
    try {
      const swotDetails = await SwotDetailsModel.findOne({ userId: user });
      console.log(swotDetails);
      if (!swotDetails) {
        resp.status(400).json({ success: false });
      } else {
        if (type === "delete") {
          // Delete tasks with provided taskIds
          swotDetails.tasks = swotDetails.tasks.filter(
            (task) => !taskIds.includes(task._id.toString())
          );
          await swotDetails.save();
          return resp
            .status(200)
            .json({ success: true, message: "Tasks deleted successfully." });
        } else if (type === "complete") {
          let counter = 0;
          // Update isComplete field for tasks with provided taskIds
          swotDetails.tasks.forEach((task) => {
            if (!task.isComplete) {
              console.log("counter", ++counter);
              if (taskIds.includes(task._id.toString())) {
                task.isComplete = true;
              }
            }
          });
          await swotDetails.save();
          return resp
            .status(200)
            .json({ success: true, message: "Tasks completed successfully." });
        } else {
          return resp
            .status(400)
            .json({ success: false, message: "Invalid operation type." });
        }
      }
    } catch (error) {
      console.error("Error updating tasks in bulk:", error);
      return resp
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);
export default router;
