import * as React from "react";
import { motion } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { useNavigate } from "react-router-dom";
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
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { dateState } from "../store/atoms/date";

const sidebarVariants = {
  open: {
    clipPath: `circle(150% at 90% 40px)`, // Expands from the right side (90%)
    transition: {
      type: "spring",
      stiffness: 50,
      restDelta: 2,
      duration: 0.5,
    },
  },
  closed: {
    clipPath: "circle(0% at 90% 40px)", // Starts as invisible (0px circle)
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      restDelta: 2,
      duration: 0.5, // Same duration as opening for symmetry
    },
  },
};

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
export const HamburgerMenu = ({ isOpen, setIsOpen, Items }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  console.log(currentUserState.userEmail);
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state on click
  };

  const handleLogout = () => {
    console.log("here");
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    localStorage.removeItem("token");
    // setCurrentUserState({
    //   userEmail: "",
    //   isLoading: false,
    //   imageUrl: currentUserState.imageUrl,
    //   isVerified: currentUserState.isVerified,
    //   myWhy: currentUserState.myWhy,
    //   isAdmin: currentUserState.isAdmin,
    // });
    setCurrentUserState((prev) => ({
      ...prev,
      userEmail: "",
      isLoading: false,
      // imageUrl: "",
      // isVerified: currentUserState.isVerified,
      // myWhy: currentUserState.myWhy,
      // isAdmin: currentUserState.isAdmin,
    }));
    setSelectedDate({
      year: selectedDate.year,
      month: new Date().toLocaleString("en-US", { month: "long" }),
    });

    navigate("/");
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };
  console.log(Items);
  return (
    <div>
      {/* Toggle Button */}
      <MenuToggle toggle={toggleMenu} isOpen={isOpen} />

      {/* Conditionally render the motion div based on `isOpen` */}
      {isOpen && (
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          exit="closed"
          variants={sidebarVariants}
          style={{
            // width: "100%",
            // height: "100vh",
            position: "fixed",
            zIndex: "50",
            top: 0,
            right: 0,
            transformOrigin: "90% 40px", // Defines the origin of the animation on the right side
          }}
          className=" bg-pink-400 w-full h-[100vh] lg:w-[50%] rounded-3xl"
        >
          {/* Content inside the menu */}
          <div className="h-screen flex text-4xl gap-5 justify-center ml-[50px] sm:ml-[100px] flex-col">
            {/* <h1 className="text-white text-center">Hello</h1> */}

            {Items.map((item, index) => (
              <motion.div
                key={index}
                variants={variants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log(item);
                  console.log("here");
                  if (item.label === "Logout") {
                    handleLogout();
                  } else {
                    console.log("here2");
                    navigate(item.route);
                  }
                  setIsOpen(false);
                }}
              >
                {item.label}
                {/* <div className="icon-placeholder h-[10px] bg-pink-400" /> */}
                {/* <div className="text-placeholder" /> */}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {/* {currentUserState.userEmail} */}
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
              <button onClick={handleLogoutConfirm}>Logout</button>
              <button onClick={handleLogoutCancel}>Cancel</button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
};
