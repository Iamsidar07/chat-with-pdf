import Dashboard from "@/components/Dashboard";
import { getUserSubscriptionPlan } from "@/utils/stripe";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  const user = await currentUser();
  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard`);

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
};
export default page;
