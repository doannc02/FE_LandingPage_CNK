"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { getDb } from "@/app/lib/firebase";
import type { FirebaseNotification } from "@/app/components/Chat/types";

export function useUserNotification(sessionId: string | null) {
  const [notification, setNotification] = useState<FirebaseNotification | null>(
    null,
  );

  useEffect(() => {
    if (!sessionId) return;

    const db = getDb();
    const notifRef = ref(db, `notifications/${sessionId}`);

    const handler = onValue(notifRef, (snapshot) => {
      const data = snapshot.val() as FirebaseNotification | null;
      if (data?.reply) {
        setNotification(data);
      }
    });

    return () => {
      off(notifRef, "value", handler);
      setNotification(null);
    };
  }, [sessionId]);

  return { notification };
}
