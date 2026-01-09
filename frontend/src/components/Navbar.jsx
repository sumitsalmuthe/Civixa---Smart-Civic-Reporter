import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo/civixa-logo.png";

const styles = {
  navbar: {
    width: "100%",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    height: 64,
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoImg: {
    width: 90,
    height: 90,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
  },
  center: {
    flex: 1,
    textAlign: "center",
    color: "#dbeafe",
    fontWeight: 600,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  notificationBtn: {
    position: "relative",
    fontSize: 20,
    color: "#fff",
    textDecoration: "none",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    background: "#dc2626",
    color: "#fff",
    fontSize: 11,
    padding: "2px 6px",
    borderRadius: 999,
    fontWeight: 700,
  },
  role: {
    background: "rgba(255,255,255,0.25)",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
  },
  logoutBtn: {
    background: "#ffffff",
    color: "#2563eb",
    border: "none",
    padding: "8px 16px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
  },
};

function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    API.get("/notifications/my")
      .then((res) =>
        setUnreadCount(res.data.filter((n) => !n.isRead).length)
      )
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <div style={styles.navbar}>
      <div style={styles.navInner}>
        <div style={styles.left}>
          <img src={logo} alt="Civixa" style={styles.logoImg} />
          <span style={styles.logoText}>Civixa</span>
        </div>

        {window.innerWidth > 768 && (
          <div style={styles.center}>Civic Complaint Platform</div>
        )}

        <div style={styles.right}>
          <Link to="/notifications" style={styles.notificationBtn}>
            🔔
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount}</span>
            )}
          </Link>
          <span style={styles.role}>Citizen</span>
          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
