import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
const API_URL = import.meta.env.VITE_API_URL;
function Register() {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check all fields
    if (!name || !employeeId || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Send registration data to backend
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            employeeId,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // Clear form after successful registration
        setName("");
        setEmployeeId("");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>📘 Digital EPK Book</h1>
        <p>Create your employee account</p>

        <h2>Register</h2>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;