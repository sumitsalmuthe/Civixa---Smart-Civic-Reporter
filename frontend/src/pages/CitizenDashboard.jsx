import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import RemarksTimeline from "../components/RemarksTimeline";
import "../styles/responsive.css";


/* =========================
   GLOBAL ANIMATIONS
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


  container: {
  maxWidth: 1400,   // 🔥 1200 → 1400
  width: "100%",
  margin: "0 auto",
  background: "#ffffff",
  padding: "36px 40px", // thoda side padding bhi badha diya
  borderRadius: 22,
  boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
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
    marginBottom: 18,
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
  },

  filterRow: {
    display: "flex",
    gap: 12,
    marginBottom: 30,
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: 900,
  width: "100%",
  margin: "0 auto 36px",
  },

  complaintGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", // 🔥 wider cards
  gap: 24,
},


 complaintCard: {
  background: "#ffffff",
  padding: 22, // 🔥 18 → 22
  borderRadius: 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
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
  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [area, setArea] = useState("");
const [images, setImages] = useState([]);
const [category, setCategory] = useState("other");
const [landmark, setLandmark] = useState("");


const handleSubmit = async (e) => {
  e.preventDefault();


  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("area", area);
  formData.append("category", category);
formData.append("landmark", landmark);

  for (let img of images) {
    formData.append("images", img);
  }

  try {
    await API.post("/complaints", formData);
    setTitle("");
    setDescription("");
    setArea("");
    setImages([]);
    fetchMyComplaints();
    alert("Complaint submitted successfully");
  } catch {
    alert("Failed to submit complaint");
  }
};

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
        {/* FORM */}
        <div
           style={{
    ...styles.card,
    maxWidth: 760,      // 🔥 YAHI SIZE CONTROL
    width: "100%",
    margin: "0 auto 36px",
  }}

          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 16px 36px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 10px 26px rgba(0,0,0,0.08)";
          }}
        >
          <h2 style={{ ...styles.formTitle, textAlign: "center" }}>
  Raise a New Complaint
</h2>

<p style={{ textAlign: "center", color: "#6b7280", marginBottom: 14 }}>
  Submit civic issues easily and track their status.
</p>

          <form
  onSubmit={handleSubmit}
  style={{ marginTop: 20 }}
>
  <label style={styles.label}>Title</label>
  <input
    style={styles.input}
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />

  <label style={styles.label}>Description</label>
  <textarea
    style={styles.textarea}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
  />
  {/* CATEGORY */}
<label style={styles.label}>Problem Category</label>
<select
  style={styles.input}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="light">Street Light</option>
  <option value="road">Road / Pothole</option>
  <option value="water">Water Supply</option>
  <option value="garbage">Garbage / Cleanliness</option>
  <option value="other">Other</option>
</select>

  <label style={styles.label}>Area</label>
  <input
    style={styles.input}
    value={area}
    onChange={(e) => setArea(e.target.value)}
  />
{/* LANDMARK */}
<label style={styles.label}>Nearby Landmark (optional)</label>
<input
  style={styles.input}
  placeholder="e.g. Near Metro Station, School, Temple"
  value={landmark}
  onChange={(e) => setLandmark(e.target.value)}
/>
  <label style={styles.label}>Complaint Evidence (optional)</label>
<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    const newFiles = Array.from(e.target.files);

    // total images (old + new)
    const combined = [...images, ...newFiles];

    if (combined.length > 3) {
      alert("You can upload only 3 images");
      return;
    }

    setImages(combined);

    // reset input so same file can be selected again if needed
    e.target.value = "";
  }}
  style={{ marginBottom: 8 }}
/>

{images.length > 0 && (
  <div
    style={{
      display: "flex",
      gap: 12,
      marginBottom: 16,
      flexWrap: "wrap",
    }}
  >
    {images.map((img, index) => (
      <div
        key={index}
        style={{
          position: "relative",
          width: 90,
          height: 90,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #d1d5db",
        }}
      >
        <img
          src={URL.createObjectURL(img)}
          alt="preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* ❌ Remove Image */}
        <button
          type="button"
          onClick={() =>
            setImages(images.filter((_, i) => i !== index))
          }
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "none",
            width: 22,
            height: 22,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

<p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
  You can upload a maximum of 3 images (JPG / PNG)
</p>

<p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
  You can upload a maximum of 3 images (JPG / PNG)
</p>


  <button style={styles.submitBtn} type="submit">
    Submit Complaint
  </button>
</form>

        </div>

        {/* FILTER */}
        <div style={styles.filterRow}>
          <input
            style={styles.input}
            placeholder="Search by title or area"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={styles.input}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
<h2
  style={{
    textAlign: "center",
    margin: "30px 0 20px",
    fontSize: 26,
    fontWeight: 700,
  }}
>
  My Complaints
</h2>


        {/* COMPLAINTS */}
        {loading && <p>Loading...</p>}
        
<div className="complaint-grid">

          {filteredComplaints.map((c) => (
            <div
              key={c._id}
              style={styles.complaintCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 34px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 22px rgba(0,0,0,0.06)";
              }}
            >
              <div style={styles.header}>
                <strong>{c.title}</strong>
                <StatusBadge status={c.status} />
              </div>

              <p>{c.description}</p>

              <div style={styles.meta}>
                📍 {c.area || "N/A"} <br />
                🕒 {new Date(c.createdAt).toLocaleString()}
              </div>

              {/* 🖼️ Complaint Images (Citizen View) */}
{c.images?.length > 0 && (
  <div style={styles.imageRow}>
    {c.images.map((img, i) => (
      <img
        key={i}
        src={img.url}
        alt="complaint"
        style={styles.thumb}
        onClick={() => window.open(img.url, "_blank")}
      />
    ))}
  </div>
)}

              <div style={styles.actionRow}>
  <button
    style={styles.viewBtn}
    onClick={() =>
      setOpenTimeline(openTimeline === c._id ? null : c._id)
    }
  >
    {openTimeline === c._id
      ? "Hide Status History ▲"
      : "View Status History ▼"}
  </button>

  <button
    style={{
      ...styles.deleteBtn,
      opacity: c.status === "pending" ? 1 : 0.5,
      cursor: c.status === "pending" ? "pointer" : "not-allowed",
    }}
    disabled={c.status !== "pending"}
    onClick={async () => {
      if (c.status !== "pending") return;
      if (!window.confirm("Delete this complaint?")) return;
      try {
        await API.delete(`/complaints/${c._id}`);
        fetchMyComplaints();
      } catch {
        alert("Cannot delete complaint after authority action");
      }
    }}
  >
    Delete
  </button>
</div>


              {openTimeline === c._id && (
                <RemarksTimeline remarks={c.remarks || []} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CitizenDashboard;
