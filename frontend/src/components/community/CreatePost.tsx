import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import TextEditor from "./TextEditor";
import Button from "../Button";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";
import TextFieldWithDropdown from "./InputField";
const HandleCreatePost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const currentUserState = useRecoilValue(userState);
  const [tag, setTag] = useState("");
  const navigate = useNavigate();
  const handleCancel = () => {};
  const handleShowtags = () => {};
  const handleCreatePost = (isPublished: Boolean) => {
    console.log("tag", tag);
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
    <div className="flex flex-col h-full items-center justify-center m-20">
      <div className="w-full max-w-3xl p-4">
        <div>
          <h2 className="text-3xl">New Discussion</h2>
        </div>
        <div className="mt-4">
          <label htmlFor="discussion-title" className="block font-semibold">
            Discussion Title
          </label>
          <motion.input
            id="discussion-title"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-message" className="block font-semibold">
            Discussion Message
          </label>
          <TextEditor
            height="400px"
            setHtmlContent={setPostContent}
          ></TextEditor>
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-title" className="block font-semibold">
            Tags
          </label>
          {/* <motion.input
            id="discussion-tags"
            className="w-full mt-1 mb-1 p-2 border border-gray-300 rounded"
          /> */}
          <TextFieldWithDropdown setTags={setTag} />
          <motion.button>Show tags</motion.button>
        </div>
        <div>
          <Button onClick={() => handleCreatePost(false)}>Save as Draft</Button>
          <Button onClick={() => handleCreatePost(true)}>
            Post Discussion
          </Button>
          <Button onClick={() => handleCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default HandleCreatePost;
