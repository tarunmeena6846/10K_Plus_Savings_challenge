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

  const handleUpvote = debounce(async (comment: CommentType) => {
    setIsProcessing((prev) => ({ ...prev, [comment._id]: true }));
    const alreadyUpvoted = comment.likes.users?.includes(userEmail);
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
          style={{
            marginLeft: `${depth * 20}px`,
            marginBottom: "10px",
            borderLeft: depth > 0 ? "1px solid black" : "",
            borderTop: depth > 0 ? "1px solid black" : "",
          }}
          className="flex flex-col p-2 rounded-2xl"
        >
          <div className="flex flex-row gap-2">
            <img
              className="w-12 h-12 rounded-full mr-2"
              src={comment.imageLink}
              // src="target.png"
              alt="Profile"
            />
            <p>{comment.author}</p>
            <p>{timePassed(new Date(comment.createdAt))}</p>
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
                Upvotes: {comment.likes.likes}
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
  console.log("currentposts sortedCOmments", sortedComments);
  return (
    <div>
      <Postdetails></Postdetails>
      <br />
      <hr className="" />
      <br />
      <h2>Comments</h2>
      <div>
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Date</option>
          <option value="upvotes">Most Popular</option>
        </select>
      </div>
      {sortedComments.length > 0 ? (
        renderComments(sortedComments)
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
};

export default CommentDetails;
