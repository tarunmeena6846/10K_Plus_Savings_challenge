import React from "react";
import { useNavigate } from "react-router-dom";
const popularTags = [
  "SavingsChallenge",
  "FinancialGoals",
  "BudgetingTips",
  "InvestingAdvice",
  "FrugalLiving",
  "MoneyManagement",
  "PersonalFinance",
  "WealthBuilding",
  "FinancialFreedom",
  "SavingsTips",
  "DebtFreeJourney",
  "RetirementPlanning",
  "EmergencyFund",
  "InvestmentStrategies",
  "FinancialEducation",
];

const links = [
  "Recent Discussions",
  "My Discussions",
  "My Bookmarks",
  "My Drafts",
];

import { motion } from "framer-motion";
import Button from "../Button";
const SideBar = () => {
  const navigate = useNavigate();
  const handleOnClick = (tag: String) => {
    console.log("onclicked ", tag);
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
          {popularTags.map((tag, index) => (
            // <li key={index} className="mb-1">
            <motion.button
              whileHover={{ scale: 1.1 }} // Define hover animation
              whileTap={{ scale: 1 }} // Define hover animation
              className="bg-gray-400 rounded-2xl px-2 "
              onClick={() => handleOnClick(tag)}
            >
              {tag}
            </motion.button>
            // </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
