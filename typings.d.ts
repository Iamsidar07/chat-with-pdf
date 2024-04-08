interface InfiniteQueryResult {
  pages: TData[];
  pageParams: number[];
}

interface Message {
  createdAt: string;
  isUserMessage: boolean;
  text: string;
  id?: string;
}

interface TData {
  hasMore: boolean;
  pageNum: number;
  messages: Message[];
}
