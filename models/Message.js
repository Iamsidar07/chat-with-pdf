import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    id: String,
    text: String,
    isUserMessage: Boolean,
    userId: { type: String, required: true },
    fileId: { type: Schema.Types.ObjectId, ref: "File" },
  },
  { timestamps: true },
);
const MessageModel = models.Message || model("Message", MessageSchema);
export default MessageModel;
