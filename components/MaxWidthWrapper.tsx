import { cn } from "@/lib/utils";
import React from "react";
interface MaxWidthWrapperProps {
    className?: string,
    children: React.ReactNode
}
const MaxWidthWrapper = ({className, children}: MaxWidthWrapperProps) => {
    return <div className={cn("w-full max-w-[1440px] mx-auto px-2.5 md:px-20", className)}>{children}</div>;
};

export default MaxWidthWrapper;
