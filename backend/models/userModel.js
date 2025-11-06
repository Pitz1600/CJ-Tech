import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  category: String,
  type: String,
  original_text: String,
  correction: String,
  reason_of_correction: String,
  sentiment_score: String,
  words_detected: String,
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  date: { type: Date, default: Date.now },
  results: { type: [resultSchema], default: [] },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  analyses: { type: [analysisSchema], default: [] },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;