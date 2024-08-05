import React from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "../store/atoms/user";
import { useRecoilState } from "recoil";
// import ManageBillingForm from "../../stripe/ManageBillingForm";
import { motion } from "framer-motion";
import UserAvatar from "../UserAvatar";
import TriggerSearch from "./TriggerSearch";

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log("subs", subscription);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  console.log("tarun", currentUserState);

  return (
    <div className="flex flex-center flex-col items-center justify-center mt-10 p-4">
      <h2 className="text-4xl">{title}</h2>
      <p>{description}</p>
      <TriggerSearch />
    </div>
  );
};

export default Header;
