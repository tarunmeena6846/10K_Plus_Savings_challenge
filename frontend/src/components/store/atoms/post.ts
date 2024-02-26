import { atom } from "recoil";
import { PostType } from "../../community/InfinitePostScroll";

export const postState = atom<PostType[]>({
  key: "postState",
  default: [],
});

export const currentPostState = atom({
  key: "currentPostState",
  default: {
    id: "",
    postTime: new Date(),
    imageContent: "",
    title: "",
    content: "",
    comments: [],
  },
});
