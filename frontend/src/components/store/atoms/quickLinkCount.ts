import { atom } from "recoil";

const countAtom = atom({
  key: "countAtom",
  default: {
    myDiscussionCount: 0,
    bookmarkCount: 0,
    draftCount: 0,
  },
});

export default countAtom;
