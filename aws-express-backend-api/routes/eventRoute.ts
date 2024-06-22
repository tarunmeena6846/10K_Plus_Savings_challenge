import express, { Response, Router } from "express";
import { AuthenticatedRequest, detokenizeAdmin, isAdmin } from "../middleware";
import EventModal from "../models/eventSchema";

const router: Router = express.Router();

router.get(
  "/get-events",
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("inside getevents");
    const { year, month } = req.query;
    console.log(year, month);
    if (!month || !year) {
      return res.status(400).send("Month and year are required");
    }
    const monthNum = parseInt(month as string, 10);
    const yearNum = parseInt(year as string, 10);

    if (isNaN(monthNum) || isNaN(yearNum)) {
      return res.status(400).send("Invalid month or year");
    }

    const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(
      Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)
    ); // last day of the month

    console.log("tarun startofmonth", startOfMonth, endOfMonth);
    try {
      const events = await EventModal.find({
        startTime: { $gte: startOfMonth },
        endTime: { $lte: endOfMonth },
      });

      console.log(events);
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
      startTime: event.start,
      endTime: event.end,
      description: event.description,
    });
    console.log("events at eventroute", newEvent);

    await newEvent.save();

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
          startTime: event.start,
          endTime: event.end,
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
