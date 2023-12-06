// MonthlyBarGraph.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { Card, Typography } from "@mui/material";
const MonthlyBarGraph = ({ monthlyData }) => {
  console.log(monthlyData);
  // Extract data for the chart
  const months = monthlyData.map((data) => data.month);
  const incomes = monthlyData.map((data) => data.totalIncome);
  const expenses = monthlyData.map((data) => data.totalExpenses);
  console.log(months, incomes, expenses);
  const data = {
    labels: months,
    datasets: [
      {
        label: "Income",
        backgroundColor: "rgb(255, 99, 132)",
        // borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        // hoverBackgroundColor: "rgb(75,192,192)",
        // hoverBorderColor: "rgba(75,192,192,1)",
        data: incomes,
      },
      {
        label: "Expenses",
        backgroundColor: "rgb(54, 162, 235)",
        // borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        // hoverBackgroundColor: "rgb(255,99,132)",
        // hoverBorderColor: "rgba(255,99,132,1)",
        data: expenses,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category", // Make sure it's 'category' for categorical data
        stacked: true,
      },
      y: { stacked: true },
    },
  };

  return (
    <div style={{ padding: 10 }}>
      <Card>
        <Typography variant="h4">Monthwise Income and Expenses</Typography>
        <Bar data={data} options={options} />
      </Card>
    </div>
  );
};

export default MonthlyBarGraph;
