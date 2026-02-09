import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const ResponseTimeChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponseTrend();
  }, []);

  const fetchResponseTrend = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo.userId;
    // console.log("Fetching response trend for userId:", userId);

    const res = await axios.get(
      "http://localhost:5000/api/logs/response-trend",
      {
        params: { userId }
      }
    );

    setChartData(res.data.data);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching response trend", err);
    setLoading(false);
  }
};


  // Process and sort data chronologically for last 24 hours
  const processChartData = () => {
    if (!chartData || chartData.length === 0) return { labels: [], values: [] };

    // Get current hour
    const now = new Date();
    const currentHour = now.getHours();

    // Create array of last 24 hours in chronological order
    // Start from 24 hours ago and go up to current hour
    const last24Hours = [];
    for (let i = 23; i >= 0; i--) {
      const hour = (currentHour - i + 24) % 24;
      last24Hours.push(hour);
    }

    // Format hour to HH:00
    const formatHour = (hour) => {
      return `${hour.toString().padStart(2, '0')}:00`;
    };

    // Map data to hours
    const dataMap = {};
    chartData.forEach(item => {
      // Extract hour from the data
      // Assuming item.hour is either a number (0-23) or a string like "14:00" or "2023-01-01 14:00"
      let hour;
      if (typeof item.hour === 'number') {
        hour = item.hour;
      } else if (typeof item.hour === 'string') {
        // Try to extract hour from string
        const match = item.hour.match(/(\d{1,2}):00/);
        if (match) {
          hour = parseInt(match[1]);
        } else {
          // If it's a datetime string, parse it
          const date = new Date(item.hour);
          if (!isNaN(date.getTime())) {
            hour = date.getHours();
          }
        }
      }
      
      if (hour !== undefined && hour >= 0 && hour <= 23) {
        dataMap[hour] = item.avgResponseTime || 0;
      }
    });

    // Create labels and values arrays maintaining chronological order
    const labels = last24Hours.map(formatHour);
    const values = last24Hours.map(hour => dataMap[hour] || null);

    return { labels, values };
  };

  const { labels, values } = processChartData();

  const data = {
    labels,
    datasets: [
      {
        label: "Avg Response Time (ms)",
        data: values,
        borderColor: "#00F0FF",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(0, 240, 255, 0.3)");
          gradient.addColorStop(1, "rgba(0, 240, 255, 0)");
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#00F0FF",
        pointBorderColor: "#0B0F19",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#FF0080",
        pointHoverBorderColor: "#0B0F19",
        spanGaps: true, // Connect points even if there are null values
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#94A3B8',
          font: {
            size: 13,
            weight: '500',
            family: "'Outfit', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          boxWidth: 8,
          boxHeight: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(21, 27, 43, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(0, 240, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: '600',
          family: "'Outfit', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Outfit', sans-serif"
        },
        callbacks: {
          title: (context) => {
            return `Time: ${context[0].label}`;
          },
          label: (context) => {
            if (context.parsed.y === null) {
              return 'No data';
            }
            return `Response Time: ${context.parsed.y.toFixed(2)} ms`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
          drawBorder: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 12,
            family: "'Outfit', sans-serif"
          },
          padding: 8,
          callback: function(value) {
            return value + ' ms';
          }
        },
        title: {
          display: true,
          text: 'Response Time',
          color: '#94A3B8',
          font: {
            size: 13,
            weight: '600',
            family: "'Outfit', sans-serif"
          },
          padding: { top: 0, bottom: 12 }
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 11,
            family: "'Outfit', sans-serif"
          },
          padding: 8,
          maxRotation: 45,
          minRotation: 0,
          autoSkip: false, // Show all labels
          callback: function(value, index) {
            // Show every 2nd hour to avoid crowding
            if (index % 2 === 0) {
              return this.getLabelForValue(value);
            }
            return '';
          }
        },
        title: {
          display: true,
          text: 'Time (Last 24 Hours)',
          color: '#94A3B8',
          font: {
            size: 13,
            weight: '600',
            family: "'Outfit', sans-serif"
          },
          padding: { top: 12, bottom: 0 }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  // Calculate stats only from non-null values
  const validValues = values.filter(v => v !== null);
  const peak = validValues.length > 0 ? Math.max(...validValues) : 0;
  const average = validValues.length > 0 
    ? validValues.reduce((a, b) => a + b, 0) / validValues.length 
    : 0;

  return (
    <>
      <style>{`
        .response-chart-card {
          background: rgba(21, 27, 43, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .response-chart-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00F0FF, #FF0080, transparent);
          opacity: 0.6;
        }

        .response-chart-card:hover {
          border-color: rgba(0, 240, 255, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .response-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .response-chart-title {
          font-size: 22px;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .response-chart-title::before {
          content: '📈';
          font-size: 24px;
        }

        .response-chart-subtitle {
          font-size: 14px;
          color: #94A3B8;
          font-weight: 400;
        }

        .chart-stats {
          display: flex;
          gap: 24px;
        }

        .stat-item {
          text-align: right;
        }

        .stat-label {
          font-size: 12px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #00F0FF;
        }

        .chart-wrapper {
          position: relative;
          height: 350px;
          background: rgba(30, 39, 56, 0.3);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(148, 163, 184, 0.08);
        }

        .chart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          color: #64748B;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(148, 163, 184, 0.2);
          border-top-color: #00F0FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 14px;
          font-weight: 500;
        }

        .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          color: #64748B;
        }

        .no-data-icon {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .no-data-text {
          font-size: 16px;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .response-chart-card {
            padding: 20px;
          }

          .response-chart-header {
            flex-direction: column;
          }

          .response-chart-title {
            font-size: 20px;
          }

          .chart-stats {
            width: 100%;
            justify-content: space-between;
          }

          .chart-wrapper {
            height: 280px;
            padding: 16px;
          }
        }
      `}</style>

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

          {!loading && validValues.length > 0 && (
            <div className="chart-stats">
              <div className="stat-item">
                <div className="stat-label">Peak</div>
                <div className="stat-value">
                  {peak.toFixed(0)} ms
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Average</div>
                <div className="stat-value">
                  {average.toFixed(0)} ms
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading chart data...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <div className="no-data-text">No data available yet</div>
          </div>
        ) : (
          <div className="chart-wrapper">
            <Line data={data} options={options} />
          </div>
        )}
      </div>
    </>
  );
};

export default ResponseTimeChart;