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
const CommunityProfile = () => {
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log("subs", subscription);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  return (
    <div className="flex flex-center flex-col items-center justify-center">
      <UserAvatar />

      <motion.input className="m-10" value={currentUserState.userEmail} />

      <motion.input className="m-10" />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        // onClick={handleContinue}
        className={
          "show-me-btn rounded-xl bg-black px-2 py-1 mt-5 mb-5 w-20 text-white shadow-lg"
        }
      >
        Create
      </motion.button>
    </div>
  );
};

export default CommunityProfile;
