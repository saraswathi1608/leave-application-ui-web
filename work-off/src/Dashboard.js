import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const { total, casual, earned, optional, lastYearBalance, compOff } = data;

      const chartValues = [
        casual,
        earned,
        compOff,
        total,
        optional,
        lastYearBalance,
      ];

      const chartData = {
        labels: ['Casual', 'Earned', 'Comp Off', 'Total', 'Optional', 'Last Year Balance'],
        datasets: [
          {
            label: 'Pie Chart',
            data: chartValues, // Use data from props
            backgroundColor: [
              'rgba(255, 105, 180, 1)',  // Medium pink
              'rgba(100, 149, 237, 1)',  // Medium blue
              'rgba(255, 215, 0, 1)',    // Medium yellow
              'rgba(102, 205, 170, 1)',  // Medium teal
              'rgba(140, 87, 255, 1)',   // Medium purple
              'rgba(255, 165, 0, 1)',    // Medium orange
            ],                             
            borderColor: [
              'rgba(0, 0, 0, 1)',    // Black
              'rgba(0, 0, 0, 1)',    // Black
              'rgba(0, 0, 0, 1)',    // Black
              'rgba(0, 0, 0, 1)',    // Black
              'rgba(0, 0, 0, 1)',    // Black
              'rgba(0, 0, 0, 1)',    // Black
            ],
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartData);
    }, 500); // Delay to simulate loading

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, [data]);

  const options = {
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 2000, // Duration of the animation
    },
    maintainAspectRatio: false, // Ensure the chart is circular
    responsive: true,
  };

  const getLegendItems = () => {
    if (!chartData) return null;
    const { labels } = chartData;
    const colors = chartData.datasets[0].backgroundColor;
    return labels.map((label, index) => (
      <div className="legend-item" key={index}>
        <div className="legend-color" style={{ backgroundColor: colors[index] }}></div>
        <span className="legend-label">{label}</span>
      </div>
    ));
  };

  return (
    <div>
      <h2 className="pie-chart-title">Dashboard</h2>
      <div className="chart-wrapper">
        <div className="pie-chart">
          {chartData ? <Pie data={chartData} options={options} /> : <div className="loading">Loading...</div>}
        </div>
        <div className="legend">
          {getLegendItems()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
