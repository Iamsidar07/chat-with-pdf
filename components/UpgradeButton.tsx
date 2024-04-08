"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { createStripeSession } from "@/actions";

const UpgradeButton = () => {
  const { toast } = useToast();
  const handleCreateSession = async () => {
    try {
      const session = await createStripeSession();
      if (session?.url) {
        window.location.href = session.url ?? "/dashboard/billing";
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create session.",
        description: "Please try again letter.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button className="w-full" onClick={handleCreateSession}>
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
