import express from "express";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
} from "../controllers/webhookController";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import bodyParser from "body-parser";
// import nodemailer from "nodemailer";
import Stripe from "stripe";
import { sendEmail } from "../emails";
import { getSubscriptionConfirmationEmail } from "../emails/creatSubscription";
import { getSubscriptionUpdateEmail } from "../emails/updateSubscription";

const router = express.Router();

router.post("/create-customer-portal-session", async (req, res) => {
  console.log("customer id", req.body.customerId);
  try {
    // Make request to Stripe API to create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: req.body.customerId,
      return_url: `${process.env.RETURN_CLIENT_URL}/dashboard`,
    });
    console.log("process.env.RETURN_CLIENT_URL", process.env.RETURN_CLIENT_URL);
    res.status(200).json({ url: session.url }); // Return URL of Stripe-hosted checkout page
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),

  async (request, response) => {
    try {
      // console.log("webhhok request.body", request.body);
      let event = request.body;
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("insdie the hook", event, "tarun sesion", session);

      switch (event?.type) {
        case "checkout.session.completed": {
          if (session.mode === "subscription") {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            // Check if the order is paid (for example, from a card payment)
            //
            // A delayed notification payment will have an `unpaid` status, as
            // you're still waiting for funds to be transferred from the customer's
            // account.
            if (session.payment_status === "paid") {
              // console.log("session in paid", session);
              await handleSubscriptionCreated(session, subscription);

              const customer = await stripe.customers.retrieve(
                event.data.object.customer
              );

              await sendEmail(
                customer.email,
                "Subscription Confirmation",
                getSubscriptionConfirmationEmail(customer.name)
              );
            }
          } else if (session.mode === "payment") {
            console.log("in else part");
          }

          break;
        }

        case "customer.subscription.updated":
          console.log("session subscription", event);
          const subscription = await stripe.subscriptions.retrieve(
            event.data.object.id as string
          );
          await handleSubscriptionUpdated(event, subscription);

          const customer = await stripe.customers.retrieve(
            event.data.object.customer
          );

          await sendEmail(
            customer.email,
            "Subscription Update",
            getSubscriptionUpdateEmail(customer.name)
          );

          break;
        case "invoice.payment_succeeded":
          // Get the plan ID from the subscription object in the event
          const planId = event.data.object.lines.data[0].plan.id;
          console.log("Plan ID:", planId);
          // Handle the rest of your logic
          break;

        case "checkout.session.async_payment_succeeded": {
          const session = event.data.object;
          console.log("session in sync passed", session);

          break;
        }

        case "checkout.session.async_payment_failed": {
          const session = event.data.object;
          console.log("session in sync failed", session);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
        // Return a 200 response to acknowledge receipt of the event
      }
      response.json({ received: true });
    } catch (error: any) {
      console.error("Webhook Error:", error.message);
      response.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

export default router;
