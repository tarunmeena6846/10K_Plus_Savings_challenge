import React, { useState } from "react";
import { useEffect } from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "../store/atoms/user";
import { useRecoilState } from "recoil";
// import ManageBillingForm from "../../stripe/ManageBillingForm";
import Header from "./Header";
import InfinitePostScroll, { PostType } from "./InfinitePostScroll";
import SideBar, { tagDataType } from "./SideBar";
import { postState } from "../store/atoms/post";
import fetchPosts, { fetchTenPosts } from "./fetchPosts";
import useFetchPosts from "./fetchPosts";
import { selectedTagIdState } from "../store/atoms/selectedTag";
import Loader from "./Loader";
import { HamburgerMenu } from "../hambuger";
export const communityItems = [
  { label: "New Post", route: "/newpost" },
  { label: "Recent Discussions", route: "/community" },
  { label: "My Discussions", route: "/community/mydiscussion" },
  { label: "My Bookmarks", route: "/community/bookmarked" },
  { label: "My Drafts", route: "/community/drafts" },
];
const CommunityLanding = () => {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [selectedTagId, setSelectedTagId] = useRecoilState(selectedTagIdState);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Render popular tags
  const handleSelectTag = (tagId: string) => {
    console.log("selectedtag");
    setSelectedTagId(tagId);
  };
  console.log("selectedTag navigation after ", currentUserState);

  // console.log("posts at infinity", posts);
  return (
    <div>
      <Header
        title="10K Savings Challenge Community"
        description="Together, let's turn small steps into significant savings and celebrate the power of collective progress in the 10K Savings Challenge Community."
      />
      <div className="p-4">
        {/* {currentUserState.isLoading ? (
          <Loader />
        ) : ( */}
        <div className="flex flex-col-reverse md:flex-row">
          <div className=" w-full lg:w-3/4">
            <InfinitePostScroll
              type="allposts"
              tag={selectedTagId}
            ></InfinitePostScroll>
          </div>
          <div className="lg:w-1/4 p-4 m-4 hidden lg:block">
            <SideBar onSelectTag={handleSelectTag}></SideBar>
          </div>

          <button
            className="lg:hidden fixed bottom-5 right-5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <img src="/CommunityMenu.svg"></img>
          </button>
        </div>

        {/* )} */}
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

export default CommunityLanding;
