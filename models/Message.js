import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    _id: { type: String, default: () => uuid() },
    text: String,
    isUserMessage: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, ref: "User" },
    fileId: { type: String, ref: "File" },
  },
  { timestamp: true },
);
const MessageModel = models.Message || model("Message", MessageSchema);
export default MessageModel;
