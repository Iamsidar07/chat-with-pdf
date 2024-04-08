"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCreateSession = () => {
  const { toast } = useToast();
  const { mutate: createSession, isPending: isLoading } = useMutation({
    mutationKey: ["createSession"],
    mutationFn: async () => {
      try {
        const res = await axios.get("/api/createSession");
        return res.data;
      } catch (error) {
        console.log("Failed createSession: ", error);
      }
    },
    onSuccess(data) {
      if (data?.url) {
        window.location.href = data?.url ?? "/dashboard/billing";
      } else {
        return toast({
          title: "There was a problem...",
          description: "Please try again in a moment",
          variant: "destructive",
        });
      }
    },
  });
  return { createSession, isLoading };
};
export default useCreateSession;
