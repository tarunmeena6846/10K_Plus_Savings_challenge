import React, { useEffect, useState } from "react";
import HandleCreatePost from "./CreatePost";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate, useParams } from "react-router-dom";
import { title } from "process";
import { fetchPosts } from "./Post/PostRetrieval";
import { currentPostState } from "../store/atoms/post";

export const EditPostWrapper = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const currentUserState = useRecoilValue(userState);
  const [currentPost, setCurrentPost] = useRecoilState(currentPostState);
  const navigate = useNavigate();
  const handleCancel = () => {};
  const { postId } = useParams();

  const [tag, setTag] = useState("");
  useEffect(() => {
    fetchPosts(postId, setCurrentPost);
  }, [postId]);

  const handleSubmit = (isPublished: Boolean) => {
    console.log("tarun at handlesubmit", isPublished, postId);
    console.log("tag", tag, postTitle, postContent);
    console.log("postcontent", postContent, currentUserState);
    // headers.append("Username", email);
    // headers.append("Password", password);
    fetch(`${import.meta.env.VITE_SERVER_URL}/post/editPost/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title: postTitle,
        content: postContent,
        author: currentUserState.userEmail,
        isPublished: isPublished,
        tag: tag,
        imageUrl: currentUserState.imageUrl,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((data) => {
          console.log(data);
          navigate("/community");
          // Handle successful post creation response
        });
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating post:", error);
      });
  };
  return (
    <HandleCreatePost
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title={currentPost.title}
      setPostTitle={setPostTitle}
      content={currentPost.content}
      setPostContent={setPostContent}
      tag={currentPost.tag}
      setTag={setTag}
    ></HandleCreatePost>
  );
};
