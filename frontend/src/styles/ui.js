import { colors } from "./theme";

export const layout = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    padding: "32px",
  },
};

export const card = {
  background: colors.card,
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
};

export const button = {
  primary: {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  danger: {
    background: colors.danger,
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    fontWeight: 600,
  },
};

export const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: `1px solid ${colors.border}`,
  outline: "none",
};

