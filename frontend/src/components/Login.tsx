import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  SubscriptionData,
  subscriptionState,
  userState,
} from "./store/atoms/user";
import { useRecoilState } from "recoil";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [resetRequested, setResetRequested] = useState(false);
  const [msg, setMsg] = useState("");
  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  console.log(password);
  const handleRegister = () => {
    if (!email || !password) {
      // Display an error message or prevent the registration process
      console.error("Email and password are required");
      alert("Email and Password are Required");
      return;
    }
    const headers = new Headers();
    headers.append("Username", email);
    headers.append("Password", password);
    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
      method: "POST",
      headers: headers,
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((data) => {
          console.log(data);
          if (data.verified) {
            localStorage.setItem("token", data.token);
            console.log("Login successfully", data);
            setCurrentUserState({
              userEmail: email as string,
              isLoading: false,
              imageUrl: currentUserState.imageUrl,
              isVerified: currentUserState.isVerified,
              myWhy: currentUserState.myWhy,
            });
            if (subscription.isSubscribed) navigate("/dashboard");
            else navigate("/pricing");
          } else {
            setMsg(data.message);
          }
        });
      })
      .catch((error) => {
        alert("Invalid Username or Password");
        console.error("Error signing in email");
      });
  };
  return (
    <div style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      <>
        <div
          style={{
            paddingTop: 120,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant={"h6"}>Welcome Back!! </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
          <Card variant="outlined" style={{ width: 400, padding: 20 }}>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              label="Username/Phone Number"
              variant="outlined"
              type="email"
              fullWidth
            />
            <br />
            <br />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
            />
            <br />
            <br />
            {msg && <div className="message">{msg}</div>}
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
            >
              Login
            </Button>
          </Card>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          New user? <a href="/register"> Register</a>
        </div>
        {/* </div> */}
      </>
    </div>
  );
}

export default Login;
