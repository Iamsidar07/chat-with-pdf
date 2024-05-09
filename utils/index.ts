import { getUserSubscriptionPlan, stripe } from "./stripe";
import UserModel from "@/models/User";
import { PLANS } from "@/config/stripe";
import dbConnect from "@/db";

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export async function createSession(userId: string) {
  try {
    await dbConnect();
    const bilingUrl = absoluteUrl("/dashboard/billing");
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const dbUser = await UserModel.findOne({
      id: userId,
    });
    if (!dbUser) {
      throw new Error("Not found");
    }
    const subscriptionPlan = await getUserSubscriptionPlan();
    if (!subscriptionPlan) {
      throw new Error("subscriptionPlan not found.");
    }
    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: bilingUrl,
      });
      return { url: stripeSession.url };
    }

    const stripeSessionForUserNotSubscribed =
      await stripe.checkout.sessions.create({
        success_url: bilingUrl,
        cancel_url: bilingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: PLANS.find((plan) => plan.name === "Silver")?.price.priceId
              .test,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
        },
      });
    return { url: stripeSessionForUserNotSubscribed.url };
  } catch (error) {
    console.log("Failed createSession: ", error);
  }
}
