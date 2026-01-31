import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./ResponseTimeChart.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const ResponseTimeChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchResponseTrend();
  }, []);

  const fetchResponseTrend = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/logs/response-trend"
      );
      setChartData(res.data.data);
    } catch (err) {
      console.error("Error fetching response trend", err);
    }
  };

  // X-axis labels (hours)
  const labels = chartData.map(item => item.hour);

  // Y-axis values (avg response time)
  const values = chartData.map(item => item.avgResponseTime);

  const data = {
    labels,
    datasets: [
      {
        label: "Avg Response Time (ms)",
        data: values,
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Milliseconds"
        }
      },
      x: {
        title: {
          display: true,
          text: "Time (Last 24 Hours)"
        }
      }
    }
  };

 return (
  <div className="response-chart-card">
    <div className="response-chart-header">
      <div>
        <div className="response-chart-title">
          API Response Time Trend
        </div>
        <div className="response-chart-subtitle">
          Average response time per hour (last 24 hrs)
        </div>
      </div>
    </div>

    <div className="chart-wrapper">
      <Line data={data} options={options} />
    </div>
  </div>
);

};

export default ResponseTimeChart;
