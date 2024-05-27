import React, { useEffect, useState } from "react";
import Button from "../../Button";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import SideBar from "../SideBar";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../TextEditor";
import { actionsState, userState } from "../../store/atoms/user";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import parse from "html-react-parser";
import MarkdownPreview from "./MarkdownPreview";

import { currentPostState, postState } from "../../store/atoms/post";
import { handleComment } from "./postComment";
import { timePassed } from "./Post";
export const fetchPosts = async (postId, setCurrentPost) => {
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
    // userImage = data.userImage.substring(2);
    // console.log("iamges", data.userImage, userImage);
    // Set comments fetched from the backend
  } catch (error) {
    console.error(error);
  }
};
const Postdetails = () => {
  console.log("inside postdetails");
  const { postId } = useParams();
  const navigate = useNavigate();
  const { userEmail } = useRecoilValue(userState);
  const [commentContent, setCommentContent] = useState("");
  const [currentPost, setCurrentPost] = useRecoilState(currentPostState);
  const actions = useRecoilValue(actionsState);
  const setActions = useSetRecoilState(actionsState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [text, setText] = useState(currentPost.content);
  // Fetch comments for the current post from the backend
  console.log("inside  postdetails ", postId);

  const approveOrDeclinePost = async (type: string) => {
    console.log(postId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/approvePost/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            type: type,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      const data = await response.json();
      console.log("data at post approve", data);
      alert("Post modified successfully");
      // setCurrentPost(data.data);
      // userImage = data.userImage.substring(2);
      // console.log("iamges", data.userImage, userImage);
      // Set comments fetched from the backend
    } catch (error) {
      console.error(error);
    }
  };
  // const fetchPosts = async () => {
  //   console.log("inside useeffect of setpost", postId);
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_SERVER_URL}/post/${postId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "content-Type": "application/json",
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response is not ok");
  //     }
  //     const data = await response.json();
  //     console.log("currentposts data in post retrieval ", data);
  //     setCurrentPost(data);
  //     userImage = data.userImage.substring(2);
  //     console.log("iamges", data.userImage, userImage);
  //     // Set comments fetched from the backend
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  useEffect(() => {
    fetchPosts(postId, setCurrentPost);
  }, [postId, actions]);

  if (currentPost.isPublished === "false") {
    console.log("post id at click", postId);
    navigate(`/community/post/${postId}`);
  }
  // console.log(typeof currentPost.content, currentPost.content);
  return (
    <div className="">
      <h1
        className="text-3xl font-bold mb-4"
        style={{ overflowWrap: "anywhere" }}
      >
        {currentPost?.title}
      </h1>
      {/* <article> */}

      {/* <hr /> */}

      <div className="flex gap-2 items-end">
        <img
          className="w-12 h-12 rounded-full mr-2"
          // src="/user12.svg"
          src={`/${currentPost.userImage}`}
          alt="Profile"
        ></img>
        <p>{currentPost?.author}</p>
        <p>{timePassed(new Date(currentPost?.createdAt))}</p>
      </div>
      {/* {text} */}
      {/* <div dangerouslySetInnerHTML={{ __html: text }} /> */}
      <MarkdownPreview markdown={currentPost.content} />
      <hr />
      {currentUserState.isAdmin && (
        <div className="flex gap-3 mt-3">
          {currentPost.status === "approvalPending" ? (
            <div className="flex gap-3 mt-3">
              <button
                className="text-green-600"
                onClick={() => approveOrDeclinePost("approved")}
              >
                Approve
              </button>

              <button
                className="text-red-600"
                onClick={() => approveOrDeclinePost("rejected")}
              >
                Delete Post
              </button>
            </div>
          ) : (
            <button
              className="text-red-600"
              onClick={() => approveOrDeclinePost("rejected")}
            >
              Delete Post
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col mt-3">
        comment as {userEmail}
        <div>
          <TextEditor
            height="100px"
            setHtmlContent={setCommentContent}
            content={""}
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
