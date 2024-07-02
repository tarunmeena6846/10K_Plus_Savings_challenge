import { atom } from "recoil";

const loadState = (key, defaultValue) => {
  const savedState = localStorage.getItem(key);
  return savedState ? JSON.parse(savedState) : defaultValue;
};

export const currentEventsState = atom({
  key: "currentEventsState",
  default: loadState("currentEventsState", [
    {
      _id: "",
      title: "",
      start: "",
      end: "",
      description: "",
      date: "",
    },
  ]),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem("currentEventsState", JSON.stringify(newValue));
      });
    },
  ],
});
