import express, { Response, Router, response } from "express";
import { AuthenticatedRequest, detokenizeAdmin } from "../middleware";
import SwotDetailsModel, { SwotDetails, Task } from "../models/swotModel";
import { sendEmail } from "../emails";
import { reminderEmail } from "../emails/Reminder";
import mongoose, { Schema, SchemaTypeOptions, Types } from "mongoose";
import { UserModel } from "../models/dynamodb/User";
import { SwotTask, SwotTaskModel } from "../models/dynamodb/SwotTask";
import { randomUUID } from 'crypto';

const router = express.Router();

router.post(
  "/savetasklist",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const tasks: Task[] = req.body.tasks;
    const isReminderSet: boolean = req.body.isReminderSet;
    console.log("tasks in backend", user, tasks);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }
    try {
      // Find the admin user
      // const admin = await UserModel.findByEmail(user);

      // Create or update SwotDetails document
      let swotDetails: SwotTask | null = await SwotTaskModel.findByUserId(user);
      console.log(swotDetails);
      if (!swotDetails) {
        swotDetails = await SwotTaskModel.create({
          userId: user,
          tasks: tasks.map((task) => ({
            taskId: `TASK#${randomUUID()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            title: task.title,
            isComplete: task.isComplete,
            dueDate: task.dueDate,
          })),
          isReminderSet: isReminderSet,
          // email: admin.email,
        });
      } else {
        console.log(tasks);
        swotDetails.tasks = [...swotDetails.tasks, ...tasks.map((task) => ({
          taskId: `TASK#${randomUUID()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: task.title,
          isComplete: task.isComplete,
          dueDate: task.dueDate,
        }))];
        console.log("swotDetails.tasks", swotDetails.tasks);
        swotDetails.isReminderSet = isReminderSet;
          await SwotTaskModel.updateTasks(user, swotDetails.tasks);
      }

      await SwotTaskModel.updateReminderStatus(user, isReminderSet);
      // await UserModel.update(user, { swotTasksDetails: JSON.stringify(swotDetails) });
      res
        .status(200)
        .json({ success: true, message: "Task list saved successfully." });
    } catch (error) {
      console.error("Error saving task list:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// router.post(
//   "/set-reminder",
//   detokenizeAdmin,
//   async (req: AuthenticatedRequest, resp: Response) => {
//     const email = req.body.email;
//     const user = req?.user;
//     try {
//       const swotDetails = await SwotDetailsModel.findOne({ userId: user });

//       if (swotDetails) {
//         if (email) {
//           swotDetails.email = email;
//           await swotDetails.save();
//           setIntervalForReminder(email);
//         }
//         resp.status(200).json({ success: true });
//       } else {
//         resp.status(200).json({ success: false });
//       }
//     } catch (error) {
//       resp.status(400).json(error);
//     }
//   }
// );
// const setIntervalForReminder = (email: string) => {
//   sendEmail(email, "Weekly Reminder", reminderEmail(email));
// };
router.get(
  "/get-task-list",
  detokenizeAdmin,
  async (req: AuthenticatedRequest, resp: Response) => {
    const user = req.user;
    try {
      const swotTask = await SwotTaskModel.findByUserId(user!);
      console.log("swotTask", swotTask);
      if (swotTask) {
        return resp.status(200).json({ success: true, data: swotTask?.tasks });
      }
      return resp.status(400).json({ success: false, data: null });
    } catch (error) {
      console.error("Error while fetching tasklist:", error);
      return resp.status(500).json({ success: false, message: "Internal server error." });
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
      const swotDetails = await SwotTaskModel.findByUserId(user!);
      console.log(swotDetails);
      if (!swotDetails) {
        return resp.status(400).json({ success: false });
      } else {
        if (type === "delete") {
          // Delete tasks with provided taskIds
          swotDetails.tasks = swotDetails.tasks.filter(
            (task) => !taskIds.includes(task.taskId)
          );
          await SwotTaskModel.updateTasks(user!, swotDetails.tasks);
          return resp
            .status(200)
            .json({ success: true, message: "Tasks deleted successfully." });
        } else if (type === "complete") {
          // Update isComplete field for tasks with provided taskIds
          swotDetails.tasks.forEach((task) => {
            if (!task.isComplete) {
              if (taskIds.includes(task.taskId)) {
                task.isComplete = true;
              }
            }
          });
          await SwotTaskModel.updateTasks(user!, swotDetails.tasks);
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
