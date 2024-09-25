import React from "react";
import Button from "../../Button";
import { useParams } from "react-router-dom";
import SideBar from "../SideBar";
import Postdetails from "./PostRetrieval";
import CommentDetails from "./RenderComments";
import { useRecoilState } from "recoil";
import { selectedTagIdState } from "../../store/atoms/selectedTag";
import { userState } from "../../store/atoms/user";
import Loader from "../Loader";

const PostLanding = () => {
  const [selectedTagId, setSelectedTagId] = useRecoilState(selectedTagIdState);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  // Render popular tags
  const handleSelectTag = (tagId: string) => {
    setSelectedTagId(tagId);
  };
  //   const params = useParams();
  return (
    <div>
      <div className="p-4">
        {/* {currentUserState.isLoading ? (
          <>
            <Loader />
          </>
        ) : ( */}
        <div className="flex flex-col-reverse md:flex-row">
          <div className=" w-full lg:w-3/4">
            <CommentDetails></CommentDetails>
          </div>
          <div className="hidden lg:w-1/4 p-4 m-4 lg:block">
            <SideBar onSelectTag={handleSelectTag}></SideBar>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};
export default PostLanding;
