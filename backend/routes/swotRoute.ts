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
          // Update isComplete field for tasks with provided taskIds
          swotDetails.tasks.forEach((task) => {
            if (taskIds.includes(task._id.toString())) {
              task.isComplete = true;
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
