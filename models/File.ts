import { Schema, model, models, Document } from "mongoose";

interface TFile extends Document {
  name: string;
  uploadStatus: "PENDING" | "PROCESSING" | "FAILED" | "UPLOAD";
  messages: [Schema.Types.ObjectId];
  url: string;
  key: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

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
