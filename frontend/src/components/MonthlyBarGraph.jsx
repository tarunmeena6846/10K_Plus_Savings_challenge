// MonthlyBarGraph.js
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarGraph = ({ monthlyData }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Monthwise Savings and Expenses",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Savings",
        backgroundColor: "#76d6f3",
        borderWidth: 5,
        borderColor: "white", // Border color for Savings dataset
        data: monthlyData.map((data) => data.income - data.expenses),
        borderRadius: 20, // Add borderRadius for Savings dataset
      },
      {
        label: "Expenses",
        backgroundColor: "#f377e7",
        // borderColor: "rgba(255,99,132,1)",
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 20, // Add borderRadius for Savings dataset
        data: monthlyData.map((data) => data.expenses),
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default MonthlyBarGraph;
