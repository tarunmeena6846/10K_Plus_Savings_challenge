import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const links = [
  "Recent Discussions",
  "My Discussions",
  "My Bookmarks",
  "My Drafts",
];

export interface tagDataType {
  _id: string;
  tag: string;
}
import { motion } from "framer-motion";
import Button from "../Button";
import { postState } from "../store/atoms/post";
import { PostType } from "./InfinitePostScroll";
import { useRecoilState } from "recoil";
const SideBar = ({
  onSelectTag,
}: {
  onSelectTag: (tag: tagDataType | null) => void;
}) => {
  const navigate = useNavigate();
  const [popularTags, setPopularTags] = useState<tagDataType[]>([]);
  const [posts, setPosts] = useRecoilState<PostType[]>(postState);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/post/tags`, {
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
          console.log("tags in db", data.data);
          setPopularTags(data.data);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleOnClick = (tag: string | tagDataType) => {
    console.log("onclicked ", tag, typeof tag);
    if (tag === "My Discussions") {
      navigate("/community/mydiscussion");
    }
    if (tag === "My Bookmarks") {
      navigate("/community/bookmarked");
    }
    if (tag === "My Drafts") {
      navigate("/community/drafts");
    }
    if (tag === "Recent Discussions") {
      navigate("/community");
    } else if (typeof tag === "object") {
      console.log(tag._id);
      onSelectTag(tag);
      //   console.log("inside useEffect in sidebar");
      //   fetch(`${import.meta.env.VITE_SERVER_URL}/post/tags/${tag._id}`, {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       authorization: "Bearer " + localStorage.getItem("token"),
      //     },
      //   })
      //     .then((response) => {
      //       if (!response.ok) {
      //         throw new Error("Network reponse is not ok");
      //       }
      //       response.json().then((data) => {
      //         if (data.success) {
      //           console.log("tags in db", data.data);
      //           setPosts(data.data);
      //         } else {
      //           setPosts([]);
      //         }
      //       });
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //     });
      // }
    }
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
          {links.map((tag, index) => (
            <div className="mb-2" key={index}>
              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }} // Define hover animation
                  whileTap={{ scale: 1 }} // Define hover animation
                  onClick={() => handleOnClick(tag)}
                >
                  {tag}
                </motion.button>
                {tag != "Recent Discussions" && <div>0</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div>
        <h2 className="text-lg font-bold">Sort by</h2>
        <ul>
          {sorts.map((tag, index) => (
            <li key={index} className="mb-1">
              <a href="#" className="text-grey-700">
                {tag}
              </a>
            </li>
          ))}
        </ul>
      </div> */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }} // Define hover animation
            whileTap={{ scale: 1 }} // Define hover animation
            className="bg-gray-400 rounded-2xl px-2 "
            onClick={() => onSelectTag(null)}
          >
            All Tags
          </motion.button>
          {popularTags?.map((tag: tagDataType, index) => (
            // <li key={index} className="mb-1">
            <motion.button
              whileHover={{ scale: 1.1 }} // Define hover animation
              whileTap={{ scale: 1 }} // Define hover animation
              className="bg-gray-400 rounded-2xl px-2 "
              onClick={() => handleOnClick(tag)}
            >
              {tag.tag}
            </motion.button>
            // </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
