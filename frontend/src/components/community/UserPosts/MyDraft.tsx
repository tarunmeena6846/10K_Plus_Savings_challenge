import React, { useState } from "react";
import Header from "../Header";
import SideBar, { tagDataType } from "../SideBar";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { postState } from "../../store/atoms/post";
import fetchPosts from "../fetchPosts";
const MyDraft = () => {
  const userEmail = useRecoilValue(userState);
  const [selectedTag, setSelectedTag] = useState<tagDataType | null>();
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);

  const handleSelectTag = (tag: tagDataType | null) => {
    setSelectedTag(tag);
  };

  fetchPosts(
    false,
    setPosts,
    selectedTag === undefined ? undefined : selectedTag?._id,
    userEmail.userEmail
  );

  return (
    <div>
      <Header title="My Drafts" description="" />
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-3/4">
            <InfinitePostScroll posts={posts}></InfinitePostScroll>
          </div>
          <div className="md:w-1/4 p-4 m-4">
            <SideBar onSelectTag={handleSelectTag}></SideBar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDraft;
