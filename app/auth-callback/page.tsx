"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const {
    data: isAuth,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await axios.get("/api/auth-callback");
      return response.data;
    },
    retryDelay: (_failureCount) => 5,
  });
  if (isAuth?.success) {
    router.push(origin ? `/${origin}` : "/dashboard");
  }
  if (isAuth?.status === 401) {
    router.push("/sign-in");
  }
  if (error) {
    alert("Something went wrong!");
  }

  return (
    <div className="w-full mt-24 grid place-items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h3 className="text-xl font-semibold">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};
export default Page;
