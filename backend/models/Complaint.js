import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "other",
    },

    location: {
      area: String,
      landmark: String,
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

    remarks: [remarkSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Complaint", complaintSchema);