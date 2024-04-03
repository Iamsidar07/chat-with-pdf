"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { LucideProps, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
interface MessageProps {
  isNextMessageBySamePerson: boolean;
  message: {
    text: string | JSX.Element;
    id?: string;
    isUserMessage: boolean;
  };
}

const Icons = {
  user: User,
  logo: (props: LucideProps) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="m6.94 14.036c-.233.624-.43 1.2-.606 1.783.96-.697 2.101-1.139 3.418-1.304 2.513-.314 4.746-1.973 5.876-4.058l-1.456-1.455 1.413-1.415 1-1.001c.43-.43.915-1.224 1.428-2.368-5.593.867-9.018 4.292-11.074 9.818zm10.06-5.035 1 .999c-1 3-4 6-8 6.5-2.669.334-4.336 2.167-5.002 5.5h-1.998c1-6 3-20 18-20-1 2.997-1.998 4.996-2.997 5.997z" />
    </svg>
  ),
};
const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ isNextMessageBySamePerson, message }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-blue-600 rounded-sm": message.isUserMessage,
              "order-2 bg-zinc-800 rounded-sm": !message.isUserMessage,
              invisible: isNextMessageBySamePerson,
            },
          )}
        >
          {message?.isUserMessage ? (
            <Icons.user className={"fill-zinc-200 text-zinc-200 w-3/4 h-3/4"} />
          ) : (
            <Icons.logo className={"fill-zinc-200 w-3/4 h-3/4"} />
          )}
        </div>
        <div
          className={cn("flex flex-col space-y-2 max-w-md mx-2 text-base", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                message.isUserMessage && isNextMessageBySamePerson,
              "rounded-bl-none":
                !message.isUserMessage && !isNextMessageBySamePerson,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "text-zinc-50": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id === "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-blue-300": message.isUserMessage,
                })}
              >
                new Date(message.createdAt)
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);
Message.displayName = "Message";
export default Message;
