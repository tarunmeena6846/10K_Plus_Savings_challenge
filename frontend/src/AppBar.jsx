import React, { useEffect } from "react";
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
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useRecoilState(yearlyIncomeState);
  const [yearlyExpense, setYearlyExpense] = useRecoilState(yearlyExpenseState);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetch("http://localhost:3000/admin/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedToken,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.username) {
            setMonthlyIncome(data.monthlyData.totalIncome);
            setMonthlyExpense(data.monthlyData.totalExpenses);
            setYearlyIncome(data.yearlyData.totalYearlyIncome);
            setYearlyExpense(data.yearlyData.totalYearlyExpenses);
            setCurrentUserState({ userEmail: data.username, isLoading: false });
          } else {
            setCurrentUserState({ userEmail: null, isLoading: false });
          }
        })
        .catch((error) => {
          console.error("Error while logging in", error);
          setCurrentUserState({ userEmail: null, isLoading: false });
        });
    } else {
      setCurrentUserState({ userEmail: null, isLoading: false });
    }
  }, [setCurrentUserState]);
  console.log("tarun at appbar", currentUserState.userEmail);
  return (
    <AppBar position="static" elevation={0} style={{ background: "#f0f0f0" }}>
      <Toolbar>
        {currentUserState.userEmail ? (
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
          >
            WealthX10K
          </Typography>
        ) : (
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexFlow: 1, textDecoration: "none", color: "black" }}
          >
            WealthX10K
          </Typography>
        )}
        {currentUserState.isLoading ? (
          <CircularProgress color="inherit" />
        ) : currentUserState.userEmail ? (
          <div style={{ marginLeft: "auto" }}>
            <Typography style={{ color: "black" }}>
              {currentUserState.userEmail}
              <Button
                color="inherit"
                style={{ textTransform: "none" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  setCurrentUserState({ userEmail: null });
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </Typography>
          </div>
        ) : (
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
