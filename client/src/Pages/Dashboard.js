import { useEffect, useState } from "react";
import ApiCard from "../Components/ApiCard";
import axios from "axios";
import ResponseTimeChart from "../Components/ResponseTimeChart";

const Dashboard = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApis = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/monitor/getAll");
      setApis(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching APIs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();

    const interval = setInterval(() => {
      fetchApis();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle delete API endpoint
  const handleDelete = async (apiId) => {
    try {
      // Call your backend delete endpoint
      await axios.delete(`http://localhost:5000/api/monitor/delete/${apiId}`);
      // Remove from state
      setApis(apis.filter(api => api._id !== apiId));
    } catch (error) {
      console.error("Error deleting API:", error);
      alert("Failed to delete endpoint. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: #0B0F19;
          color: #F8FAFC;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .dashboard-container {
          min-height: 100vh;
          background: #0B0F19;
          padding: 40px 24px;
          position: relative;
        }

        /* Animated Background */
        .dashboard-container::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 0, 128, 0.06) 0%, transparent 40%);
          animation: backgroundShift 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes backgroundShift {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(5%, -5%) rotate(5deg);
          }
          66% {
            transform: translate(-5%, 5%) rotate(-5deg);
          }
        }

        .dashboard-header {
          max-width: 1400px;
          margin: 0 auto 40px;
          position: relative;
          z-index: 1;
          animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-title {
          font-size: 42px;
          font-weight: 700;
          background: linear-gradient(135deg, #00F0FF, #FF0080);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .dashboard-subtitle {
          font-size: 16px;
          color: #94A3B8;
          font-weight: 400;
        }

        .dashboard-stats {
          max-width: 1400px;
          margin: 0 auto 32px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card {
          background: rgba(21, 27, 43, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border: 1px solid rgba(167, 180, 199, 0.61);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 240, 255, 0.3);
          box-shadow: 0 8px 24px rgba(0, 240, 255, 0.15);
        }

        .stat-label {
          font-size: 13px;
          color: #94A3B8;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #F8FAFC;
        }

        .stat-value.success {
          color: #10B981;
        }

        .stat-value.warning {
          color: #F59E0B;
        }

        .stat-value.error {
          color: #EF4444;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .chart-section {
          margin-bottom: 32px;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        .api-grid-section {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #F8FAFC;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #00F0FF, #FF0080);
          border-radius: 4px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(148, 163, 184, 0.2);
          border-top-color: #00F0FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #64748B;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state-text {
          font-size: 18px;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 24px 16px;
          }

          .dashboard-title {
            font-size: 32px;
          }

          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">API Monitor Dashboard</h1>
          <p className="dashboard-subtitle">Real-time monitoring and analytics</p>
        </div>
       

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Total APIs</div>
            <div className="stat-value">{apis.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">APIs Up</div>
            <div className="stat-value success">
              {apis.filter(api => api.status === "UP").length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">APIs Down</div>
            <div className="stat-value error">
              {apis.filter(api => api.status === "DOWN").length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Response</div>
            <div className="stat-value">
              {apis.length > 0
                ? Math.round(
                    apis.reduce((sum, api) => sum + (api.responseTime || 0), 0) /
                      apis.length
                  )
                : 0}
              <span style={{ fontSize: '16px', marginLeft: '4px' }}>ms</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-section">
            <h2 className="section-title">Performance Trends</h2>
            <ResponseTimeChart />
          </div>

          <div className="api-grid-section">
            <h2 className="section-title">API Endpoints</h2>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : apis.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📡</div>
                <div className="empty-state-text">No APIs to monitor yet</div>
              </div>
            ) : (
              <div className="grid">
                {apis.map((api, index) => (
                  <ApiCard 
                    key={api._id} 
                    api={api} 
                    index={index}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;