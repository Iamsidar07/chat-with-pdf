import UserModel from "@/models/User";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") ?? "";
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    });
  }

  if (event.type === "checkout.session.completed") {
    // TODO: Understand this piece of code
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    const user = await UserModel.findOneAndUpdate(
      { id: session.metadata.userId },
      {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
      { new: true },
    );
    console.log({ user });
  }

  if (event.type === "invoice.payment_succeeded") {
    //TODO: I have to understand this part of the code.
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    await UserModel.findOneAndUpdate(
      {
        stripeSubscriptionId: subscription.id,
      },

      {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    );
  }

  return new Response(null, { status: 200 });
};
