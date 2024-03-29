import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { NextRequest } from "next/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { pinecone, pineconeIndex } from "@/utils/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { currentUser } from "@clerk/nextjs";
import FileModel from "@/models/File";

export const runtime = "nodejs";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
const middleware = async ({ req }: { req: NextRequest }) => {
  // This code runs on your server before upload
  const user = await currentUser();

  // If you throw, the user will not be able to upload
  if (!user) throw new UploadThingError("Unauthorized");

  // Whatever is returned here is accessible in onUploadComplete as `metadata`
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
      apiKey: process.env.GOOGLE_API_KEY,
    });
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: file.key,
    });
    // const client = new MongoClient(process.env.MONGODB_URI || "");
    // const collection = client.db("chatwithpdf").collection(file.key);
    //
    // const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs,embeddings, {
    //     collection,
    //     indexName: "chatwithpdf",
    //     textKey: "text",
    //     embeddingKey: "embedding"
    // })
    // const assignedIds = await vectorStore.addDocuments([
    //     { pageContent: "upsertable", metadata: {} },
    // ]);
    //
    // const upsertedDocs = [{ pageContent: "overwritten", metadata: {} }];
    //
    // await vectorStore.addDocuments(upsertedDocs, { ids: assignedIds });
    //
    // await client.close();
    // This code RUNS ON YOUR SERVER after upload
    console.log("Upload complete for userId:", metadata.userId);

    console.log("file url", file.url);
    await FileModel.findOneAndUpdate(
      { id: createdFile.id },
      {
        uploadStatus: "UPLOAD",
      },
    );

    // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    return { uploadedBy: metadata.userId };
  } catch (e) {
    console.error("FAILED EMBEDDINGS: ", e);
    await FileModel.findOneAndUpdate(
      { id: createdFile.id },
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
