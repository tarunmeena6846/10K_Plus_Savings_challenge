// MonthlyBarGraph.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { Card, Typography } from "@mui/material";
const MonthlyBarGraph = ({ monthlyData }) => {
  console.log(monthlyData);
  // Extract data for the chart
  const months = monthlyData.map((data) => data.month);
  const incomes = monthlyData.map((data) => data.income - data.expenses);
  const expenses = monthlyData.map((data) => data.expenses);
  console.log(months, incomes, expenses);
  const data = {
    labels: months,
    datasets: [
      {
        label: "Savings",
        backgroundColor: "#76d6f3",
        // borderColor: "rgba(75,192,192,1)",
        borderWidth: 5,
        borderColor: "white", // Border color for Savings dataset

        // hoverBackgroundColor: "rgb(75,192,192)",
        // hoverBorderColor: "rgba(75,192,192,1)",
        data: incomes,
        borderRadius: 20, // Add borderRadius for Savings dataset
      },
      {
        label: "Expenses",
        backgroundColor: "#f377e7",
        // borderColor: "rgba(255,99,132,1)",
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 20, // Add borderRadius for Savings dataset

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
    plugins: {
      legend: {
        display: true,
      },
    },
    elements: {
      bar: {
        // borderRadius: 10px 30px 20px 40px/20px 40px 30px 10px;
        // borderRadius: {
        //   topLeft: 10,
        //   topRight: 10,
        //   bottomLeft: 10,
        //   bottomRight: 10,
        // },
      },
    },
  };

  return (
    // <div style={{ padding: 10 }}>
    // <Card>
    <>
      <Typography style={{ margin: "20px" }} variant="h4">
        Monthwise Income and Expenses
      </Typography>
      <Bar data={data} options={options} />
    </>
    // </Card>
    // </div>
  );
};

export default MonthlyBarGraph;
