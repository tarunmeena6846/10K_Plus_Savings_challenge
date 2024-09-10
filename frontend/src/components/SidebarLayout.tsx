// SidebarLayout.js
import React from "react";
import SideBar from "./Sidebar/SideBar";

const SidebarLayout = ({ children }) => {
  return (
    <div>
      <div className="flex md:flex-row">
        <div className="w-[0px] md:w-80">
          <SideBar />
        </div>
        <div className="w-full md:w-3/4">
          <div className="p-2 md:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
