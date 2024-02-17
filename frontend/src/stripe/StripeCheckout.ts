import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
  }
  return stripePromise;
};

const redirectToStripeCheckout = async (
  plan: string,
  mode: "payment" | "subscription" | undefined,
  currentUserEmail: string
) => {
  try {
    const stripe = await getStripe();
    console.log("currentuseremail", currentUserEmail, mode);
    console.log("tarun stripe", stripe);
    const stripeResult = await stripe?.redirectToCheckout({
      lineItems: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      mode: mode,
      successUrl: `${import.meta.env.VITE_CLIENT_URL}/projecteddashboard`,
      cancelUrl: `${import.meta.env.VITE_CLIENT_URL}/pricing`,
      customerEmail: currentUserEmail,
    });

    console.log("stripeResult", stripeResult);
    if (stripeResult?.error) {
      console.error("Error redirecting to checkout:", stripeResult?.error);
    }
  } catch (error) {
    console.error("stripe error ", error);
  }
};

export default redirectToStripeCheckout;
