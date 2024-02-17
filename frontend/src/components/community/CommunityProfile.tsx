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
      <div className="flex flex-center flex-col items-center justify-center mt-10">
        <label>Username</label>
        <motion.input className="mb-10" value={currentUserState.userEmail} />
        <label>Name</label>

        <motion.input className="" />
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
    </div>
  );
};

export default CommunityProfile;
