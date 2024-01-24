import React, { useState } from "react";
import { Grid, Typography, Button, Box, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import style from "./style.css";
import { layouts } from "chart.js";
const LandingPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div style={{ textAlign: "center", background: "white" }}>
        {/* <header style={{ marginBottom: "16px", background: "white" }}>
        <span
          style={{
            textShadow: "2px 2px 2px black", // Border color for "Here"
            color: "black",
            // Optional: Add padding for spacing
          }}
        >
          <Typography variant="h1">WealthX10K</Typography>
        </span>
        <Typography variant="subtitle1">
          Navigate Your Financial Journey, Multiply Your Wealth, Embrace
          WealthX10K
        </Typography>
      </header> */}

        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            // alignItems: "top",
            // marginTop: "1px",
          }}
          spacing={4}
        >
          <Grid item xs={12} md={6}>
            <div
              style={{
                maxWidth: "600px",
                marginRight: "16px",
                marginTop: "100px",
              }}
            >
              <Typography
                variant="h2"
                style={{
                  // color: "black",
                  fontFamily: "serif",
                  // fontSize: "46px",
                  textShadow: "1px 1px 1px grey",
                  // marginTop: "20px", // Adjust the value to add the desired space

                  // Optional: Add padding for spacing
                }}
              >
                Path to Manifesting Your Ideal{" "}
                <span
                  style={{
                    color: "black",
                    textShadow: "1px 1px 1px black", // Border color for "Here"
                  }}
                >
                  Life.
                </span>
              </Typography>
              <Typography
                variant="h6"
                style={{
                  fontFamily: "serif",
                  // fontSize: "20px",
                  // paddingTop: "50px",
                }}
              >
                Join the community of people just like you who are committed to
                taking control of their finances and setting and achieving their
                annual savings goals year-after-year.
              </Typography>
              {/* </br> */}
              <motion.button
                // variant="contained"
                // color="primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ marginTop: "8px" }}
                onClick={() => {
                  // navigate("/register");
                }}
              >
                Get Started
              </motion.button>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div style={{ maxWidth: "100%" }}>
              <img
                src="https://i.ibb.co/4dL1ZSx/Screenshot-2023-12-05-at-6-14-34-PM.png"
                alt="Financial Freedom"
                style={{ width: "100%" }}
              />
            </div>
          </Grid>
        </Grid>
      </div>
      {/* <div style={{ textAlign: "center" }}> */}
      {/* <div
        style={{
          background: "#404040",
          minHeight: "100vh",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          // alignItems: "center",
          // marginLeft: "150px",
          width: "70vw",
          margin: " auto", // Center the div horizontally
          borderRadius: "20px",
          // zIndex: 1,
          // alignItems: "center",
          // marginLeft: "140px",
          // marginRight: "140px",
        }}
      >
        <Typography variant="h3" style={{ color: "white", paddingTop: "50px" }}>
          Discover your savings potential
        </Typography>
        <Typography
          // variant="body1"
          style={{
            // paddingTop: "5px",
            color: "white",
            fontSize: "20px",
            paddingTop: "10px",
          }}
        >
          Based on your current spending, let’s see how much you will save
          before end-of-year.
        </Typography>
        <motion.div
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="projected-input"
          style={{
            borderRadius: "20px",
            background: "white",
            width: "50%",
            margin: " auto",
            // minHeight: "100px",
          }}
        >{isOpen && (
          <motion.div>
          <motion.h4 layout="position">Input Income and Expenses</motion.h4>
          </motion.div>
        ):(
            <motion.div style={{ width: "70%", margin: " auto" }}>
              <motion.input></motion.input>
              <motion.input></motion.input>
              <motion.button>Continue</motion.button>
            </motion.div>
          )}
        </motion.div>
      </div> */}
      <div
        style={{
          // background: "#404040",
          background: "linear-gradient(180deg,#232426 70%,transparent)",
          minHeight: "100vh",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "70vw",
          margin: "auto", // Center the div horizontally
          borderRadius: "20px",
        }}
      >
        <Typography variant="h3" style={{ color: "white", paddingTop: "50px" }}>
          Discover your savings potential
        </Typography>
        <Typography
          style={{
            color: "white",
            fontSize: "20px",
            paddingTop: "10px",
          }}
        >
          Based on your current spending, let’s see how much you will save
          before end-of-year.
        </Typography>
        <motion.div
          className="projected-input"
          transition={{ layout: { duration: 1, type: "spring" } }}
          layout
          style={{
            borderRadius: "20px",
            background: "white",
            width: "50%",
            margin: "auto",
            cursor: "pointer",
            boxShadow: "0px 10px 30px black",
          }}
          // onClick={() => {
          //   setIsOpen(!isOpen);
          // }}
        >
          {/* {!isOpen ? ( */}
          <motion.h4
            layout="position"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            Input Income and Expenses
          </motion.h4>
          {/* ) : ( */}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                width: "70%",
                margin: "auto",
                // paddingTop: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <motion.input />
              <br />
              <motion.input />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Continue
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                style={{
                  marginBottom: "10px",
                }}
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* </div> */}
      <div>
        <Card>plaa for you</Card>
      </div>
    </div>
  );
};

export default LandingPage;
