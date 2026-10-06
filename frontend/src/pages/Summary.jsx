import { useEffect, useState } from "react";
import "./Summary.css";
const API_URL = import.meta.env.VITE_API_URL;
function Summary() {
const [selectedMonth, setSelectedMonth] = useState(
  new Date().toISOString().slice(0, 7)
);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (!month) {
      setSummary(null);
      return;
    }

    const employee = JSON.parse(localStorage.getItem("employee"));

    if (!employee) {
      alert("Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
`${API_URL}/api/epk/summary?employeeId=${employee.employeeId}&month=${month}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Summary error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  handleMonthChange({
    target: {
      value: selectedMonth,
    },
  });
}, []);
  return (
    <div className="summary-page">
      <div className="summary-card">

     <h1>📊 Monthly Summary</h1>

<div className="whatsapp-channel-text">
  APPTD Employee Info Repository WhatsApp Channel
</div>

<div className="summary-group">
          <label>Select Month</label>

          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
        </div>

        {loading && (
          <p className="summary-loading">
            Loading summary...
          </p>
        )}

        {/* Summary cards always visible */}
        <div className="summary-grid">

          <div className="summary-box">
            <span>🚌</span>
            <p>Duty Days</p>
            <strong>{summary ? summary.dutyDays : "--"}</strong>
          </div>

          <div className="summary-box">
            <span>⭐</span>
            <p>Special Duty</p>
            <strong>{summary ? summary.specialDuty : "--"}</strong>
          </div>

          <div className="summary-box">
            <span>🏖️</span>
            <p>Leave</p>
            <strong>{summary ? summary.leave : "--"}</strong>
          </div>

          <div className="summary-box">
            <span>🛌</span>
            <p>Weekly Off</p>
            <strong>{summary ? summary.weeklyOff : "--"}</strong>
          </div>

          <div className="summary-box">
            <span>📏</span>
            <p>Scheduled KM</p>
            <strong>{summary ? summary.scheduledKm : "--"}</strong>
          </div>

          <div className="summary-box">
            <span>🚍</span>
            <p>Operated KM</p>
            <strong>{summary ? summary.operatedKm : "--"}</strong>
          </div>

          <div className="summary-box">
            <span>❌</span>
            <p>Cancelled KM</p>
            <strong>{summary ? summary.cancelledKm : "--"}</strong>
          </div>

          <div className="summary-box earnings-box">
            <span>💰</span>
            <p>Total Earnings</p>
            <strong>
              {summary ? `₹${summary.totalEarnings}` : "--"}
            </strong>
          </div>

          <div className="summary-box epk-box">
            <span>📊</span>
            <p>Monthly EPK</p>
            <strong>
              {summary
                ? `₹${summary.monthlyEpk.toFixed(2)}`
                : "--"}
            </strong>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Summary;