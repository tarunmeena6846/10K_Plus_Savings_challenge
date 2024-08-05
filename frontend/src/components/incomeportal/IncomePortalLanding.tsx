import React, { useEffect, useState } from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "../store/atoms/user";
import { useRecoilState } from "recoil";
// import ManageBillingForm from "../../stripe/ManageBillingForm";
import Login from "../Login";
// import { motion } from "framer-motion";

const IncomePortalLanding = () => {
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log("subs", subscription);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  return (
    <>
      <h1 className="mb-4 font-heading text-7xl">
        Welcome to our income portal.
      </h1>
      {/* {!subscription.isTopTier && <ManageBillingForm></ManageBillingForm>} */}
      {!currentUserState.userEmail && <button>Login</button>}
    </>
  );
};

export default IncomePortalLanding;
