import { useState } from "react";
import "./ApiCard.css";
import axios from "axios";
import ApiLogsModal from "./ApiLogsModal";

const ApiCard = ({ api }) => {
    const[allLogs,setallLogs]=useState([]);
    const[showLogs,setshowLogs]=useState(false);
    const fetchAllLogs=async(apiId)=>{
        try{
            const allLogs=await axios.get(`http://localhost:5000/api/logs/${apiId}`);
            setallLogs(allLogs.data.Apilogs);
            console.log(allLogs.data.Apilogs);
            setshowLogs(true);
        }
        catch(error){
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
      <button id="log_btn" onClick={()=>fetchAllLogs(api._id)}>All logs</button>
      <ApiLogsModal
        show={showLogs}
        logs={allLogs}
        onClose={() => setshowLogs(false)}
      />
    </div>
  );
};

export default ApiCard;
