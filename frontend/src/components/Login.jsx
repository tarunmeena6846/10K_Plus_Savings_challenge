import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userState } from "./store/atoms/user";
import { useRecoilState } from "recoil";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [resetRequested, setResetRequested] = useState(false);
  console.log("tarun", email);
  console.log(password);
  const handleReset = () => {
    setResetRequested(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/reset-password`, {
      method: "POST",
      body: JSON.stringify({
        username: email,
      }),
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }

        resp.json().then((data) => {
          console.log("before router");
          setCurrentUserState({
            userEmail: email,
            isLoading: false,
            imageUrl: currentUserState.imageUrl,
          });
          // setCurrentUserState({ userEmail: email, isLoading: false });
          navigate("/dashboard");
          // history.go(0);
          console.log("email registered successfully", data);
          localStorage.setItem("token", data.token);
        });
      })
      .catch((error) => {
        console.error("Error registering email");
      });
  };
  const handleRegister = () => {
    const headers = new Headers();
    headers.append("Username", email);
    headers.append("Password", password);
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/login`, {
      method: "POST",
      headers: headers,
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
          setCurrentUserState({
            userEmail: email,
            isLoading: false,
            imageUrl: currentUserState.imageUrl,
          });
          navigate("/dashboard");
          console.log(data.token);
          console.log("Login successfully", data);
        });
      })
      .catch((error) => {
        alert("Invalid Username or Password");
        console.error("Error signing in email");
      });
  };
  console.log("resetRequested ", resetRequested);
  return (
    <div style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      {!resetRequested ? (
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
          <div
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <Card variant="outlined" style={{ width: 400, padding: 20 }}>
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                label="Email or Username"
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegister}
              >
                Login
              </Button>
            </Card>
          </div>
        </>
      ) : (
        <div>
          <div
            style={{
              paddingTop: 120,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant={"h6"}>Reset Password </Typography>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <Card variant="outlined" style={{ width: 400, padding: 20 }}>
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
              />
              <br />
              <br></br>

              <Button variant="contained" color="primary">
                Reset
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
