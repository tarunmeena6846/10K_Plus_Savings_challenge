import React from "react";
import Button from "../../Button";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import TextEditor from "../TextEditor";
import { userState } from "../../store/atoms/user";
import { useRecoilValue } from "recoil";
import HTMLReactParser, {
  domToReact,
  htmlToDOM,
  Element,
} from "html-react-parser";

import { postState } from "../../store/atoms/post";

const Postdetails = () => {
  const { postId } = useParams();
  const { userEmail } = useRecoilValue(userState);
  const handleComment = () => {};
  const posts = useRecoilValue(postState);

  const post = posts.find((post: PostType) => post.postId === postId);
  console.log("post content", post?.content, postId);

  return (
    <div className="">
      <div className=" text-3xl font-bold mb-4" >{post?.title as string}</div>

      <div className="mb-4">{HTMLReactParser(post?.content as string)}</div>
      <div className="flex flex-col">
        comment as {userEmail}
        <div className="">
          <TextEditor height="100px"></TextEditor>
        </div>
        <div className="mt-7 md:m-0">
          <Button onClick={handleComment}>Comment</Button>
        </div>
      </div>
    </div>
  );
};
export default Postdetails;
