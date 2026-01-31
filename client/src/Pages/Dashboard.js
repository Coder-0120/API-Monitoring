import { useEffect, useState } from "react";
import ApiCard from "../Components/ApiCard";
import axios from "axios";
import ResponseTimeChart from "../Components/ResponseTimeChart";

const Dashboard = () => {
  const [apis, setApis] = useState([]);

  const fetchApis = async () => {
    const res = await axios.get("http://localhost:5000/api/monitor/getAll");
    setApis(res.data.data);
  };

  useEffect(() => {
    fetchApis();

    const interval = setInterval(() => {
      fetchApis();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div>
      <ResponseTimeChart/>
    </div>
    <div className="grid">
      {apis.map(api => (
        <ApiCard key={api._id} api={api} />
      ))}
    </div>
      </>
  );
};

export default Dashboard;
