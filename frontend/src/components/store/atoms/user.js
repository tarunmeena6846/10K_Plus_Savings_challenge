// atoms.js
import { atom } from "recoil";

// export type userType = {
//   isLoading: boolean;
//   userEmail: string | null; // You can specify the type for the course field here
// };
export const userState = atom({
  key: "userState",
  default: {
    isLoading: true,
    userEmail: null,
    imageUrl: "",
  },
});
