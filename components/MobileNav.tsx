"use client";
import { AlignRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const pathname = usePathname();
  useEffect(() => {
    if (isOpen) {
      toggleOpen();
    }
  }, [pathname]);
  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };
  return (
    <div className="sm:hidden">
      <AlignRight onClick={toggleOpen} className="relative w-6 h-6 z-50" />
      {isOpen ? (
        <div className="fixed inset-0 z-0 w-full">
          <ul className="absolute border-b shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {isAuth ? (
              <>
                <Link
                  onClick={() => closeOnCurrent("/dashboard")}
                  href={"/dashboard"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link
                  onClick={() => closeOnCurrent("/sign-in")}
                  href={"/sign-in"}
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Signin
                </Link>
                <Link
                  onClick={() => closeOnCurrent("/sign-up")}
                  href={"/sign-up"}
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
