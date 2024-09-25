import React from "react";
import SideBar from "../community/SideBar";
import InfinitePostScroll from "../community/InfinitePostScroll";
import Calender from "./Calender";

const LandingConsole = () => {
  return (
    <div>
      <div className="p-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-[60%]">
            {/* <div className="md:w-1/2"> */}
            <InfinitePostScroll
              type="approvalReqPosts"
              tag={""}
            ></InfinitePostScroll>
          </div>
          <div className="w-full md:w-[40%] lg:p-4 lg:m-4">
            {/* <div className="md:w-1/2 p-4 m-4"> */}
            <Calender />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingConsole;
