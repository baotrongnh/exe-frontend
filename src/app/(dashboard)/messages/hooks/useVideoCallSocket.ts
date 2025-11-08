"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase";
import { API_BASE_URL } from "@/lib/api";

export function useVideoCallSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          console.warn("⚠️ No session token for video call socket");
          return;
        }

        // Decode JWT to get user ID
        const tokenParts = session.access_token.split(".");
        if (tokenParts.length !== 3) {
          console.error("❌ Invalid token format");
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.id || payload.sub || payload.userId;

        if (!userId) {
          console.error("❌ No user ID in token");
          return;
        }

        setCurrentUserId(userId);
        console.log("🎥 Initializing video call socket for user:", userId);

        // Create socket connection
        const socketInstance = io(API_BASE_URL, {
          auth: {
            token: session.access_token,
          },
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ["websocket", "polling"],
        });

        // Socket event listeners
        socketInstance.on("connect", () => {
          console.log("✅ Video call socket connected");
          setIsConnected(true);
        });

        socketInstance.on("disconnect", (reason) => {
          console.log("❌ Video call socket disconnected:", reason);
          setIsConnected(false);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("❌ Video call socket connection error:", error);
          setIsConnected(false);
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);
      } catch (error) {
        console.error("❌ Error initializing video call socket:", error);
      }
    };

    initializeSocket();

    // Cleanup
    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up video call socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    currentUserId,
  };
}
