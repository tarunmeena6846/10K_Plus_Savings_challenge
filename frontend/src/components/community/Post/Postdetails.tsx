import React, { useEffect, useState } from "react";
import Button from "../../Button";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import TextEditor from "../TextEditor";
import { userState } from "../../store/atoms/user";
import { useRecoilState, useRecoilValue } from "recoil";
import HTMLReactParser, {
  domToReact,
  htmlToDOM,
  Element,
} from "html-react-parser";

import { currentPostState, postState } from "../../store/atoms/post";
import { handleComment } from "./postComment";

const Postdetails = () => {
  console.log("inside postdetails");
  const { postId } = useParams();
  const { userEmail } = useRecoilValue(userState);
  const [commentContent, setCommentContent] = useState("");
  const [currentPost, setCurrentPost] =
    useRecoilState<PostType>(currentPostState);

  // Fetch comments for the current post from the backend
  console.log("inside  postdetails ");

  useEffect(() => {
    console.log("inside useeffect of setpost");
    fetch(`${import.meta.env.VITE_SERVER_URL}/post/${postId}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response is not ok");
        }
        response.json().then((data) => {
          console.log("data at comment details", data);
          setCurrentPost(data);
        });

        // Set comments fetched from the backend
      })
      .catch((error) => console.error(error));
  }, [postId]);

  return (
    <div className="">
      <div className=" text-3xl font-bold mb-4">
        {currentPost?.title as string}
      </div>
      {currentPost?.content && ( // Check if post?.content exists
        <div className="mb-4">{HTMLReactParser(currentPost.content)}</div> // Render HTMLReactParser
      )}
      <div className="flex flex-col">
        comment as {userEmail}
        <div className="">
          <TextEditor
            height="100px"
            setHtmlContent={setCommentContent}
          ></TextEditor>
        </div>
        <div className="mt-7 md:m-0">
          <Button
            onClick={() =>
              handleComment(commentContent, postId as string, userEmail, null)
            }
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Postdetails;
