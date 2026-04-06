"use client";

import { useEffect, useState, useCallback } from "react";
import { ref, onChildAdded, onValue, off, push } from "firebase/database";
import { getDb } from "@/app/lib/firebase";
import type { FirebaseChatMessage } from "@/app/components/Chat/types";

export interface ChatRoomMessage extends FirebaseChatMessage {
  key: string;
}

export function useChatRoom(chatRoomId: string | null) {
  const [messages, setMessages] = useState<ChatRoomMessage[]>([]);
  const [status, setStatus] = useState<"open" | "closed" | null>(null);

  useEffect(() => {
    if (!chatRoomId) return;

    const db = getDb();
    const messagesRef = ref(db, `chats/${chatRoomId}/messages`);
    const statusRef = ref(db, `chats/${chatRoomId}/metadata/status`);

    const messageHandler = onChildAdded(messagesRef, (snapshot) => {
      const data = snapshot.val() as FirebaseChatMessage;
      if (!data) return;
      setMessages((prev) => [
        ...prev,
        { ...data, key: snapshot.key ?? Date.now().toString() },
      ]);
    });

    const statusHandler = onValue(statusRef, (snapshot) => {
      const val = snapshot.val() as "open" | "closed" | null;
      if (val) setStatus(val);
    });

    return () => {
      off(messagesRef, "child_added", messageHandler);
      off(statusRef, "value", statusHandler);
      setMessages([]);
      setStatus(null);
    };
  }, [chatRoomId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!chatRoomId) return;
      const db = getDb();
      const messagesRef = ref(db, `chats/${chatRoomId}/messages`);
      await push(messagesRef, {
        sender: "user",
        text,
        timestamp: Date.now(),
        read: false,
      });
    },
    [chatRoomId]
  );

  return { messages, status, sendMessage };
}
