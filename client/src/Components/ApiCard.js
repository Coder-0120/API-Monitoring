import { useEffect, useState } from "react";
import axios from "axios";
import ApiLogsModal from "./ApiLogsModal";

const ApiCard = ({ api, index }) => {
  const [allLogs, setallLogs] = useState([]);
  const [showLogs, setshowLogs] = useState(false);
  const [uptime, setuptime] = useState(null);
  const [avg_resp_time, setavg_resp_time] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/logs/uptime/${api._id}`);
        setuptime(response.data.uptime);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAvgRespTime = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/logs/avg_resp_time/${api._id}`);
        setavg_resp_time(response.data.avg_resp_time);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUptime();
    fetchAvgRespTime();
  }, [api._id]);

  const fetchAllLogs = async (apiId) => {
    setLoading(true);
    try {
      const allLogs = await axios.get(`http://localhost:5000/api/logs/${apiId}`);
      setallLogs(allLogs.data.Apilogs);
      setshowLogs(true);
    } catch (error) {
      alert("Failed to fetch all logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .api-card {
          background: rgba(21, 27, 43, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: cardSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: calc(${index} * 0.05s);
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .api-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00F0FF, #FF0080);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .api-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 240, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 240, 255, 0.1);
        }

        .api-card:hover::before {
          opacity: 1;
        }

        .api-card-header {
          margin-bottom: 20px;
        }

        .api-card-title {
          font-size: 20px;
          font-weight: 600;
          color: #F8FAFC;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-indicator.up {
          background: #10B981;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
        }

        .status-indicator.down {
          background: #EF4444;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.6);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .api-url {
          font-size: 13px;
          color: #64748B;
          font-family: 'JetBrains Mono', monospace;
          word-break: break-all;
          padding: 8px 12px;
          background: rgba(30, 39, 56, 0.5);
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .api-card-body {
          display: grid;
          gap: 16px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .metric-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .metric-label {
          font-size: 14px;
          color: #94A3B8;
          font-weight: 500;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: #F8FAFC;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .metric-value.success {
          color: #10B981;
        }

        .metric-value.warning {
          color: #F59E0B;
        }

        .metric-value.error {
          color: #EF4444;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.up {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-badge.down {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .api-card-footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }

        .log-btn {
          width: 100%;
          height: 44px;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 128, 0.1));
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 10px;
          color: #00F0FF;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .log-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .log-btn:hover {
          transform: translateY(-2px);
          border-color: #00F0FF;
          box-shadow: 0 8px 16px rgba(0, 240, 255, 0.2);
        }

        .log-btn:hover::before {
          left: 100%;
        }

        .log-btn:active {
          transform: translateY(0);
        }

        .log-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .metric-icon {
          font-size: 12px;
          opacity: 0.6;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .api-card {
            padding: 20px;
          }

          .api-card-title {
            font-size: 18px;
          }

          .metric-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      <div className="api-card">
        <div className="api-card-header">
          <h3 className="api-card-title">
            <span className={`status-indicator ${api.status === "UP" ? "up" : "down"}`}></span>
            {api.name}
          </h3>
          <div className="api-url">{api.url}</div>
        </div>

        <div className="api-card-body">
          <div className="metric-row">
            <span className="metric-label">Status</span>
            <span className={`status-badge ${api.status === "UP" ? "up" : "down"}`}>
              {api.status}
            </span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Response Time</span>
            <span className="metric-value">
              {api.responseTime ?? "--"} <span className="metric-icon">ms</span>
            </span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Last Checked</span>
            <span className="metric-value" style={{ fontSize: '14px' }}>
              {api.lastChecked
                ? new Date(api.lastChecked).toLocaleTimeString()
                : "Not yet"}
            </span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Uptime</span>
            <span className={`metric-value ${uptime >= 99 ? 'success' : uptime >= 95 ? 'warning' : 'error'}`}>
              {uptime ?? "--"}%
            </span>
          </div>

          <div className="metric-row">
            <span className="metric-label">Avg Response Time</span>
            <span className="metric-value">
              {avg_resp_time ?? "--"} <span className="metric-icon">ms</span>
            </span>
          </div>
        </div>

        <div className="api-card-footer">
          <button 
            className="log-btn" 
            onClick={() => fetchAllLogs(api._id)}
            disabled={loading}
          >
            {loading ? "Loading..." : "📊 View All Logs"}
          </button>
        </div>
      </div>

      <ApiLogsModal
        show={showLogs}
        logs={allLogs}
        onClose={() => setshowLogs(false)}
      />
    </>
  );
};

export default ApiCard;