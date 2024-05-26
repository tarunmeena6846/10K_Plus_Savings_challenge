import React, { useState } from "react";
// import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Card, Input, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userState } from "./store/atoms/user";
import { useRecoilState } from "recoil";
import CheckBox from "./Checkbox";
import { validateEmail } from "./validator/emailValidator";
function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [secretePhrase, setSecretePhase] = useState("");
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [registrationError, setRegistrationError] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    if (isChecked && secretePhrase === "") {
      setRegistrationError("Secret phrase can not be empty");
      return;
    }
    if (!email || !password || !username) {
      // Display an error message or prevent the registration process
      console.error("Email and password are required");
      alert("Email and Password are Required");
      return;
    }
    if (validateEmail(email) === false) {
      setRegistrationError("Email format not correct");
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        secretePhrase: isChecked ? secretePhrase : "",
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
          console.log("before router", data);
          if (data.success) {
            setRegistrationError(data.message);

            console.log("email registered successfully", data);
          } else {
            setRegistrationError(
              "Username already exists. Please choose another."
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error registering email", error);
        setRegistrationError("Error registering email");
      });
  };
  return (
    <div style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      <div>{/* <Payment /> */}</div>
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
              setRegistrationError(""); // Reset registration error when user starts typing again
            }}
            label="Email"
            // inputProps={{ maxLength:  }}
            variant="outlined"
            type={"email"}
            fullWidth
            required={true}
          />
          <br />
          <br />
          <TextField
            onChange={(e) => {
              setUserName(e.target.value);
              setRegistrationError(""); // Reset registration error when user starts typing again
            }}
            label="Username"
            inputProps={{ maxLength: 15 }}
            variant="outlined"
            type={"email"}
            fullWidth
            required={true}
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
            required={true}
          />
          <br />
          <br></br>
          <div className="flex flex-col items-start ">
            <div className=" flex flex-row">
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
              <p className="ml-2 mb-1">Signup as Root user</p>
            </div>
            {isChecked && (
              <TextField
                type="password"
                variant="outlined"
                fullWidth
                label="Enter key Phrase"
                value={secretePhrase}
                onChange={(e) => {
                  setSecretePhase(e.target.value);
                }}
                style={{ marginBottom: "10px" }}
              />
            )}
            {registrationError && (
              <div className="text-red-500 mb-2">{registrationError}</div>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
            >
              Signup
            </Button>
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        Already a user? <a href="/login">Login</a>
      </div>
    </div>
  );
}

export default Register;
