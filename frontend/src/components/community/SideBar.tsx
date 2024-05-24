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
import HandleCreatePost from "./CreatePost";
const SideBar = ({ onSelectTag }: { onSelectTag: (tagId: string) => void }) => {
  const navigate = useNavigate();
  const [popularTags, setPopularTags] = useState<tagDataType[]>([]);
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);
  const [loading, setLoading] = useState(true); // New state to track loading
  const [count, setCount] = useRecoilState(countAtom);
  console.log("count", count);

  const links = [
    { name: "Recent Discussions", count: 0 },
    { name: "My Discussions", count: count.myDiscussionCount },
    { name: "My Bookmarks", count: count.bookmarkCount },
    { name: "My Drafts", count: count.draftCount },
  ];
  useEffect(() => {
    console.log(count, "Bearer " + localStorage.getItem("token"));

    fetch(`${import.meta.env.VITE_SERVER_URL}/post/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network reponse is not ok");
        }
        response.json().then((data) => {
          console.log("tags in db", data.data);
          setPopularTags(data.data);
        });
      })
      .catch((error) => {
        console.error(error);
      });
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
    <div>
      <div>
        <Button
          onClick={() => {
            navigate("/newpost");
          }}
        >
          + New Post
        </Button>
      </div>
      <div>
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

      <div>
        <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }} // Define hover animation
            whileTap={{ scale: 1 }} // Define hover animation
            className="bg-gray-400 rounded-2xl px-2 "
            onClick={() => onSelectTag("")}
          >
            All Tags
          </motion.button>
          {popularTags?.map((tag: tagDataType, index) => (
            <div key={index}>
              <motion.button
                whileHover={{ scale: 1.1 }} // Define hover animation
                whileTap={{ scale: 1 }} // Define hover animation
                className="bg-gray-400 rounded-2xl px-2 "
                onClick={() => handleTagClick(tag._id)}
              >
                {tag.tag}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
