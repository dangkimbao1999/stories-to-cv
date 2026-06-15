import { ChatSessionClient } from "./session-client";

export default async function ChatSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  return <ChatSessionClient sessionId={sessionId} />;
}
