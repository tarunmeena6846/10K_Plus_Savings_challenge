// atoms/total.js
import { atom } from "recoil";

export const monthlyIncomeState = atom({
  key: "monthlyIncomeState",
  default: 0,
});

export const monthlyExpenseState = atom({
  key: "monthlyExpenseState",
  default: 0,
});

export const yearlyIncomeState = atom({
  key: "yearlyIncomeState",
  default: 0,
});

export const yearlyExpenseState = atom({
  key: "yearlyExpenseState",
  default: 0,
});
