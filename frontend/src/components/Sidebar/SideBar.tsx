import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiMoney, BiSearch } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { AiFillHeart, AiTwotoneFileExclamation } from "react-icons/ai";
import { ImPriceTags } from "react-icons/im";
import { TbBuildingCommunity } from "react-icons/tb";
import { IoAnalyticsSharp } from "react-icons/io5";

import { MdOutlineSavings } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import { Avatar } from "@mui/material";
import UserAvatar from "../UserAvatar";
const routes = [
  {
    path: "/dashboard",
    name: "My Savings Dashboard",
    icon: <FaHome />,
  },
  {
    path: "/currentdashboard",
    name: "Current Savings Portal",
    icon: <FaUser />,
  },
  {
    path: "/targetdashboard",
    name: "Target Savings Portal",
    icon: <MdOutlineSavings />,
  },
  {
    path: "/actualdashboard",
    name: "Actual Savings Portal",
    icon: <BiMoney />,
  },
  {
    path: "/pricing",
    name: "Pricing",
    icon: <ImPriceTags />,
  },
  {
    path: "/community",
    name: "Community",
    icon: <TbBuildingCommunity />,
  },
  {
    path: "/swotportal",
    name: "SWOT Portal",
    icon: <AiFillHeart />,
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: <IoAnalyticsSharp />,
  },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const showAnimation = {
    hidden: { width: 0, opacity: 0, transition: { duration: 0.5 } },
    show: { opacity: 1, width: "auto", transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  return (
    <div className="fixed top-0 left-0 h-screen bg-gray-600 z-50">
      <motion.div
        animate={{
          overflow: "auto",
          width: isMobile ? "45px" : "300px",
          transition: {
            duration: 0.5,
            type: "spring",
            damping: 10,
          },
        }}
      >
        <UserAvatar />
        <section className="routes">
          {routes.map((route, index) => {
            return (
              <NavLink
                to={route.path}
                key={index}
                className="link"
                activeClassName="active"
              >
                <div className="icon">{route.icon}</div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="link_text"
                    >
                      {route.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </section>
      </motion.div>
    </div>
  );
};

export default SideBar;
