import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiMoney, BiSearch } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { AiFillHeart, AiTwotoneFileExclamation } from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import { useState } from "react";
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
    icon: <BiMoney />,
  },
  {
    path: "/actualdashboard",
    name: "Actual Savings Portal",
    icon: <BiMoney />,
  },
  {
    path: "/community",
    name: "Community",
    icon: <BiMoney />,
  },
  {
    path: "/swotportal",
    name: "SWOT Portal",
    icon: <AiFillHeart />,
  },
  // { path: "/settings", name: "Settings", icon: <BiCog /> },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="h-screen bg-gray-600">
      <motion.div
        animate={{
          width: isOpen ? "300px" : "45px",
          transition: {
            duration: 0.5,
            type: "spring",
            damping: 10,
          },
        }}
        className="h-full" // Ensure content scrolls if it exceeds height
      >
        <UserAvatar />
        <section className="routes">
          {routes.map((route, index) => {
            // if (route.subRoutes) {
            //   return (
            //     <SidebarMenu
            //       setIsOpen={setIsOpen}
            //       route={route}
            //       showAnimation={showAnimation}
            //       isOpen={isOpen}
            //     />
            //   );
            // }

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

      {/* <main>{children}</main> */}
    </div>
  );
};

export default SideBar;
