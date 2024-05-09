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
}) => {
  console.log("tarun postid", postId, userProfile, username);
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
    <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl m-4 shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <div className="rounded-t-lg overflow-hidden">
        {/* {imageContent} */}
        {/* <img className="w-full" src={imageContent} alt="" /> */}
        <div className="absolute top-0 right-0 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke={isDarkTheme ? "whtte" : "currentColor"} // Set stroke color based on theme
            onClick={toggleDeleteOption}
            ref={optionRef}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z"
            />
          </svg>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center">
          {/* {userProfile} */}
          <img
            className="w-12 h-12 rounded-full mr-2"
            src={`/${userProfile}`}
            alt="Profile"
          />

          <div className="ml-2 flex justify-center items-center text-lg">
            <span className="text-gray-600 font-normal text-sm p-1">
              Posted by{" "}
            </span>
            <span className="text-gray-600 font-normal text-sm">
              {username}
            </span>
            <span className="text-gray-600 font-normal text-sm p-1">
              {timePassed(postTime)}
            </span>
          </div>
        </div>
        <div>
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title.substring(0, 60).concat(title.length > 60 ? "..." : "")}
            </h5>
          </a>
        </div>
        {/* <p className="mb-3 font-normal text-xl dark:text-gray-400">{excerpt}</p> */}
        {/* 
        <div
          className="mb-3 font-normal text-xl dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        /> */}

        <Button onClick={handleClick}>Read more</Button>
      </div>
      {showDeleteOption && (
        <div className="absolute top-0 right-0 m-2">
          <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
            {/* {type} */}
            {(type === "mybookmarks" ||
              currentUserEmail.userEmail === username) && (
              <button
                className="block w-full text-left py-1 px-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <button
              className="block w-full text-left py-1 px-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={handleSaveBookmark}
            >
              Bookmark
            </button>
            <button className="block w-full text-left py-1 px-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
