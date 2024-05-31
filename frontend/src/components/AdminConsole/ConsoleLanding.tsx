import React from "react";
import SideBar from "../community/SideBar";
import InfinitePostScroll from "../community/InfinitePostScroll";
import Calender from "./Calender";

const LandingConsole = () => {
  return (
    <div>
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-3/4">
            <InfinitePostScroll
              type="approvalReqPosts"
              tag={""}
            ></InfinitePostScroll>
            {/* <CommentDetails></CommentDetails> */}
          </div>
          <div className="md:w-1/4 p-4 m-4">
            {/* <CalenderInvite/> */}
            <Calender />
            {/* <motion className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Create Post
          </button>
          <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
          <ul>
            {popularTags.map((tag, index) => (
              <li key={index} className="mb-1">
                <a href="#" className="text-blue-600 hover:underline">
                  {tag}
                </a>
              </li>
            ))}
          </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingConsole;
