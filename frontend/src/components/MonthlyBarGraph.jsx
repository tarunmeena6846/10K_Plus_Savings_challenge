// MonthlyBarGraph.js
import React from "react";
import {
  Chart as ChartJS,
  BarController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { months } from "./MonthlyIncome";

ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarGraph = ({ monthlyData }) => {
  console.log("monthlyData at graph", monthlyData);
  // if (monthlyData.length <= 0) return;
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Projected Savings Vs Actual Savings",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: false, // Disable stacking for grouped bars
      },
      y: {
        stacked: false,
      },
    },
  };

  const data = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Projected Saving",
        backgroundColor: "#76d6f3",
        // borderColor: "white",
        data: monthlyData.map((data) => data.projectedSaving),
        // borderRadius: 10,
      },
      {
        label: "Actual Saving",
        backgroundColor: "#f377e7",
        // borderColor: "white",
        data: monthlyData.map((data) => data.actualSavings),
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default MonthlyBarGraph;
