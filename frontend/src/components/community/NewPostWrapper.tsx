import React, { useState } from "react";
import HandleCreatePost from "./CreatePost";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";
import { title } from "process";
import Loader from "./Loader";

export const NewPostWrapper = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/community");
  };

  const [tag, setTag] = useState("");
  console.log(currentUserState.userName);
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
        author: currentUserState.userName,
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
          setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
          navigate("/community");
          // Handle successful post creation response
        });
      })
      .catch((error) => {
        // Handle error
        setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
        alert("Error creating Post");
        console.error("Error creating post:", error);
      });
  };
  return (
    <div>
      {currentUserState.isLoading && <Loader />}
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
    </div>
  );
};
