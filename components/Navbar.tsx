import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import MobileNavigation from "./MobileNavigation";
import { currentUser } from "@clerk/nextjs";
const Navbar = async () => {
  const user = await currentUser();
  return (
    <nav className="sticky inset-x-0 h-14 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-14 border-b border-zinc-200">
          <Link href="/" className="z-40 font-semibold ">
            <span>Chatty.</span>
          </Link>
          {/* mobile navigation */}
          <MobileNavigation isAuth={!!user} />
          <div className="hidden sm:flex items-center gap-4">
            {!user ? (
              <>
                {" "}
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Pricing
                  </Link>
                </>
                <>
                  <Link
                    href={"/sign-in"}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Sign In
                  </Link>
                </>
                <>
                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name={
                    !user.firstName || !user.lastName
                      ? "Your Account"
                      : `${user.firstName} ${user.lastName}`
                  }
                  email={user.emailAddresses[0].emailAddress ?? ""}
                  imageUrl={user.imageUrl ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default Navbar;
