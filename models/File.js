import { Schema, model, models } from "mongoose";

const FileSchema = new Schema(
  {
    _id: { type: String, default: () => uuid() },
    name: String,
    uploadStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "FAILED", "SUCCESS"],
      default: "PENDING",
    },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    url: String,
    key: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, ref: "User" },
  },
  { timestamp: true },
);

const FileModel = models.File || model("File", FileSchema);
export default FileModel;
