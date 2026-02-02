const ApiLogsModal = ({ show, onClose, logs }) => {
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
          position: fixed;
          overflow: hidden;
          margin: auto;
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #EF4444;
          transform: rotate(90deg);
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          min-height: 200px;
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(30, 39, 56, 0.3);
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.5);
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

        .logs-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        }

        .logs-table tbody tr {
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          transition: background 0.2s;
        }

        .logs-table tbody tr:hover {
          background: rgba(0, 240, 255, 0.05);
        }

        .logs-table tbody tr:last-child {
          border-bottom: none;
        }

        .logs-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #F8FAFC;
        }

        .status-cell {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }

        .status-cell.up {
          color: #10B981;
        }

        .status-cell.down {
          color: #EF4444;
        }

        .response-time-cell {
          font-family: 'JetBrains Mono', monospace;
          color: #00F0FF;
        }

        .date-cell {
          color: #94A3B8;
          font-size: 13px;
        }

        .error-cell {
          color: #F59E0B;
          font-size: 13px;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .error-cell:empty::before {
          content: '—';
          color: #64748B;
        }

        .log-count {
          padding: 0 32px 16px;
          color: #94A3B8;
          font-size: 14px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .log-count strong {
          color: #00F0FF;
          font-weight: 600;
        }

        /* Tablet Responsive */
        @media (max-width: 1024px) {
          .modal-overlay {
            padding: 20px;
          }

          .modal-box {
            max-height: calc(100vh - 40px);
          }

          .modal-header {
            padding: 24px 28px;
          }

          .modal-content {
            padding: 28px;
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 16px;
          }

          .modal-box {
            max-height: calc(100vh - 32px);
            border-radius: 20px;
          }

          .modal-header {
            padding: 20px 24px;
          }

          .modal-header h3 {
            font-size: 20px;
          }

          .modal-content {
            padding: 24px;
          }

          .log-count {
            padding: 0 24px 12px;
          }

          .logs-table th,
          .logs-table td {
            padding: 12px 16px;
            font-size: 13px;
          }

          .error-cell {
            max-width: 150px;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .modal-overlay {
            padding: 12px;
          }

          .modal-box {
            max-height: calc(100vh - 24px);
            border-radius: 16px;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-header h3 {
            font-size: 18px;
          }

          .modal-header h3::before {
            font-size: 20px;
          }

          .close-btn {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }

          .modal-content {
            padding: 20px;
          }

          .log-count {
            padding: 0 20px 12px;
            font-size: 13px;
          }

          .logs-table th,
          .logs-table td {
            padding: 10px 12px;
            font-size: 12px;
          }

          .logs-table th:nth-child(4),
          .logs-table td:nth-child(4) {
            display: none;
          }

          .empty-logs {
            padding: 40px 16px;
          }

          .empty-icon {
            font-size: 48px;
          }

          .empty-text {
            font-size: 16px;
          }

          .error-cell {
            max-width: 100px;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>API Logs</h3>
            <button className="close-btn" onClick={onClose}>
              ✖
            </button>
          </div>

          {logs.length > 0 && (
            <div className="log-count">
              Showing <strong>{logs.length}</strong> log entries
            </div>
          )}

          <div className="modal-content">
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
                        <td>
                          <span className={`status-cell ${log.status === "UP" ? "up" : "down"}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="response-time-cell">
                          {log.responseTime ?? "--"} ms
                        </td>
                        <td className="date-cell">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="error-cell" title={log.Errormessage}>
                          {log.Errormessage}
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