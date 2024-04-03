import React, {ChangeEvent, createContext, useRef, useState} from "react";
import {useInfiniteQuery, useMutation, useQueryClient,} from "@tanstack/react-query";
import axios from "axios";
import {useToast} from "@/components/ui/use-toast";

const LIMIT = 10;

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

interface IFileMessages {
    messages: [];
    nextCursor: string;
}

export const ChatContext = createContext<IChatContext>({
    message: "",
    isLoading: false,
    addMessage: () => {
    },
    handleInputChange: () => {
    },
});

const ChatContextProvider = ({
                                 fileId,
                                 children,
                             }: ChatContextProviderProps) => {
    const queryClient = useQueryClient();
    const {toast} = useToast();
    const lastMsgRef = useRef("");
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchProjects = async ({pageParam}: { pageParam: number }) => {
        console.log({pageParam});
        const res = await axios.get(
            `/api/getFileMessages?fileId=${fileId}&pageNum=${pageParam}`,
        );
        console.log({res});
        const data = res.data;
        return {...data, pageNum: pageParam};
    };

    const {data} = useInfiniteQuery({
        queryKey: ["getFileMessages", fileId],
        queryFn: fetchProjects,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            console.log({lastPage});
            if (lastPage?.hasMore) {
                return lastPage?.pageNum + 1;
            }
            return false;
        },
    });

    const {mutate: sendMessage} = useMutation({
        mutationKey: ["sendMessage"],
        mutationFn: async ({message}: { message: string }) => {
            const res = await axios.post("/api/message", {
                fileId,
                message,
            });
            console.log(res.data);
            return res.data;
        },
        onMutate: async ({message}) => {
            lastMsgRef.current = message;
            setMessage("");
            await queryClient.cancelQueries({queryKey: ["getFileMessages", fileId]});
            const previousMessages = queryClient.getQueryData([
                "getFileMessages",
                fileId,
            ]);
            console.log({previousMessages});
            queryClient.setQueryData(["getFileMessages", fileId], {
                pages: [],
                pageParams: [],
            });
            // get all previous messages
            // cancel any ongoing req for file messages
            // get previous messages for the file
            // update infinite data
            // add new message to the latest page of messages
            setIsLoading(true);
            return {
                previousMessages:
                    previousMessages?.pages.flatMap((page) => page.messages) ?? [],
            };
        },
        onSettled: async (_, __, {message}) => {
            setIsLoading(false);
            await queryClient.invalidateQueries({queryKey: ["getFileMessages", fileId]});
        },
        onError: (_, __, context) => {
            setMessage(lastMsgRef.current);
            setIsLoading(false);
            queryClient.setQueryData(["fileMessages", fileId], {
                messages: context?.previousMessages ?? [],
            });
        },
        onSuccess: async (stream) => {
            console.log({stream});
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
                const {value, done: doneReading} = await reader.read();
                isComplete = doneReading;
                const chunkValue = decoder.decode(value);
                text += chunkValue;
            }
            try {

                const oldMessages = queryClient.getQueryData([
                    "getFileMessages",
                    fileId,
                ]);
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
            } catch (error) {
                console.log("FAILED UPDATED MESSAGES: ", error);
            }
        },
    });
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };
    const addMessage = () => sendMessage({message});
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
