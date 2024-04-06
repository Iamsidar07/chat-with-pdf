import { currentUser } from "@clerk/nextjs";
import { getUserSubscriptionPlan, stripe } from "./stripe";
import UserModel from "@/models/User";
import { PLANS } from "@/config/stripe";

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export async function createSession() {
  const user = await currentUser();
  const bilingUrl = absoluteUrl("/dashboard/billing");
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const dbUser = await UserModel.findOne({
    id: user?.id,
  });
  if (!dbUser) {
    throw new Error("Not found");
  }
  const subscriptionPlan = await getUserSubscriptionPlan();
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
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceId.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user?.id,
      },
    });
  return { url: stripeSessionForUserNotSubscribed.url };
}
