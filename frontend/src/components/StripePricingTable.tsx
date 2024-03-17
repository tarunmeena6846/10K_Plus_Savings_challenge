import { useState } from "react";
import { FcInfo } from "react-icons/fc";
import { motion } from "framer-motion";
// import { fadeIn } from "./Varients";
import { useRecoilState } from "recoil";
import { yearlyPlan } from "./store/atoms/yearlyPlan";
import { useNavigate, useLocation } from "react-router-dom";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "./store/atoms/user";
import ManageBillingForm from "../stripe/ManageBillingForm";
import redirectToStripeCheckout from "../stripe/StripeCheckout";

let stripePromise: Promise<Stripe | null>
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
  }
  return stripePromise;
};

const StripePricingTable = () => {
  const [selectedYearlyPrice, setSelectedYearlyPrice] =
    useRecoilState(yearlyPlan);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const navigate = useNavigate();
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log("current", currentUserState.userEmail);
  async function handleCheckout(plan: string) {

    if (!currentUserState.userEmail) {
      navigate("/register");
    }

    await redirectToStripeCheckout(
      plan,
      "subscription",
      currentUserState.userEmail
    );
  }

  const packages = [
    {
      name: "Non-Challenger Saver",
      yearlyPrice: 199,
      yearlyPlanId: "price_1OeQmBSBiPFrlsnbHtsR1wlx",
      // monthlyPrice: 18,
      // monthlyPlanId: "price_1OeQr8SBiPFrlsnbK6qF3cTT",
      description:
        "A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      name: "10K Savings Challenger",
      yearlyPrice: 499,
      yearlyPlanId: "price_1OeQmjSBiPFrlsnbPRGm9YvH",
      // monthlyPrice: 45,
      // monthlyPlanId: "price_1OeQqRSBiPFrlsnb7DJKbvbr",
      description:
        "A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      green: true,
    },
  ];
  console.log("subscription saate ", subscription);
  return (
    <div className="py-10 md:px-14 p-4 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="md:text-5xl text-7xl mb-2">
          Choose one of the following memberships
        </h2>
      </div>

      {/* <div className="flex justify-center mt-5">
        <button
          className={`mx-5  w-60 items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 text-center`}
          onClick={() => setIsYearly(!isYearly)}
        >
          {isYearly ? "Show Monthly Prices" : "Show Yearly Prices"}
        </button>
      </div> */}
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10 mt-20 md:w-11/12 mx-auto border-2-green">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`border ${
              subscription.isSubscribed &&
              pkg.planId === subscription.stripePlanId
                ? "border-green-500"
                : "border-black"
            } py-10 md:px-6 px-4 rounded-lg shadow-4xl`}
          >
            {/* {pkg.planId} */}
            {/* {index} */}

            <h3 className="text-3xl  font-bold text-center">{pkg.name}</h3>
            <p className="mt-5 text-center text-secondary text-4xl font-bold">
              {/* {isYearly */}${pkg.yearlyPrice}/year
              {/* : `$${pkg.monthlyPrice}/month`} */}
            </p>
            <ul className="mt-4 space-y-2 px-4">
              <li className="flex items-center">
                <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                High-Income Savings Calculator
              </li>
              <li className="flex items-center">
                {pkg.green ? (
                  <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                ) : (
                  <div className="mr-2 w-3 h-3 rounded-full bg-red-500"></div>
                )}
                Savings Bootcamp
              </li>
              <li className="flex items-center">
                {pkg.green ? (
                  <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                ) : (
                  <div className="mr-2 w-3 h-3 rounded-full bg-red-500"></div>
                )}
                High-Income Mastery Savings Community
              </li>
              <li className="flex items-center">
                {pkg.green ? (
                  <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                ) : (
                  <div className="mr-2 w-3 h-3 rounded-full bg-red-500"></div>
                )}
                Savings Partner Portal
              </li>
              <li className="flex items-center">
                {pkg.green ? (
                  <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                ) : (
                  <div className="mr-2 w-3 h-3 rounded-full bg-red-500"></div>
                )}
                High Income Portal
              </li>
            </ul>

            <div className="w-full mx-auto flex justify-center mt-5">
              {subscription.isSubscribed ? (
                <>
                  {pkg.planId === subscription.stripePlanId ? (
                    <motion.button
                      className="mx-5 flex grow items-center justify-center rounded-3xl bg-green-500 text-black shadow-lg h-10 text-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        // Handle action for subscribed user
                      }}
                    >
                      <ManageBillingForm></ManageBillingForm>
                    </motion.button>
                  ) : (
                    <motion.button
                      className="mx-5 flex grow items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 text-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        handleCheckout(pkg.planId);
                      }}
                    ></motion.button>
                  )}
                </>
              ) : (
                <motion.button
                  className="mx-5 flex grow items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 text-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    handleCheckout(pkg.yearlyPlanId);
                  }}
                >
                  Subscribe
                </motion.button>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StripePricingTable;
