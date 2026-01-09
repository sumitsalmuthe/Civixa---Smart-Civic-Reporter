import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    padding: 40,
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  backBtn: {
    marginBottom: 16,
    padding: "10px 16px",
    background: "transparent",
    border: "1px solid #6366f1",
    borderRadius: 8,
    color: "#6366f1",
    fontWeight: 600,
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeft: "5px solid #0b5ed7",
    maxWidth: 600,
    margin: "0 auto 36px",
  },
  unread: {
    borderLeft: "5px solid #dc2626",
    background: "#fef2f2",
  },
  message: {
    fontSize: 15,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  readBtn: {
    marginTop: 8,
    padding: "6px 10px",
    background: "#0b5ed7",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
  },
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  /* =========================
     FETCH NOTIFICATIONS
  ========================= */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications/my");
        setNotifications(res.data);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  /* =========================
     MARK AS READ
  ========================= */
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      // 🔔 notify Navbar
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      alert("Failed to mark as read");
    }
  };

  /* =========================
     BACK TO DASHBOARD
  ========================= */
  const goToDashboard = () => {
    if (role === "authority") {
      navigate("/authority");
    } else {
      navigate("/citizen");
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* 🔙 BACK BUTTON */}
        <button onClick={goToDashboard} style={styles.backBtn}>
          ← Back to Dashboard
        </button>

        <center><h2>Notifications</h2></center>

        {loading && <p>Loading notifications...</p>}

        {!loading && notifications.length === 0 && (
          <p>No notifications available.</p>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            style={{
              ...styles.card,
              ...(n.isRead ? {} : styles.unread),
            }}
          >
            <div style={styles.message}>{n.message}</div>

            <div style={styles.time}>
              {new Date(n.createdAt).toLocaleString()}
            </div>

            {!n.isRead && (
              <button
                style={styles.readBtn}
                onClick={() => markAsRead(n._id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Notifications;
