import React from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = "black";
// Chart.defaults.plugins.legend.position = "right";
Chart.defaults.plugins.legend.title.display = true;
// Chart.defaults.plugins.legend.title.text = "60 of 100 Done";
// Chart.defaults.plugins.legend.title.font = "Helvetica Neue";

function DoughnutData({
  annualTargetSavings,
  annualCurrentSavings,
  annualActualSavings,
}) {
  console.log(annualActualSavings, annualTargetSavings);
  const actualPercentage = (annualActualSavings / annualTargetSavings) * 100;
  const currentPercentage = (annualCurrentSavings / annualTargetSavings) * 100;

  const data = {
    labels: ["Actual Savings", "Current Savings", "Remaining Target"],
    datasets: [
      {
        data: [
          annualTargetSavings,
          annualCurrentSavings,
          //   100 - actualPercentage - currentPercentage,
          annualActualSavings - annualCurrentSavings,
        ],
        backgroundColor: ["#4CAF50", "#FFCE56", "#FF6384"],
        hoverBackgroundColor: ["#45A049", "#FFBC43", "#FF4365"],
      },
    ],
  };

  const options = {
    cutout: "70%", // Creates the donut hole effect
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + "$" + tooltipItem.raw;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl py-5">
      {/* <h3 className="text-xl font-semibold mb-4">Savings Progress</h3> */}
      <Doughnut data={data} options={options} />
      {/* <div className="absolute text-center mt-4"> */}
      {/* <h2 className="text-4xl font-bold">{actualPercentage}%</h2> */}
      {/* <p className="text-gray-600">of Target Savings</p> */}
      {/* </div> */}
    </div>
  );
}
//   const data = {
//     labels: ["Target Savings", "Actual Savings", "Current Savings"],
//     datasets: [
//       {
//         data: [annualTargetSavings, annualCurrentSavings, annualActualSavings],
//         backgroundColor: [
//           "rgb(255, 99, 132)",
//           "rgb(54, 162, 235)",
//           "rgb(255, 205, 86)",
//         ],
//         borderWidth: 2,
//         radius: "90%",
//       },
//     ],
//   };

//   return (
//     <div>
//       {/* <h2>Requests Summary Widget</h2> */}
//       <Doughnut data={data} />
//     </div>
//   );
// }

export default DoughnutData;
