import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { userState } from "./components/store/atoms/user";
import { useRecoilState } from "recoil";
import {
  monthlyExpenseState,
  monthlyIncomeState,
  yearlyExpenseState,
  yearlyIncomeState,
} from "./components/store/atoms/total";
function Appbar() {
  const navigate = useNavigate();
  // const [userEmail, setUserEmail] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useRecoilState(yearlyIncomeState);
  const [yearlyExpense, setYearlyExpense] = useRecoilState(yearlyExpenseState);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Make an API call to check the user's login status
      fetch("http://localhost:3000/admin/me", {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          authorization: "Bearer " + storedToken,
        },
      })
        .then((resp) => {
          if (!resp.ok) {
            setCurrentUserState({ userEmail: null, isLoading: false });
            throw new Error("Network response is not ok");
          }
          resp.json().then((data) => {
            if (data && data.username) {
              console.log("tarun data from the /me route ", data);
              setMonthlyIncome(data.monthlyData.totalIncome);
              setMonthlyExpense(data.monthlyData.totalExpenses);
              setYearlyIncome(data.yearlyData.totalYearlyIncome);
              setYearlyExpense(data.yearlyData.totalYearlyExpenses);

              console.log(
                "tarun at appbar after me route ",
                data.monthlyData.totalExpenses,
                data.monthlyData.totalIncome,
                data.yearlyData.totalYearlyExpenses
              );
              console.log(monthlyExpense, monthlyIncome);
              setCurrentUserState({
                userEmail: data.username,
                isLoading: false,
              });
            } else {
              setCurrentUserState({ userEmail: null, isLoading: false });
            }
          });
        })
        .catch((error) => {
          console.error("Error while logging in", error);
          setCurrentUserState({ userEmail: null, isLoading: false });
        });
    } else {
      setCurrentUserState({ isLoading: false }); // Set isLoading to false once the request is complete
    }
  }, []);

  return (
    <AppBar position="static" elevation={0} style={{ background: "#f0f0f0" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
        >
          WealthX10K
        </Typography>
        {currentUserState.isLoading ? ( // Display a loading indicator while isLoading is true
          <CircularProgress color="inherit" />
        ) : currentUserState.userEmail ? (
          // If the user is logged in, render the user-specific buttons
          <div style={{ marginLeft: "auto" }}>
            <Typography style={{ color: "black" }}>
              {currentUserState.userEmail}
              <Button
                color="inherit"
                style={{ textTransform: "none" }}
                onClick={() => {
                  navigate("/");

                  localStorage.removeItem("token");
                  setCurrentUserState({ userEmail: null });
                }}
              >
                Logout
              </Button>
            </Typography>
          </div>
        ) : (
          // If the user is not logged in, render the login and register buttons
          <div style={{ marginLeft: "auto" }}>
            <Button
              style={{ color: "black", textTransform: "none" }}
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;
