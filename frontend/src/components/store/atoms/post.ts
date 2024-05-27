import { atom } from "recoil";
import { PostType } from "../../community/InfinitePostScroll";
import { CommentType } from "../../community/Post/RenderComments";

export const postState = atom<PostType[]>({
  key: "postState",
  default: [],
});

export const currentPostState = atom({
  key: "currentPostState",
  default: {
    id: "",
    createdAt: new Date(),
    title: "",
    content: "",
    author: "",
    comments: [] as CommentType[],
    userImage: "",
    isPublished: "",
    status: "",
  },
});
