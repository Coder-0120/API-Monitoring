import { useEffect, useRef } from "react";

const ApiLogsModal = ({ show, onClose, logs }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (show) {
      // Scroll whole page to top smoothly
      window.scrollTo({
        top: 1000,
        behavior: "smooth",
      });

      // Disable background scrolling
      // document.body.style.overflow = "hidden";

      // Scroll modal content to top
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }

      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "auto";
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 15, 25, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          padding: 20px;
          animation: overlayFadeIn 0.3s ease-out;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-box {
          background: #151B2B;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 24px;
          width: 100%;
          max-width: 900px;
          max-height: calc(100vh - 40px);
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.02);
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          position: relative;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00F0FF, #FF0080, transparent);
          opacity: 0.8;
        }

        .modal-header {
          padding: 28px 32px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(30, 39, 56, 0.3);
          flex-shrink: 0;
        }

        .modal-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #F8FAFC;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-header h3::before {
          content: '📊';
          font-size: 24px;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #EF4444;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #EF4444;
          transform: rotate(90deg);
        }

        .log-count {
          padding: 16px 32px 0;
          color: #94A3B8;
          font-size: 14px;
          font-weight: 500;
        }

        .log-count strong {
          color: #00F0FF;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .logs-table-wrapper {
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.1);
          background: rgba(30, 39, 56, 0.3);
        }

        .logs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .logs-table thead {
          background: rgba(30, 39, 56, 0.5);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logs-table th,
        .logs-table td {
          padding: 14px 18px;
          text-align: left;
          font-size: 14px;
        }

        .logs-table th {
          color: #94A3B8;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }

        .logs-table tbody tr {
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          transition: background 0.2s;
        }

        .logs-table tbody tr:hover {
          background: rgba(0, 240, 255, 0.05);
        }

        .status-cell.up {
          color: #10B981;
          font-weight: 600;
        }

        .status-cell.down {
          color: #EF4444;
          font-weight: 600;
        }

        .response-time-cell {
          font-family: monospace;
          color: #00F0FF;
        }

        .date-cell {
          color: #94A3B8;
          font-size: 13px;
        }

        .error-cell {
          color: #F59E0B;
          font-size: 13px;
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .empty-logs {
          text-align: center;
          padding: 60px 20px;
          color: #64748B;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 18px;
          font-weight: 500;
        }
          
      `
      }</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>API Logs</h3>
            <button className="close-btn" onClick={onClose}>✖</button>
          </div>

          {logs.length > 0 && (
            <div className="log-count">
              Showing <strong>{logs.length}</strong> log entries
            </div>
          )}

          <div className="modal-content" ref={modalContentRef}>
            {logs.length === 0 ? (
              <div className="empty-logs">
                <div className="empty-icon">📭</div>
                <p className="empty-text">No logs available</p>
              </div>
            ) : (
              <div className="logs-table-wrapper">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Response Time</th>
                      <th>Created At</th>
                      <th>Error Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td className={`status-cell ${log.status === "UP" ? "up" : "down"}`}>
                          {log.status}
                        </td>
                        <td className="response-time-cell">
                          {log.responseTime ?? "--"} ms
                        </td>
                        <td className="date-cell">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="error-cell" title={log.Errormessage}>
                          {log.Errormessage || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiLogsModal;
