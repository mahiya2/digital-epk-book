import { useEffect, useState } from "react";
import "./History.css";
const API_URL = import.meta.env.VITE_API_URL;
function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState(null);

  // Open Edit Form
  const handleEdit = (entry) => {
    const formattedDate = new Date(entry.date).toLocaleDateString("en-GB");

    setEditingEntry({
      ...entry,
      date: formattedDate,
    });
  };

  // Update EPK Entry
  const handleUpdate = async () => {
    if (!editingEntry) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/epk/entry/${editingEntry._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            date: editingEntry.date,
            dayType: editingEntry.dayType,
            otherReason: editingEntry.otherReason || "",
            key: editingEntry.key || "",
            route: editingEntry.route || "",
            scheduledKm: editingEntry.scheduledKm,
            operatedKm: editingEntry.operatedKm,
            extraKm: editingEntry.extraKm,
            cancelledKm: editingEntry.cancelledKm,
            earnings: editingEntry.earnings,
            remarks: editingEntry.remarks || "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setEntries((currentEntries) =>
          currentEntries.map((entry) =>
            entry._id === editingEntry._id ? data.entry : entry
          )
        );

        setEditingEntry(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Delete EPK Entry
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this EPK entry?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
      `${API_URL}/api/epk/entry/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setEntries((currentEntries) =>
          currentEntries.filter((entry) => entry._id !== id)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      const employee = JSON.parse(localStorage.getItem("employee"));

      if (!employee) {
        alert("Please login again.");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/epk/history?employeeId=${employee.employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setEntries(data.entries);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("History error:", error);
        alert("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="history-page">
        <div className="history-card">
          <h1>📜 History</h1>
          <p>Loading entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-card">
<h1>📜 History</h1>

<div className="whatsapp-channel-text">
  APPTD Employee Info Repository WhatsApp Channel
</div>

        {/* EDIT FORM */}
        {editingEntry && (
          <div className="edit-form">

            <h2>✏️ Edit EPK Entry</h2>

            <div className="edit-group">
              <label>Date (DD/MM/YYYY)</label>

              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={editingEntry.date}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    date: e.target.value,
                  })
                }
                maxLength="10"
              />
            </div>

            <div className="edit-group">
              <label>Day Type</label>

              <select
                value={editingEntry.dayType}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    dayType: e.target.value,
                  })
                }
              >
                <option value="Duty">Duty</option>
                <option value="Leave">Leave</option>
                <option value="Special Duty">Special Duty</option>
                <option value="Special Off">Special Off</option>
                <option value="Weekly Off">Weekly Off</option>
                <option value="D OFF">D OFF</option>
                <option value="Medical/PME">Medical/PME</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {editingEntry.dayType === "Other" && (
              <div className="edit-group">
                <label>Specify Reason</label>

                <input
                  type="text"
                  placeholder="Enter reason"
                  value={editingEntry.otherReason || ""}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      otherReason: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="edit-group">
              <label>Key</label>

              <input
                type="text"
                value={editingEntry.key || ""}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    key: e.target.value,
                  })
                }
              />
            </div>

            <div className="edit-group">
              <label>Route</label>

              <input
                type="text"
                value={editingEntry.route || ""}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    route: e.target.value,
                  })
                }
              />
            </div>

            <div className="edit-group">
              <label>Scheduled KM</label>

              <input
                type="number"
                value={editingEntry.scheduledKm}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    scheduledKm: e.target.value,
                  })
                }
              />
            </div>

            <div className="edit-group">
              <label>Operated KM</label>

              <input
                type="number"
                value={editingEntry.operatedKm}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    operatedKm: e.target.value,
                  })
                }
              />
            </div>
                <div className="edit-group">
  <label>Extra KM</label>

  <input
    type="number"
    min="0"
    value={editingEntry.extraKm || 0}
    onChange={(e) =>
      setEditingEntry({
        ...editingEntry,
        extraKm: e.target.value,
      })
    }
  />
</div>
            <div className="edit-group">
              <label>Cancelled KM</label>

              <input
                type="number"
                value={editingEntry.cancelledKm}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    cancelledKm: e.target.value,
                  })
                }
              />
            </div>

            <div className="edit-group">
              <label>Earnings</label>

              <input
                type="number"
                value={editingEntry.earnings}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    earnings: e.target.value,
                  })
                }
              />
            </div>

            <div className="edit-group">
              <label>Remarks</label>

              <textarea
                value={editingEntry.remarks || ""}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    remarks: e.target.value,
                  })
                }
              />
            </div>

            <div className="edit-actions">

              <button
                type="button"
                className="save-edit-button"
                onClick={handleUpdate}
              >
                💾 Save Changes
              </button>

              <button
                type="button"
                className="cancel-edit-button"
                onClick={() => setEditingEntry(null)}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {/* HISTORY TABLE */}
        {entries.length === 0 ? (
          <p>No EPK entries found.</p>
        ) : (
          <div className="history-table-container">

            <table className="history-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day Type</th>
                  <th>Key</th>
                  <th>Route</th>
                  <th>Scheduled KM</th>
                  <th>Operated KM</th>
                  <th>Extra KM</th>
                  <th>Cancelled KM</th>
                  <th>Earnings</th>
                  <th>EPK</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {entries.map((entry) => (
                  <tr key={entry._id}>

                    <td>
                      {new Date(entry.date).toLocaleDateString("en-GB")}
                    </td>

                    <td>{entry.dayType}</td>

                    <td>{entry.key || "-"}</td>

                    <td>{entry.route || "-"}</td>

                    <td>{entry.scheduledKm}</td>

                    <td>{entry.operatedKm}</td>
                  <td>{entry.extraKm || 0}</td>
                    <td>{entry.cancelledKm}</td>

                    <td>₹{entry.earnings}</td>

                    <td>
                      ₹{Number(entry.epk).toFixed(2)}
                    </td>

                    <td>{entry.remarks || "-"}</td>

                    <td>
                      <button
                        onClick={() => handleEdit(entry)}
                        className="edit-button"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="delete-button"
                      >
                        🗑️ Delete
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default History;