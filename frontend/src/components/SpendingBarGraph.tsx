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

const IncomeGraph = ({ spendingData }) => {
  //   console.log(spendingData);
  // Format the data for the Pie chart
  const formattedData = spendingData.slice(0, 4) || [];

  const data = {
    labels: formattedData.map((item) => item.category),
    datasets: [
      {
        label: "Spending",
        data: formattedData.map((item) => item.amount),
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

        text: "Top Income Sources",
        margin: {},
        padding: {},
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
    <div className="bg-white h-full w-full p-4 flex items-center">
      <Pie data={data} options={options} />
    </div>
  );
};

export default IncomeGraph;
