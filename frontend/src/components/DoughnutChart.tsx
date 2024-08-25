import React from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = "black";
Chart.defaults.plugins.legend.title.display = true;

function DoughnutData({
  annualTargetSavings,
  annualCurrentSavings,
  annualActualSavings,
}) {
  console.log(annualActualSavings, annualTargetSavings);
  const actualPercentage = (annualActualSavings / annualTargetSavings) * 100;
  const currentPercentage = (annualCurrentSavings / annualTargetSavings) * 100;

  //TODO make the border lines overlap
  const data = {
    labels: ["Actual Savings", "Current Savings", "Remaining Target"],
    color: "white",
    datasets: [
      {
        data: [
          annualTargetSavings,
          annualCurrentSavings,
          //   100 - actualPercentage - currentPercentage,
          annualActualSavings - annualCurrentSavings,
        ],
        backgroundColor: ["#96c9dd", "#ffa540", "#51d9a8"],
        // hoverBackgroundColor: ["#45A049", "#FFBC43", "#FF4365"],
        borderWidth: 0, // Removes borders
        borderRadius: 10,
        // lineJoin: 10,
        // borderAlign: "inner", // Aligns the border to overlap the segments
      },
    ],
  };

  const options = {
    cutout: "70%", // Creates the donut hole effect
    plugins: {
      title: {
        display: true,
        color: "white",
        text: "Savings Progress: Target vs. Actual",
        padding: {
          top: 10,
          // bottom: 50, // Adjust the top padding for the title
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
          color: "white", // Label text color
          //   bord
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-[#111f36] rounded-3xl py-3">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default DoughnutData;
