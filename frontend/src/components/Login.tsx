import React, { useEffect, useState } from "react";
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
import { Spinner } from "./Loader/Spinner";

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
  const [shakePrompt, setShakePrompt] = useState(false);

  console.log(password);
  const handleRegister = () => {
    if (!email || !password) {
      // Display an error message or prevent the registration process
      console.error("Email and password are required");
      alert("Email and Password are Required");
      return;
    }
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));

    const headers = new Headers();
    headers.append("email", email);
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
          console.log("data after login", data);
          if (data.verified) {
            localStorage.setItem("token", data.token);
            console.log("Login successfully", data);
            setCurrentUserState({
              userEmail: email as string,
              isLoading: false,
              imageUrl: currentUserState.imageUrl,
              isVerified: currentUserState.isVerified,
              myWhy: currentUserState.myWhy,
              isAdmin: currentUserState.isAdmin,
            });
            if (subscription.isSubscribed) navigate("/dashboard");
            else navigate("/pricing");
          } else {
            setMsg(data.message);
          }
        });
      })
      .catch((error) => {
        setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
        alert("Invalid Username or Password");
        console.error("Error signing in email");
      });
  };

  useEffect(() => {
    if (msg) {
      setShakePrompt(true);
      setTimeout(() => setShakePrompt(false), 500); // Remove shake effect after animation ends
    }
  }, [msg]);

  return (
    <section className="h-screen bg-[#eaeaea]">
      <div className="container py-5 h-full">
        <div className="flex justify-center items-center h-full">
          <div className="xl:w-10/12">
            <div className="card rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-wrap g-0">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className=" h-screen rounded-l-lg"
                  />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 flex items-center">
                  <div className="p-8 lg:p-10 text-black w-full">
                    <form>
                      <div className="flex items-center mb-3 pb-1">
                        <img src="./10ksc.png" className="w-[140px]" />
                      </div>
                      <h5 className="text-lg font-normal mb-3 pb-3 tracking-wider">
                        Sign into your account
                      </h5>
                      <div className="mb-4">
                        <input
                          type="email"
                          id="email"
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input w-full rounded-lg p-3"
                          placeholder="Email address"
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          id="password"
                          className="form-input w-full rounded-lg p-3"
                          placeholder="Password"
                        />
                      </div>
                      {msg && (
                        <div
                          className={`text-red-600 mb-2 ${
                            shakePrompt ? "shake" : ""
                          }`}
                          style={{
                            animation: shakePrompt ? "shake 0.5s" : "none",
                          }}
                        >
                          {msg}
                        </div>
                      )}
                      <div className="pt-1 mb-4">
                        {currentUserState.isLoading ? (
                          <button
                            className="btn btn-dark btn-lg w-full py-3 bg-[#ef85a5] text-black rounded-lg"
                            type="button"
                            onClick={handleRegister}
                          >
                            <Spinner />
                            {/* {currentUserState.isLoading ? <Spinner /> : Login} */}
                            {/* Login */}
                          </button>
                        ) : (
                          <button
                            className="btn btn-dark btn-lg w-full py-3 bg-[#ef85a5] text-black rounded-lg"
                            type="button"
                            onClick={handleRegister}
                          >
                            {/* {currentUserState.isLoading ? <Spinner /> : Login} */}
                            Login
                          </button>
                        )}
                      </div>
                      <a
                        className="text-sm text-gray-500"
                        onClick={() => navigate("/request-otp")}
                        // className="text-[#ef85a5]"
                      >
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2 text-gray-600">
                        Don't have an account?{" "}
                        <button
                          onClick={() => navigate("/register")}
                          className="text-[#ef85a5]"
                        >
                          Register here
                        </button>
                      </p>
                      <a href="#!" className="text-sm text-[#ef85a5]">
                        Terms of use.
                      </a>{" "}
                      <a href="#!" className="text-sm text-[#ef85a5]">
                        Privacy policy
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25%, 75% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
          }
          .shake {
            animation: shake 0.5s;
          }
        `}
      </style>
    </section>
  );
}

export default Login;
