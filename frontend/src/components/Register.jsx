import React from "react";
// import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userState } from "./store/atoms/user";
import { useRecoilState } from "recoil";
/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);

  console.log("tarun", email);
  const navigate = useNavigate();

  console.log(password);
  const handleRegister = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/signup`, {
      method: "POST",
      body: JSON.stringify({
        username: email,
        password: password,
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
  return (
    <div style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      <div
        style={{
          paddingTop: 120,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant={"h6"}>Register to the website</Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <TextField
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            label="Email"
            variant="outlined"
            type={"email"}
            fullWidth
          />
          <br />
          <br />
          <TextField
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label="Password"
            variant="outlined"
            type={"password"}
            fullWidth
          />
          <br />
          <br></br>
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Signup
          </Button>
        </Card>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        Already a user? <a href="/login">Login</a>
      </div>
    </div>
  );
}

export default Register;
