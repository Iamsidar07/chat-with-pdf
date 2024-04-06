import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/utils/stripe";

const Page = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return <BillingForm subscriptionPlan={subscriptionPlan} />;
};

export default Page;
