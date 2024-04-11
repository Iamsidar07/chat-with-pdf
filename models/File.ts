import { Schema, model, models, Document } from "mongoose";
import { TFile } from "@/typings";

const FileSchema = new Schema<TFile>(
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

const FileModel = models.File || model<TFile>("File", FileSchema);
export default FileModel;
