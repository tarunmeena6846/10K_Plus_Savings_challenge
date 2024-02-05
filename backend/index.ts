// src/app.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import dotenv from "dotenv";
// import admi from "./routes/admin.routes";
import dataRoute from "./routes/dataRoute";
import authRoutes from "./routes/authRoutes";
import webhookRoutes from "./routes/webhookRoutes"; // Import the webhook routes
// import { stripe } from "./config/stripe";
import { Resend } from "resend";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
} from "./controllers/webhookController";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
import Stripe from "stripe";

// import { secretKey } from "./middleware/authAdmin";
// export const secretKey = process.env.JWT_SCERET;

const app = express();
// dotenv.config();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// console.log("JWT_TOKEN", process.env.JWT_SCERET);
mongoose
  .connect(process.env.MONGODB_URL || "", {
    dbName: "savingApp",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
console.log("pointer till 27");
app.use("/auth", authRoutes);
app.use("/data", dataRoute);
// app.use("/webhook", webhookRoutes); // Mount the webhook routes

// ... (your existing app logic)
const endpointSecret =
  "whsec_87d735066aaff8a39ea87d59156cdc240d9ca075cfed64255174e6b13b13cccc";
app.post("/create-customer-portal-session", async (req, res) => {
  console.log("customer id", req.body.customerId);
  const session = await stripe.billingPortal.sessions.create({
    customer: req.body.customerId,
    return_url: process.env.RETURN_CLIENT_URL,
  });
  console.log("session url", session.url);
  console.log("process.env.RETURN_CLIENT_URL", process.env.RETURN_CLIENT_URL);
  res.redirect(session.url);
});
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),

  async (request, response) => {
    // const sig = request.headers["stripe-signature"] as string;
    const sig = request.headers["stripe-signature"];
    console.log("webhhok request.body", request.body);
    let event = request.body;

    // try {
    //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // } catch (err: any) {
    //   response.status(400).send(`Webhook Error: ${err.message}`);
    //   return;
    // }
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("insdie the hook", event, event.data.object.plan);
    // Handle the checkout.session.completed event
    if (event?.type === "checkout.session.completed") {
      // const session = event.data.object;
      // Fulfill the purchase...
      // fulfillOrder(session);
    }
    switch (event?.type) {
      case "checkout.session.completed": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        console.log("session in complete", session);

        // Check if the order is paid (for example, from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.

        if (session.payment_status === "paid") {
          console.log("session in paid", session);
          const resend = new Resend(process.env.RESEND_KEY);
          await handleSubscriptionCreated(session, subscription);

          const customer = await stripe.customers.retrieve(
            event.data.object.customer
          );
          console.log("custoemr", customer);
          resend.emails.send({
            from: "delivered@resend.dev",
            // to: session.customer_email as string,
            to: customer.email as string,
            subject: "Hello World",
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to 10K Plus Savings Challange</title>
              </head>
              <body>
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h1>Welcome to 10K Plus Saving Challange !</h1>
                  <p>Dear ${customer.name},</p>
                  <p>Thank you for subscribing to our Challange. We're excited to have you on board!</p>
                  <p>We promise not to spam your inbox and only send you relevant content.</p>
                  <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
                  <p>Best regards,<br> 10K Plus Savings Challange Team</p>
                </div>
              </body>
              </html>
            `,
          });
        }

        break;
      }

      case "customer.subscription.updated":
        console.log("session subscription", session.subscription);
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id as string
        );
        await handleSubscriptionUpdated(event, subscription);
        const resend = new Resend(process.env.RESEND_KEY);
        // // await handleSubscriptionCreated(session, subscription);
        const customer = await stripe.customers.retrieve(
          event.data.object.customer
        );
        console.log("custoemr", customer);
        resend.emails.send({
          from: "delivered@resend.dev",
          // to: session.customer_email as string,
          to: customer.email as string,
          subject: "",
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Subscribing!</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Thank You for Subscribing!</h1>
            <p>Dear ${customer.name},</p>
            <p>Thank you for subscribing to our website. We're thrilled to have you as part of our community!</p>
            <p>Stay tuned for exciting updates and exclusive offers.</p>
            <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
            <p>Best regards,<br> 10K Plus Savings Challange Team</p>
          </div>
        </body>
          </html>
        `,
        });
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
        // Fulfill the purchase...
        // fulfillOrder(session);

        break;
      }

      case "checkout.session.async_payment_failed":
        {
          const session = event.data.object;
          console.log("session in sync failed", session);
          // Send an email to the customer asking them to retry their order
          // emailCustomerAboutFailedPayment(session);

          break;
        }
        // Return a 200 response to acknowledge receipt of the event
        response.send();
    }
  }
);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
