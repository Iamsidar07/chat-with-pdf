"use server";

import { PLANS } from "@/config/stripe";
import UserModel from "@/models/User";
import { absoluteUrl } from "@/utils";
import { getUserSubscriptionPlan, stripe } from "@/utils/stripe";
import { auth } from "@clerk/nextjs";

export const createStripeSession = async () => {
  const { userId } = auth();
  const bilingUrl = absoluteUrl("/dashboard/billing");
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await UserModel.findOne({
    id: userId,
  });
  if (!dbUser) {
    throw new Error("User not found");
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
};
