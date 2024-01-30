// atoms.js
import { atom } from "recoil";
export const yearlyPlan = atom({
  key: "yearlyPlan",
  default: { price: 0 },
});
