import { atom } from "recoil";

export const dateState = atom({
  key: "dateState",
  default: {
    year : new Date().getFullYear(),
    // month: new Date().toLocaleString("en-US", { month: "long" }),
    month: new Date().toLocaleString("en-US", { month: "long" }),
  },
});
