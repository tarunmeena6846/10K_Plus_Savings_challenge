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

            setSubscripton({
              isSubscribed: data.userData.isSubscribed,
              stripeCustomerId: data.userData.stripeUserId,
              stripePlanId: data.userData.stripePlanId,
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
            });
          }
        })
        .catch((error) => {
          console.error("Error while logging in", error);
          setCurrentUserState({
            userEmail: "",
            isLoading: false,
            imageUrl: "",
          });
          setLogoutModalOpen(false);
        });
    } else {
      setCurrentUserState({ userEmail: "", isLoading: false, imageUrl: "" });
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
  return (
    <div>
      <Toolbar className="mx-auto px-4 mt-6 ml-10 mr-10 rounded-3xl bg-gray-200">
        {currentUserState.userEmail ? (
          <Typography
            variant="h6"
            sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
            onClick={() => {
              setSelectedDate({
                year: new Date().getFullYear(),
                month: selectedDate.month,
              });
              navigate("/dashboard");
            }}
          >
            10K Savings Challange
          </Typography>
        ) : (
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
          >
            10K Savings Challange
          </Typography>
        )}

        {currentUserState.userEmail ? (
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              // edge="end"
              // color="black"
              aria-label="menu"
              onClick={handleLogout}
            >
              <MenuIcon />
            </IconButton>
          </div>
        ) : (
          // <div></div>
          <div style={{ marginLeft: "auto" }}>
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
        )}
      </Toolbar>
      {/* </AppBar> */}
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
                <form
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
                </form>
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
