"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Loader, RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import SimpleBar from "simplebar-react";
import Pdffullscreen from "./Pdffullscreen";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFRendererProps {
  url: string;
}
const PDFRenderer = ({ url }: PDFRendererProps) => {
  const [scale, setScale] = useState(1);
  const [totalNumPages, setTotalNumPages] = useState<number | null>(null);
  const [currentPageNum, setCurrentNumPage] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleNextPageClick = () => {
    setCurrentNumPage((prevCurrentNumPage) => {
      if (prevCurrentNumPage >= totalNumPages!) {
        return prevCurrentNumPage;
      }
      return prevCurrentNumPage + 1;
    });
  };
  const handlePreviousPageClick = () => {
    setCurrentNumPage((prevCurrentNumPage) => {
      if (prevCurrentNumPage <= 1) {
        return prevCurrentNumPage;
      }
      return prevCurrentNumPage - 1;
    });
  };
  return (
    <div className="w-full flex flex-col items-center shadow rounded-2xl p-2">
      <div className="h-14 w-full border shadow-t-sm rounded-md flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-1.5">
            <Button
              disabled={currentPageNum === 1}
              variant={"ghost"}
              aria-label="previous-page"
              onClick={handlePreviousPageClick}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Input
              value={currentPageNum}
              onChange={(e) =>
                setCurrentNumPage(Math.floor(Number(e.target.value)))
              }
              min={1}
              max={totalNumPages ?? 1}
              placeholder="1"
              type="number"
              className="w-14 h-8 "
            />
            <div className="flex space-x-2 items-center">
              {currentPageNum}
              <span>/</span>
              {totalNumPages ?? "0"}
            </div>
            <Button
              disabled={currentPageNum === totalNumPages}
              onClick={handleNextPageClick}
              variant={"ghost"}
              aria-label="previous-page"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="zoom">
                  <span>{scale * 100}%</span>
                  <ChevronDown className="ml-1.5 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.25)}>
                  125%
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.75)}>
                  175%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant={"ghost"}
              aria-label="rotate pdf"
              onClick={() =>
                setRotation((prevRotation) => {
                  if (prevRotation == 360) {
                    return 360;
                  }
                  return prevRotation + 90;
                })
              }
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <Pdffullscreen url={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen overflow-y-scroll no-scrollbar ">
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
            onLoadSuccess={({ numPages }) => setTotalNumPages(numPages)}
          >
            <Page
              scale={scale}
              pageNumber={currentPageNum == 0 ? 1 : currentPageNum}
              rotate={rotation}
              className={"flex justify-center"}
              loading={
                <div className="grid place-items-center">
                  <Loader className="w-5 h-5 animate-spin my-24" />
                </div>
              }
            />
          </Document>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PDFRenderer;
