import React from "react";
import Button from "../../Button";
import { useParams } from "react-router-dom";
import SideBar from "../SideBar";
import Postdetails from "./Postdetails";
import CommentDetails from "./CommentDetails";
import { useRecoilState } from "recoil";
import { selectedTagIdState } from "../../store/atoms/selectedTag";

const PostLanding = () => {
  const [selectedTagId, setSelectedTagId] = useRecoilState(selectedTagIdState);
  // Render popular tags
  const handleSelectTag = (tagId: string) => {
    setSelectedTagId(tagId);
  };
  //   const params = useParams();
  return (
    <div>
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-3/4">
            {/* <Postdetails></Postdetails> */}
            <CommentDetails></CommentDetails>
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
export default PostLanding;
