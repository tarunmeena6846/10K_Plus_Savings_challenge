import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { PostType } from "../InfinitePostScroll";
import { currentPostState } from "../../store/atoms/post";
// import HtmlParser from "react-html-parser";
import Button from "../../Button";
import TextEditor from "../TextEditor";
import { handleComment } from "./postComment";
import { timePassed } from "./Post";
import { userState } from "../../store/atoms/user";

type CommentType = {
  _id: string;
  content: string;
  createdAt: Date;
  likes: number;
  parentId: string | null;
  author: string;
};

const CommentDetails = () => {
  const [comments, setComments] = useState([]);
  const [sortedComments, setSortedComments] = useState<CommentType[]>([]);
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by createdAt
  const { postId } = useParams();
  const { userEmail } = useRecoilValue(userState);
  const [clickedComments, setClickedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPost, setCurrentPost] = useRecoilState(currentPostState);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string>("");
  console.log(currentPost, "currentposts");
  useEffect(() => {
    const sortedComments = [...currentPost.comments].sort(
      (a: CommentType, b: CommentType) => {
        if (sortBy === "createdAt") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortBy === "upvotes") {
          return b.likes - a.likes;
        }
        return 0;
      }
    );
    setSortedComments(sortedComments);
  }, [sortBy, comments, currentPost]);

  const toggleCommentClicked = (commentId: string) => {
    setClickedComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleUpvote = () => {
    console.log("inside upvote");
  };

  // const handleReply = (commentId: string) => {
  //   setEditingCommentId("");
  //   setCommentContent("");
  //   toggleCommentClicked(commentId);
  // };

  const handleEdit = (commentId: string) => {
    setEditingCommentId(commentId);
    toggleCommentClicked(commentId);
  };

  // const handleSave = async (commentId: string) => {
  //   // Implement logic to save edited comment
  //   console.log("commentContent", commentContent);
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_SERVER_URL}/post/${commentId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "content-Type": "application/json",
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //         body: JSON.stringify({ commentContent: commentContent }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network Response is not ok");
  //     }

  //     const data = await response.json();
  //     console.log(data);
  //     toggleCommentClicked(commentId);
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // };

  const handleCancel = (commentId: string) => {
    setEditingCommentId("");
    toggleCommentClicked(commentId);
  };

  const handleDelete = async (commentId: string, postId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/${postId}/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            postId: postId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network Response is not ok");
      }

      const data = await response.json();
      console.log(data);
      toggleCommentClicked(commentId);
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
            <img src="" className="w-15 h-15" />
            <p>{comment.author}</p>
            <p>{timePassed(new Date(comment.createdAt))}</p>
          </div>
          <div className="">
            <p className="p-2 ml-5">{comment.content}</p>
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
                      {/* <Button onClick={() => handleSave(comment._id)}> */}
                      <Button
                        onClick={() =>
                          handleComment(
                            commentContent,
                            postId as string,
                            userEmail,
                            comment._id,
                            "save",
                            comment._id
                          )
                        }
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    // <Button onClick={() => handleReply(comment._id)}>
                    <Button
                      onClick={() =>
                        handleComment(
                          commentContent,
                          postId as string,
                          userEmail,
                          comment._id,
                          "reply",
                          comment._id
                        )
                      }
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
              <button onClick={handleUpvote}>Upvotes: {comment.likes}</button>
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

  return (
    <div>
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
      {renderComments(sortedComments)}
    </div>
  );
};

export default CommentDetails;
