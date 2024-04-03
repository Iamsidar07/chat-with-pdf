"use clinet";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader, MessageSquareDashed } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { useIntersection } from "@mantine/hooks";
import Message from "./Message";

const Messages = ({ fileId }: { fileId: string }) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection();
  const { isLoading: isAIThinking } = useContext(ChatContext);
  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["messages", fileId],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(
        `/api/getFileMessages?fileId=${fileId}&pageNum=${pageParam}`,
      );
      const data = res.data;
      return { ...data, pageNum: pageParam };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.pageNum + 1;
      }
      return false;
    },
  });
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);
  const messages = data?.pages.reduce((acc, page) => {
    return [...acc, ...page.messages];
  }, []);
  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    text: (
      <span className="h-full grid place-items-center">
        <Loader className="h-4 w-4 animate-spin" />
      </span>
    ),
    isUserMessage: false,
  };

  const combinedMessages = [
    isAIThinking ? [loadingMessage] : [],
    ...(messages ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem] border-zinc-200 flex-col-reverse gap-3 overflow-y-auto overflow-x-hidden">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages?.map((msg, i) => {
          const isNextMessageBySamePerson =
            msg.isUserMessage === combinedMessages[i - 1].isUserMessage;
          if (isNextMessageBySamePerson) {
            // next msg by same person
            return (
              <Message
                key={msg.id}
                isNextMessageBySamePerson={isNextMessageBySamePerson}
                message={msg}
              />
            );
          }
          if (i === combinedMessages.length - 1) {
            // last msg
            return (
              <Message
                key={msg.id}
                isNextMessageBySamePerson={isNextMessageBySamePerson}
                message={msg}
                ref={ref}
              />
            );
          }

          return "";
        })
      ) : isLoading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader className="w-4 h-4 animate-spin" />
          <h2 className="text-sm text-zinc-900">
            Your messages being loading...
          </h2>
        </div>
      ) : (
        <div className="w-full h-full grid place-items-center">
          <MessageSquareDashed className="w-4 h-4 animate-spin" />
          <h2 className="text-sm text-zinc-900">
            Nothing to show here! Start your first chat with your lovely PDF
          </h2>
        </div>
      )}
    </div>
  );
};
export default Messages;
