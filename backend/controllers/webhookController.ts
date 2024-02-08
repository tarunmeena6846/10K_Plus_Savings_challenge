import { Request, Response } from "express";
import { stripe } from "../config/stripe"; // Import the configured Stripe instance
import SubscriptionModel, { Subscription } from "../models/subscription"; // Import your Mongoose model for subscriptions
import MonthlyDataModel from "../models/monthlyData";
import AdminModel from "../models/admin";
import { Types } from "mongoose";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  console.log("at stripehook", sig);

  try {
    // Parse the request body as JSON
    const payload = JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_ENDPOINT_KEY as string
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log("event", event);
  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Access the status property from the event data object
      const paymentStatus = paymentIntent.status;
      // Handle the payment success status
      break;
    // Add handlers for other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).end(); // Respond to Stripe with a 200 OK status
};

export async function handleSubscriptionCreated(event: any, subscription: any) {
  // const subscriptionData = event.data.object; // Extract subscription data from the event
  // Save subscription data to MongoDB
  // const { ObjectId } = Types;
  console.log("tarun event", event, event.customer_email);
  console.log("tarun subs", subscription);
  // Your subscription creation logic...
  // const newSub: Subscription = await SubscriptionModel.create({
  //   planId: subscription.plan.id,
  //   userId: event.customer,
  //   isSubscribed: true,
  //   // Add more fields as needed
  // });

  // Convert the subscription's _id to an ObjectId
  // const newSubObjectId = new ObjectId(newSub._id);

  // Find the admin document
  const userData = await AdminModel.findOne({
    username: event.customer_email,
  });
  console.log("user data ", userData);
  if (userData) {
    try {
      // Push the ObjectId into the subscriptions array
      userData.stripePlanId = subscription.plan.id;
      userData.stripeUserId = event.customer;
      userData.isSubscribed = true;
      if (
        subscription.plan.id === "price_1OeQqRSBiPFrlsnb7DJKbvbr" ||
        subscription.plan.id === "price_1OeQmjSBiPFrlsnbPRGm9YvH"
      ) {
        userData.isTopTier = true;
      }
      // Save the updated userData document
      await userData.save();
    } catch (error) {
      console.error("Error saving subscription data to MongoDB:", error);
    }
  }
}

export async function handleSubscriptionUpdated(event: any, subscription: any) {
  // const subscriptionData = event.data.object; // Extract subscription data from the event
  // Save subscription data to MongoDB
  // const { ObjectId } = Types;
  console.log("tarun event", event);
  console.log("tarun subs", subscription);
  // Your subscription creation logic...
  // const newSub: Subscription = await SubscriptionModel.create({
  //   planId: subscription.plan.id,
  //   userId: event.customer,
  //   isSubscribed: true,
  //   // Add more fields as needed
  // });

  // Convert the subscription's _id to an ObjectId
  // const newSubObjectId = new ObjectId(newSub._id);

  // Find the admin document
  const userData = await AdminModel.findOne({
    stripeUserId: event.data.object.customer,
  });
  console.log("user data ", userData);
  if (userData) {
    try {
      // Push the ObjectId into the subscriptions array
      userData.stripePlanId = subscription.plan.id;
      userData.stripeUserId = event.data.object.customer;
      userData.isSubscribed = true;
      if (
        subscription.plan.id === "price_1OeQqRSBiPFrlsnb7DJKbvbr" ||
        subscription.plan.id === "price_1OeQmjSBiPFrlsnbPRGm9YvH"
      ) {
        userData.isTopTier = true;
      }
      // Save the updated userData document
      await userData.save();
    } catch (error) {
      console.error("Error saving subscription data to MongoDB:", error);
    }
  }
}
// // Handler function for subscription updated event
// async function handleSubscriptionUpdated(event: any) {
//   // Similar to handleSubscriptionCreated, update subscription data in MongoDB based on the event
// }
