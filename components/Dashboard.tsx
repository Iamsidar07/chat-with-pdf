"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UploadButton from "@/components/UploadButton";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Ghost, Loader, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { format } from "date-fns";

const Dashboard = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const { data: user } = useQuery({
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/getUser?userId=${userId}`);
        return res.data;
      } catch (error) {
        throw new Error("Failed to get user");
      }
    },
    queryKey: [userId],
  });
  const { data: files, isLoading } = useQuery({
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/getUserFiles`);
        return res.data.results;
      } catch (error) {
        throw new Error("Failed to get user");
      }
    },
    queryKey: ["files"],
  });

  const { mutate: deleteFile } = useMutation({
    mutationKey: ["deleteFile"],
    mutationFn: async (fileId: string) => {
      try {
        const res = await axios.delete(`/api/deleteFile?id=${fileId}`);
      } catch (error) {
        console.log("Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onMutate(fileId) {
      // when function start to execute
      setCurrentlyDeletingFile(fileId);
    },
    onSettled: () => {
      // when function end to execute
      setCurrentlyDeletingFile(null);
    },
  });

  useEffect(() => {
    if (!user) {
      redirect("/auth-callback?origin=dashboard");
    }
  }, [user]);
  return (
    <MaxWidthWrapper className="pt-12 sm:pt-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-5xl">My Files</h2>
        <UploadButton />
      </div>
      <Separator className="mt-12" />
      {files && files?.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file: any) => (
            <li
              key={file.key}
              className="col-span-1 bg-white rounded-2xl shadow transition-all hover:shadow-lg"
            >
              <Link
                href={`/dashboard/${file._id}`}
                className="flex flex-col gap-2"
              >
                <div className="flex w-full items-center pt-8 px-6 gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                  <div className="truncate flex-1 font-medium text-lg">
                    {file.name}
                  </div>
                </div>
              </Link>
              <div className="mt-4 px-6 grid grid-cols-3 place-items-center py-2 gap-6 text-zinc-700">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <p className="truncate whitespace-nowrap">
                    {format(new Date(file.createdAt), "MM/dd/yyyy")}
                  </p>
                </div>

                <Button
                  onClick={() => deleteFile(file._id)}
                  className="flex items-center gap-2 w-full "
                  size={"sm"}
                  variant={"destructive"}
                >
                  {currentlyDeletingFile === file.id ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <div className="mt-16 flex flex-col items-center justify-center">
          <Loader className="w-6 h-6 animate-spin" />
          <h3>Loading up your PDFs...</h3>
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center">
          <Ghost className="w-8 h-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos; upload my first PDF file...</p>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Dashboard;
