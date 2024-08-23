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
import { MonthlyDataItem } from "./Dashboard";
interface MonthlyBarGraphProps {
  monthlyData: MonthlyDataItem[];
}
ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarGraph: React.FC<MonthlyBarGraphProps> = ({ monthlyData }) => {
  monthlyData.sort();
  console.log("monthlyData at graph", monthlyData);
  // if (monthlyData.length <= 0) return;
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Projected Savings Vs Actual Savings Vs Current Savings",
        color: "white",
        padding: {
          top: 10,
        },
      },
      legend: {
        labels: {
          color: "white",
        },
      },
      backgroundColor: "white",
    },
    responsive: true,
    scales: {
      // color: "white",
      x: {
        stacked: false, // Disable stacking for grouped bars
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid lines color
        },
        ticks: {
          color: "white", // X-axis labels color
        },
      },
      y: {
        stacked: false,
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Grid lines color
        },
        ticks: {
          color: "white", // X-axis labels color
        },
      },
    },
  };

  const data: any = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Target Saving",
        backgroundColor: "#51d9a8",
        // borderColor: "white",
        data: monthlyData.map((data: any) => data.target),
        // color: "white",
        // borderRadius: 10,
      },
      {
        label: "Actual Saving",
        backgroundColor: "#96c9dd",
        // borderColor: "white",
        data: monthlyData.map((data: any) => data.actual),
      },
      {
        label: "Current Saving",
        backgroundColor: "#ffa540",
        // borderColor: "white",
        data: monthlyData.map((data: any) => data.current),
        // borderRadius: 10,
      },
    ],
  };

  return (
    <div className=" rounded-3xl bg-[#111f36] p-3">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthlyBarGraph;
