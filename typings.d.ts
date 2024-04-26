import { Document, Schema } from "mongoose";

interface InfiniteQueryResult {
  pages: TData[];
  pageParams: number[];
}

interface TData {
  hasMore: boolean;
  pageNum: number;
  messages: Message[];
}

export interface User {
  _id: string;
  id: string;
  email: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
  stripeSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id?: string;
  id: string;
  text: string;
  isUserMessage: boolean;
  userId?: string;
  fileId?: Schema.Types.ObjectId;
  createdAt: string;
  updatedAt?: string;
}

export interface TFile {
  _id: string;
  name: string;
  uploadStatus: "PENDING" | "PROCESSING" | "FAILED" | "UPLOAD";
  messages: [Schema.Types.ObjectId];
  url: string;
  key: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
