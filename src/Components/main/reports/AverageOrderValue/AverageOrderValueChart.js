import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const AverageOrderValueChart = ({ labels, orders }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        // label: "Average Orders Value",
        data: orders,
        backgroundColor: orders.map((item) => getRandomColor()),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <>
      <div className="header">
        <h1 className="title" style={{ textAlign: "center" }}>
          Average Order Value
        </h1>
      </div>
      <Bar data={data} options={options} height="90%" />
    </>
  );
};

export default AverageOrderValueChart;
