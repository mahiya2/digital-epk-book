import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;
function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!employeeId || !password) {
      alert("Please enter Employee ID and password.");
      return;
    }

    try {
      const response = await fetch(
`${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store JWT token
        localStorage.setItem("token", data.token);

        // Store employee details
        localStorage.setItem(
          "employee",
          JSON.stringify(data.employee)
        );

        alert(data.message);

        // Temporary navigation
        // Dashboard route will be created later
     navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>📘 Digital EPK Book</h1>
        <p>Welcome back</p>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="Enter employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        <p className="register-link">
          New user? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;