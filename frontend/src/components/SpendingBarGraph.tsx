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

const IncomeGraph = ({ spendingData }) => {
  //   console.log(spendingData);
  // Format the data for the Pie chart
  const formattedData = spendingData.slice(0, 4) || [];
  const isMobile = useIsMobile();
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
        color: isMobile ? "black" : "white",
        margin: {},
        padding: {},
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

export default IncomeGraph;
