import "./ApiLogsModal.css";

const ApiLogsModal = ({ show, onClose, logs }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>API Logs</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-content">
          {logs.length === 0 ? (
            <p>No logs available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Response Time</th>
                  <th>Created At</th>
                  <th>Errormessage</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className={log.status === "UP" ? "up" : "down"}>
                      {log.status}
                    </td>
                    <td>{log.responseTime ?? "--"} ms</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>{log.Errormessage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiLogsModal;
