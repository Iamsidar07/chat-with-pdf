import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { UserButton, currentUser } from "@clerk/nextjs";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <nav className="sticky inset-x-0  w-full shadow-sm z-30">
      <MaxWidthWrapper className="py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="z-30">Logo</Link>
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <Link
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
                {" "}
                <Link
                  href={"/sign-in"}
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Signin
                </Link>
                <Link
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
          </div>
          {/* Mobile Navigation */}
          <MobileNav isAuth={Boolean(user)} />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
