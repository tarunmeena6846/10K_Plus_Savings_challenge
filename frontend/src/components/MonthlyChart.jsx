// MonthlyChart.js
import React, { useEffect, useRef } from "react";
import { Chart, DoughnutController, ArcElement, Legend, Title } from "chart.js";
import { months } from "./MonthlyIncome";

const MonthlyChart = ({ monthlyIncome, monthlyExpenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      // Destroy the previous chart instance
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Register Chart.js components
      Chart.register(DoughnutController, ArcElement, Legend, Title);

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [`Income`, `Expenses`],
          datasets: [
            {
              label: "Monthly Income and Expenses",
              data: [monthlyIncome, monthlyExpenses],
              backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
              hoverOffset: 4,
            },
          ],
        },
        plugins: [
          DoughnutController,
          ArcElement,
          Legend,
          Title,
          {
            beforeDraw: (chart) => {
              const width = chart.width;
              const height = chart.height;
              const ctx = chart.ctx;

              const total = monthlyIncome + monthlyExpenses;
              const savingPercentage = Math.round(
                ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
              );

              ctx.restore();
              const fontSize = height / 500;
              const font = `bold ${fontSize}em sans-serif`; // Make the text bold
              ctx.font = font;
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#000";
              const monthAbbreviation = new Date().toLocaleString("en-US", {
                month: "short",
              });
              const text = `${savingPercentage}% Savings in ${monthAbbreviation}`;

              const textX = width / 2 - ctx.measureText(text).width / 2;
              const textY = height / 2;

              ctx.fillText(text, textX, textY);
              ctx.save();
            },
          },
        ],
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        // Destroy the chart instance when the component is unmounted
        chartInstance.current.destroy();
      }
    };
  }, [monthlyIncome, monthlyExpenses]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <canvas ref={chartRef} width="500" height="200"></canvas>
    </div>
  );
};

export default MonthlyChart;
