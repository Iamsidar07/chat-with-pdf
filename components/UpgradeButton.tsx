"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { createSession } from "@/utils";

const UpgradeButton = () => {
  const { mutate: handleCreateSession } = useMutation({
    mutationKey: ["createSession"],
    mutationFn: createSession,
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });
  return (
    <Button className="w-full" onClick={() => handleCreateSession()}>
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
