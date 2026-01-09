function RemarksTimeline({ remarks = [] }) {
  return (
    <div style={{ marginTop: 12 }}>
      {remarks.map((r, i) => (
        <div
          key={i}
          style={{
            background: "#ffffff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <strong style={{ color: "#2563eb", fontSize: 13 }}>
            {r.status.replace("_", " ").toUpperCase()}
          </strong>
          <p style={{ margin: "6px 0", fontSize: 14 }}>{r.comment}</p>
          <small style={{ color: "#6b7280", fontSize: 12 }}>
            {new Date(r.updatedAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default RemarksTimeline;
