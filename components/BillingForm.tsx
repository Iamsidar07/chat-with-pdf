"use client";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import { getUserSubscriptionPlan } from "@/utils/stripe";
import { useTransition } from "react";
import { createStripeSession } from "@/actions";
import { useToast } from "./ui/use-toast";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}
const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast();
  const [isLoading, startTransition] = useTransition();
  const createSession = () => {
    startTransition(async () => {
      try {
        const session = await createStripeSession();
        if (session?.url) {
          window.location.href = session.url ?? "/dashboard/billing";
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to create session.",
          description: "Please try again letter.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on <strong>{subscriptionPlan?.name}</strong>{" "}
              plan.
            </CardDescription>
          </CardHeader>
          <CardHeader className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isLoading ? (
                <Loader className="mr-4 w-4 h-4 animate-spin" />
              ) : null}
              {subscriptionPlan?.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to PRO"}
            </Button>
            {subscriptionPlan?.isSubscribed ? (
              <p className="rounded-full text-sm font-medium">
                {subscriptionPlan?.isCanceled
                  ? "Your plan will be cancel on "
                  : "Your plan review on "}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
              </p>
            ) : null}
          </CardHeader>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
