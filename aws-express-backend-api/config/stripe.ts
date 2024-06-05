import Stripe from "stripe";

// Initialize the Stripe client with your API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
