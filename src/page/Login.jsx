import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://restaurent-pos.test/api/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Assuming response contains token and user info
      const data = response.data;
      console.log("token & user info", data.user);

      // Save token
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user)); // 👈 Store user info

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed.");
      } else {
        setError("Network or server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center vh-100">
      <div
        className="login-card bg-white p-4 rounded shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div
          className="logo text-center mb-3"
          style={{ fontSize: "28px", fontWeight: "bold", color: "#134e89" }}
        >
          🍽️ Restaurant POS
        </div>
        <h3
          className="text-center mb-4"
          style={{ color: "#2c3e50", fontWeight: 600 }}
        >
          Admin Login
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Username or Email
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-login"
              style={{ backgroundColor: "#134e89", color: "white" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
