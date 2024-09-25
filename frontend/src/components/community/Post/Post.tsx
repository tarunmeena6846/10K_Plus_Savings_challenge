import React, { useEffect, useRef, useState } from "react";
import { PostType } from "../InfinitePostScroll";
import { Card, CardHeader } from "@mui/material";
import { motion } from "framer-motion";
import Button from "../../Button";
import { useNavigate } from "react-router-dom";
import { response } from "express";
import { json } from "stream/consumers";
import { currentPostState } from "../../store/atoms/post";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { error } from "console";
// import HtmlParser from "react-html-parser";

export const timePassed = (date: Date): string => {
  // console.log(date, "date passed");
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return "now";
  } else if (minutes < 60) {
    return `${minutes} min. ago`;
  } else if (hours < 24) {
    return `${hours} hr. ago`;
  } else if (days === 1) {
    return `${days} day ago`;
  } else if (days < 29) {
    return `${days} days ago`;
  } else if (months === 0) {
    return "1 mo. ago";
  } else if (months < 12) {
    return `${months} mo. ago`;
  } else if (years === 1) {
    return `${years} year ago`;
  } else {
    return `${years} years ago`;
  }
};

const Post: React.FC<PostType> = ({
  userProfile,
  postId,
  username,
  postTime,
  imageContent,
  title,
  content,
  type,
  tag,
}) => {
  console.log("tarun postid", tag);
  const navigate = useNavigate();
  // const excerpt = HtmlParser(content.substring(0, 200)); // Adjust the length as needed
  const currentUserEmail = useRecoilValue(userState);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const optionRef = useRef(null);
  const isDarkTheme = document.documentElement.classList.contains("dark");
  const handleSaveBookmark = () => {
    console.log("postid at savebookmark", postId);
    fetch(`${import.meta.env.VITE_SERVER_URL}/post/bookmarkPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response is not ok ");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          alert(data.data);
        } else {
          alert(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleDelete = async () => {
    console.log("type at handle delete", type);
    try {
      let url = `${
        import.meta.env.VITE_SERVER_URL
      }/post/deletepost/${postId}/${type}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Network response is not ok");
      }
      await response.json().then((data) => {
        console.log(data);
        if (data.success) {
          alert("Post delete successfully");
        } else {
          alert("Issue while deleting the post");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    if (type === "mydrafts") {
      console.log("post id at click", postId);
      navigate(`/community/drafts/editpost/${postId}`);
    } else {
      console.log("post id at click", postId);
      navigate(`/community/post/${postId}`);
    }
  };
  const toggleDeleteOption = () => {
    setShowDeleteOption(!showDeleteOption);
  };
  const handleOutsideClick = (event) => {
    if (optionRef.current && !optionRef.current.contains(event.target)) {
      setShowDeleteOption(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  console.log("theme", isDarkTheme);
  return (
    <div className="w-full max-w-3xl rounded-2xl relative text-white ">
      <div className="mb-6">
        <div className="flex  justify-between my-[20px]">
          <span className="flex gap-1 bg-[#bfdbfe] items-center p-1 px-3 rounded-xl text-blue-600">
            <img src="/article.svg"></img>
            <h2 className="text-sm">{tag}</h2>
          </span>
          <span className="text-[#9ca3af] font-normal text-sm p-1">
            {timePassed(postTime)}
          </span>
        </div>

        <h5 className="mb-2 text-2xl font-bold tracking-tight">
          {title.substring(0, 60).concat(title.length > 60 ? "..." : "")}
        </h5>

        <div
          dangerouslySetInnerHTML={{
            __html: content
              .substring(0, 300)
              .concat(content.length > 60 ? "..." : ""),
          }}
          className="text-sm font-normal text-[#9ca3af]"
        />
        <div className="flex justify-between my-3">
          <div className="flex items-center">
            <img
              className="w-8 h-8 rounded-full mr-2"
              src={userProfile}
              alt="Profile"
            />
            <div className="ml-2 flex justify-center items-center text-lg">
              <span className="font-normal text-sm">{username}</span>
            </div>
          </div>
          <div className="flex">
            <button
              className="p-3 text-[#3c82f6] rounded-3xl"
              onClick={handleClick}
            >
              Read more
            </button>
            <img src={"/RightPointedArrow.svg"}></img>
          </div>
        </div>
      </div>
      <hr className="mt-3"></hr>
    </div>
  );
};

export default Post;
