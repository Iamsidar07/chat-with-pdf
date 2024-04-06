import ChatWrapper from "@/components/ChatWrapper";
import PDFRenderer from "@/components/PDFRenderer";
import FileModel from "@/models/File";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileId } = params;
  const user = await currentUser();
  if (!user || !user.id) redirect("/auth-callback?origin=password");
  const file = await FileModel.findById(fileId);
  if (!file) notFound();
  const subscriptionPlan = {
    name: "Pro",
    pagesPerPdf: 35,
  };
  return (
    <div className="flex justify-between flex-1 flex-col h-[calc(100vh-56px)] ">
      <div className="mx-auto max-w-8xl w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} subscriptionPlan={subscriptionPlan} />
        </div>
      </div>
    </div>
  );
};

export default Page;
