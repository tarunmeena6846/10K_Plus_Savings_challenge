import React from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useIsMobile } from "./MonthlyBarGraph";

Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = "black";
Chart.defaults.plugins.legend.title.display = true;

function DoughnutData({
  annualTargetSavings,
  annualCurrentSavings,
  annualActualSavings,
}) {
  const actualPercentage = (annualActualSavings / annualTargetSavings) * 100;
  const currentPercentage = (annualCurrentSavings / annualTargetSavings) * 100;
  const isMobile = useIsMobile();

  const data = {
    labels: ["Actual Savings", "Current Savings", "Remaining Target"],
    datasets: [
      {
        data: [
          annualTargetSavings,
          annualCurrentSavings,
          annualActualSavings - annualCurrentSavings,
        ],
        backgroundColor: ["#96c9dd", "#ffa540", "#51d9a8"],
        borderWidth: 0, // Removes borders
        borderRadius: 10,
      },
    ],
  };

  const options = {
    cutout: "70%", // Creates the donut hole effect
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to adjust to its container's size
    plugins: {
      title: {
        display: true,
        color: isMobile ? "black" : "white",
        text: "Savings Progress: Target vs. Actual",
        padding: {
          top: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + "$" + tooltipItem.raw;
          },
        },
      },
      legend: {
        labels: {
          color: isMobile ? "black" : "white",
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-[#eaeaea] lg:bg-[#111f36] rounded-3xl p-3">
      <div className="w-full h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[30vh] ">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default DoughnutData;
