import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  monthlyExpenseState,
  monthlyIncomeState,
  yearlyExpenseState,
  yearlyIncomeState,
} from "./store/atoms/total";
import MonthlyChart from "./MonthlyChart";
import Login from "./Login";
import MonthlyBarGraph from "./MonthlyBarGraph";
function Dashboard() {
  const navigate = useNavigate();

  // Assuming these are your Recoil state variables
  const [monthlyIncome, setMonthlyIncome] = useRecoilState(monthlyIncomeState);
  const [monthlyExpense, setMonthlyExpense] =
    useRecoilState(monthlyExpenseState);
  const [yearlyIncome, setYearlyIncome] = useRecoilState(yearlyIncomeState);
  const [yearlyExpense, setYearlyExpense] = useRecoilState(yearlyExpenseState);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Fetch monthly data from the backend
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from your authentication process
        const response = await fetch(
          "http://localhost:3000/admin/monthly-data",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Monthly Data:", data.data);
          setMonthlyData(data.data);
          console.log(monthlyData);
          // Process the data as needed in your frontend
        } else {
          console.error("Failed to fetch monthly data");
        }
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    fetchData();
  }, []); // Run this effect only once when the component mounts

  return (
    <div
      style={{
        backgroundColor: "#F0F0F0",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Your Financial Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Keep track of your monthly and yearly financial activities. View your
        income, expenses, and savings at a glance.
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {/* Monthly Chart */}
        <Grid item xs={12} sm={12} md={4} lg={6}>
          <Card style={{ background: "", height: "51vh" }}>
            <MonthlyChart
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpense}
            />
          </Card>
        </Grid>

        {/* Right Cards */}
        <Grid
          item
          container
          xs={12}
          md={4}
          lg={6}
          direction="column"
          spacing={2}
        >
          <Grid item md={4}>
            <Card
              onClick={() => navigate("/monthlyIncome")}
              style={{
                height: "15vh",
                cursor: "pointer",
                // background: "rgb(255, 99, 132)",
                background: "#58D68D",
                color: "white",
              }}
            >
              <Typography variant="h6">Monthly Income</Typography>
              <Typography variant="h4">${monthlyIncome.toFixed(2)}</Typography>
            </Card>
          </Grid>
          <Grid item md={4}>
            <Card
              onClick={() => navigate("/expenses")}
              style={{
                // height: "100px",
                height: "15vh",
                cursor: "pointer",
                // background: "rgb(54, 162, 235)",
                background: "#fba447",
                color: "white",
              }}
            >
              <Typography variant="h6">Monthly Expenses</Typography>
              <Typography variant="h4">${monthlyExpense.toFixed(2)}</Typography>
            </Card>
          </Grid>
          <Grid item md={4}>
            <Card
              style={{ height: "15vh", background: "#f6600a", color: "white" }}
            >
              <Typography variant="h6">Monthly Saving</Typography>
              <Typography variant="h4">
                ${monthlyIncome - monthlyExpense.toFixed(2)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Cards */}
        <Grid
          item
          container
          // xs={12}
          // md={12}
          // sm={4}
          spacing={2}
          // lg={6}
          justifyContent="space-between"
        >
          <Grid item md={3} sm={12} xs={12}>
            <Card
              style={{ height: "100px", background: "#7D3C98", color: "white" }}
            >
              <Typography variant="h6">Yearly Income</Typography>
              <Typography variant="h4">${yearlyIncome.toFixed(2)}</Typography>
            </Card>
          </Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Card
              style={{ height: "100px", background: "#3498DB", color: "white" }}
            >
              <Typography variant="h6">Yearly Expenses</Typography>
              <Typography variant="h4">${yearlyExpense.toFixed(2)}</Typography>
            </Card>
          </Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Card
              style={{ height: "100px", background: "#D35400", color: "white" }}
            >
              <Typography variant="h6">Actual Yearly Savings</Typography>
              <Typography variant="h4">
                ${yearlyIncome - yearlyExpense.toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Card
              style={{ height: "100px", background: "#E74C3C", color: "white" }}
            >
              <Typography variant="h6">Projected Yearly Savings</Typography>
              <Typography variant="h4">
                ${(monthlyIncome - monthlyExpense.toFixed(2)) * 12}
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Grid item md={10} xs={12} lg={10} sm={10}>
          <MonthlyBarGraph monthlyData={monthlyData} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
