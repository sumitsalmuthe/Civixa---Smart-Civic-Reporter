import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: { type: String, default: "other" },

    location: {
      area: { type: String, default: "Not specified" },
      landmark: { type: String, default: "" },
    },

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    images: [
  {
    url: String,
    public_id: String,
  },
],

    remarks: [
      {
        status: {
          type: String,
          enum: ["pending", "in_progress", "resolved", "rejected"],
          required: true,
        },
        comment: { type: String, required: true },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
