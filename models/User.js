import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
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

const UserModel = models?.User || model("User", UserSchema);
export default UserModel;
