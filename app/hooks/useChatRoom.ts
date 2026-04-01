"use client";

import { useEffect, useState } from "react";
import { ref, onChildAdded, off } from "firebase/database";
import { getDb } from "@/app/lib/firebase";
import type { FirebaseChatMessage } from "@/app/components/Chat/types";

export interface ChatRoomMessage extends FirebaseChatMessage {
  key: string;
}

export function useChatRoom(chatRoomId: string | null) {
  const [messages, setMessages] = useState<ChatRoomMessage[]>([]);

  useEffect(() => {
    if (!chatRoomId) return;

    const db = getDb();
    const messagesRef = ref(db, `chats/${chatRoomId}/messages`);

    const handler = onChildAdded(messagesRef, (snapshot) => {
      const data = snapshot.val() as FirebaseChatMessage;
      if (!data) return;
      setMessages((prev) => [
        ...prev,
        { ...data, key: snapshot.key ?? Date.now().toString() },
      ]);
    });

    return () => {
      off(messagesRef, "child_added", handler);
      setMessages([]);
    };
  }, [chatRoomId]);

  return { messages };
}
