import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
type CommentType = {
  _id: string;
  content: string;
  createdAt: string;
  upvotes: number;
  parentId: string | null;
};

const comments = [
  {
    _id: "1",
    content: "This is the first comment",
    createdAt: "2024-02-16T10:30:00Z",
    upvotes: 5,
    parentId: null, // Root comment
  },
  {
    _id: "2",
    content: "This is the second comment",
    createdAt: "2024-02-16T11:00:00Z",
    upvotes: 10,
    parentId: null, // Root comment
  },
  {
    _id: "3",
    content: "This is a reply to the second comment",
    createdAt: "2024-02-16T11:15:00Z",
    upvotes: 2,
    parentId: "1", // Reply to second comment
  },
];
const CommentDetails = () => {
  // const [comments, setComments] = useState([]);
  const [sortedComments, setSortedComments] = useState<CommentType[]>([]);
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by createdAt
  const { postId } = useParams();

  // Fetch comments for the current post from the backend
  useEffect(() => {
    fetch(`/api/post/${postId}/comments`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response is not ok");
        }
        response.json().then((data) => {
          // setComments(data);
        });

        // Set comments fetched from the backend
      })
      .catch((error) => console.error(error));
  }, [postId]);
  // Sort comments based on the selected sorting option
  // Sort comments based on the selected sorting option
  useEffect(() => {
    const sortedComments = [...comments].sort((a, b) => {
      if (sortBy === "createdAt") {
        // Convert dates to milliseconds and compare
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "upvotes") {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });
    setSortedComments(sortedComments);
  }, [sortBy, comments]);

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
          className="flex flex-row"
        >
          <div>
            <img src="./save1.jpg" className="w-15 h-15"></img>
          </div>
          <div>
            <p>{comment.content}</p>
            <p>Created at: {new Date(comment.createdAt).toLocaleString()}</p>
            <p>Upvotes: {comment.upvotes}</p>
            {/* Render child comments recursively */}
            {renderComments(commentsArray, comment._id, depth + 1)}
          </div>
        </div>
      ));
  };

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
