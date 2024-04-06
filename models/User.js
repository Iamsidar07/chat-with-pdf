import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, unique: true, sparse: true },
    stripeSubscriptionId: { type: String, unique: true, sparse: true },
    stripePriceId: String,
    stripeCurrentPeriodEnd: Date,
  },
  { timestamps: true },
);

const UserModel = models?.User || model("User", UserSchema);
export default UserModel;
