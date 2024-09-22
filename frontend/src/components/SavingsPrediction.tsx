import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useIsMobile } from "./MonthlyBarGraph";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SavingsTrendPrediction = ({ expenseAndIncome }) => {
  const isMobile = useIsMobile();

  console.log(expenseAndIncome);
  const data = {
    labels: expenseAndIncome.map((month) => month.month),
    datasets: [
      {
        label: "Actual Savings",
        data: expenseAndIncome.map((data) => data.actual),
        borderColor: "#96c9dd",
        backgroundColor: "#96c9dd",
        borderWidth: 2,
        tension: 0.4, // Line smoothness
      },
      {
        label: "Target Savings",
        data: expenseAndIncome.map((data) => data.target),
        borderColor: "#ffa540",
        backgroundColor: "#ffa540",
        borderWidth: 2,
        tension: 0.4, // Line smoothness
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isMobile ? "black" : "white",
          font: {
            // size: window.innerWidth < 640 ? 10 : 12, // Smaller font for mobile
          },
        },
      },
      title: {
        display: true,
        text: "Target Vs Actual Savings",
        color: isMobile ? "black" : "white",
        padding: {
          top: 10,
        },
        font: {
          // size: window.innerWidth < 640 ? 12 : 16, // Smaller font for mobile screens
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + "$" + tooltipItem.raw;
          },
        },
      },
    },
    maintainAspectRatio: false, // Allow the chart to fill the container
    scales: {
      x: {
        stacked: false,
        grid: {
          color: isMobile ? "black" : "rgba(255, 255, 255, 0.2)", // Grid lines color
        },
        ticks: {
          color: isMobile ? "black" : "white",
          font: {
            // size: window.innerWidth < 640 ? 10 : 12, // Smaller font for x-axis on mobile
          },
        },
      },
      y: {
        stacked: false,
        grid: {
          color: isMobile ? "black" : "rgba(255, 255, 255, 0.2)", // Grid lines color
        },
        ticks: {
          color: isMobile ? "black" : "white",
          font: {
            // size: window.innerWidth < 640 ? 10 : 12, // Smaller font for y-axis on mobile
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-[#eaeaea] lg:bg-[#111f36] rounded-3xl p-3 h-full">
      {/* <div className="w-full h-[50vh] sm:h-[50vh] md:h-[30vh] lg:h-[40vh] "> */}
      <div className="w-full h-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SavingsTrendPrediction;
