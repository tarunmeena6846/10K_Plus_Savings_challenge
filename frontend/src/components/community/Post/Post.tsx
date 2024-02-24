import React from "react";
import { PostType } from "../InfinitePostScroll";
import { Card, CardHeader } from "@mui/material";
import { motion } from "framer-motion";
import Button from "../../Button";
import { useNavigate } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

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
}) => {
  console.log("tarun postid", postId);
  const navigate = useNavigate();
  const excerpt = ReactHtmlParser(content.substring(0, 200)); // Adjust the length as needed

  const handleClick = () => {
    console.log("post id at click", postId);
    navigate(`/community/post/${postId}`);
  };
  return (
    <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl m-4 shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <div className="rounded-t-lg overflow-hidden">
          <img className="w-full" src={imageContent} alt="" />
        </div>
      </a>
      <div className="p-5">
        <div className="flex items-center">
          <img className="w-12 h-12 rounded-full mr-2" src="./profile.jpg" />
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
              {title}
            </h5>
          </a>
        </div>
        <p className="mb-3 font-normal text-xl dark:text-gray-400">{excerpt}</p>
        <Button onClick={handleClick}>Read more</Button>
      </div>
    </div>
  );
};

export default Post;
