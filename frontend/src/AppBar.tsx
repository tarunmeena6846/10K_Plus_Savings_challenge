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
import ManageBillingForm from "./stripe/ManageBillingForm";

// import { handleSubscription } from "./stripe/subscription";
// import { getUserSubscriptionPlan } from "./stripe/subscription";

function Appbar() {
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useRecoilState(dateState);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  // const subscriptionPlan = await getUserSubscriptionPlan();
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log(
    "import.meta.env.VITE_SERVER_URL",
    import.meta.env.VITE_SERVER_URL
  );

  const [anchorEl, setAnchorEl] = useState(null);

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
              isVerified: data.userData.verified,
            });

            setSubscripton({
              isSubscribed: data.userData.isSubscribed,
              stripeCustomerId: data.userData.stripeUserId,
              stripePlanId: data.userData.stripePlanId,
              isTopTier: data.userData.isTopTier,
            });

            if (!data.userData.isSubscribed) {
              navigate("/pricing");
            }
            // if (data.userData.isSubscribed) {
            //   const resend = new Resend("re_NNACsYE7_2erSMMU7kcXaXufffNzUBotd");
            //   // await handleSubscriptionCreated(session, subscription);
            //   const htmlContent = renderToString(
            //     <WelcomeEmail name="Brendon Urie" email="panic@thedis.co" />
            //   );
            //   console.log("tarun  meeana");
            //   resend.emails.send({
            //     from: "delivered@resend.dev",
            //     // to: session.customer_email as string,
            //     to: "tarunmeena6846@gmail.com",
            //     subject: "Hello World",
            //     html: htmlContent,
            //   });
            // }
          } else {
            setCurrentUserState({
              userEmail: "",
              isLoading: false,
              imageUrl: "",
              isVerified: currentUserState.isVerified,
            });
          }
        })
        .catch((error) => {
          console.error("Error while logging in", error);
          setCurrentUserState({
            userEmail: "",
            isLoading: false,
            imageUrl: "",
            isVerified: currentUserState.isVerified,
          });
          setLogoutModalOpen(false);
        });
    } else {
      setCurrentUserState({
        userEmail: "",
        isLoading: false,
        imageUrl: "",
        isVerified: currentUserState.isVerified,
      });
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
      userEmail: "",
      isLoading: false,
      imageUrl: currentUserState.imageUrl,
      isVerified: currentUserState.isVerified,
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

    // const session = await handleSubscription();

    // if (session) {
    //   window.location.href = session.url;
    // }
  };

  // if (currentUserState.userEmail === "") navigate("/login");
  return (
    <div>
      <Toolbar
        className="mx-auto px-4 mt-6 rounded-3xl"
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
          sx={{ textDecoration: "none", color: "black" }}
        >
          10K Savings Challenge
        </Typography>
        <div
          // className={"rounded-3xl "}
          className="hidden md:flex space-x-4 rounded-3xl"
          style={{
            border: "2px solid black",
            gap: "10px",
            padding: "10px",
            width: "auto",
            // display: "flex",
            // justifyContent: "center",
          }}
        >
          <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-20 h-10"
            }
            whileHover={{ background: "black", color: "white", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate(currentUserState.userEmail ? "/dashboard" : "/");
            }}
          >
            Home
          </motion.button>
          <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-20 h-10"
            }
            whileHover={{ background: "black", color: "white", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate("/pricing");
            }}
          >
            Pricing
          </motion.button>
          {/* <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-20 h-10"
            }
            whileHover={{ background: "black", color: "white", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Incomes
          </motion.button>
          <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-20 h-10"
            }
            whileHover={{ background: "black", color: "white", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Expenses
          </motion.button> */}
          <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-20 h-10"
            }
            whileHover={{
              background: "black",
              color: "white",
              width: "120px",
              scale: 1.1,
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate("/community");
            }}
          >
            Community
          </motion.button>
          <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-50 h-10"
            }
            whileHover={{
              background: "black",
              color: "white",
              width: "120px",
              scale: 1.1,
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate("/savingportal");
            }}
          >
            Saving Portal
          </motion.button>
          <motion.button
            className={
              "login-button rounded-3xl bg-transparent text-black w-50 h-10"
            }
            whileHover={{
              background: "black",
              width: "120px",
              color: "white",
              scale: 1.1,
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              navigate("/incomeportal");
            }}
          >
            Income Portal
          </motion.button>
          <div>
            <motion.button
              className={
                "login-button rounded-3xl bg-transparent text-black w-50 h-10"
              }
              whileHover={{
                background: "black",
                width: "120px",
                color: "white",
                scale: 1.1,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                navigate("/swotportal");
              }}
            >
              SWOT Portal
            </motion.button>
          </div>
        </div>

        <div>
          {!currentUserState.userEmail ? (
            <div className="hidden md:flex space-x-4">
              <motion.button
                className={
                  "login-button rounded-3xl bg-black text-white shadow-lg w-20 h-10"
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
            </div>
          ) : (
            <>
              {" "}
              <IconButton
                aria-label="menu"
                onClick={handleLogout}
                // color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </div>
        <div className="md:hidden md:flex">
          <IconButton
            aria-label="menu"
            onClick={handleMenuClick}
            // color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </div>
        {/* <div className="md:hidden">
          <IconButton
            aria-label="menu"
            onClick={handleMenuClick}
            // color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </div>

        <div className="hidden md:flex space-x-4">
          <Button color="inherit" onClick={() => navigate("/pricing")}>
            Pricing
          </Button>
          <Button color="inherit" onClick={() => navigate("/incomes")}>
            Incomes
          </Button>
          <Button color="inherit" onClick={() => navigate("/expenses")}>
            Expenses
          </Button>
          <Button color="inherit" onClick={() => navigate("/blog")}>
            Blog
          </Button>
        </div> */}
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
          <MenuItem onClick={() => handleMenuItemClick("/blog")}>Blog</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/login")}>
            Login
          </MenuItem>
        </Menu>
      </Toolbar>
      {/* </AppBar> */}
      {/* Drawer for menu options */}
      {/* {currentUserState.userEmail} */}
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
              {currentUserState.userEmail}
              <br />
              <br />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button onClick={handleLogoutConfirm}>Logout</Button>
                <Button onClick={handleLogoutCancel}>Cancel</Button>
                {/* <form
                  method="POST"
                  action={`${
                    import.meta.env.VITE_SERVER_URL
                  }/create-customer-portal-session`}
                >
                  <input
                    type="hidden"
                    name="customerId"
                    value={subscription.stripeCustomerId}
                  />

                  <button type="submit">Manage billing</button>
                </form> */}
                <ManageBillingForm></ManageBillingForm>
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
