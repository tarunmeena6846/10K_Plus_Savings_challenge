import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { PostType } from "../InfinitePostScroll";
import { currentPostState } from "../../store/atoms/post";
// import HtmlParser from "react-html-parser";
import Button from "../../Button";
import TextEditor from "../TextEditor";
import { handleComment } from "./postComment";
import { timePassed } from "./Post";
import { actionsState, userState } from "../../store/atoms/user";
import Postdetails from "./PostRetrieval";
import { error } from "console";
import MarkdownPreview from "./MarkdownPreview";
import Loader from "../Loader";

export type CommentType = {
  _id: string;
  content: string;
  createdAt: Date;
  likes: { likes: number; users: string[] };
  parentId: string | null;
  author: string;
  imageLink: string;
};

const CommentDetails = () => {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [sortedComments, setSortedComments] = useState<CommentType[]>([]);
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by createdAt
  const { postId } = useParams();
  const { userEmail } = useRecoilValue(userState);
  const [clickedComments, setClickedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const setActions = useSetRecoilState(actionsState);
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>(
    {}
  );

  const currentPost = useRecoilValue(currentPostState);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string>("");
  console.log(currentPost.comments, "currentposts");

  // Debounce function to prevent multiple rapid requests
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  useEffect(() => {
    if (currentPost.comments.length === 0) {
      console.log("currentposts length 0");
      return;
    }
    // setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
    const sortedComments = [...currentPost.comments].sort(
      (a: CommentType, b: CommentType) => {
        if (sortBy === "createdAt") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortBy === "upvotes") {
          return b.likes.likes - a.likes.likes;
        }
        return 0;
      }
    );
    setSortedComments(sortedComments);
    // setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
  }, [sortBy, currentPost]);

  const toggleCommentClicked = (commentId: string) => {
    setClickedComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };
  //TODO make this work currently upvote url is not getting trigered from the frontend changed the atom also
  // const handleUpvote = async (comment: any) => {
  //   console.log("inside upvote", comment._id);

  //   fetch(`${import.meta.env.VITE_SERVER_URL}/post/${comment._id}/upvote`, {
  //     method: "POST",
  //     headers: {
  //       "content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("token"),
  //     },
  //     body: JSON.stringify({
  //       username: userEmail,
  //     }),
  //   })
  //     .then((resp) => {
  //       if (!resp.ok) {
  //         throw new Error("Network response is not ok");
  //       }
  //       resp.json().then((data) => {
  //         console.log("at upvote comment", data);

  //         // if (data.success === false) {
  //         //   alert(data.message);
  //         // }
  //         setActions((prev) => prev + 1); // Increment actionsState
  //       });
  //     })
  //     .catch((error) => {
  //       // Handle error
  //       console.error("Error creating post:", error);
  //     });
  // };
  let alreadyUpvoted = false;
  const handleUpvote = debounce(async (comment: CommentType) => {
    setIsProcessing((prev) => ({ ...prev, [comment._id]: true }));
    alreadyUpvoted = comment.likes.users?.includes(userEmail);
    console.log("inside upvote", alreadyUpvoted, comment);

    // Update the local state first
    const updatedComments = sortedComments.map((c) => {
      if (c._id === comment._id) {
        return {
          ...c,
          likes: {
            ...c.likes,
            likes: alreadyUpvoted ? c.likes.likes - 1 : c.likes.likes + 1, // Increment or decrement likes count locally
            username: alreadyUpvoted
              ? c.likes.users.filter((u) => u !== userEmail)
              : [...c.likes.users, userEmail], // Add or remove the user from the list of upvoters
          },
        };
      }
      return c;
    });
    setSortedComments(updatedComments);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/${comment._id}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            username: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      const data = await response.json();
      console.log("at upvote comment", data);
      setActions((prev) => prev + 1); // Increment actionsState
    } catch (error) {
      // Revert the local state if an error occurs
      const revertedComments = sortedComments.map((c) => {
        if (c._id === comment._id) {
          return {
            ...c,
            likes: {
              ...c.likes,
              likes: alreadyUpvoted ? c.likes.likes + 1 : c.likes.likes - 1, // Increment or decrement likes count locally
              username: alreadyUpvoted
                ? [...c.likes.users, userEmail]
                : c.likes.users.filter((u) => u !== userEmail), // Add or remove the user from the list of upvoters
            },
          };
        }
        return c;
      });
      setSortedComments(revertedComments);
      console.error("Error creating post:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setIsProcessing((prev) => ({ ...prev, [comment._id]: false }));
    }
  }, 300);

  const handleEdit = (commentId: string) => {
    setEditingCommentId(commentId);
    toggleCommentClicked(commentId);
  };

  const handleCancel = (commentId: string) => {
    setEditingCommentId("");
    toggleCommentClicked(commentId);
  };

  const handleDelete = async (commentId: string, postId: string) => {
    console.log("at delete comment", commentId, postId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/${postId}/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network Response is not ok");
      }

      const data = await response.json();
      console.log(data);
      alert(data.message);
      setActions((prev) => prev + 1); // Increment actionsState

      // toggleCommentClicked(commentId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const renderComments = (
    commentsArray: CommentType[],
    parentId: string | null = null,
    depth: number = 0
  ) => {
    if (commentsArray.length === 0) {
      console.log("currentposts length 0");
      return <div>No comments available.</div>;
    }
    console.log("currentposts at renderCOmments", commentsArray);
    return commentsArray
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div
          key={comment._id}
          style={
            {
              // marginLeft: `${depth * 20}px`,
              // marginBottom: "10px",
              // borderLeft: depth > 0 ? "1px solid black" : "",
              // borderTop: depth > 0 ? "1px solid black" : "",
            }
          }
          className="flex flex-col p-2 rounded-2xl "
        >
          <div className="flex flex-row gap-2">
            {/* user image code */}
            <img
              className="w-8 h-8 rounded-full mr-2"
              src={comment.imageLink}
              // src="target.png"
              alt="Profile"
            />
            <p>{comment.author}</p>
            <p className="text-gray-400">
              {timePassed(new Date(comment.createdAt))}
            </p>
          </div>
          <div className="">
            <MarkdownPreview markdown={comment.content} />
            {clickedComments[comment._id] && (
              <div>
                <TextEditor
                  height="80px"
                  setHtmlContent={setCommentContent}
                  content={
                    editingCommentId === comment._id ? comment.content : ""
                  }
                />
                <div className="flex flex-row p-2 gap-2">
                  {editingCommentId === comment._id ? (
                    <>
                      <Button
                        onClick={() => {
                          handleComment(
                            commentContent,
                            postId as string,
                            userEmail,
                            currentUserState.imageUrl,
                            comment._id,
                            setActions,
                            "save",
                            comment._id
                          );
                          handleCancel(comment._id);
                        }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    // <Button onClick={() => handleReply(comment._id)}>
                    <Button
                      onClick={() => {
                        handleComment(
                          commentContent,
                          postId as string,
                          userEmail,
                          currentUserState.imageUrl,
                          comment._id,
                          setActions,
                          "reply",
                          comment._id
                        );
                        handleCancel(comment._id);
                      }}
                    >
                      Reply
                    </Button>
                  )}
                  <Button onClick={() => handleCancel(comment._id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <div className="flex flex-row p-2 ml-5 gap-2">
              <button onClick={() => handleUpvote(comment)}>
                {alreadyUpvoted.toString()}
                <button
                  type="button"
                  className={`text-blue-700 border border-blue-700 hover:bg-blue-700 ${
                    alreadyUpvoted ? "bg-blue-700" : ""
                  }hover:text-white  font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center w-8 h-8`}
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
                  </svg>
                  <span className="sr-only">Icon description</span>
                </button>
                : {comment.likes.likes}
              </button>
              {!clickedComments[comment._id] && (
                <button onClick={() => toggleCommentClicked(comment._id)}>
                  Reply
                </button>
              )}
              {comment.author === userEmail && (
                <div className=" flex flex-row gap-2">
                  <button onClick={() => handleDelete(comment._id, postId)}>
                    Delete
                  </button>
                  {editingCommentId != comment._id && (
                    <div>
                      <button onClick={() => handleEdit(comment._id)}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {renderComments(commentsArray, comment._id, depth + 1)}
            {depth === 0 && <hr className="" />}
          </div>
        </div>
      ));
  };
  console.log("currentposts sortedCOmments", currentUserState.isLoading);
  return (
    <div className="text-white">
      {/* {currentUserState.isLoading ? (
        <Loader />
      ) : (
        <> */}
      <Postdetails commentCount={sortedComments.length}></Postdetails>

      <div className="px-1 lg:px-10">
        {/* <h2>Comments</h2> */}
        {/* <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Date</option>
          <option value="upvotes">Most Popular</option>
        </select> */}

        {sortedComments.length > 0 ? (
          renderComments(sortedComments)
        ) : (
          <p>No comments yet</p>
        )}
        {/* </>
      )} */}
      </div>
    </div>
  );
};

export default CommentDetails;
