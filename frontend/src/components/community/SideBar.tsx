import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
const popularTags = ["Technology", "Travel", "Food", "Fitness"];
const links = ["My Discussions", "My Bookmarks", "My Drafts"];
const sorts = ["Dates", "MostPopular", "Name"];

import { motion } from "framer-motion";
import Button from "../Button";
const SideBar = () => {
  const navigate = useNavigate();
  const handleOnClick = (tag: String) => {
    console.log("onclicked ", tag);
    if (tag === "My Discussions") {
      navigate("/community/mydiscussion");
    }
    if (tag === "My Bookmarks") {
      navigate("/community/bookmarked");
    }
    if (tag === "My Drafts") {
      navigate("/community/drafts");
    }
  };
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            navigate("/newpost");
          }}
        >
          + New Post
        </Button>
      </div>
      <div>
        <h2 className="text-lg font-bold">Quick Links</h2>
        <ul>
          {links.map((tag, index) => (
            <li key={index} className="mb-1">
              <button onClick={() => handleOnClick(tag)}>{tag}</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-bold">Sort by</h2>
        <ul>
          {sorts.map((tag, index) => (
            <li key={index} className="mb-1">
              <a href="#" className="text-grey-700">
                {tag}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
        <ul>
          {popularTags.map((tag, index) => (
            <li key={index} className="mb-1">
              <a href="#" className="text-grey-700">
                {tag}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
