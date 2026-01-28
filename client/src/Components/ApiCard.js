import "./ApiCard.css";
const ApiCard = ({ api }) => {
  return (
    <div className="api-card">
      <h3>{api.name}</h3>
      <p className={api.status === "UP" ? "up" : "down"}>
        {api.status}
      </p>
      <p>Response Time: {api.responseTime ?? "--"} ms</p>
      <p>
        Last Checked:{" "}
        {api.lastChecked
          ? new Date(api.lastChecked).toLocaleTimeString()
          : "Not yet"}
      </p>
    </div>
  );
};

export default ApiCard;
