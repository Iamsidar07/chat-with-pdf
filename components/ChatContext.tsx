import React, { ChangeEvent, createContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { InfiniteQueryResult, TData } from "@/typings";

interface IChatContext {
  message: string;
  addMessage: () => void;
  isLoading: boolean;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface ChatContextProviderProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContext = createContext<IChatContext>({
  message: "",
  isLoading: false,
  addMessage: () => {},
  handleInputChange: () => {},
});

const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const lastMsgRef = useRef("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: sendMessage, error } = useMutation<
    Promise<ReadableStream<Uint8Array>>,
    { message: string }
  >({
    mutationKey: ["sendMessage"],
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });
      if (!response.ok) {
        toast({
          title: "Unable to send message",
          description: "Please try again in a moment",
          variant: "destructive",
        });
      }
      return response.body;
    },
    onMutate: async ({ message }: { message: string }) => {
      lastMsgRef.current = message;
      setMessage("");
      await queryClient.cancelQueries({
        queryKey: ["messages"],
      });
      const previousMessages: InfiniteQueryResult | undefined =
        queryClient.getQueryData(["messages"]);
      queryClient.setQueryData(
        ["messages"],
        (oldMessages: InfiniteQueryResult) => {
          if (!oldMessages) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          const newPages = [...oldMessages.pages];
          const latestPage = newPages[0];
          latestPage.messages = [
            {
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
              createdAt: new Date().toISOString(),
            },
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;
          return {
            ...oldMessages,
            pages: newPages,
          };
        },
      );
      setIsLoading(true);
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page: TData) => page.messages) ?? [],
      };
    },
    onSettled: async () => {
      setIsLoading(false);
      await queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
    onError: (_: any, __: any, context: { previousMessages: any }) => {
      setMessage(lastMsgRef.current);
      setIsLoading(false);
      queryClient.setQueryData(["messages"], {
        messages: context?.previousMessages ?? [],
      });
    },
    onSuccess: async (stream: ReadableStream<Uint8Array>) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem in sending message.",
          description: "Please refresh this page and try again.",
          variant: "destructive",
        });
      }
      const reader = stream?.getReader();
      const decoder = new TextDecoder();
      let isComplete = false;
      let text = "";
      while (!isComplete) {
        const { value, done: doneReading } = await reader.read();
        isComplete = doneReading;
        const chunkValue = decoder.decode(value);
        text += chunkValue;
      }
      try {
        queryClient.setQueryData(
          ["messages"],
          (oldMessages: InfiniteQueryResult) => {
            if (!oldMessages) {
              return {
                pages: [],
                pageParams: [],
              };
            }
            const isAIResponseCreated = oldMessages.pages.some((page) => {
              page.messages.some((msg) => msg.id === "ai-response");
            });
            const updatedPages = oldMessages.pages.map((page) => {
              if (page === oldMessages.pages[0]) {
                let updatedMessages;
                if (!isAIResponseCreated) {
                  updatedMessages = [
                    {
                      id: "ai-response",
                      isUserMessage: false,
                      text,
                      createdAt: new Date().toISOString(),
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((msg) => {
                    if (msg.id === "ai-response") {
                      return {
                        ...msg,
                        text,
                      };
                    }
                    return msg;
                  });
                }
                return {
                  ...page,
                  messages: updatedMessages,
                };
              }
              return page;
            });
            return {
              ...oldMessages,
              pages: updatedPages,
            };
          },
        );
      } catch (error) {
        console.log("FAILED UPDATED MESSAGES: ", error);
      }
    },
  });
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const addMessage = () => sendMessage({ message });
  console.log(error);
  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        isLoading,
        handleInputChange,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
