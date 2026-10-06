import { useEffect, useState } from "react";
import "./DashboardHome.css";

const API_URL = import.meta.env.VITE_API_URL;
function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const response = await fetch(
`${API_URL}/api/epk/summary?month=${currentMonth}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSummary(data.summary);
        }
      } catch (error) {
        console.error("Dashboard summary error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  return (
    <div className="dashboard-home">
<h1>Welcome to Digital EPK Book 👋</h1>

<div className="whatsapp-channel-text">
  APPTD Employee Info Repository WhatsApp Channel
</div>

<p className="dashboard-subtitle">
  Manage your daily EPK records easily and efficiently.
</p>

      <div className="dashboard-welcome-card">
        <h2>📘 Digital EPK Book</h2>

        <p>
          Use the menu on the left to enter your daily records,
          view monthly summaries, and check your history.
        </p>
      </div>

      <h2 className="dashboard-section-title">
        📊 Current Month Overview
      </h2>

      {loading ? (
        <p className="dashboard-loading">
          Loading dashboard...
        </p>
      ) : (
        <div className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="stat-icon">📅</div>
            <div>
              <h3>Duty Days</h3>
              <strong>{summary?.dutyDays ?? 0}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">🚍</div>
            <div>
              <h3>Operated KM</h3>
              <strong>{summary?.operatedKm ?? 0}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">💰</div>
            <div>
              <h3>Total Earnings</h3>
              <strong>
                ₹{Number(summary?.totalEarnings ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">📈</div>
            <div>
              <h3>Monthly EPK</h3>
              <strong>
                ₹{Number(summary?.monthlyEpk ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default DashboardHome;