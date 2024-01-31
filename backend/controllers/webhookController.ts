import { Request, Response } from "express";
import { stripe } from "../config/stripe"; // Import the configured Stripe instance
import SubscriptionModel from "../models/subscription"; // Import your Mongoose model for subscriptions

const endpointSecret =
  "whsec_7d74df60f0709530bf2f523cb3118e6ceb1ce864431bf3879b0e591c74d758d1";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  console.log("at stripehook", sig);

  try {
    // Parse the request body as JSON
    const payload = JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
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

async function handleSubscriptionCreated(event: any) {
  const subscriptionData = event.data.object; // Extract subscription data from the event
  // Save subscription data to MongoDB
  try {
    await SubscriptionModel.create({
      planId: subscriptionData.plan.id,
      userId: subscriptionData.customer,
      status: subscriptionData.status,
      // Add more fields as needed
    });
  } catch (error) {
    console.error("Error saving subscription data to MongoDB:", error);
  }
}

// Handler function for subscription updated event
async function handleSubscriptionUpdated(event: any) {
  // Similar to handleSubscriptionCreated, update subscription data in MongoDB based on the event
}
