import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useIsMobile } from "./MonthlyBarGraph";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const MonthwiseDataGraph = ({ expenseAndIncome }) => {
  // Process data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  console.log(expenseAndIncome);
  // Initialize empty data structure
  const dailyData = Array.from({ length: 31 }, (_, i) => ({
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      i + 1
    ).padStart(2, "0")}`,
    income: 0,
    expense: 0,
  }));

  // Fill daily data with values from expenseAndIncome
  expenseAndIncome.forEach((item) => {
    const date = new Date(item.date).getDate() - 1; // Zero-based index
    if (item.type === "Income") {
      dailyData[date].income += item.amount;
    } else if (item.type === "Expense") {
      dailyData[date].expense += item.amount;
    }
  });

  console.log(dailyData[0].date.substring(5));
  // Chart data preparation
  const labels = dailyData.map((data) => data.date.substring(5)); // Extract day from date
  const incomeData = dailyData.map((data) => data.income);
  const expenseData = dailyData.map((data) => data.expense);
  const isMobile = useIsMobile();
  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        backgroundColor: "#51d9a8",
        data: incomeData,
      },
      {
        label: "Expense",
        backgroundColor: "#96c9dd",
        data: expenseData,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: `Income and Expenses by Day (${currentYear})`,
        color: isMobile ? "black" : "white",
        padding: {
          top: 10,
        },
      },
      legend: {
        labels: {
          color: isMobile ? "black" : "white",
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
            // size: window.innerWidth < 640 ? 10 : 12, // Smaller font for y-axis on mobile
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
      {/* <div className="w-full h-full"> */}
      <Bar options={options} data={data} />
      {/* </div> */}
    </div>
  );
};

export default MonthwiseDataGraph;
