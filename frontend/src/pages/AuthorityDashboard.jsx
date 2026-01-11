import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import RemarksTimeline from "../components/RemarksTimeline";
import ComplaintCharts from "../components/ComplaintCharts";

/* ======================
   GLOBAL STYLES
====================== */
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}
@media (min-width: 768px) {
  .filters-center {
    justify-content: center;
  }
}
@media (min-width: 992px) {
  .container-narrow {
    max-width: 1200px;
    margin: auto;
  }
}
`;
document.head.appendChild(styleTag);

/* ======================
   STYLES
====================== */
const styles = {
  page: {
    padding: "36px 24px",
    background: "#f4f6f8",
    minHeight: "100vh",
    animation: "fadeIn 0.4s ease",
  },

  welcomeCard: {
    background: "#ffffff",
    padding: 28,
    borderRadius: 18,
    marginBottom: 26,
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    textAlign: "center", // ✅ CENTER FIX
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  filters: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.2s ease",
  },

  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
    gap: 22,
    maxWidth: 1200,
    margin: "0 auto",
  },

  card: {
    background: "#ffffff",
    padding: 22,
    borderRadius: 18,
    boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "box-shadow 0.2s ease",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  description: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#374151",
  },

  meta: {
    fontSize: 13,
    color: "#6b7280",
    background: "#f9fafb",
    padding: "10px 12px",
    borderRadius: 12,
  },

  imageRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  thumb: {
    width: 64,
    height: 64,
    objectFit: "cover",
    borderRadius: 10,
    cursor: "pointer",
    border: "1px solid #e5e7eb",
  },

  actionBox: {
    background: "#f8fafc",
    padding: 14,
    borderRadius: 14,
  },

  select: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #d1d5db",
  },

  updateBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
  },

  toggleBtn: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "8px 12px",
    borderRadius: 999,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: "#1e3a8a",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modalContent: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 20,
    maxWidth: "90vw",
    maxHeight: "90vh",
    animation: "zoomIn 0.25s ease",
  },

  modalImg: {
    maxWidth: "100%",
    maxHeight: "65vh",
    objectFit: "contain",
  },

  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#111827",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
  },
  chartCard: {
  background: "#ffffff",
  padding: "32px 40px",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: 30,
},

};

const getResolutionTime = (complaint) => {
  if (!complaint.remarks || complaint.remarks.length === 0) return null;

  const first = new Date(complaint.createdAt);
  const last = new Date(
    complaint.remarks[complaint.remarks.length - 1].createdAt
  );

  const diffMs = last - first;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${diffHrs}h ${diffMins}m`;
};

/* ======================
   COMPONENT
====================== */
function AuthorityDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState({});
  const [openTimeline, setOpenTimeline] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    API.get("/complaints/all")
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, []);

  
  const updateStatus = async (id) => {
    const comment = comments[id];
    const status = comments[`status_${id}`] || "pending";
    if (!comment?.trim()) return alert("Please add a remark");

    try {
      setUpdatingId(id);
     await API.put(`/complaints/${id}/status`, { status, comment });

      setComments({});
      const res = await API.get("/complaints/all");
      setComplaints(res.data);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* WELCOME */}
        <div style={styles.welcomeCard} className="container-narrow">
          <h2 style={{ fontWeight: 700 }}>Authority Dashboard</h2>
          <p style={{ color: "#6b7280" }}>
            Review, assign, and resolve citizen complaints efficiently
          </p>
        </div>

      <div style={styles.chartCard} className="container-narrow">
  <h2 style={{ textAlign: "center", marginBottom: 8 }}>
    Complaint Status Overview
  </h2>

  <p
    style={{
      textAlign: "center",
      color: "#6b7280",
      marginBottom: 24,
    }}
  >
    Overview of complaint resolution progress
  </p>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <ComplaintCharts complaints={complaints} />
  </div>
</div>




        {/* SEARCH + FILTER */}
        <div className="container-narrow">
          <input
            style={styles.input}
            placeholder="Search by title, area or citizen email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={styles.filters} className="filters-center">
            {["all", "pending", "in_progress", "resolved"].map((f) => (
              <button
                key={f}
                style={{
                  ...styles.filterBtn,
                  background: filter === f ? "#2563eb" : "#fff",
                  color: filter === f ? "#fff" : "#374151",
                }}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "ALL" : f.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div style={styles.list}>
          {complaints
            .filter(
              (c) =>
                (filter === "all" || c.status === filter) &&
                (c.title.toLowerCase().includes(search.toLowerCase()) ||
                  c.location?.area?.toLowerCase().includes(search.toLowerCase()) ||
                  c.citizen?.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase()))
            )
            .map((c) => (
              <div key={c._id} style={styles.card}>
                {c.remarks?.length > 0 && (
  <p style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
    ⏱ Resolution Time:{" "}
    <strong>{getResolutionTime(c)}</strong>
  </p>
)}


                <p style={styles.description}>{c.description}</p>

                <div style={styles.meta}>
  📍 {c.location?.area || "Not specified"} <br />
  👤 {c.citizen?.email} <br />
  📨 Received:{" "}
  <strong>
    {new Date(c.createdAt).toLocaleDateString()}{" "}
    {new Date(c.createdAt).toLocaleTimeString()}
  </strong>
</div>


                {c.images?.length > 0 && (
                  <div style={styles.imageRow}>
                    {c.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        style={styles.thumb}
                        onClick={() => setPreviewImage(img.url)}
                      />
                    ))}
                  </div>
                )}

                <div style={styles.actionBox}>
                  <input
                    style={styles.input}
                    placeholder="Add official remark"
                    value={comments[c._id] || ""}
                    onChange={(e) =>
                      setComments({ ...comments, [c._id]: e.target.value })
                    }
                  />

                  <select
                    style={styles.select}
                    value={comments[`status_${c._id}`] || c.status}
                    onChange={(e) =>
                      setComments({
                        ...comments,
                        [`status_${c._id}`]: e.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    style={styles.updateBtn}
                    disabled={updatingId === c._id}
                    onClick={() => updateStatus(c._id)}
                  >
                    {updatingId === c._id ? "Updating..." : "Update Status"}
                  </button>
                </div>

                {c.remarks?.length > 0 && (
                  <>
                    <button
                      style={styles.toggleBtn}
                      onClick={() =>
                        setOpenTimeline(openTimeline === c._id ? null : c._id)
                      }
                    >
                      {openTimeline === c._id
                        ? "Hide Status History ▲"
                        : "View Status History ▼"}
                    </button>

                    {openTimeline === c._id && (
                      <RemarksTimeline remarks={c.remarks} />
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>

      {previewImage && (
        <div
          style={styles.modalOverlay}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.closeIcon}
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <img src={previewImage} alt="" style={styles.modalImg} />
          </div>
        </div>
      )}
    </>
  );
}

export default AuthorityDashboard;
