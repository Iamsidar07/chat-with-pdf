"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Loader } from "lucide-react";

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
      try {
        const response = await axios.get("/api/auth-callback");
        return response.data;
      } catch (error) {
        throw new Error("Failed to authenticate");
      }
    },
    retryDelay: (_failureCount) => 5,
  });
  useEffect(() => {
    if (!isLoading && isAuth) {
      if (isAuth.success) {
        router.push(origin ? `/${origin}` : "/dashboard");
      } else if (isAuth.status === 401) {
        router.push("/sign-in");
      }
    }
  }, [isLoading, isAuth, origin, router]);
  if (error) {
    alert("Something went wrong!");
  }

  return (
    <div className="w-full mt-24 grid place-items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader className="w-6 h-6 animate-spin" />
        <h3 className="text-xl font-semibold">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};
export default Page;
