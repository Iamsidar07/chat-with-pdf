"use client";

import { Expand, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useResizeDetector } from "react-resize-detector";

interface PdffullscreenProps {
  url: string;
}
const Pdffullscreen = ({ url }: PdffullscreenProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { width, ref } = useResizeDetector();
  const [totalPages, setTotalPages] = useState<number | null>(null);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          aria-label="full screen"
          onClick={() => setIsOpen(true)}
        >
          <Expand className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full mx-auto mt-6 max-h-[calc(100vh-10rem)] overflow-y-scroll no-scrollbar ">
        <div className="flex-1 w-full" ref={ref}>
          <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
            <Document
              file={url}
              loading={
                <div className="w-full grid place-items-center h-24">
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <p className="text-zinc-500">Preparing your pdf...</p>
                  </div>
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Unable to load your pdf",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
            >
              {new Array(totalPages).fill(0).map((_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={width ? width : 1}
                />
              ))}
            </Document>
          </SimpleBar>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Pdffullscreen;
