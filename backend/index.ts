// src/app.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import dotenv from "dotenv";
// import admi from "./routes/admin.routes";
import dataRoute from "./routes/dataRoute";
import authRoutes from "./routes/authRoutes";
import stripeRoutes from "./routes/stripeRoutes"; // Import the webhook routes
// import { stripe } from "./config/stripe";
// import { Resend } from "resend";
// import {
//   handleSubscriptionCreated,
//   handleSubscriptionUpdated,
// } from "./controllers/webhookController";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// import bodyParser from "body-parser";
// import nodemailer from "nodemailer";

// import Stripe from "stripe";

// import { secretKey } from "./middleware/authAdmin";
// export const secretKey = process.env.JWT_SCERET;

const app = express();
// dotenv.config();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.NODEMAILER_ADMIN_EMAIL,
//     pass: process.env.NODEMAILER_ADMIN_PASS,
//   },
// });
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
app.use("/stripe", stripeRoutes); // Mount the webhook routes
app.use("/post", postRoute);
// ... (your existing app logic)
const endpointSecret =
  "whsec_87d735066aaff8a39ea87d59156cdc240d9ca075cfed64255174e6b13b13cccc";
// app.post("/create-customer-portal-session", async (req, res) => {
//   console.log("customer id", req.body.customerId);
//   // const session = await stripe.billingPortal.sessions.create({
//   //   customer: req.body.customerId,
//   //   return_url: `${process.env.RETURN_CLIENT_URL}`,
//   // });
//   try {
//     // Make request to Stripe API to create customer portal session
//     const session = await stripe.billingPortal.sessions.create({
//       customer: req.body.customerId,
//       return_url: `${process.env.RETURN_CLIENT_URL}`,
//     });
//     // console.log("session url", session.url);
//     console.log("process.env.RETURN_CLIENT_URL", process.env.RETURN_CLIENT_URL);
//     // res.redirect(session.url);
//     res.status(200).json({ url: session.url }); // Return URL of Stripe-hosted checkout page
//   } catch (error) {
//     console.error("Error creating customer portal session:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// app.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),

//   async (request, response) => {
//     try {
//       // const sig = request.headers["stripe-signature"] as string;
//       const sig = request.headers["stripe-signature"];
//       // console.log("webhhok request.body", request.body);
//       let event = request.body;

//       // try {
//       //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//       // } catch (err: any) {
//       //   response.status(400).send(`Webhook Error: ${err.message}`);
//       //   return;
//       // }
//       const session = event.data.object as Stripe.Checkout.Session;

//       // console.log("insdie the hook", event);

//       switch (event?.type) {
//         case "checkout.session.completed": {
//           const subscription = await stripe.subscriptions.retrieve(
//             session.subscription as string
//           );

//           // console.log("session in complete", session);

//           // Check if the order is paid (for example, from a card payment)
//           //
//           // A delayed notification payment will have an `unpaid` status, as
//           // you're still waiting for funds to be transferred from the customer's
//           // account.

//           if (session.payment_status === "paid") {
//             // console.log("session in paid", session);
//             const resend = new Resend(process.env.RESEND_KEY);
//             await handleSubscriptionCreated(session, subscription);

//             const customer = await stripe.customers.retrieve(
//               event.data.object.customer
//             );
//             // console.log("custoemr", customer);
//             resend.emails.send({
//               from: "delivered@resend.dev",
//               // to: session.customer_email as string,
//               to: customer.email as string,
//               subject: "Hello World",
//               html: `
//               <!DOCTYPE html>
//               <html lang="en">
//               <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Welcome to 10K Plus Savings Challange</title>
//               </head>
//               <body>
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//                   <h1>Welcome to 10K Plus Saving Challange !</h1>
//                   <p>Dear ${customer.name},</p>
//                   <p>Thank you for subscribing to our Challange. We're excited to have you on board!</p>
//                   <p>We promise not to spam your inbox and only send you relevant content.</p>
//                   <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
//                   <p>Best regards,<br> 10K Plus Savings Challange Team</p>
//                 </div>
//               </body>
//               </html>
//             `,
//             });
//           }

//           break;
//         }

//         case "customer.subscription.updated":
//           console.log("session subscription", event);
//           const subscription = await stripe.subscriptions.retrieve(
//             event.data.object.id as string
//           );
//           await handleSubscriptionUpdated(event, subscription);
//           // const nodemailer = require("nodemailer");

//           // Create a transporter object using SMTP transport

//           // console.log("transporter", transporter);
//           const customer = await stripe.customers.retrieve(
//             event.data.object.customer
//           );
//           // console.log("custoemr", customer);
//           // Email content
//           const mailOptions = {
//             from: "wealthxk@gmail.com",
//             to: customer.email as string,
//             subject: "Test Email",
//             text: `
//               <!DOCTYPE html>
//               <html lang="en">
//               <head>
//               <meta charset="UTF-8">
//               <meta name="viewport" content="width=device-width, initial-scale=1.0">
//               <title>Thank You for Subscribing!</title>
//             </head>
//             <body>
//               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//                 <h1>Thank You for Subscribing!</h1>
//                 <p>Dear ${customer.name},</p>
//                 <p>Thank you for subscribing to our website. We're thrilled to have you as part of our community!</p>
//                 <p>Stay tuned for exciting updates and exclusive offers.</p>
//                 <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
//                 <p>Best regards,<br> 10K Plus Savings Challange Team</p>
//               </div>
//             </body>
//               </html>
//             `,
//           };
//           console.log("mailoption", mailOptions);
//           // Send email
//           transporter.sendMail(mailOptions, function (error: any, info: any) {
//             if (error) {
//               console.error("Error sending email:", error);
//             } else {
//               console.log("Email sent:", info.response);
//             }
//           });

//           // const resend = new Resend(process.env.RESEND_KEY);
//           // // await handleSubscriptionCreated(session, subscription);

//           //   resend.emails.send({
//           //     from: "delivered@resend.dev",
//           //     // to: session.customer_email as string,
//           //     to: customer.email as string,
//           //     subject: "",
//           //     html: `
//           //   <!DOCTYPE html>
//           //   <html lang="en">
//           //   <head>
//           //   <meta charset="UTF-8">
//           //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           //   <title>Thank You for Subscribing!</title>
//           // </head>
//           // <body>
//           //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           //     <h1>Thank You for Subscribing!</h1>
//           //     <p>Dear ${customer.name},</p>
//           //     <p>Thank you for subscribing to our website. We're thrilled to have you as part of our community!</p>
//           //     <p>Stay tuned for exciting updates and exclusive offers.</p>
//           //     <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
//           //     <p>Best regards,<br> 10K Plus Savings Challange Team</p>
//           //   </div>
//           // </body>
//           //   </html>
//           // `,
//           //   });
//           break;
//         case "invoice.payment_succeeded":
//           // Get the plan ID from the subscription object in the event
//           const planId = event.data.object.lines.data[0].plan.id;
//           console.log("Plan ID:", planId);
//           // Handle the rest of your logic
//           break;

//         case "checkout.session.async_payment_succeeded": {
//           const session = event.data.object;
//           console.log("session in sync passed", session);
//           // Fulfill the purchase...
//           // fulfillOrder(session);

//           break;
//         }

//         case "checkout.session.async_payment_failed": {
//           const session = event.data.object;
//           console.log("session in sync failed", session);
//           // Send an email to the customer asking them to retry their order
//           // emailCustomerAboutFailedPayment(session);

//           break;
//         }
//         default:
//           console.log(`Unhandled event type ${event.type}`);
//         // Return a 200 response to acknowledge receipt of the event
//       }
//       response.json({ received: true });
//     } catch (error: any) {
//       console.error("Webhook Error:", error.message);
//       response.status(400).send(`Webhook Error: ${error.message}`);
//     }
//   }
// );
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
