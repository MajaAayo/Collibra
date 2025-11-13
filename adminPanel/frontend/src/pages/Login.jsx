import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", { username, password });
      setLoading(false);
      if (res.data?.message === "Login successful") {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate("/admin");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="admin-container"
      style={{
        maxWidth: 400,
        margin: "60px auto",
        background: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: 32,
      }}
    >
      <h1 style={{ color: "#4A90E2", textAlign: "center", marginBottom: 24 }}>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ borderColor: "#4A90E2", width: "100%" }}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: "#4A90E2", width: "100%" }}
          />
        </div>

        {/* Error message */}
        {error && <p style={{ color: "#dc3545", textAlign: "center" }}>{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          style={{ width: "100%", marginTop: 16 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
