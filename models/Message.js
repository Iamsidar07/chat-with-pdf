import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    text: String,
    isUserMessage: Boolean,
    userId: { type: String, ref: "User" },
    fileId: { type: String, ref: "File" },
  },
  { timestamp: true },
);
const MessageModel = models.Message || model("Message", MessageSchema);
export default MessageModel;
