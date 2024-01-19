import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Button,
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRecoilState } from "recoil";
import { userState } from "./components/store/atoms/user";
import { dateState } from "./components/store/atoms/date";

function Appbar() {
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetch(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedToken,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(" data after me route", data);
          if (data && data.userEmail) {
            setCurrentUserState({
              userEmail: data.userEmail,
              isLoading: false,
              imageUrl: data.imageUrl,
            });
          } else {
            setCurrentUserState({
              userEmail: null,
              isLoading: false,
              imageUrl: "",
            });
          }
        })
        .catch((error) => {
          console.error("Error while logging in", error);
          setCurrentUserState({
            userEmail: null,
            isLoading: false,
            imageUrl: "",
          });
          setLogoutModalOpen(false);
        });
    } else {
      setCurrentUserState({ userEmail: null, isLoading: false, imageUrl: "" });
    }
  }, [setCurrentUserState, navigate, setSelectedDate]);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    // Perform any additional actions here
    // ...
    // For now, let's just logout
    localStorage.removeItem("token");
    setCurrentUserState({
      userEmail: null,
      isLoading: false,
      imageUrl: currentUserState.imageUrl,
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

  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        style={{
          backgroundColor: "#daf7fd",
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "white",
            justifyContent: "space-between",
            borderRadius: "30px",
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          {currentUserState.userEmail ? (
            <Typography
              variant="h6"
              // component={Link}
              // to="/dashboard"
              sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
              onClick={() => {
                setSelectedDate({
                  year: new Date().getFullYear(),
                  month: selectedDate.month,
                });
                navigate("/dashboard");
              }}
            >
              WealthX10K
            </Typography>
          ) : (
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
            >
              WealthX10K
            </Typography>
          )}
          {currentUserState.isLoading ? (
            <CircularProgress color="inherit" />
          ) : currentUserState.userEmail ? (
            <div></div>
          ) : (
            // <div></div>
            <div style={{ marginLeft: "auto" }}>
              <Button
                style={{ color: "black", textTransform: "none" }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            </div>
          )}
          <IconButton
            edge="start"
            color="black"
            aria-label="menu"
            onClick={handleLogout}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Drawer for menu options */}
      {currentUserState.userEmail ? (
        <div>
          {/* Logout modal */}
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
                alt="Edit Avatar"
                src={currentUserState.imageUrl}
                style={{
                  width: "90px",
                  height: "90px",
                  marginBottom: "16px", // Add margin to separate Avatar and buttons
                }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button onClick={handleLogoutConfirm}>Logout</Button>
                <Button onClick={handleLogoutCancel}>Cancel</Button>
              </Box>
            </Box>
          </Modal>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Appbar;
