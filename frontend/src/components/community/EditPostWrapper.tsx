import React, { useEffect, useState } from "react";
import HandleCreatePost from "./CreatePost";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate, useParams } from "react-router-dom";
import { title } from "process";
import { fetchPosts } from "./Post/PostRetrieval";
import { currentPostState } from "../store/atoms/post";

export const EditPostWrapper = () => {
  const { postId } = useParams();
  const [currentPost, setCurrentPost] = useRecoilState(currentPostState);

  useEffect(() => {
    fetchPosts(postId, setCurrentPost);
  }, [postId]);

  console.log("currentpost in editpost", currentPost);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const currentUserState = useRecoilValue(userState);
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/community/drafts");
  };

  const [tag, setTag] = useState("");

  useEffect(() => {
    // Check if currentPost is not null before setting the initial state of input fields
    if (currentPost) {
      console.log(currentPost.tag);
      setPostTitle(currentPost.title);
      setPostContent(currentPost.content);
      setTag(currentPost.tag);
    }
  }, [currentPost]);

  const handleSubmit = (isPublished: Boolean) => {
    console.log("tarun at handlesubmit", isPublished, postId);
    console.log("tag", tag, postTitle, postContent, typeof tag);
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
          console.log("data in editpost", data);
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
