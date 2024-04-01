"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { File, Loader, UploadCloudIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/utils/uploadthing";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
const UploadDropzone = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileKey, setFileKey] = useState<null | string>(null);
  const { startUpload } = useUploadThing("pdfUploader");
  const { data } = useQuery({
    queryKey: [fileKey],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/getFile?key=${fileKey}`);
        return response.data;
      } catch (error) {
        throw new Error("Failed to authenticate.");
      }
    },
    retry: true,
    retryDelay: 500,
  });
  useEffect(() => {
    if (data && data?.file) {
      router.push(`/dashboard/${data.file._id}`);
    }
  }, [data?.file]);

  const startProgressSimulation = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevUploadProgress) => {
        if (prevUploadProgress >= 85) {
          clearInterval(interval);
          return prevUploadProgress;
        }
        return prevUploadProgress + 5;
      });
    }, 500);
    return interval;
  };
  const handleDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const progressInterval = startProgressSimulation();
    const res = await startUpload(acceptedFiles);
    if (!res) {
      return toast({
        title: "Something went wrong!",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    const [fileResponse] = res;
    const key = fileResponse.key;
    if (!key) {
      return toast({
        title: "Something went wrong!",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    clearInterval(progressInterval);
    setIsUploading(false);
    setUploadProgress(100);
    setFileKey(key);
  };
  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <section>
          <div
            {...getRootProps()}
            className="rounded-2xl border border-dashed h-64 m-4 text-center p-6"
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-2.5">
              <input {...getInputProps()} />
              <UploadCloudIcon className="w-8 h-8" />
              <p>
                Drag and drop some PDF or{" "}
                <span className="font-bold">click to upload</span>{" "}
              </p>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-sm border  p-2 rounded flex items-center gap-x-2">
                  <File className="w-6 h-6 text-green-500" />
                  <p className="truncate">{acceptedFiles[0].name}</p>
                </div>
              ) : null}
              {isUploading ? (
                <div className="w-full max-w-sm mt-6 mx-auto">
                  <Progress value={uploadProgress} className="h-1 " />
                </div>
              ) : null}
              {uploadProgress === 100 ? (
                <div className="flex flex-col items-center justify-center gap-2.5 mt-2">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Redirecting...</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  );
};
const UploadButton = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>upload PDF</Button>
        </DialogTrigger>
        <DialogContent>
          <UploadDropzone />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadButton;
