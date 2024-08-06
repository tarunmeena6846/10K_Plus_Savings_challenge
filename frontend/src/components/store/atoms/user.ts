// atoms.js
import { atom } from "recoil";
export const userState = atom({
  key: "userState",
  default: {
    isLoading: true,
    userEmail: "",
    imageUrl: "",
    isVerified: false,
    myWhy: "",
    isAdmin: false,
  },
});
export interface SubscriptionData {
  isSubscribed: boolean;
  stripeCustomerId: string;
  stripePlanId: string;
  isTopTier: boolean;
}
export const subscriptionState = atom({
  key: "subscriptionState",
  default: {
    isSubscribed: false,
    stripeCustomerId: "",
    stripePlanId: "",
    isTopTier: false,
  },
});

export const videoModalState = atom({
  key: "videoModalState",
  default: {
    dashboardVideoModal: true,
  },
});
// actionsState.js
export const actionsState = atom({
  key: "actionsState",
  default: 0, // Initial value doesn't matter, it will be updated when actions occur
});
