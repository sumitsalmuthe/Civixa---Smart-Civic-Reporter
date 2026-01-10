import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ComplaintCharts({ complaints = [] }) {
  const data = [
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "pending").length,
    },
    {
      name: "In Progress",
      value: complaints.filter((c) => c.status === "in_progress").length,
    },
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "resolved").length,
    },
  ];

  const COLORS = ["#f97316", "#3b82f6", "#16a34a"];

  return (
    <div style={styles.card}>
      <h3 style={{ marginBottom: 10 }}>Complaint Status Overview</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComplaintCharts;

/* Style */
const styles = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
};
