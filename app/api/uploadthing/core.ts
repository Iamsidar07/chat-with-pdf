import FileModel from "@/models/File";
import { pineconeIndex } from "@/utils/pinecone";
import { currentUser } from "@clerk/nextjs";
import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { NextRequest } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

export const runtime = "nodejs";

const f = createUploadthing();

const middleware = async ({ req }: { req: NextRequest }) => {
  const user = await currentUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
};
const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    name: string;
    url: string;
    key: string;
  };
}) => {
  const isFileExist = await FileModel.findOne({
    key: file.key,
  });
  if (isFileExist) return;
  const createdFile = await FileModel.create({
    userId: metadata.userId,
    uploadStatus: "PROCESSING",
    ...file,
  });

  try {
    const response = await fetch(file.url);
    const blob = await response.blob();
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "embedding-001", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: String(process.env.GOOGLE_API_KEY),
    });
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: file.key,
    });

    await FileModel.findByIdAndUpdate(
      createdFile._id,
      {
        uploadStatus: "UPLOAD",
      },
    );

    return { uploadedBy: metadata.userId };
  } catch (e) {
    console.error("FAILED EMBEDDINGS: ", e);
    await FileModel.findByIdAndUpdate(
      createdFile._id,
      {
        uploadStatus: "FAILED",
      },
    );
  }
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "64MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
