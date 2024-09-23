import React from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Required for pie charts
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useIsMobile } from "./MonthlyBarGraph";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const IncomeVsExpenseGraph = ({ income, expense }) => {
  console.log(income, expense);
  const isMobile = useIsMobile();
  // Format the data for the Pie chart
  //   const formattedData = spendingData.slice(0, 4);
  //   //     .map((key) => ({
  //   //       category: key,
  //   //       amount: spendingData[key],
  //   //     }));

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Spending",
        data: [income, expense],
        backgroundColor: ["#ffa540", "#ff6384"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        color: isMobile ? "black" : "white",
        text: "Income Vs Expenses",
        margin: {
          //   top: 30,
        },
        padding: {
          //   top: 10,
          // bottom: 50, // Adjust the top padding for the title
        },
      },
      legend: {
        labels: {
          color: isMobile ? "black" : "white",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: $${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-[#eaeaea] lg:bg-[#111f36] rounded-3xl p-3 h-full">
      <Pie data={data} options={options} />
    </div>
  );
};

export default IncomeVsExpenseGraph;
