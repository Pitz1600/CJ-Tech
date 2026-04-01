import mongoose from "mongoose";

const jobOrderSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  device: { type: String, required: true },
  customerName: { type: String, required: true },
  issueDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  priority: { type: Boolean, default: false },
  revenue: { type: Number, default: 0 },
  deadline: { type: Date }
}, { timestamps: true });

const jobOrderModel = mongoose.models.jobOrder || mongoose.model("jobOrder", jobOrderSchema);

export default jobOrderModel;
