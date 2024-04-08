import { PLANS } from "@/config/stripe";
import dbConnect from "@/db";
import UserModel from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function getUserSubscriptionPlan() {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user?.id) {
      return {
        ...PLANS[0],
        isSubscribed: false,
        isCanceled: false,
        stripeCurrentPeriodEnd: null,
      };
    }
    const dbUser = await UserModel.findOne({
      id: user.id,
    });

    if (!dbUser) {
      return {
        ...PLANS[0],
        isSubscribed: false,
        isCanceled: false,
        stripeCurrentPeriodEnd: null,
      };
    }

    const isSubscribed = Boolean(
      dbUser.stripePriceId &&
        dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
        dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now(),
    );

    const plan = isSubscribed
      ? PLANS.find((plan) => plan.price.priceId.test === dbUser.stripePriceId)
      : null;

    let isCanceled = false;
    if (isSubscribed && dbUser.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        dbUser.stripeSubscriptionId,
      );
      isCanceled = stripePlan.cancel_at_period_end;
    }
    console.log({ plan, dbUser });

    return {
      ...plan,
      stripeSubscriptionId: dbUser.stripeSubscriptionId,
      stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
      stripeCustomerId: dbUser.stripeCustomerId,
      isSubscribed,
      isCanceled,
    };
  } catch (error) {
    console.log("Failed getUserSubscriptionPlan: ", error);
  }
}
