import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import RemarksTimeline from "../components/RemarksTimeline";
import "../styles/responsive.css";

/* =========================
   GLOBAL ANIMATION
========================= */
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
`;
document.head.appendChild(animationStyle);



/* =========================
   STYLES
========================= */
const styles = {
  page: {
    padding: "36px 20px",
    background: "#f4f6f8",
    minHeight: "100vh",
    animation: "fadeIn 0.4s ease",
  },

  card: {
    background: "#ffffff",
    padding: 22,
    borderRadius: 18,
    marginBottom: 28,
    boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  formTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center",
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 14,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    minHeight: 100,
    marginBottom: 14,
    borderRadius: 12,
    border: "1px solid #d1d5db",
  },

  submitBtn: {
    marginTop: 10,
    padding: "14px",
    width: "100%",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  filterRow: {
    display: "flex",
    gap: 12,
    marginBottom: 30,
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: 900,
    margin: "0 auto 36px",
  },

  complaintGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
    gap: 24,
  },

  complaintCard: {
    background: "#ffffff",
    padding: 22,
    borderRadius: 18,
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  meta: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },

  actionRow: {
    marginTop: 14,
    display: "flex",
    gap: 12,
  },

  viewBtn: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
  },

  imageRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },

  thumb: {
    width: 60,
    height: 60,
    objectFit: "cover",
    borderRadius: 6,
    cursor: "pointer",
    border: "1px solid #e5e7eb",
  },
};

/* =========================
   COMPONENT
========================= */
function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTimeline, setOpenTimeline] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* Form state */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("other");
  const [landmark, setLandmark] = useState("");
  const [images, setImages] = useState([]);

  /* UX states */
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMyComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("area", area);
    formData.append("category", category);
    formData.append("landmark", landmark);

    images.forEach((img) => formData.append("images", img));

    try {
      await API.post("/complaints", formData);
      setTitle("");
      setDescription("");
      setArea("");
      setImages([]);
      setSuccessMsg("Complaint submitted successfully ✅");
      fetchMyComplaints();
    } catch {
      setErrorMsg("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.area?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* ================= FORM ================= */}
        <div style={{ ...styles.card, maxWidth: 760, margin: "0 auto 36px" }}>
          <h2 style={styles.formTitle}>Raise a New Complaint</h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 16 }}>
            Submit civic issues easily and track their status.
          </p>

          {successMsg && (
            <div
              style={{
                background: "#ecfdf5",
                color: "#065f46",
                padding: 12,
                borderRadius: 10,
                marginBottom: 14,
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                padding: 12,
                borderRadius: 10,
                marginBottom: 14,
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label style={styles.label}>Problem Category</label>
            <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="light">Street Light</option>
              <option value="road">Road / Pothole</option>
              <option value="water">Water Supply</option>
              <option value="garbage">Garbage / Cleanliness</option>
              <option value="other">Other</option>
            </select>

            <label style={styles.label}>Area</label>
            <input style={styles.input} value={area} onChange={(e) => setArea(e.target.value)} />

            <label style={styles.label}>Nearby Landmark (optional)</label>
            <input style={styles.input} value={landmark} onChange={(e) => setLandmark(e.target.value)} />

            <label style={styles.label}>Complaint Evidence (optional)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length + images.length > 3) {
                alert("You can upload only 3 images");
                return;
              }
              setImages([...images, ...files]);
              e.target.value = "";
            }} />

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        {/* ================= FILTER ================= */}
        <div style={styles.filterRow}>
          <input style={styles.input} placeholder="Search by title or area" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select style={styles.input} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* ================= COMPLAINTS ================= */}
        {loading && <p>Loading...</p>}

        {!loading && filteredComplaints.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            <h3>No complaints yet</h3>
            <p>Raise your first complaint using the form above.</p>
          </div>
        )}

        <div className="complaint-grid">
          {filteredComplaints.map((c) => (
            <div key={c._id} style={styles.complaintCard}>
              <div style={styles.header}>
                <strong>{c.title}</strong>
                <StatusBadge status={c.status} />
              </div>

              <p>{c.description}</p>

              <div style={styles.meta}>
  📍 {c.area || "N/A"} <br />
  📨 Submitted on:{" "}
  <strong>
    {new Date(c.createdAt).toLocaleDateString()}{" "}
    {new Date(c.createdAt).toLocaleTimeString()}
  </strong>
</div>


              {c.images?.length > 0 && (
                <div style={styles.imageRow}>
                  {c.images.map((img, i) => (
                    <img key={i} src={img.url} alt="" style={styles.thumb} onClick={() => window.open(img.url, "_blank")} />
                  ))}
                </div>
              )}

              <div style={styles.actionRow}>
                <button style={styles.viewBtn} onClick={() => setOpenTimeline(openTimeline === c._id ? null : c._id)}>
                  {openTimeline === c._id ? "Hide Status History ▲" : "View Status History ▼"}
                </button>

                <button
                  style={{ ...styles.deleteBtn, opacity: c.status === "pending" ? 1 : 0.5 }}
                  disabled={c.status !== "pending"}
                  onClick={async () => {
                    if (!window.confirm("Delete this complaint?")) return;
                    await API.delete(`/complaints/${c._id}`);
                    fetchMyComplaints();
                  }}
                >
                  Delete
                </button>
              </div>

              {openTimeline === c._id && <RemarksTimeline remarks={c.remarks || []} />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CitizenDashboard;
