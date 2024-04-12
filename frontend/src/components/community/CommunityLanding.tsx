import React, { useState } from "react";
import { useEffect } from "react";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "../store/atoms/user";
import { useRecoilState } from "recoil";
import ManageBillingForm from "../../stripe/ManageBillingForm";
import Header from "./Header";
import InfinitePostScroll, { PostType } from "./InfinitePostScroll";
import SideBar, { tagDataType } from "./SideBar";
import { postState } from "../store/atoms/post";
import fetchPosts, { fetchTenPosts } from "./fetchPosts";

const CommunityLanding = () => {
  const [subscription, setSubscription] =
    useRecoilState<SubscriptionData>(subscriptionState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [selectedTag, setSelectedTag] = useState<tagDataType | null>();
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);

  // Render popular tags
  const handleSelectTag = (tag: tagDataType) => {
    setSelectedTag(tag);
  };

  fetchPosts(
    true,
    setPosts,
    selectedTag === undefined ? undefined : selectedTag?._id
  );

  // useEffect(() => {
  //   console.log("inside useeefetct", selectedTag);

  //   // Fetch all posts
  //   // Reset currentOffset and posts when isPublished changes
  //   currentOffset = 0;
  //   setPosts([]);
  //   fetchTenPosts(
  //     true,
  //     setPosts,
  //     // loading,
  //     // currentOffset,
  //     selectedTag === undefined ? undefined : selectedTag._id
  //   );

  //   const handleScroll = () => {
  //     const scrollHeight = document.documentElement.scrollHeight;
  //     const currentHeight = Math.ceil(
  //       document.documentElement.scrollTop + window.innerHeight
  //     );
  //     if (currentHeight + 1 >= scrollHeight) {
  //       fetchTenPosts(
  //         true,
  //         setPosts,
  //         // loading,
  //         // currentOffset,
  //         selectedTag === undefined ? undefined : selectedTag._id
  //       );
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [selectedTag]);
  return (
    <div>
      <Header
        title="10K Savings Challenge Community"
        description="Together, let's turn small steps into significant savings and celebrate the power of collective progress in the 10K Savings Challenge Community."
      />
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

export default CommunityLanding;
