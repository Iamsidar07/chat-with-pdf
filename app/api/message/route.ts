import { NextRequest, NextResponse } from "next/server";
import { TaskType } from "@google/generative-ai";
import { pineconeIndex } from "@/utils/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Client } from "@octoai/client";

export const POST = async (req: NextRequest) => {
  const requestBody = await req.json();
  const { message } = requestBody;
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: "ac8fc37a-9f53-482f-8aa3-05ca16f9c209-f1lhsm.pdf",
  });

  /* Search the vector DB independently with metadata filters */
  const results = await vectorStore.maxMarginalRelevanceSearch(message, {
    k: 4,
  });
  const context = results.map((r) => r.pageContent).join("\n");
  const OCTOAI_TOKEN = process.env.OCTOAI_TOKEN; // Or your token here

  const client = new Client(OCTOAI_TOKEN);
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Keep your responses limited to one short paragraph if possible.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.
      CONTEXT: ${context}
      USER INPUT: ${message}.`,
      },
    ],
    model: "mistral-7b-instruct",
  });

  return NextResponse.json({ response: response.choices[0].message.content });
};
