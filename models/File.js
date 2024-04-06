import { Schema, model, models } from "mongoose";

const FileSchema = new Schema(
  {
    name: String,
    uploadStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "FAILED", "UPLOAD"],
      default: "PENDING",
    },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    url: String,
    key: String,
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

const FileModel = models.File || model("File", FileSchema);
export default FileModel;
