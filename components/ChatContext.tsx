import React, { ChangeEvent, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({ message }: { message: string }) => {
      const res = await axios.post("/api/message", {
        fileId,
        message,
      });
      console.log(res.data);
      return res.data;
    },
    onSuccess: async (stream) => {
      console.log({ stream });
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem in sending message.",
          description: "Please refresh this page and try again.",
          variant: "destructive",
        });
      }
      const reader = new stream.getReader();
      const decoder = new TextDecoder();
      let isComplete = false;
      let text = "";
      while (!isComplete) {
        const { value, done: doneReading } = await reader.read();
        isComplete = doneReading;
        const chunkValue = decoder.decode(value);
        text += chunkValue;
      }
      console.log({ text });
    },
  });
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const addMessage = () => sendMessage({ message });
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

