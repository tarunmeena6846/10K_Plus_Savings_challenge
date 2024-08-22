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
        padding: {
          top: 10,
          // bottom: 50, // Adjust the top padding for the title
        },
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

  const data: any = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Target Saving",
        backgroundColor: "#76d6f3",
        // borderColor: "white",
        data: monthlyData.map((data: any) => data.target),
        // borderRadius: 10,
      },
      {
        label: "Actual Saving",
        backgroundColor: "#f377e7",
        // borderColor: "white",
        data: monthlyData.map((data: any) => data.actual),
      },
      {
        label: "Current Saving",
        backgroundColor: "green",
        // borderColor: "white",
        data: monthlyData.map((data: any) => data.current),
        // borderRadius: 10,
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl p-3">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthlyBarGraph;
