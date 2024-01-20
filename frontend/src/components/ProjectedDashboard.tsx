import { Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import IncomeCard from "./IncomeCard";
// import ExpenseCard from "./ExpenseCard";
import SavingsCard from "./SavingsCard";
function ProjectedDashboard() {
  return (
    <>
      <div className="grid-container" style={{ margin: "20px" }}>
        <div className="grid-item item-projected-dashboard3">
          {/* <div> */}
          <img
            src="https://i.ibb.co/f2hX8rh/5240-removebg-preview-1.jpg"
            alt="Subject"
            // border="0"
            // style={{ border: "1px solid black" }}
          ></img>
          {/* </div> */}
        </div>

        <div
          className="grid-item item-projected-dashboard2"
          //   style={{
          //     display: "flex",
          //     flexDirection: "column",
          //     justifyContent: "center",
          //   }}
        >
          <SavingsCard />
        </div>
      </div>
    </>
  );
}

export default ProjectedDashboard;
