import React from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Required for pie charts
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const IncomeVsExpenseGraph = ({ income, expense }) => {
  console.log(income, expense);
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
        backgroundColor: ["#51d9a8", "#ff6384", "#ff9f40", "#ffcd56"],
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
        // color: "white",
        text: "Income Vs Expenses",
        margin: {
          //   top: 30,
        },
        padding: {
          //   top: 10,
          // bottom: 50, // Adjust the top padding for the title
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
    <div className="bg-white h-full w-full p-4  items-center">
      <Pie data={data} options={options} />
    </div>
  );
};

export default IncomeVsExpenseGraph;
