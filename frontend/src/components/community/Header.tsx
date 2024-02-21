import React, { useEffect, useState } from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "../store/atoms/user";
import { useRecoilState } from "recoil";
import ManageBillingForm from "../../stripe/ManageBillingForm";
import { motion } from "framer-motion";
import UserAvatar from "../UserAvatar";
import TriggerSearch from "./TriggerSearch";
const Header = () => {
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log("subs", subscription);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  console.log("tarun", currentUserState);

  return (
    <div className="bg-green-600 flex flex-center flex-col items-center justify-center">
      <h2 className="text-4xl">10K Savings Challenge Community</h2>
      <p>
        Together, let's turn small steps into significant savings and celebrate
        the power of collective progress in the 10K Savings Challenge Community.
      </p>
      <TriggerSearch></TriggerSearch>
    </div>
  );
};

export default Header;
