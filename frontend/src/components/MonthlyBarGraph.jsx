// MonthlyBarGraph.js
import React from "react";
import { Bar } from "react-chartjs-2";
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
        borderWidth: 5,
        borderColor: "white", // Border color for Savings dataset
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
    elements: {},
  };

  return (
    <div style={{ padding: 10, minHeight: 400 }}>
      {/* <Card> */}
      <Bar data={data} options={options} />
      {/* </Card> */}
    </div>
  );
};

export default MonthlyBarGraph;
