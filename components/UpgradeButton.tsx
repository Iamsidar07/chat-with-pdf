"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import useCreateSession from "@/hooks/useCreateSession";

const UpgradeButton = () => {
  const { createSession } = useCreateSession();
  return (
    <Button className="w-full" onClick={() => createSession()}>
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
