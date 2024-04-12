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
import { fetchTenPosts } from "./fetchPosts";

const CommunityLanding = () => {
  const [subscription, setSubscription] =
    useRecoilState<SubscriptionData>(subscriptionState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [selectedTag, setSelectedTag] = useState<tagDataType>();
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  let currentOffset = 0;
  let loading = false;

  // Render popular tags
  const handleSelectTag = (tag: tagDataType) => {
    setSelectedTag(tag);
  };
  const fetchPostsByTag = (tag: tagDataType) => {
    console.log("inside useEffect in sidebar");
    fetch(`${import.meta.env.VITE_SERVER_URL}/post/tags/${tag._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network reponse is not ok");
        }
        response.json().then((data) => {
          if (data.success) {
            console.log("tags in db", data.data.posts);
            setPosts(data.data.posts);
          } else {
            setPosts([]);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log("inside useeefetct", selectedTag);

    // Fetch all posts
    // Reset currentOffset and posts when isPublished changes
    currentOffset = 0;
    setPosts([]);
    fetchTenPosts(
      true,
      setPosts,
      loading,
      currentOffset,
      selectedTag === undefined ? undefined : selectedTag._id
    );

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = Math.ceil(
        document.documentElement.scrollTop + window.innerHeight
      );
      if (currentHeight + 1 >= scrollHeight) {
        fetchTenPosts(
          true,
          setPosts,
          loading,
          currentOffset,
          selectedTag === undefined ? undefined : selectedTag._id
        );
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedTag]);
  return (
    <div>
      {/* <div>
        {!subscription.isTopTier && <ManageBillingForm></ManageBillingForm>}
        {!currentUserState.userEmail && <button>Login</button>}
      </div> */}
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

export default CommunityLanding;
