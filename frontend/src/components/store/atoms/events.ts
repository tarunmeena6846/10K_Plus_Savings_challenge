import { atom } from "recoil";

export const currentEventsState = atom({
  key: "currentEventsState",
  default: [
    {
      _id: "",
      title: "",
      start: "",
      end: "",
      description: "",
      date: "",
    },
  ],
});
