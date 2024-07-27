import React from "react";
import Button from "../../Button";
import { useParams } from "react-router-dom";
import SideBar from "../SideBar";
import Postdetails from "./PostRetrieval";
import CommentDetails from "./RenderComments";
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
            <CommentDetails></CommentDetails>
          </div>
          <div className="md:w-1/4 p-4 m-4">
            <SideBar onSelectTag={handleSelectTag}></SideBar>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostLanding;
