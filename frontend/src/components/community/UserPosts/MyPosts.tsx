import React, { useState, useEffect } from "react";
import Header from "../Header";
import SideBar, { tagDataType } from "../SideBar";
import InfinitePostScroll, { PostType } from "../InfinitePostScroll";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { postState } from "../../store/atoms/post";
import fetchPosts from "../fetchPosts";
import useFetchPosts from "../fetchPosts";
import { selectedTagIdState } from "../../store/atoms/selectedTag";
import { HamburgerMenu } from "../../hambuger";
import { communityItems } from "../CommunityLanding";

const MyPosts = () => {
  const userEmailState = useRecoilValue(userState);
  const [selectedTagId, setSelectedTagId] = useRecoilState(selectedTagIdState);
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  console.log(userEmailState);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render popular tags
  const handleSelectTag = (tagId: string) => {
    setSelectedTagId(tagId);
  };

  console.log("posts at my posts", posts);

  return (
    <div>
      <Header title="My Posts" description="" />
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className=" w-full lg:w-3/4">
            <InfinitePostScroll type="myposts" tag=""></InfinitePostScroll>
          </div>
          <div className="hidden lg:w-1/4 p-4 m-4 lg:block">
            <SideBar onSelectTag={handleSelectTag}></SideBar>
          </div>
        </div>

        <button
          className="lg:hidden fixed bottom-5 right-5"
          onClick={() => setMobileMenuOpen(true)}
        >
          <img src="/CommunityMenu.svg"></img>
        </button>
      </div>
      {isMobileMenuOpen && (
        <HamburgerMenu
          isOpen={isMobileMenuOpen}
          setIsOpen={setMobileMenuOpen}
          Items={communityItems}
          type={"communityMenu"}
        />
      )}
    </div>
  );
};

export default MyPosts;
