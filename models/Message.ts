import { Schema, model, models } from "mongoose";

interface Message extends Document {
  id: string;
  text: string;
  isUserMessage: boolean;
  userId: string;
  fileId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<Message>(
  {
    id: String,
    text: String,
    isUserMessage: Boolean,
    userId: { type: String, required: true },
    fileId: { type: Schema.Types.ObjectId, ref: "File" },
  },
  { timestamps: true },
);
const MessageModel = models.Message || model<Message>("Message", MessageSchema);
export default MessageModel;
