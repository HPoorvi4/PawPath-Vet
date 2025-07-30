import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


export default function VetLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/vet-login", {
        email,
        password,
      });

      if (res.data.success) {
        const { token, vet } = res.data;

        // Store token and vet info
        localStorage.setItem("vetToken", token);
        localStorage.setItem("vetData", JSON.stringify(vet));

        // Set global Authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Clear inputs
        setEmail("");
        setPassword("");

        navigate("/dashboard");
        
      } else {
        setErr(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setErr(data.message || "Please check your input.");
            break;
          case 401:
            setErr("Incorrect email or password.");
            break;
          case 403:
            setErr("Your account is not approved yet. Please wait for admin approval.");
            break;
          case 500:
            setErr("Server error. Please try again later.");
            break;
          default:
            setErr(data.message || "Login failed.");
        }
      } else if (error.request) {
        setErr("Network error. Please check your connection.");
      } else {
        setErr("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card vet-login-card">
        <div className="login-header">
          <h2>Vet Sign In - PawPath</h2>
          <p className="login-subtitle">Access your vet dashboard</p>
        </div>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your vet-registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="loading-spinner" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="redirect">
            New to PawPath? <Link to="/register">Register as Vet</Link>
          </p>

          <div className="help-links">
            <a href="#" className="help-link">Forgot Password?</a>
            <span className="divider">|</span>
            <a href="#" className="help-link">Need Help?</a>
          </div>
        </div>

        <div className="security-notice">
          <p>🔒 Your data is encrypted and securely transmitted</p>
        </div>
      </div>
    </div>
  );
}
