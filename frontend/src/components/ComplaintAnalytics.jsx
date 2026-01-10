import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ComplaintAnalytics = ({ complaints }) => {

  // Status Data
  const statusData = [
    {
      name: "Pending",
      count: complaints.filter((c) => c.status === "pending").length,
    },
    {
      name: "In Progress",
      count: complaints.filter((c) => c.status === "in_progress").length,
    },
    {
      name: "Resolved",
      count: complaints.filter((c) => c.status === "resolved").length,
    },
  ];

  // Category Data
  const categoryMap = {};
  complaints.forEach((c) => {
    const cat = c.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    count: categoryMap[key],
  }));

  return (
    <div style={styles.wrapper}>
      <h3>Complaint Analytics</h3>

      {/* Status Chart */}
      <div style={styles.chartBox}>
        <h4>Status Overview</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Chaart */}
      <div style={styles.chartBox}>
        <h4>Category-wise Distribution</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintAnalytics;

const styles = {
  wrapper: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  chartBox: {
    marginTop: 20,
  },
};
