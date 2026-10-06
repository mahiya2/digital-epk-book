import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const employee = JSON.parse(localStorage.getItem("employee"));

  return (
    <div className="dashboard-layout">

      {/* Left Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          📘
          <span>Digital EPK Book</span>
        </div>

        <div className="employee-info">
          <strong>{employee?.name || "Employee"}</strong>
          <span>{employee?.employeeId || "N/A"}</span>
        </div>

        <nav className="sidebar-menu">
<NavLink to="/dashboard" end>
  🏠 Dashboard
</NavLink>
          <NavLink to="/dashboard/data-entry">
            ➕ Data Entry
          </NavLink>

          <NavLink to="/dashboard/summary">
            📊 Monthly Summary
          </NavLink>

          <NavLink to="/dashboard/history">
            📜 History
          </NavLink>

        </nav>

        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("employee");
            window.location.href = "/";
          }}
        >
          🚪 Logout
        </button>

      </aside>

     {/* Right Content */}
<main className="dashboard-content">
  <Outlet />
</main>

    </div>
  );
}

export default Dashboard;