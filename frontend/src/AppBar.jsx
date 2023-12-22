import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { userState } from "./components/store/atoms/user";
import { useRecoilState } from "recoil";
import {
  monthlyExpenseState,
  monthlyIncomeState,
  yearlyExpenseState,
  yearlyIncomeState,
} from "./components/store/atoms/total";
import MenuIcon from "@mui/icons-material/Menu";
import { dateState } from "./components/store/atoms/date";

function Appbar() {
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetch(`${import.meta.env.VITE_SERVER_URL}/admin/me`, {
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
        });
    } else {
      setCurrentUserState({ userEmail: null, isLoading: false, imageUrl: "" });
    }
  }, [setCurrentUserState, navigate]);
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
              component={Link}
              to="/dashboard"
              sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
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
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Drawer for menu options */}
      {currentUserState.userEmail ? (
        <Drawer
          anchor="right"
          style={{}}
          open={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem("token");
                setCurrentUserState({
                  userEmail: null,
                  isLoading: false,
                  imageUrl: currentUserState.imageUrl,
                });
                setDrawerOpen(false);
                setSelectedDate({ year: selectedDate.year, month: "January" });
                navigate("/");
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary={currentUserState.userEmail} />
            </ListItemButton>
          </List>
        </Drawer>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Appbar;
