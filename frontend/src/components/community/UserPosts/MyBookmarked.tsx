import React, { useState } from "react";
import Header from "../Header";
import SideBar, { tagDataType } from "../SideBar";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { postState } from "../../store/atoms/post";
import fetchPosts from "../fetchPosts";
import { error } from "console";
import useFetchPosts from "../fetchPosts";
import { selectedTagIdState } from "../../store/atoms/selectedTag";
const MyBookmarked = () => {
  const userEmail = useRecoilValue(userState);
  const [selectedTagId, setSelectedTagId] = useRecoilState(selectedTagIdState);
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  // Render popular tags

  // Render popular tags
  const handleSelectTag = (tagId: string) => {
    setSelectedTagId(tagId);
  };

  useFetchPosts(
    true,
    setPosts,
    "mybookmarks",
    undefined,
    userEmail.userEmail,
    true,
  );
  // fetch(`${import.meta.env.VITE_SERVER_URL}/post/bookmarked`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     authorization: "Bearer " + localStorage.getItem("token"),
  //   }
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response is not ok ");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     if (data.success) {
  //       setPosts(data.data);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  return (
    <div>
      <Header title="My Bookmarks" description="" />
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-3/4">
            <InfinitePostScroll posts={posts}></InfinitePostScroll>
          </div>
          <div className="md:w-1/4 p-4 m-4">
            <SideBar onSelectTag={handleSelectTag}></SideBar>
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
