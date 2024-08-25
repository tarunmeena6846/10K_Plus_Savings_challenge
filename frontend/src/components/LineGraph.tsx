import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const LineGraph = ({ spendings, income }) => {
  // Data and options for the chart
  const chartData = {
    labels: spendings.map((data) => data.category), // Array of labels (e.g., months or days)
    datasets: [
      {
        label: "My Data",
        data: spendings.map((data) => data.amount), // Array of data points
        borderColor: "rgba(75,192,192,1)", // Line color
        backgroundColor: "rgba(75,192,192,0.2)", // Background color of the line
        fill: true, // Whether to fill the area under the line
        tension: 0.1, // Curvature of the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top",
      // },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: $${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "X Axis Label",
        },
      },
      y: {
        title: {
          display: true,
          text: "Y Axis Label",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;
