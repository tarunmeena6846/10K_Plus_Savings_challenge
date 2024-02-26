import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { PostType } from "../InfinitePostScroll";
import { currentPostState } from "../../store/atoms/post";
import HTMLReactParser from "html-react-parser";
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
  console.log("userEmail", userEmail);
  const [clickedComments, setClickedComments] = useState<{
    [key: string]: boolean;
  }>({}); // Track clicked state for each comment

  const [currentPost, setCurrentPost] = useRecoilState(currentPostState);
  const [commentContent, setCommentContent] = useState("");
  const toggleCommentClicked = (commentId: string) => {
    console.log("inside toggle", commentId);
    setClickedComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleDelete = async (commentId: String, postId: String) => {
    try {
      console.log("handle delete", commentId);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/post/${postId}/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            // content: commentContent,
            // authorId: userEmail,
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
  console.log("currentpost", currentPost.comments);
  // Sort comments based on the selected sorting option
  // Sort comments based on the selected sorting option
  useEffect(() => {
    const sortedComments = [...currentPost.comments].sort(
      (a: CommentType, b: CommentType) => {
        // console.log(a, b);
        if (sortBy === "createdAt") {
          // Convert dates to milliseconds and compare
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
          style={{ marginLeft: `${depth * 20}px`, marginBottom: "10px" }}
          className="flex flex-col"
        >
          <div
            className="flex flex-row"
            onClick={() => toggleCommentClicked(comment._id)}
          >
            <img src="./save1.jpg" className="w-15 h-15"></img>
            <p>{comment.author}</p>
            <p>Post at: {timePassed(new Date(comment.createdAt))}</p>
            <p>Upvotes: {comment.likes}</p>
          </div>
          <div className="">
            <p>{HTMLReactParser(comment.content)}</p>
            {clickedComments[comment._id] && (
              <div>
                <TextEditor height="80px" setHtmlContent={setCommentContent} />
                <Button
                  onClick={() => {
                    handleComment(
                      commentContent,
                      postId as string,
                      userEmail,
                      comment._id
                    ).then((data) => {
                      toggleCommentClicked(data.parentId);
                    });
                  }}
                >
                  Reply
                </Button>
                {comment.author === userEmail && (
                  <Button
                    onClick={() => {
                      handleDelete(comment._id, postId as string);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
            {/* Render child comments recursively */}
            {renderComments(commentsArray, comment._id, depth + 1)}
          </div>
        </div>
      ));
  };
  console.log("sortedcomments", sortedComments);
  return (
    <div>
      <h2>Comments</h2>
      <div>
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Date</option>
          <option value="upvotes">Most Popular</option>
        </select>
      </div>
      {/* Render sorted comments */}
      {renderComments(sortedComments)}
    </div>
  );
};

export default CommentDetails;
