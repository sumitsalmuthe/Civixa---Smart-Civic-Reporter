import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import RemarksTimeline from "../components/RemarksTimeline";
import ComplaintCharts from "../components/ComplaintCharts";

const skeletonStyle = document.createElement("style");
skeletonStyle.innerHTML = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;
document.head.appendChild(skeletonStyle);

const widthFixStyle = document.createElement("style");
widthFixStyle.innerHTML = `
/* Desktop width control */
@media (min-width: 992px) {
  .container-narrow {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
}
`;
document.head.appendChild(widthFixStyle);

/*Global Animation*/
const animationStyle = document.createElement("style");
animationStyle.innerHTML = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;
document.head.appendChild(animationStyle);

/*Style*/
const styles = {
  skeletonLine: {
  height: 14,
  borderRadius: 8,
  background:
    "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)",
  backgroundSize: "400px 100%",
  animation: "shimmer 1.2s infinite",
},

skeletonCard: {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
},

  page: {
    padding: "36px 24px",
    background: "#f4f6f8",
    minHeight: "100vh",
    animation: "fadeIn 0.4s ease",
  },

  welcomeCard: {
    background: "#ffffff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  filters: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "8px 14px",
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
    gap: 20,
    maxWidth: 1200,
    margin: "0 auto",
  },

  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
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
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
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
    transition: "transform 0.15s ease",
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

  emptyState: {
    background: "#ffffff",
    padding: 40,
    borderRadius: 18,
    textAlign: "center",
    color: "#6b7280",
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    position: "relative",
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

  downloadBtn: {
    width: "100%",
    padding: "12px",
    background: "#0b5ed7",
    color: "#ffffff",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};

const responsiveStyle = document.createElement("style");
responsiveStyle.innerHTML = `
/* Desktop only */
@media (min-width: 768px) {
  .filters-center {
    justify-content: center;
  }
}
`;
document.head.appendChild(responsiveStyle);

/* Components */
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
       <div style={styles.welcomeCard} className="container-narrow">

          <h2>Authority Dashboard</h2>
          <p>Review and manage civic complaints</p>
        </div>

        <div className="container-narrow">
  <ComplaintCharts complaints={complaints} />
</div>


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
              <div
                key={c._id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 24px rgba(0,0,0,0.08)";
                }}
              >
                <div style={styles.cardHeader}>
                  <h4>{c.title}</h4>
                  <StatusBadge status={c.status} />
                </div>

                <p style={styles.description}>{c.description}</p>

                <div style={styles.meta}>
                  📍 {c.location?.area || "Not specified"} <br />
                  👤 {c.citizen?.email}
                </div>

                {c.images?.length > 0 && (
                  <div style={styles.imageRow}>
                    {c.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        style={styles.thumb}
                        onClick={() => setPreviewImage(img.url)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.08)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 16px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
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
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {updatingId === c._id ? "Updating..." : "Update Status"}
                  </button>
                </div>

                {c.remarks?.length > 0 && (
                  <>
                    <button
                      style={styles.toggleBtn}
                      onClick={() =>
                        setOpenTimeline(
                          openTimeline === c._id ? null : c._id
                        )
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

            <button style={styles.downloadBtn}>⬇ Download</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthorityDashboard;
