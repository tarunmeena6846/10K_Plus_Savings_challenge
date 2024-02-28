import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import success from "../../images/success.png";
// import styles from "./styles.module.css";
// import { Fragment } from "react/cjs/react.production.min";

const EmailVerify = () => {
  console.log("tarun in email verify");
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();
  console.log("param", param);
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        // const url = `http://localhost:8080/api/users/${param.id}/verify/${param.token}`;
        console.log("tarun insde the email varification");
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/verify-email/${param.token}`,
          {
            method: "GET",
            // headers: {
            //   "Content-Type": "application/json",
            // },
          }
        )
          .then((resp) => {
            console.log(resp);
            if (!resp.ok) {
              throw new Error("Error while verifying email");
            }
            return resp.json(); // Parse JSON response
          })
          .then((data) => {
            console.log(" data after me verify route", data);
            if (data) {
              console.log("tarun inside ");
              setValidUrl(true);
            }
          })
          .catch((error) => {
            console.error("Error verifying email", error);
            // setValidUrl(false);
          });
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, []);

  return (
    <div>
      {validUrl ? (
        <div className="">
          <img
            src="/success.png"
            alt="success_img"
            // className={styles.success_img}
          />
          <h1>Email verified successfully</h1>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </div>
  );
};

export default EmailVerify;
