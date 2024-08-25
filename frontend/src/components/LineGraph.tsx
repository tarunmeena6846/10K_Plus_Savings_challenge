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

  // Chart data preparation
  const labels = dailyData.map((data) => data.date.split("-").pop()); // Extract day from date
  const incomeData = dailyData.map((data) => data.income);
  const expenseData = dailyData.map((data) => data.expense);

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
        text: "Income and Expenses by Day",
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
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        stacked: false,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="rounded-3xl p-2 bg-[#111f36] h-full w-full ">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthwiseDataGraph;
