import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

export interface tagDataType {
  _id: string;
  tag: string;
}
import { motion } from "framer-motion";
import Button from "../Button";
import { postState } from "../store/atoms/post";
import { PostType } from "./InfinitePostScroll";
import { useRecoilState, useRecoilValue } from "recoil";
import countAtom from "../store/atoms/quickLinkCount";

import { currentEventsState } from "../store/atoms/events";
import { Tooltip } from "../ToolTip";
import { userState } from "../store/atoms/user";
export const fetchTags = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/post/tags`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response is not ok");
    }

    const data = await response.json();
    console.log("tags in db", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

const SideBar = ({ onSelectTag }: { onSelectTag: (tagId: string) => void }) => {
  const navigate = useNavigate();
  const [popularTags, setPopularTags] = useState<tagDataType[]>([]);
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  const [loading, setLoading] = useState(true); // New state to track loading
  const [count, setCount] = useRecoilState(countAtom);
  const currentEvents = useRecoilValue(currentEventsState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  console.log("count", count);
  console.log(currentEvents);
  const links = [
    { name: "Recent Discussions", count: 0 },
    { name: "My Discussions", count: count.myDiscussionCount },
    { name: "My Bookmarks", count: count.bookmarkCount },
    { name: "My Drafts", count: count.draftCount },
  ];
  useEffect(() => {
    const fetchTagsFromDB = async () => {
      // setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
      console.log("here");
      try {
        const response = await fetchTags();
        console.log(response);
        console.log(response);
        setPopularTags(response);
        setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTagsFromDB();
  }, []);

  const handleOnClick = (link: string) => {
    console.log("onclicked ", link);
    if (link === "My Discussions") {
      // onSelectTag("");
      navigate("/community/mydiscussion");
    } else if (link === "My Bookmarks") {
      // onSelectTag("");
      navigate("/community/bookmarked");
    } else if (link === "My Drafts") {
      // onSelectTag("");
      navigate("/community/drafts");
    } else if (link === "Recent Discussions") {
      onSelectTag("");
      navigate("/community");
    }
    // } else if (typeof tag === "object") {
    //   console.log("selectedTag navigation at sidebar", tag._id);
    //   navigate("/community");
    //   onSelectTag({ _id: tag._id });
    // }
  };
  const handleTagClick = (tagId: string) => {
    console.log("selectedTag navigation at sidebar", tagId);
    navigate("/community");
    onSelectTag(tagId);
  };
  return (
    <div className="text-white">
      <div className="my-4">
        <button
          className="bg-[#6d94ff] p-3 rounded-3xl mb-2"
          onClick={() => {
            navigate("/newpost");
          }}
        >
          + New Post
        </button>
      </div>
      <hr />
      <div className="my-4">
        <h2 className="text-lg font-bold">Quick Links</h2>
        <div className="">
          {links.map((links, index) => (
            <div className="mb-2" key={index}>
              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }} // Define hover animation
                  whileTap={{ scale: 1 }} // Define hover animation
                  onClick={() => handleOnClick(links.name)}
                >
                  {links.name}
                </motion.button>
                {links.name != "Recent Discussions" && links.count}
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="my-4">
        <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }} // Define hover animation
            whileTap={{ scale: 1 }} // Define hover animation
            className="bg-[#6d94ff] rounded-2xl px-2 "
            onClick={() => onSelectTag("")}
          >
            All Tags
          </motion.button>

          {popularTags?.map((tag: tagDataType, index) => (
            <>
              {/* {!currentUserState.isLoading && ( */}
              <div key={index}>
                <motion.button
                  whileHover={{ scale: 1.1 }} // Define hover animation
                  whileTap={{ scale: 1 }} // Define hover animation
                  className="bg-[#6d94ff] rounded-2xl px-2 "
                  onClick={() => handleTagClick(tag._id)}
                >
                  {tag.tag}
                </motion.button>
              </div>
              {/* )} */}
            </>
          ))}
        </div>
      </div>
      <hr className="mt-5" />
      <div className="my-4">
        <div className="">
          <h1 className="text-lg font-semibold mb-1 mt-3">Events this month</h1>
          {currentEvents.length > 0 ? (
            <>
              {currentEvents.map((event, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <Tooltip title={event.title}>
                      {event.title.substring(0, 20)}
                    </Tooltip>
                    <h1 className="">{event.start.split("T")[0]}</h1>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h2>*No events this month*</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
