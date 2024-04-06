"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mb-4 max-w-fit rounded-full shadow-md flex items-center justify-center space-x-2 bg-white px-7 py-2 border border-gray-200 transition-all hover:border-gray-300 hover:bg-white/50 backdrop-blur">
          <p className="text-sm font-semibold text-gray-700">
            Chatty is now public!
          </p>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl max-w-5xl font-bold">
          Chat with your <span className="text-blue-500">documetns</span> in
          seconds.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          Chatty allows you to have chat with your any PDF documents. Simply
          upload your file and start asking questions right away.
        </p>
        <Link
          href="/dashboard"
          target="_blank"
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 " />
        </Link>
      </MaxWidthWrapper>
      <div>
        <div className="relative isolate">
          <div
            area-hidden="true"
            className="absolute pointer-events-none -z-10 inset-x-0 overflow-hidden transform-gpu -top-40 blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/768] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            ></div>
          </div>
        </div>
      </div>
      <div>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="rounded-xl -m-2 bg-gray-900/5 ring-1 ring-inset p-2 ring-gray-900/10 lg:rounded-2xl lg:p-4 lg:-m-4">
              <Image
                src={"/dashboard-preview.png"}
                alt="Product Preview"
                width={1364}
                height={866}
                quality={100}
                className="rounded-xl lg:rounded-2xl shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="relative isolate">
            <div
              area-hidden="true"
              className="absolute pointer-events-none -z-10 inset-x-0 overflow-hidden transform-gpu -top-40 blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="relative left-[calc(50%-13rem)] aspect-[1155/768] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-32 sm:my-56 max-w-5xl mx-auto">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto sm:text-center max-w-2xl">
            <h2 className="mt-2 font-bold text-4xl lg:text-5xl text-gray-900">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting to your PDF files never has been easier than with Chatty.
            </p>
          </div>
        </div>
        <ol className="my-8 space-y-4 md:space-x-12 md:flex md:space-y-0 pt-8">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 rounded-l-lg md:rounded-l-none md:rounded-t-2xl border-l-4 border-zinc-300 py-2 pl-4 md:border-t-8 md:border-l-0 md:pb-0 pt-4 ">
              <span className="text-sm md:text-lg font-medium text-blue-600">
                Step 1
              </span>
              <p className="text-xl md:text-2xl mt-2 font-semibold">
                Sign up for an account
              </p>
              <p className="mt-2 text-zinc-700 md:text-lg">
                Either Starting out with free plan or choose{" "}
                <Link href="/pricing" className="text-blue-500 underline">
                  pro plane.
                </Link>{" "}
              </p>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 rounded-l-lg md:rounded-l-none md:rounded-t-2xl border-l-4 border-zinc-300 py-2 pl-4 md:border-t-8 md:border-l-0 md:pb-0 pt-4 ">
              <span className="text-sm md:text-lg font-medium text-blue-600">
                Step 2
              </span>
              <p className="text-xl md:text-2xl mt-2 font-semibold">
                Upload any PDF file
              </p>
              <p className="mt-2 text-zinc-700 md:text-lg">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </p>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 rounded-l-lg md:rounded-l-none md:rounded-t-2xl border-l-4 border-zinc-300 py-2 pl-4 md:border-t-8 md:border-l-0 md:pb-0 pt-4 ">
              <span className="text-sm md:text-lg font-medium text-blue-600">
                Step 3
              </span>
              <p className="text-xl md:text-2xl mt-2 font-semibold">
                Start asking questions
              </p>
              <p className="mt-2 text-zinc-700 md:text-lg">
                It&apos;s that simple. Try out Chatty today. It really takes
                less than a minute.{" "}
              </p>
            </div>
          </li>
        </ol>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="rounded-xl -m-2 bg-gray-900/5 ring-1 ring-inset p-2 ring-gray-900/10 lg:rounded-2xl lg:p-4 lg:-m-4">
              <Image
                src={"/file-upload-preview.png"}
                alt="file uploading preview"
                width={1419}
                height={732}
                quality={100}
                className="rounded-xl lg:rounded-2xl shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
