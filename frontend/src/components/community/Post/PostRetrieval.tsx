import React, { useEffect, useState } from "react";
import Button from "../../Button";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import SideBar from "../SideBar";
import { useParams } from "react-router-dom";
import TextEditor from "../TextEditor";
import { actionsState, userState } from "../../store/atoms/user";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import HtmlParser from "react-html-parser";
import parse from "html-react-parser";
import MarkdownPreview from "./MarkdownPreview";

import { currentPostState, postState } from "../../store/atoms/post";
import { handleComment } from "./postComment";

const Postdetails = ({ setCurrentPost }) => {
  console.log("inside postdetails");
  const { postId } = useParams();
  const { userEmail } = useRecoilValue(userState);
  const [commentContent, setCommentContent] = useState("");
  // const [currentPost, setCurrentPost] = useRecoilState(currentPostState);
  const actions = useRecoilValue(actionsState);
  const setActions = useSetRecoilState(actionsState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  // Fetch comments for the current post from the backend
  console.log("inside  postdetails ", postId);
  const fetchPosts = async () => {
    console.log("inside useeffect of setpost", postId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/${postId}`,
        {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      const data = await response.json();
      console.log("currentposts data in post retrieval ", data);
      setCurrentPost(data);
      // Set comments fetched from the backend
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [postId, actions]);
  // console.log(typeof currentPost.content, currentPost.content);
  return (
    <div className="">
      <div className=" text-3xl font-bold mb-4">
        {/* {currentPost?.title as string} */}
      </div>
      {/* {currentPost?.content && ( // Check if post?.content exists
        // <div>
        //   <div
        //     // className="mb-4"
        //     dangerouslySetInnerHTML={{ __html: currentPost.content }}
        //   />
        // </div>
        <MarkdownPreview markdown={currentPost.content} />
      )} */}
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
            onClick={() => {
              setCommentContent("");
              handleComment(
                commentContent,
                postId as string,
                userEmail,
                currentUserState.imageUrl,
                null,
                setActions,
                "comment",
                ""
              );
            }}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Postdetails;
