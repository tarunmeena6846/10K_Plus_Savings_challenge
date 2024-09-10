import React from "react";
import SideBar from "./Sidebar/SideBar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block lg:w-1/4 bg-[#111f36]">
        <SideBar />
      </div>

      {/* Content area */}
      <div className="w-full lg:w-3/4">
        <div className="p-2 md:p-10">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
