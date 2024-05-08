import React, { useState } from "react";
import HandleCreatePost from "./CreatePost";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";
import { title } from "process";

export const NewPostWrapper = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const currentUserState = useRecoilValue(userState);
  const navigate = useNavigate();
  const handleCancel = () => {};

  const [tag, setTag] = useState("");
  const handleSubmit = (isPublished: Boolean) => {
    console.log("tarun at handlesubmit", isPublished);
    console.log("tag", tag, postTitle, postContent);
    console.log("postcontent", postContent, currentUserState);
    // headers.append("Username", email);
    // headers.append("Password", password);
    fetch(`${import.meta.env.VITE_SERVER_URL}/post`, {
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
      title={postTitle}
      setPostTitle={setPostTitle}
      content={postContent}
      setPostContent={setPostContent}
      tag={tag}
      setTag={setTag}
    ></HandleCreatePost>
  );
};
