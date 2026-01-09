function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status) {
      case "resolved":
        return { background: "#d1e7dd", color: "#0f5132" };
      case "in_progress":
        return { background: "#fff3cd", color: "#664d03" };
      default:
        return { background: "#f8d7da", color: "#842029" };
    }
  };

  const label =
    status === "in_progress"
      ? "In Progress"
      : status[0].toUpperCase() + status.slice(1);

  return (
    <span style={{ ...styles.badge, ...getStyle() }}>
      {label}
    </span>
  );
}

export default StatusBadge;

const styles = {
  badge: {
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",

    whiteSpace: "nowrap",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
  },
};
