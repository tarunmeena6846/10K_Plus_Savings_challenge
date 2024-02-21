import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
const popularTags = ["Technology", "Travel", "Food", "Fitness"];
import { motion } from "framer-motion";
const SideBar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <motion.button
        className="bg-black text-white rounded-3xl p-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          navigate("/newpost");
        }}
      >
        + New Post
      </motion.button>
      <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
      <ul>
        {popularTags.map((tag, index) => (
          <li key={index} className="mb-1">
            <a href="#" className="text-blue-600 hover:underline">
              {tag}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
