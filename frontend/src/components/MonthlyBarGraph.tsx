import React, { useEffect, useState } from "react";
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
// import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const MonthlyBarGraph: React.FC<MonthlyBarGraphProps> = ({ monthlyData }) => {
  monthlyData.sort();
  const isMobile = useIsMobile();

  console.log(monthlyData);
  console.log(isMobile);
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Variance ( Target Vs Actual )",
        color: isMobile ? "black" : "white",
        padding: {
          top: 10,
        },
        font: {
          // size: window.innerWidth < 640 ? 12 : 16, // Smaller font for mobile screens
        },
      },
      legend: {
        labels: {
          color: isMobile ? "black" : "white",
          font: {
            // size: window.innerWidth < 640 ? 10 : 12, // Smaller font for mobile
          },
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
    responsive: true,
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

  const data = {
    labels: monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Income Variance",
        backgroundColor: "rgba(75, 192, 192)",
        data: monthlyData.map((data: any) => data.incomeVariance),
        borderRadius: 20, // Adding border radius
        borderSkipped: false,
      },

      {
        label: "Expense Variance",
        backgroundColor: "rgba(255, 99, 132)",
        data: monthlyData.map((data: any) => data.expenseVariance),
        borderRadius: 20, // Adding border radius
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center bg-[#eaeaea] lg:bg-[#111f36] rounded-3xl p-3 h-full">
      {/* <div className="w-full h-[50vh] sm:h-[50vh] md:h-[30vh] lg:h-[40vh] "> */}
      <div className="w-full h-full">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default MonthlyBarGraph;
