"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, Link, Loader, XCircle } from "lucide-react";
import ChatInput from "./ChatInput";
import ChatContextProvider from "@/components/ChatContext";
import Messages from "@/components/Messages";
import { getUserSubscriptionPlan } from "@/utils/stripe";

interface ChatWrapperProps {
  fileId: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}
const ChatWrapper = ({ fileId, subscriptionPlan }: ChatWrapperProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [fileId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/api/getFileUploadStatus?fileId=${fileId}`
        );
        return response.data;
      } catch (error: any) {
        console.error("FAILED: getFileUploadStatus", error.message);
      }
    },
    refetchInterval: (query: any) => {
      const data = query?.state?.data;
      return data?.status == "UPLOAD" || data?.status == "FAILED" ? false : 500;
    },
  });
  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-zinc-50 flex flex-col divide-y divide-zinc-200 gap-2">
        <div className="flex-1 flex flex-col items-center justify-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-zinc-400 text-sm">We are preparing your pdf</p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }
  if (data?.status === "PROCESSING") {
    return (
      <div className="relative min-h-screen bg-zinc-50 flex flex-col divide-y divide-zinc-200 gap-2">
        <div className="flex-1 flex flex-col items-center justify-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            <h3 className="font-semibold text-xl">Processing...</h3>
            <p className="text-zinc-400 text-sm">It won&apos;t take to long.</p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }
  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-screen bg-zinc-50 flex flex-col divide-y divide-zinc-200 gap-2">
        <div className="flex-1 flex flex-col items-center justify-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-xl">
              Failed to process your pdf
            </h3>
            <p className="text-zinc-400 text-sm">Too many pages in your pdf</p>
            <p className="text-zinc-500 text-sm">
              Your{" "}
              <span className="font-semibold font-mono">
                {subscriptionPlan?.name}
              </span>{" "}
              plan ony support {subscriptionPlan?.pagesPerPdf} pages per pdf.
            </p>
            <Link
              href={"/dashboard"}
              className="flex items-center gap-2 mt-6 bg-zinc-100 px-4 py-2.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-semibold">Back</span>
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative h-[calc(100vh-3.5rem)] bg-zinc-50 flex flex-col divide-y divide-zinc-200 gap-2">
        <div className="flex-1 flex flex-col mb-28">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
