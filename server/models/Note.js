import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    subject: { type: String, default: "general" }, // ✅ mặc định lowercase
    read: { type: Boolean, default: false } // ✅ trạng thái: đã hoàn thành hay chưa
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
