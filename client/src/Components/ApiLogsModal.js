import { useEffect, useRef } from "react";

const ApiLogsModal = ({ show, onClose, logs }) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
      const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [show, onClose]);

  if (!show) return null;

  const upCount   = logs.filter(l => l.status === "UP").length;
  const downCount = logs.filter(l => l.status === "DOWN").length;
  const avgResp   = logs.length
    ? Math.round(logs.reduce((s, l) => s + (l.responseTime || 0), 0) / logs.length)
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        /* ── Overlay ── */
        .lm-overlay {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(11, 15, 25, 0.82);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 99999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px;
          box-sizing: border-box;
          animation: lmOverlayIn 0.25s ease;
        }
        @keyframes lmOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Modal box ── */
        .lm-box {
          background: #151B2B;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 24px;
          width: 100%;
          max-width: 880px;
          max-height: calc(100vh - 40px);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 40px 100px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          animation: lmBoxIn 0.38s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes lmBoxIn {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: none; }
        }

        /* Cyan-magenta accent bar on top */
        .lm-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00F0FF 30%, #FF0080 70%, transparent);
          z-index: 2;
        }

        /* ── Header ── */
        .lm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 28px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          background: rgba(21, 27, 43, 0.9);
          flex-shrink: 0;
        }
        .lm-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .lm-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          background: linear-gradient(135deg, rgba(0,240,255,0.12), rgba(255,0,128,0.08));
          border: 1px solid rgba(0, 240, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .lm-title {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #F8FAFC;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .lm-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }
        .lm-close {
          width: 38px;
          height: 38px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 11px;
          color: #EF4444;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .lm-close:hover {
          background: rgba(239, 68, 68, 0.18);
          border-color: #EF4444;
          transform: rotate(90deg) scale(1.05);
        }

        /* ── Stats strip (only shown when logs exist) ── */
        .lm-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          flex-shrink: 0;
        }
        .lm-stat {
          padding: 14px 20px;
          text-align: center;
          border-right: 1px solid rgba(148, 163, 184, 0.07);
        }
        .lm-stat:last-child { border-right: none; }
        .lm-stat-val {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 2px;
        }
        .lm-stat-lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── Scrollable body ── */
        .lm-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        .lm-body::-webkit-scrollbar { width: 4px; }
        .lm-body::-webkit-scrollbar-track { background: transparent; }
        .lm-body::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.2); border-radius: 4px; }

        /* ── Table ── */
        .lm-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .lm-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Outfit', sans-serif;
        }
        .lm-table thead {
          background: rgba(30, 39, 56, 0.5);
          position: sticky;
          top: 0;
          z-index: 3;
        }
        .lm-table th {
          padding: 11px 18px;
          text-align: left;
          font-size: 10px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          white-space: nowrap;
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        }
        .lm-table td {
          padding: 13px 18px;
          font-size: 14px;
          color: #CBD5E1;
          border-bottom: 1px solid rgba(148, 163, 184, 0.055);
        }
        .lm-table tbody tr:last-child td { border-bottom: none; }
        .lm-table tbody tr { transition: background 0.15s; }
        .lm-table tbody tr:hover td { background: rgba(0, 240, 255, 0.03); }

        /* Status badge */
        .lm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .lm-badge-up {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #10B981;
        }
        .lm-badge-down {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #EF4444;
        }
        .lm-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          animation: lmDot 1.8s ease infinite;
        }
        @keyframes lmDot {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }

        .lm-td-time {
          font-family: 'JetBrains Mono', monospace;
          color: #00F0FF;
          font-size: 13px;
        }
        .lm-td-date { color: #475569; font-size: 13px; white-space: nowrap; }
        .lm-td-err  {
          color: #F59E0B;
          font-size: 13px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Empty state ── */
        .lm-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 56px 32px;
          text-align: center;
          min-height: 280px;
        }
        .lm-empty-ring {
          position: relative;
          width: 96px;
          height: 96px;
          margin-bottom: 28px;
        }
        .lm-empty-ring-outer {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 2px solid rgba(0, 240, 255, 0.12);
          position: absolute;
          inset: 0;
          animation: lmSpin 8s linear infinite;
        }
        .lm-empty-ring-inner {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px dashed rgba(255, 0, 128, 0.1);
          position: absolute;
          top: 13px; left: 13px;
          animation: lmSpin 5s linear infinite reverse;
        }
        .lm-empty-ring-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
        }
        @keyframes lmSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .lm-empty-title {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .lm-empty-desc {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #475569;
          line-height: 1.75;
          max-width: 320px;
          margin-bottom: 28px;
        }
        .lm-empty-pills {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .lm-empty-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(30, 39, 56, 0.5);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #475569;
        }
        .lm-empty-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00F0FF;
          box-shadow: 0 0 6px rgba(0,240,255,0.5);
          animation: lmDot 1.5s ease infinite;
        }

        /* ── Footer ── */
        .lm-footer {
          padding: 14px 28px;
          border-top: 1px solid rgba(148, 163, 184, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background: rgba(21, 27, 43, 0.6);
        }
        .lm-footer-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #334155;
        }
        .lm-footer-text strong { color: #00F0FF; }
        .lm-footer-close {
          padding: 8px 20px;
          border-radius: 10px;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(30, 39, 56, 0.6);
          color: #94A3B8;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lm-footer-close:hover {
          border-color: rgba(0,240,255,0.25);
          color: #F8FAFC;
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .lm-overlay { padding: 0 !important; align-items: flex-end !important; }
          .lm-box { border-radius: 22px 22px 0 0 !important; max-height: 90vh; }
          .lm-header { padding: 18px 20px; }
          .lm-title  { font-size: 17px; }
          .lm-stats  { grid-template-columns: repeat(3,1fr); }
          .lm-stat   { padding: 10px 8px; }
          .lm-stat-val { font-size: 18px; }
          .lm-table th, .lm-table td { padding: 10px 12px; font-size: 12px; }
          .lm-footer { padding: 12px 20px; }
          .lm-empty  { padding: 40px 24px; min-height: 240px; }
        }
      `}</style>

      <div className="lm-overlay" onClick={onClose}>
        <div className="lm-box" onClick={(e) => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="lm-header">
            <div className="lm-header-left">
              <div className="lm-icon-wrap">📊</div>
              <div>
                <h3 className="lm-title">API Logs</h3>
                <div className="lm-subtitle">
                  {logs.length > 0 ? `${logs.length} entries` : "No data yet"}
                </div>
              </div>
            </div>
            <button className="lm-close" onClick={onClose}>✕</button>
          </div>

          {/* ── Stats strip ── */}
          {logs.length > 0 && (
            <div className="lm-stats">
              <div className="lm-stat">
                <div className="lm-stat-val" style={{ color:"#10B981" }}>{upCount}</div>
                <div className="lm-stat-lbl">Successful</div>
              </div>
              <div className="lm-stat">
                <div className="lm-stat-val" style={{ color:"#EF4444" }}>{downCount}</div>
                <div className="lm-stat-lbl">Failed</div>
              </div>
              <div className="lm-stat">
                <div className="lm-stat-val" style={{ color:"#00F0FF" }}>
                  {avgResp ?? "--"}<span style={{ fontSize:13, fontWeight:400, color:"#475569", marginLeft:3 }}>ms</span>
                </div>
                <div className="lm-stat-lbl">Avg Response</div>
              </div>
            </div>
          )}

          {/* ── Body ── */}
          <div className="lm-body" ref={modalContentRef}>
            {logs.length === 0 ? (

              /* ── Beautiful empty state ── */
              <div className="lm-empty">
                <div className="lm-empty-ring">
                  <div className="lm-empty-ring-outer" />
                  <div className="lm-empty-ring-inner" />
                  <div className="lm-empty-ring-icon">📡</div>
                </div>

                <h4 className="lm-empty-title">No logs yet</h4>
                <p className="lm-empty-desc">
                  ApiFlux hasn't recorded any checks for this endpoint yet.
                  Logs will appear here once monitoring begins.
                </p>

                <div className="lm-empty-pills">
                  <span className="lm-empty-pill">
                    <span className="lm-empty-pill-dot" />
                    Checks run every 30s
                  </span>
                  <span className="lm-empty-pill">
                    <span className="lm-empty-pill-dot" style={{ background:"#FF0080", boxShadow:"0 0 6px rgba(255,0,128,0.5)", animationDelay:"0.5s" }} />
                    Auto-refresh active
                  </span>
                </div>
              </div>

            ) : (

              /* ── Table ── */
              <div className="lm-table-wrap">
                <table className="lm-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Response Time</th>
                      <th>Checked At</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td>
                          <span className={`lm-badge ${log.status === "UP" ? "lm-badge-up" : "lm-badge-down"}`}>
                            <span className="lm-badge-dot" />
                            {log.status}
                          </span>
                        </td>
                        <td className="lm-td-time">
                          {log.responseTime ?? "--"} ms
                        </td>
                        <td className="lm-td-date">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="lm-td-err" title={log.Errormessage}>
                          {log.Errormessage || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
          </div>

          {/* ── Footer ── */}
          <div className="lm-footer">
            <span className="lm-footer-text">
              {logs.length > 0
                ? <><strong>{logs.length}</strong> log entries · ESC to close</>
                : <>Waiting for first check… · ESC to close</>
              }
            </span>
            <button className="lm-footer-close" onClick={onClose}>Close</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ApiLogsModal;