import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "authority") {
        navigate("/authority");
      } else {
        navigate("/citizen");
      }
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
  <div className="auth-page">
    <div className="auth-card">
      <h2 className="auth-title">Welcome</h2>
      <p className="auth-subtitle">Login to Smart Civic Reporter</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        {/* EMAIL */}
        <input
          className="auth-input"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          className="auth-input"
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* FORGOT PASSWORD — 👈 YAHI SAHI JAGAH */}
       <p
  className="auth-link"
  style={{ textAlign: "center", marginTop: 8 }}
  onClick={() => navigate("/forgot-password")}
>
  Forgot password?
</p>


        {/* LOGIN BUTTON */}
        <button className="auth-button" type="submit">
          Log in
        </button>
      </form>

      {/* SIGN UP — ❗ SIRF EK HI BAAR */}
      <div className="auth-footer">
        Don’t have an account?{" "}
        <span
          className="auth-link"
          onClick={() => navigate("/register")}
        >
          Sign up
        </span>
      </div>
    </div>
  </div>
);

}

export default Login;
