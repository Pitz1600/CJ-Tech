import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // Reference to user's email
    title: { type: String, required: true },
    description: { type: String, required: true },
    hasDeadline: { type: Boolean, default: false },
    deadline: { type: Date }, // Only used if hasDeadline is true
    status: {
    type: String,
    enum: ["In Progress", "Completed"],
    default: "In Progress",
    },
    images: [{ type: String }], // Store image file URLs or paths
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const taskModel = mongoose.models.task || mongoose.model("task", taskSchema);
export default taskModel;