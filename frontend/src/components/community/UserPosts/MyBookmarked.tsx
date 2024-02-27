import React from "react";
import Header from "../Header";
import SideBar from "../SideBar";
const MyBookmarked = () => {
  return (
    <div>
      <Header title="My Bookmarks" description="" />
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-3/4">
            {/* <InfinitePostScroll></InfinitePostScroll> */}
          </div>
          <div className="md:w-1/4 p-4 m-4">
            <SideBar></SideBar>
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

export default MyBookmarked;
