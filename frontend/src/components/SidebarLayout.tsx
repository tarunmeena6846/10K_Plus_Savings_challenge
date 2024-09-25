import React from "react";
import SideBar from "./Sidebar/SideBar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex  lg:w-1/4 bg-[#111f36]">
        <SideBar />
      </div>

      {/* Content area */}
      <div className="w-full lg:w-3/4 2xl:flex 2xl:justify-center">
        {/* <div className="hidden lg:block bg-[#111f36]"></div> */}
        <div className="p-5 md:p-10 ">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
