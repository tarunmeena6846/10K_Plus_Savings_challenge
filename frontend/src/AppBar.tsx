import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Modal,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRecoilState } from "recoil";
import {
  userState,
  subscriptionState,
  SubscriptionData,
} from "./components/store/atoms/user";
import { dateState } from "./components/store/atoms/date";
import { motion } from "framer-motion";
import { Resend } from "resend";

import { renderToString } from "react-dom/server"; // Import ReactDOMServer
// import ManageBillingForm from "./stripe/ManageBillingForm";
import Button from "./components/Button";
import handleBuyClick from "./stripe/SwotCheckout";
import countAtom from "./components/store/atoms/quickLinkCount";
import Dropdown from "./Dropdown";
import Loader from "./components/community/Loader";
import { Spinner } from "./components/Loader/Spinner";
import { HamburgerMenu } from "./components/hambuger";
// import { handleSubscription } from "./stripe/subscription";
// import { getUserSubscriptionPlan } from "./stripe/subscription";

function Appbar() {
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  const handleAdminMouseEnter = () => {
    if (currentUserState.isAdmin) {
      setIsAdminDropdownOpen(true);
    }
  };

  const handleAdminMouseLeave = () => {
    setIsAdminDropdownOpen(false);
  };

  const adminItems = [{ label: "Admin Console", route: "/adminconsole" }];

  const swotItems = [{ label: "Tasklist", route: "/swotportal/tasklist" }];
  const navBarItems = [
    { label: "Home", route: "/" },
    ...(currentUserState.userEmail === ""
      ? [
          { label: "Login", route: "/login" },
          { label: "Sign up", route: "/register" },
          { label: "Pricing", route: "/pricing" },
          { label: "Community", route: "/community" },
          { label: "SWOT Portal", route: "/swotportal" },
        ]
      : [
          { label: "Savings Portal", route: "/dashboard" },
          { label: "Current Savings Portal", route: "/currentdashboard" },
          { label: "Target Savings Portal", route: "/targetdashboard" },
          { label: "Actual Savings Portal", route: "/actualdashboard" },
          { label: "Pricing", route: "/pricing" },
          { label: "Community", route: "/community" },
          ...(currentUserState.isAdmin
            ? [{ label: "Admin Console", route: "/adminconsole" }]
            : []),
          { label: "SWOT Portal", route: "/swotportal" },
          { label: "SWOT TaskList", route: "/swotportal/tasklist" },
          { label: "Analytics", route: "/analytics" },
          { label: "Logout", route: "/logout" },
        ]),
  ];
  console.log(currentUserState);

  return (
    <div className="px-4 ">
      <Toolbar
        className="mx-auto mt-6 w-full rounded-3xl bg-[#eaeaea] border z-[999]"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          to={currentUserState.userEmail ? "/dashboard" : "/"}
          sx={{ textDecoration: "none", color: "white" }}
        >
          <img
            src="./10ksc.png"
            className="w-20 h-20 rounded-3xl"
            alt="10KSC Logo"
          ></img>
          {/* 10K Savings Challenge */}
        </Typography>
        <div className="hidden md:flex space-x-4 rounded-3xl justify-between items-center  text-white p-2">
          <motion.button
            whileHover={{ scale: 1.3, background: "black", color: "white" }}
            whileTap={{ scale: 1 }}
            className="rounded-3xl text-black p-2"
            onClick={() =>
              navigate(currentUserState.userEmail ? "/dashboard" : "/")
            }
          >
            Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.3, background: "black", color: "white" }}
            whileTap={{ scale: 1 }}
            className="rounded-3xl text-black p-2"
            onClick={() => navigate("/pricing")}
          >
            Pricing
          </motion.button>
          <div>
            <motion.button
              whileHover={{ scale: 1.3, background: "black", color: "white" }}
              whileTap={{ scale: 1 }}
              onMouseEnter={handleAdminMouseEnter}
              onMouseLeave={handleAdminMouseLeave}
              className="rounded-3xl text-black p-2"
              onClick={() => navigate("/community")}
            >
              Community
            </motion.button>
            <Dropdown
              items={adminItems}
              isOpen={isAdminDropdownOpen}
              onMouseEnter={handleAdminMouseEnter}
              onMouseLeave={handleAdminMouseLeave}
              navigate={navigate}
            />
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.3, background: "black", color: "white" }}
              whileTap={{ scale: 1 }}
              className="rounded-3xl text-black pr-3 p-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate("/swotportal")}
            >
              SWOT Portal
            </motion.button>
            <Dropdown
              items={swotItems}
              isOpen={isDropdownOpen}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              navigate={navigate}
            />
          </div>
        </div>
        <div>
          {currentUserState.isLoading ? (
            <>
              <Spinner />
            </>
          ) : (
            <div>
              {currentUserState.userEmail === "" ? (
                <>
                  <div className="hidden md:flex space-x-4">
                    <motion.button
                      className="login-button rounded-3xl text-black w-20 h-10"
                      whileHover={{
                        scale: 1.3,
                        background: "black",
                        color: "white",
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </motion.button>
                  </div>
                  <div className="md:hidden">
                    <HamburgerMenu
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      Items={navBarItems}
                      type={"AppbarMenu"}
                    />
                  </div>
                </>
              ) : (
                <div className="md:w-1/2">
                  <HamburgerMenu
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    Items={navBarItems}
                    type={"AppbarMenu"}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Toolbar>
    </div>
  );
}
export default Appbar;
