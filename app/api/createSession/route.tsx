import { PLANS } from "@/config/stripe";
import UserModel from "@/models/User";
import { absoluteUrl } from "@/utils";
import { getUserSubscriptionPlan, stripe } from "@/utils/stripe";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    const bilingUrl = absoluteUrl("/dashboard/billing");
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const dbUser = await UserModel.findOne({
      id: userId,
    });
    if (!dbUser) {
      return NextResponse.json("Not found", { status: 404 });
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
      return NextResponse.json({ url: stripeSession.url }, { status: 200 });
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
    return NextResponse.json(
      { url: stripeSessionForUserNotSubscribed.url },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json("Failed to create session", { status: 500 });
  }
};
