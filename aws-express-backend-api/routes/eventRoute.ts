import express, { Response, Router } from "express";
import { AuthenticatedRequest, detokenizeAdmin, isAdmin } from "../middleware";
import EventModal from "../models/eventSchema";
import { sendEmail } from "../emails";
import { AdminModel, NotificationModel } from "../models/admin";
import { eventNotificationEmail } from "../emails/eventNotification";
import corn from "node-cron";

const router: Router = express.Router();

// router.post(
//   "/notification",
//   detokenizeAdmin,
//   async (req: AuthenticatedRequest, res: Response) => {
//     console.log("inside notification", req.body.selectedNotifications);
//     const { adminPost, groupPost, taskListReminder, monthlySwot } =
//       req.body.selectedNotifications;

//     console.log(adminPost, groupPost, taskListReminder, monthlySwot);

//     const notificationInDb = await NotificationModel.findOneAndUpdate(
//       { userEmail: req.user },
//       {
//         type: {
//           taskListReminder: taskListReminder,
//           adminPost: adminPost,
//           groupPost: groupPost,
//           monthlySwot: monthlySwot,
//         },
//       },
//       { new: true, upsert: true }
//     );

//     console.log("notificationInDb", notificationInDb);
//     // if (!notificationInDb) {
//     // } else {
//     //   notificationInDb.userEmail = req.user || "";
//     //   notificationInDb.type = {
//     //     taskListReminder: taskListReminder,
//     //     adminPost: adminPost,
//     //     groupPost: groupPost,
//     //     monthlySwot: monthlySwot,
//     //   };
//     // }
//     // await notificationInDb?.save();
//   }
// );
router.get(
  "/get-events",
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("inside getevents");
    const { startTime, endTime } = req.query;
    console.log(startTime, endTime);
    // scheduleWeeklyReminderEmail();
    if (!startTime || !endTime) {
      return res.status(400).send("Month and year are required");
    }
    // const monthNum = parseInt(month as string, 10);
    // const yearNum = parseInt(year as string, 10);

    // if (isNaN(monthNum) || isNaN(yearNum)) {
    //   return res.status(400).send("Invalid month or year");
    // }
    // const startOfMonth = new Date(yearNum, monthNum - 1, 1, 0, 0);
    // const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59);
    // const formatDateToLocalString = (date: string) => {
    //   const format = date.split(" ");
    //   return format[0];
    // };

    // const startOfMonthFormatted = formatDateToLocalString(startTime);
    // const endOfMonthFormatted = formatDateToLocalString(endTime);

    // console.log(
    //   "tarun startofmonth",
    //   startOfMonthFormatted,
    //   endOfMonthFormatted
    // );
    try {
      const events = await EventModal.find({
        start: { $gte: startTime },
        end: { $lte: endTime },
      });

      console.log("event between dates ", events);
      res.status(200).json({ success: true, events: events });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/save-event",
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    const event = req.body.event;
    console.log("events at eventroute", event);

    const newEvent = new EventModal({
      //   id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.description,
    });
    console.log("events at eventroute", newEvent);

    await newEvent.save();
    const currentActiveUsers = await AdminModel.aggregate([
      {
        $match: { verified: true }, // Filter to include only verified users
      },
      {
        $group: {
          _id: null,
          emails: { $push: "$email" },
        },
      },
      {
        $project: {
          _id: 0,
          emails: 1,
        },
      },
    ]);

    const emails = currentActiveUsers.length
      ? currentActiveUsers[0].emails
      : [];

    console.log(emails);

    console.log("currentactiveusers", emails);
    //TODO try to get the username while sending the email
    await sendEmail(
      emails,
      "10K SAVINGS CHALLENGE: Notification of Community Admin Post",
      eventNotificationEmail(emails)
    );

    res.status(200).json({ success: true, event: newEvent });
  }
);

router.delete(
  "/delete-event",
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("at delete event ");
    const eventId = req.body.eventId;
    console.log(eventId);
    try {
      const eventInDB = await EventModal.findByIdAndDelete(eventId);
      console.log("eventInDB", eventInDB);
      if (!eventInDB) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }
      console.log("after delete");
      res.status(200).json({ success: true });
    } catch (error) {
      console.log("in catch");
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post(
  "/update-event",
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("at update event ");

    const { event } = req.body;

    console.log(event);
    try {
      const eventInDB = await EventModal.findByIdAndUpdate(
        { _id: event._id },
        {
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
        },
        { new: true }
      );
      console.log(eventInDB);
      if (!eventInDB) {
        res
          .status(404)
          .json({ success: false, message: "Event not found in DB" });
      }

      res.status(200).json({ success: true, data: eventInDB });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

export default router;
