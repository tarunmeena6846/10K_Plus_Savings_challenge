import express, { Response, Router } from "express";
import { AuthenticatedRequest, detokenizeAdmin } from "../middleware";
import AdminModel from "../models/admin";
import SwotDetailsModel, { SwotDetails, Task } from "../models/swotModel";

const router = express.Router();

router.post(
  "/savetasklist",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const tasks: Task[] = req.body.tasks;
    const isReminderSet: Boolean = req.body.isReminderSet;
    console.log(user, tasks);
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
        });
      } else {
        swotDetails.tasks.push(...tasks);
      }

      await swotDetails.save();

      // Update admin's swotDetails field with the ID of the saved SwotDetails document
      admin.swotTasksDetails = swotDetails._id;
      await admin.save();
      if (isReminderSet) {
        
      }
      res.status(200).json({ message: "Task list saved successfully." });
    } catch (error) {
      console.error("Error saving task list:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
