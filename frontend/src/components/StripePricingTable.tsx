import { useState } from "react";
import { FcInfo } from "react-icons/fc";
import { motion } from "framer-motion";
// import { fadeIn } from "./Varients";
import { useRecoilState } from "recoil";
import { yearlyPlan } from "./store/atoms/yearlyPlan";
import { useNavigate, useLocation } from "react-router-dom";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { userState } from "./store/atoms/user";

let stripePromise: Promise<Stripe | null>;
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
  //   const location = useLocation();

  async function handleCheckout(plan: number) {
    // console.log("yearlyprice", selectedYearlyPrice.price);
    try {
      const stripe = await getStripe();
      console.log("tarun stripe", stripe);
      const stripeResult = await stripe?.redirectToCheckout({
        lineItems: [
          {
            price:
              plan === 199
                ? "price_1OeQmBSBiPFrlsnbHtsR1wlx"
                : "price_1OeQmjSBiPFrlsnbPRGm9YvH",
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `${import.meta.env.VITE_CLIENT_URL}/projecteddashboard`,
        cancelUrl: `${import.meta.env.VITE_CLIENT_URL}/pricing`,
        customerEmail: currentUserState.userEmail,
      });

      console.log("stripeResult", stripeResult);
      if (stripeResult?.error) {
        console.error("Error redirecting to checkout:", stripeResult?.error);
      }
    } catch (error) {
      console.error("stripe error ", error);
    }
  }

  const packages = [
    {
      name: "Start",
      yearlyPrice: 199,
      description:
        "A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      name: "Plus",
      yearlyPrice: 499,
      description:
        "A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      green: true,
    },
  ];

  return (
    <div className="py-10 md:px-14 p-4 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="md:text-7xl text-7xl mb-2">Here are all our plans</h2>
      </div>
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10 mt-20 md:w-11/12 mx-auto">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="border border-black py-10 md:px-6 px-4 rounded-lg shadow-4xl"
          >
            <h3 className="text-3xl  font-bold text-center">{pkg.name}</h3>
            <p className="mt-5 text-center text-secondary text-4xl font-bold">
              {`$${pkg.yearlyPrice}`}
              <span className="text-base text-tertiary font-medium">
                /{"year"}
              </span>
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
              <motion.button
                className="mx-5 flex grow items-center justify-center rounded-3xl bg-black text-white shadow-lg h-10 text-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  //   setSelectedYearlyPrice({ price: pkg.yearlyPrice });
                  handleCheckout(pkg.yearlyPrice);
                }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StripePricingTable;
