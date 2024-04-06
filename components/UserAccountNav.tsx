import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import Icons from "./Icons";
import Link from "next/link";
import { Gem } from "lucide-react";
import { getUserSubscriptionPlan } from "@/utils/stripe";
import { SignOutButton } from "@clerk/nextjs";

interface UserAccountNavProps {
  email: string | undefined;
  name: string;
  imageUrl: string;
}
const UserAccountNav = async ({
  email,
  name,
  imageUrl,
}: UserAccountNavProps) => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-8 w-8 bg-slate-400 aspect-square">
          <Avatar className="relative w-8 h-8">
            {imageUrl ? (
              <div className="relative w-full h-full aspect-square">
                <Image
                  src={imageUrl}
                  fill
                  alt={"profile pitcture"}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="w-4 h-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flexl items-center justify-start gap-2">
          <div className="flex flex-col space-y-0.5 leading-none p-1">
            {name && <p className="font-medium text-sm text-black">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {subscriptionPlan?.isSubscribed ? (
            <Link href="/dashboard/billing">Manage Subscription</Link>
          ) : (
            <Link href="/pricing">
              Upgrade <Gem className="w-4 h-4 text-blue-600 ml-1.5" />
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <SignOutButton>Logout</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
