import React, { useEffect, useState } from "react";
import CheckBox from "./Checkbox";
import { useRecoilState } from "recoil";
import { userState } from "./store/atoms/user";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "./validator/emailValidator";
import { Spinner } from "./Loader/Spinner";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [secretePhrase, setSecretePhase] = useState("");
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [registrationError, setRegistrationError] = useState("");
  const [verifyEmailPrompt, setVerifyEmailPrompt] = useState("");
  const [shakePrompt, setShakePrompt] = useState(false);

  const navigate = useNavigate();

  const handleRegister = () => {
    if (isChecked && secretePhrase === "") {
      setRegistrationError("Secret phrase cannot be empty");
      return;
    }
    if (!email || !password || !username) {
      alert("Email and Password are Required");
      return;
    }
    if (validateEmail(email) === false) {
      setRegistrationError("Email format not correct");
      return;
    }

    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));

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
          if (data.success) {
            setVerifyEmailPrompt(data.message);
            setCurrentUserState((prev) => ({ ...prev, isLoading: false }));
          } else {
            setVerifyEmailPrompt("");
            setRegistrationError(
              "Username already exists. Please choose another."
            );
          }
        });
      })
      .catch((error) => {
        setCurrentUserState((prev) => ({ ...prev, isLoading: false }));

        setRegistrationError("Error registering email");
      });
  };

  useEffect(() => {
    if (verifyEmailPrompt || registrationError) {
      setShakePrompt(true);
      setTimeout(() => setShakePrompt(false), 500); // Remove shake effect after animation ends
    }
  }, [verifyEmailPrompt, registrationError]);

  return (
    <section className="h-screen bg-[#eaeaea]">
      <div className="container">
        <div className="flex justify-center items-center h-full">
          <div className="xl:w-10/12">
            <div className="card rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-wrap g-0">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="h-screen rounded-l-lg"
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
                        Welcome Challenger
                      </h5>
                      <div className="mb-4">
                        <input
                          type="email"
                          id="email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setRegistrationError(""); // Reset registration error when user starts typing again
                          }}
                          className="form-input w-full rounded-lg p-3"
                          placeholder="Email address"
                          required={true}
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="text"
                          id="username"
                          onChange={(e) => {
                            setUserName(e.target.value);
                            setRegistrationError(""); // Reset registration error when user starts typing again
                          }}
                          className="form-input w-full rounded-lg p-3"
                          placeholder="Username"
                          required={true}
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          id="password"
                          className="form-input w-full rounded-lg p-3"
                          placeholder="Password"
                          required={true}
                        />
                      </div>
                      <div className="flex flex-row">
                        <CheckBox
                          isChecked={isChecked}
                          setIsChecked={setIsChecked}
                        />
                        <p className="ml-2 mb-1">Signup as Root user</p>
                      </div>
                      {isChecked && (
                        <input
                          type="password"
                          className="form-input w-full rounded-lg p-3"
                          placeholder="Enter Key Phrase"
                          value={secretePhrase}
                          onChange={(e) => {
                            setSecretePhase(e.target.value);
                          }}
                          style={{ marginBottom: "10px" }}
                        />
                      )}
                      {verifyEmailPrompt && (
                        <div
                          className={`text-red-600 mb-2 ${
                            shakePrompt ? "shake" : ""
                          }`}
                          style={{
                            animation: shakePrompt ? "shake 0.5s" : "none",
                          }}
                        >
                          *{verifyEmailPrompt}
                        </div>
                      )}
                      {registrationError && (
                        <div
                          className={`text-red-500 mb-2 ${
                            shakePrompt ? "shake" : ""
                          }`}
                          style={{
                            animation: shakePrompt ? "shake 0.5s" : "none",
                          }}
                        >
                          *{registrationError}
                        </div>
                      )}
                      <div className="pt-1 mb-4">
                        {/* <button
                          className="btn btn-dark btn-lg w-full py-3 bg-[#ef85a5] text-black rounded-lg"
                          type="button"
                          onClick={handleRegister}
                        >
                          Register
                        </button> */}
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
                            Resister
                          </button>
                        )}
                      </div>
                      <p className="mb-5 pb-lg-2 text-gray-600">
                        Already have an account?
                        <button
                          onClick={() => navigate("/login")}
                          className="text-[#ef85a5] pointer"
                        >
                          Login here
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

      {/* CSS for shake animation */}
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

export default Register;
