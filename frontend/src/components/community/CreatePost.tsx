import React from "react";
import { motion, useInView } from "framer-motion";
import TextEditor from "./TextEditor";

const HandleCreatePost = () => {
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
          />
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-message" className="block font-semibold">
            Discussion Message
          </label>
          <TextEditor></TextEditor>
        </div>
        <div className="mt-4 mb-4">
          <label htmlFor="discussion-title" className="block font-semibold">
            Tags
          </label>
          <motion.input
            id="discussion-tags"
            className="w-full mt-1 mb-1 p-2 border border-gray-300 rounded"
          />
          <motion.button>Show tags</motion.button>
        </div>
        <div>
          <motion.button className="rounded-3xl bg-black text-white p-3 mr-3">
            Cancel
          </motion.button>
          <motion.button className="rounded-3xl bg-black text-white p-3">
            Post Discussion
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HandleCreatePost;
