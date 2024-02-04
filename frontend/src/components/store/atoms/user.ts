// atoms.js
import { atom } from "recoil";
export const userState = atom({
  key: "userState",
  default: {
    isLoading: true,
    userEmail: "",
    imageUrl: "",
  },
});
export interface SubscriptionData {
  isSubscribed: boolean;
  stripeCustomerId: string;
  stripePlanId: string;
}
export const subscriptionState = atom({
  key: "subscriptionState",
  default: {
    isSubscribed: false,
    stripeCustomerId: "",
    stripePlanId: "",
  },
});
