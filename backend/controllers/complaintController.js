import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

/* create complaint */
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, area, landmark } = req.body;

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "smart-civic-reporter/complaints",
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const complaint = await Complaint.create({
      title,
      description,
      category: category || "other",
      location: {
        area: area || "Not specified",
        landmark: landmark || "",
      },
      citizen: req.user.id,
      images: uploadedImages,
    });

    const authorities = await User.find({ role: "authority" });
    if (authorities.length > 0) {
      await Notification.insertMany(
        authorities.map((a) => ({
          user: a._id,
          complaint: complaint._id,
          message: `🆕 New complaint received: "${complaint.title}"`,
        }))
      );
    }

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create complaint" });
  }
};

/* get my complaints */
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/*get all complaints*/
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("citizen", "email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* update status*/
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate("citizen");
    if (!complaint) return res.status(404).json({ message: "Not found" });

    complaint.status = status;
    complaint.remarks.push({
      status,
      comment,
      updatedBy: req.user.id,
      createdAt: new Date(),
    });

    await complaint.save();

    await Notification.create({
      user: complaint.citizen._id,
      complaint: complaint._id,
      message: `Status updated to ${status}`,
    });

    res.json({ message: "Updated", complaint });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

/* delete complaint*/
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Not found" });

    if (complaint.citizen.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (complaint.images?.length) {
      for (const img of complaint.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await complaint.deleteOne();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
