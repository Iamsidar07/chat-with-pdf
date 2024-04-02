import {NextRequest, NextResponse} from "next/server";
import {GoogleGenerativeAI, TaskType} from "@google/generative-ai";
import {pineconeIndex} from "@/utils/pinecone";
import {PineconeStore} from "@langchain/pinecone";
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import FileModel from "@/models/File";
import {GoogleGenerativeAIStream, StreamingTextResponse} from "ai"
import MessageModel from "@/models/Message";
import {currentUser} from "@clerk/nextjs";

interface GenerativeAIMessage {
    text: string
    isUserMessage: boolean
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export const POST = async (req: NextRequest) => {
    const requestBody = await req.json();
    const user = await currentUser()
    const {message, fileId} = requestBody;
    if (!user || !user?.id) return NextResponse.json("Unauthorized", {status: 401})

    const file = await FileModel.findById(fileId)
    if (!file) return NextResponse.json({error: "Not found"}, {status: 404})
    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        apiKey: process.env.GOOGLE_API_KEY,
    });
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: file.key,
    });

    /* Search the vector DB independently with metadata filters */
    const results = await vectorStore.maxMarginalRelevanceSearch(message, {
        k: 4,
    });
    const context = results.map((r) => r.pageContent).join("\n");
    const recentMessages: GenerativeAIMessage[] = await MessageModel.find({
        fileId,
        userId: user?.id
    }, {text: true, isUserMessage: true}).limit(4)
    const formatMessageForGoogleGenerativeAI = (messages: GenerativeAIMessage[]) => messages.map((msg) => {
        if (msg.isUserMessage) {
            return ({
                role: "user",
                parts: [{text: msg.text}]
            })
        }
        return ({
            role: "model",
            parts: [{text: msg.text}]
        })
    })
    const model = genAI.getGenerativeModel({model: "gemini-pro"})

    const chat = model.startChat({
        // @ts-ignore
        history: formatMessageForGoogleGenerativeAI(recentMessages),
        generationConfig: {
            maxOutputTokens: 1000
        }
    })
    const msg = `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.
  CONTEXT: ${context}
  USER INPUT: ${message}`
    const result = await chat.sendMessageStream(msg)
    const stream = GoogleGenerativeAIStream(result)

    return new StreamingTextResponse(stream)
};
