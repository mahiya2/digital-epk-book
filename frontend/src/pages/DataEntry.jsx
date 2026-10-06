import { useState } from "react";
import "./DataEntry.css";

const API_URL = import.meta.env.VITE_API_URL;
function DataEntry() {
  const [date, setDate] = useState("");
  const [dayType, setDayType] = useState("Duty");
  const [otherReason, setOtherReason] = useState("");
  const [key, setKey] = useState("");
  const [route, setRoute] = useState("");
  const [scheduledKm, setScheduledKm] = useState("");
  const [operatedKm, setOperatedKm] = useState("");
  const [cancelledKm, setCancelledKm] = useState("");
  const [earnings, setEarnings] = useState("");
  const [remarks, setRemarks] = useState("");

  const calculateEpk = () => {
    if (!operatedKm || Number(operatedKm) === 0) {
      return "0.00";
    }

    return (Number(earnings || 0) / Number(operatedKm)).toFixed(2);
  };

const handleSave = async (e) => {
  e.preventDefault();

  if (!date || !dayType) {
    alert("Please enter Date and Day Type.");
    return;
  }
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

if (!datePattern.test(date)) {
  alert("Please enter date in DD/MM/YYYY format.");
  return;
}
  if (
  Number(scheduledKm) < 0 ||
  Number(operatedKm) < 0 ||
  Number(cancelledKm) < 0 ||
  Number(earnings) < 0
) {
  alert("KM and Earnings cannot be negative.");
  return;
}
if (Number(operatedKm) > Number(scheduledKm)) {
  alert("Operated KM cannot be greater than Scheduled KM.");
  return;
}
if (Number(cancelledKm) > Number(scheduledKm)) {
  alert("Cancelled KM cannot be greater than Scheduled KM.");
  return;
}
  if (dayType === "Other" && !otherReason) {
    alert("Please specify the reason.");
    return;
  }

  const employee = JSON.parse(localStorage.getItem("employee"));

  if (!employee) {
    alert("Please login again.");
    return;
  }

  try {
    const response = await fetch(
     `${API_URL}/api/epk/entry`,
      {
        method: "POST",
       headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
       body: JSON.stringify({
  date,
  dayType,
  otherReason,
  key,
  route,
  scheduledKm,
  operatedKm,
  cancelledKm,
  earnings,
  remarks,
}),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Entry saved successfully!");

      console.log("Saved EPK entry:", data.entry);

      setDate("");
      setDayType("Duty");
      setOtherReason("");
      setKey("");
      setRoute("");
      setScheduledKm("");
      setOperatedKm("");
      setCancelledKm("");
      setEarnings("");
      setRemarks("");
    } 
    else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Save entry error:", error);
    alert("Unable to connect to the server.");
  }
};
  return (
    <div className="data-entry-page">
      <div className="data-entry-card">
<h1>📘 Digital EPK Book</h1>

<div className="whatsapp-channel-text">
  APPTD Employee Info Repository WhatsApp Channel
</div>

<p>Enter your daily duty details</p>

<h2>Data Entry</h2>
        <form className="entry-form" onSubmit={handleSave}>

       <div className="entry-group">
  <label>📅 Date (DD/MM/YYYY)</label>

  <input
    type="text"
    placeholder="DD/MM/YYYY"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    maxLength="10"
  />
</div>

          <div className="entry-group">
           <label>🚌 Day Type</label>
            <select
              value={dayType}
              onChange={(e) => setDayType(e.target.value)}
            >
              <option value="Duty">Duty</option>
              <option value="Leave">Leave</option>
              <option value="Special Duty">Special Duty</option>
              <option value="Weekly Off">Weekly Off</option>
              <option value="D OFF">D OFF</option>
              <option value="Medical/PME">Medical/PME</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {dayType === "Other" && (
            <div className="entry-group">
<label>✏️ Specify Reason</label>
              <input
                type="text"
                placeholder="Enter reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </div>
          )}

          <div className="entry-group">
            <label>🔑 Key</label>
            <input
              type="text"
              placeholder="Enter key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="entry-group">
           <label>🛣️ Route</label>
            <input
              type="text"
              placeholder="Enter route"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
            />
          </div>

          <div className="entry-group">
           <label>📏 Scheduled KM</label>
            <input
              type="number"
              value={scheduledKm}
              onChange={(e) => setScheduledKm(e.target.value)}
            />
          </div>

          <div className="entry-group">
            <label>🚍 Operated KM</label>
            <input
              type="number"
              value={operatedKm}
              onChange={(e) => setOperatedKm(e.target.value)}
            />
          </div>

          <div className="entry-group">
           <label>❌ Cancelled KM</label>
            <input
  type="number"
  value={
    scheduledKm && operatedKm
      ? Math.max(0, Number(scheduledKm) - Number(operatedKm))
      : 0
  }
  readOnly
/>
          </div>

          <div className="entry-group">
           <label>💰 Earnings</label>
            <input
              type="number"
              value={earnings}
              onChange={(e) => setEarnings(e.target.value)}
            />
          </div>

          <div className="entry-group">
           <label>📝 Remarks</label>
            <textarea
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

<div className="epk-display">
  <h2>📊 EPK ₹{calculateEpk()}</h2>
</div>

          <button type="submit" className="save-entry-button">
  💾 Save Entry
</button>

        </form>
      </div>
    </div>
  );
}

export default DataEntry;