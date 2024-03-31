import Dashboard from "@/components/Dashboard";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard`);

  return <Dashboard userId={user?.id ?? ""} />;
};
export default page;
