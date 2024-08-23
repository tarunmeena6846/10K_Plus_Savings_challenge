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
import WelcomeEmail from "./utils/emails/Welcome";
import { renderToString } from "react-dom/server"; // Import ReactDOMServer
// import ManageBillingForm from "./stripe/ManageBillingForm";
import Button from "./components/Button";
import handleBuyClick from "./stripe/SwotCheckout";
import countAtom from "./components/store/atoms/quickLinkCount";
import Dropdown from "./Dropdown";
import Loader from "./components/community/Loader";
import { Spinner } from "./components/Loader/Spinner";
// import { handleSubscription } from "./stripe/subscription";
// import { getUserSubscriptionPlan } from "./stripe/subscription";

function Appbar() {
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  // const [videoModalOpen, setVideoModalOpen] = useRecoilState(videoModalState);

  const adminItems = [{ label: "Admin Console", route: "/adminconsole" }];

  const swotItems = [{ label: "Tasklist", route: "/swotportal/tasklist" }];
  // const [userPostCount, setUserPostCount] = useRecoilState(countAtom);
  // const subscriptionPlan = await getUserSubscriptionPlan();
  // const [subscription, setSubscripton] =
  //   useRecoilState<SubscriptionData>(subscriptionState);
  console.log(
    "import.meta.env.VITE_SERVER_URL",
    import.meta.env.VITE_SERVER_URL
  );

  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (route) => {
    setAnchorEl(null);
    navigate(route);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    localStorage.removeItem("token");
    setCurrentUserState({
      userEmail: "",
      isLoading: false,
      imageUrl: currentUserState.imageUrl,
      isVerified: currentUserState.isVerified,
      myWhy: currentUserState.myWhy,
      isAdmin: currentUserState.isAdmin,
    });
    setSelectedDate({
      year: selectedDate.year,
      month: new Date().toLocaleString("en-US", { month: "long" }),
    });

    navigate("/");
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };
  const manageSubscription = async () => {
    setLogoutModalOpen(false);
  };
  console.log(currentUserState);
  return (
    <div className="px-4">
      <Toolbar
        className="mx-auto mt-6 mx-4 rounded-3xl bg-[#eaeaea] border "
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
            className="w-20 h-20  rounded-3xl"
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
                <div className="hidden md:flex space-x-4">
                  <motion.button
                    className="login-button rounded-3xl  text-black  w-20 h-10"
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
              ) : (
                <>
                  <IconButton aria-label="menu" onClick={handleLogout}>
                    <MenuIcon className="text-white" />
                  </IconButton>
                </>
              )}
            </div>
          )}
        </div>
        <div className="md:hidden md:flex">
          <IconButton aria-label="menu" onClick={handleMenuClick}>
            <MenuIcon className="text-white" />
          </IconButton>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className="md:hidden"
        >
          <MenuItem onClick={() => handleMenuItemClick("/pricing")}>
            Pricing
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/incomes")}>
            Incomes
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/expenses")}>
            Expenses
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/community")}>
            Community
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/login")}>
            Login
          </MenuItem>
        </Menu>
      </Toolbar>
      {currentUserState.userEmail && (
        <Modal
          open={isLogoutModalOpen}
          onClose={handleLogoutCancel}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="User Avatar"
              src={currentUserState.imageUrl}
              style={{
                width: "90px",
                height: "90px",
                marginBottom: "16px",
              }}
            />
            {currentUserState.userEmail}
            <br />
            <br />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button onClick={handleLogoutConfirm}>Logout</Button>
              <Button onClick={handleLogoutCancel}>Cancel</Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}
export default Appbar;
