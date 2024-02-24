import { atom } from "recoil";
import { PostType } from "../../community/InfinitePostScroll";

export const postState = atom<PostType[]>({
  key: "postState",
  default: [],
});
