import { useEffect, useState } from "react";
import "./ApiCard.css";
import axios from "axios";
import ApiLogsModal from "./ApiLogsModal";

const ApiCard = ({ api }) => {
  const [allLogs, setallLogs] = useState([]);
  const [showLogs, setshowLogs] = useState(false);
  const [uptime, setuptime] = useState(null);
  const [avg_resp_time, setavg_resp_time] = useState(null);
  useEffect(() => {
    const fetchUptime = async () => {
      try {

        const response = await axios.get(`http://localhost:5000/api/logs/uptime/${api._id}`)
        setuptime(response.data.uptime);
      }
      catch (error) {
        console.log(error);
      }
    }
    const fetchAvgRespTime = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/logs/avg_resp_time/${api._id}`);
        setavg_resp_time(response.data.avg_resp_time);
      }
      catch (error) {
        console.log(error);
      }

    }
    fetchUptime();
    fetchAvgRespTime();
  }, [api._id])
  const fetchAllLogs = async (apiId) => {
    try {
      const allLogs = await axios.get(`http://localhost:5000/api/logs/${apiId}`);
      setallLogs(allLogs.data.Apilogs);
      console.log(allLogs.data.Apilogs);
      setshowLogs(true);
    }
    catch (error) {
      alert("failed to fetch all logs");
    }
  }

  return (
    <div className="api-card">
      <h3>{api.name}</h3>
      <h3>{api.url}</h3>
      <p >
        Status : <strong className={api.status === "UP" ? "up" : "down"}>{api.status}</strong>
      </p>
    

      <p>Response Time: {api.responseTime ?? "--"} ms</p>
      <p>
        Last Checked:{" "}
        {api.lastChecked
          ? new Date(api.lastChecked).toLocaleTimeString()
          : "Not yet"}
      </p>
      <button id="log_btn" onClick={() => fetchAllLogs(api._id)}>All logs</button>
      <ApiLogsModal
        show={showLogs}
        logs={allLogs}
        onClose={() => setshowLogs(false)}
      />
      <p>
        Uptime:{" "}
        <strong style={{ color: uptime >= 99 ? "green" : "orange" }}>
          {uptime ?? "--"}%
        </strong>
      </p>
      <p>
        Avg_Resp_Time:{" "}
        <strong style={{ color: avg_resp_time >= 99 ? "green" : "orange" }}>
          {avg_resp_time ?? "--"} ms
        </strong>
      </p>

    </div>

  );
};

export default ApiCard;
