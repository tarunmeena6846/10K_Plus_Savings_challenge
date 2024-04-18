import React, { useState } from "react";
import Header from "../Header";
import SideBar, { tagDataType } from "../SideBar";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { postState } from "../../store/atoms/post";
import fetchPosts from "../fetchPosts";
import countAtom from "../../store/atoms/quickLinkCount";
import useFetchPosts from "../fetchPosts";
import { selectedTagIdState } from "../../store/atoms/selectedTag";
const MyDraft = () => {
  const userEmail = useRecoilValue(userState);
  const [selectedTagId, setSelectedTagId] = useRecoilState(selectedTagIdState);
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  const [count, setCount] = useRecoilState(countAtom);

  // Render popular tags
  const handleSelectTag = (tagId: string) => {
    setSelectedTagId(tagId);
  };

  useFetchPosts(
    false,
    setPosts,
    "mydrafts",
    undefined,
    userEmail.userEmail,
    null,
    setCount
  );
  console.log("at my draft", count.draftCount);
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
