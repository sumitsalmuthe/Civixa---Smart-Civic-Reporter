import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });
      navigate("/");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: 420 }}>
        <h2 className="auth-title">Registration Form</h2>
        <p className="auth-subtitle">Create your account</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Enter your Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          

          <button className="auth-button">Submit</button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/")}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
