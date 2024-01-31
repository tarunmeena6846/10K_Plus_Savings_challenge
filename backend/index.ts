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

const stripe = require("stripe")(
  "sk_test_51OeQglSBiPFrlsnbV04gxCKnQO3fh5gmRvtmR1NhCLw3SVX5kxhPRSY9QqEASf05oh4XJHfY0bcjpejAOLP5Gsp4006W3Af6Lq"
);
const bodyParser = require("body-parser");

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

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (request, response) => {
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

    console.log("insdie the hook", event);
    // Handle the checkout.session.completed event
    if (event?.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fulfill the purchase...
      // fulfillOrder(session);
    }
    switch (event?.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Save an order in your database, marked as 'awaiting payment'
        // createOrder(session);
        console.log("session in complete", session);

        // Check if the order is paid (for example, from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === "paid") {
          console.log("session in paid", session);
          const resend = new Resend("re_fTogyVPD_JaoSAyV92gN7WMPEwMRA9ftq");

          resend.emails.send({
            from: "onboarding@resend.dev",
            to: "wealthxk@gmail.com",
            subject: "Hello World",
            html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
          });
        }

        break;
      }

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
