"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ResultChart = ({ responses, calculateTotalScore, maxScore }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const data = {
        labels: [
          "ไม่เห็นด้วยอย่างยิ่ง",
          "ไม่ค่อยเห็นด้วย",
          "ไม่แน่ใจ",
          "ค่อนข้างเห็นด้วย",
          "เห็นด้วยอย่างยิ่ง",
        ],
        datasets: [
          {
            label: "คะแนนของคุณ",
            data: Object.values(responses),
            borderWidth: 2,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(54, 162, 235)",
          },
        ],
      };

      const config = {
        type: "radar",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { display: false },
              suggestedMin: 0,
              suggestedMax: maxScore + 5,
              ticks: { stepSize: 10 },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      };

      chartInstance.current = new Chart(ctx, config);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [responses, maxScore, calculateTotalScore]);

  return (
    <div style={{ width: "100%", height: "450px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ResultChart;
