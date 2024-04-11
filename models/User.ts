import { Schema, model, models, Document } from "mongoose";
import { User } from "@/typings";

const UserSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    stripePriceId: { type: String, default: null },
    stripeCurrentPeriodEnd: { type: Date, default: null },
  },
  { timestamps: true },
);

const UserModel = models?.User || model<User>("User", UserSchema);
export default UserModel;
