"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./useRedux";
import baseApi from "@/store/Api/BaseApi/BaseApi";
import type { NotificationItem } from "@/store/Api/Notification/notification.types";

export function useNotificationSocket() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.userId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const socketUrl = `${apiBaseUrl}/notifications`;

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      // Connected to notifications namespace
    });

    socket.on("new_notification", (_notification: NotificationItem) => {
      // Silently invalidate cache to trigger real-time badge and list refresh
      dispatch(baseApi.util.invalidateTags(["Notifications"]));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.userId, dispatch]);
}
