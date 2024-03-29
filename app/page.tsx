"use client";
import { UploadButton } from "@/utils/uploadthing";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";

export default function Home() {
  const user = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserButton />
      {/*<UploadButton*/}
      {/*    endpoint="pdfUploader"*/}
      {/*    onClientUploadComplete={(res) => {*/}
      {/*      // Do something with the response*/}
      {/*      console.log("Files: ", res);*/}
      {/*      alert("Upload Completed");*/}
      {/*    }}*/}
      {/*    onUploadError={(error: Error) => {*/}
      {/*      // Do something with the error.*/}
      {/*      alert(`ERROR! ${error.message}`);*/}
      {/*    }}*/}
      {/*/>*/}
    </main>
  );
}
