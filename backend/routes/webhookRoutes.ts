import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController";

const router = express.Router();
console.log("at webhook route");
router.post(
  "/",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
