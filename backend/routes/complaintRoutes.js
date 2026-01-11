import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ======================
   Citizen Routes
====================== */
router.post(
  "/",
  protect,
  authorize("citizen"),
  upload.array("images", 3),
  createComplaint
);

router.get(
  "/my",
  protect,
  authorize("citizen"),
  getMyComplaints
);

router.delete(
  "/:id",
  protect,
  authorize("citizen"),
  deleteComplaint
);

/* ======================
   Authority Routes
====================== */
router.get(
  "/all",
  protect,
  authorize("authority"),
  getAllComplaints
);

router.put(
  "/:id/status",
  protect,
  authorize("authority"),
  updateComplaintStatus
);

/* 🔥 THIS IS REQUIRED */
export default router;
