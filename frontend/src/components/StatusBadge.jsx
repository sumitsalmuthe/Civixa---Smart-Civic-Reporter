function StatusBadge({ status }) {
  const map = {
    pending: { bg: "#fee2e2", color: "#991b1b" },
    in_progress: { bg: "#fef3c7", color: "#92400e" },
    resolved: { bg: "#dcfce7", color: "#166534" },
  };

  const label =
    status === "in_progress"
      ? "In Progress"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 700,
        background: map[status]?.bg,
        color: map[status]?.color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
