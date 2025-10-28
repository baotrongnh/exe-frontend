"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { api } from "@/lib/api";

export type CallStatus =
  | "idle"
  | "initiating"
  | "ringing"
  | "connecting"
  | "connected"
  | "ended"
  | "error";

interface UseVideoCallOptions {
  socket: Socket | null;
  isConnected: boolean;
  currentUserId: string | null;
  onIncomingCall?: (data: {
    from: string;
    callId: string;
    room_name?: string;
  }) => void;
  onCallEnded?: (data: { from: string; callId: string }) => void;
}

interface CallData {
  callId: string | null;
  remoteUserId: string | null;
  status: CallStatus;
  error: string | null;
}

const ICE_SERVERS = {
  iceServers: [
    // Google STUN servers
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // Free TURN servers (for NAT traversal)
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
  iceCandidatePoolSize: 10,
};

export function useVideoCall(options: UseVideoCallOptions) {
  const { socket, isConnected, currentUserId, onIncomingCall, onCallEnded } =
    options;

  const [callData, setCallData] = useState<CallData>({
    callId: null,
    remoteUserId: null,
    status: "idle",
    error: null,
  });

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callbacksRef = useRef({ onIncomingCall, onCallEnded });
  const socketRef = useRef(socket);

  // Update refs
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  // Update callbacks ref
  useEffect(() => {
    callbacksRef.current = { onIncomingCall, onCallEnded };
  }, [onIncomingCall, onCallEnded]);

  // Initialize peer connection
  const createPeerConnection = useCallback(
    (remoteUserId: string, callId: string) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      console.log("🔗 Creating peer connection with ICE servers:", ICE_SERVERS);
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local stream tracks to peer connection
      if (localStreamRef.current) {
        console.log("📹 Adding local tracks to peer connection");
        localStreamRef.current.getTracks().forEach((track) => {
          if (localStreamRef.current) {
            console.log(`➕ Adding ${track.kind} track:`, {
              id: track.id,
              enabled: track.enabled,
              muted: track.muted,
              readyState: track.readyState,
            });
            pc.addTrack(track, localStreamRef.current);
          }
        });
      } else {
        console.warn(
          "⚠️ No local stream available when creating peer connection"
        );
      }

      // Handle incoming tracks (remote stream)
      pc.ontrack = (event) => {
        console.log("📥 Received remote track:", {
          kind: event.track.kind,
          id: event.track.id,
          enabled: event.track.enabled,
          muted: event.track.muted,
          streams: event.streams.length,
        });
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          console.log("🧊 Sending ICE candidate:", {
            type: event.candidate.type,
            protocol: event.candidate.protocol,
            address: event.candidate.address,
          });
          socketRef.current.emit("webrtc:ice-candidate", {
            to: remoteUserId,
            candidate: event.candidate,
            callId: callId,
          });
        } else if (!event.candidate) {
          console.log("✅ ICE gathering completed");
        }
      };

      // Handle ICE gathering state
      pc.onicegatheringstatechange = () => {
        console.log("🧊 ICE gathering state:", pc.iceGatheringState);
      };

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log("🧊 ICE connection state:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed") {
          console.error("❌ ICE connection failed - may need TURN servers");
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("🔗 Connection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setCallData((prev) => ({ ...prev, status: "connected" }));
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          console.error("❌ Connection lost:", pc.connectionState);
          setCallData((prev) => ({
            ...prev,
            status: "error",
            error: "Connection lost",
          }));
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    []
  ); // No dependencies - use refs instead

  // Get user media (camera + microphone)
  const getUserMedia = useCallback(async () => {
    try {
      console.log("🎥 Requesting user media...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("✅ Got media stream:", {
        id: stream.id,
        active: stream.active,
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
      });

      stream.getTracks().forEach((track) => {
        console.log(`📹 Track ${track.kind}:`, {
          id: track.id,
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings: track.getSettings(),
        });
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error(
        "❌ Error accessing media devices:",
        error.name,
        error.message
      );

      // If video fails, try audio only
      if (
        error.name === "NotReadableError" ||
        error.name === "NotAllowedError"
      ) {
        console.warn("Camera not available, trying audio only...");
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          localStreamRef.current = audioStream;
          setLocalStream(audioStream);
          return audioStream;
        } catch (audioError: any) {
          console.error(
            "Failed to get audio:",
            audioError.name,
            audioError.message
          );
          setCallData((prev) => ({
            ...prev,
            status: "error",
            error: "Could not access microphone",
          }));
          throw audioError;
        }
      }

      setCallData((prev) => ({
        ...prev,
        status: "error",
        error: "Could not access camera/microphone",
      }));
      throw error;
    }
  }, []);

  // Initiate call
  const initiateCall = useCallback(
    async (remoteUserId: string) => {
      console.log("📞 Initiating call to:", remoteUserId);
      if (!socket || !isConnected) {
        console.error("❌ Socket not connected");
        return;
      }

      try {
        setCallData((prev) => ({
          ...prev,
          status: "initiating",
          remoteUserId,
        }));

        // Create call session via REST API
        console.log("🔄 Creating call session via API...");
        const response = await api.videoCall.create();
        const { data: call } = response;
        console.log("✅ Call session created:", call.id);

        setCallData((prev) => ({
          ...prev,
          callId: call.id,
          status: "ringing",
        }));

        // Get user media
        console.log("🎥 Getting user media...");
        await getUserMedia();
        console.log("✅ User media obtained");

        // Notify remote user via socket
        console.log("📤 Sending call notification to:", remoteUserId);
        socket.emit("webrtc:call", {
          to: remoteUserId,
          callId: call.id,
          room_name: call.room_name,
        });
        console.log("✅ Call notification sent");
      } catch (error) {
        console.error("❌ Error initiating call:", error);
        setCallData((prev) => ({
          ...prev,
          status: "error",
          error: "Failed to initiate call",
        }));
      }
    },
    [socket, isConnected, getUserMedia]
  );

  // Accept incoming call
  const acceptCall = useCallback(
    async (callId: string, fromUserId: string) => {
      console.log("✅ Accepting call from:", fromUserId, "callId:", callId);
      if (!socket || !isConnected) {
        console.error("❌ Socket not connected");
        return;
      }

      try {
        setCallData({
          callId,
          remoteUserId: fromUserId,
          status: "connecting",
          error: null,
        });

        // Join call via REST API
        console.log("🔄 Joining call via API...");
        await api.videoCall.join(callId);
        console.log("✅ Joined call successfully");

        // Get user media
        console.log("🎥 Getting user media...");
        await getUserMedia();
        console.log("✅ User media obtained");

        // Notify caller that we accepted (so they can start sending offer)
        console.log("📤 Sending call-accepted notification to:", fromUserId);
        socket.emit("webrtc:call-accepted", {
          to: fromUserId,
          callId: callId,
        });
        console.log("✅ Call-accepted notification sent");
      } catch (error) {
        console.error("❌ Error accepting call:", error);
        setCallData((prev) => ({
          ...prev,
          status: "error",
          error: "Failed to accept call",
        }));
      }
    },
    [socket, isConnected, getUserMedia]
  );

  // End call
  const endCall = useCallback(async () => {
    try {
      if (callData.callId) {
        // End via REST API
        await api.videoCall.end(callData.callId);

        // Notify remote user
        if (socket && callData.remoteUserId) {
          socket.emit("webrtc:end-call", {
            to: callData.remoteUserId,
            callId: callData.callId,
          });
        }
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      setLocalStream(null);
      setRemoteStream(null);
      setCallData({
        callId: null,
        remoteUserId: null,
        status: "ended",
        error: null,
      });

      console.log("📞 Call ended");
    } catch (error) {
      console.error("Error ending call:", error);
    }
  }, [callData, socket]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, []);

  // Setup socket event listeners for WebRTC signaling
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle incoming call
    const handleIncomingCall = (data: {
      from: string;
      callId: string;
      room_name?: string;
    }) => {
      callbacksRef.current.onIncomingCall?.(data);
    };

    // Handle call accepted (caller receives this from callee)
    const handleCallAccepted = async (data: {
      from: string;
      callId: string;
    }) => {
      console.log("✅ Call accepted by:", data.from, "callId:", data.callId);
      try {
        // Ensure we have local stream
        if (!localStreamRef.current) {
          console.log("🎥 Local stream not found, getting user media...");
          await getUserMedia();
        } else {
          console.log("✅ Local stream already available");
        }

        setCallData((prev) => ({ ...prev, status: "connecting" }));

        console.log("🔧 Creating peer connection...");
        const pc = createPeerConnection(data.from, data.callId);

        console.log("🎬 Creating offer...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("✅ Local description (offer) set");

        if (socket) {
          console.log("📤 Sending offer to:", data.from);
          socket.emit("webrtc:offer", {
            to: data.from,
            sdp: offer,
            callId: data.callId,
          });
          console.log("✅ Offer sent");
        } else {
          console.warn("⚠️ Socket not available to send offer");
        }
      } catch (error) {
        console.error("❌ Error sending offer after acceptance:", error);
        setCallData((prev) => ({
          ...prev,
          status: "error",
          error: "Failed to send offer",
        }));
      }
    };

    // Handle offer
    const handleOffer = async (data: {
      from: string;
      sdp: RTCSessionDescriptionInit;
      callId: string;
    }) => {
      console.log("📥 Received offer from:", data.from, "callId:", data.callId);
      try {
        setCallData((prev) => ({
          ...prev,
          remoteUserId: data.from,
          callId: data.callId,
        }));

        await new Promise((resolve) => setTimeout(resolve, 50));

        const pc = createPeerConnection(data.from, data.callId);
        console.log("🔧 Setting remote description (offer)...");
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        console.log("✅ Remote description set");

        console.log("🎬 Creating answer...");
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("✅ Local description (answer) set");

        console.log("📤 Sending answer to:", data.from);
        socket.emit("webrtc:answer", {
          to: data.from,
          sdp: answer,
          callId: data.callId,
        });

        setCallData((prev) => ({ ...prev, status: "connected" }));
      } catch (error) {
        console.error("❌ Error handling offer:", error);
        setCallData((prev) => ({
          ...prev,
          status: "error",
          error: "Failed to process offer",
        }));
      }
    };

    // Handle answer
    const handleAnswer = async (data: {
      from: string;
      sdp: RTCSessionDescriptionInit;
      callId: string;
    }) => {
      console.log(
        "📥 Received answer from:",
        data.from,
        "callId:",
        data.callId
      );
      try {
        if (peerConnectionRef.current) {
          console.log("🔧 Setting remote description (answer)...");
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp)
          );
          console.log("✅ Remote description (answer) set");
          setCallData((prev) => ({ ...prev, status: "connected" }));
        } else {
          console.warn("⚠️ No peer connection to set answer");
        }
      } catch (error) {
        console.error("❌ Error handling answer:", error);
        setCallData((prev) => ({
          ...prev,
          status: "error",
          error: "Failed to process answer",
        }));
      }
    };

    // Handle ICE candidate
    const handleIceCandidate = async (data: {
      from: string;
      candidate: RTCIceCandidateInit;
      callId: string;
    }) => {
      console.log("📥 Received ICE candidate from:", data.from, {
        type: data.candidate.candidate?.includes("typ")
          ? data.candidate.candidate.split("typ ")[1]?.split(" ")[0]
          : "unknown",
        candidate: data.candidate.candidate,
      });

      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          console.log("✅ Added ICE candidate successfully");
        } else {
          console.warn("⚠️ No peer connection to add ICE candidate");
        }
      } catch (error) {
        console.error("❌ Error adding ICE candidate:", error);
      }
    };

    // Handle end call
    const handleEndCall = (data: { from: string; callId: string }) => {
      endCall();
      callbacksRef.current.onCallEnded?.(data);
    };

    // Register listeners
    socket.on("webrtc:incoming-call", handleIncomingCall);
    socket.on("webrtc:call-accepted", handleCallAccepted);
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("webrtc:end-call", handleEndCall);

    return () => {
      socket.off("webrtc:incoming-call", handleIncomingCall);
      socket.off("webrtc:call-accepted", handleCallAccepted);
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
      socket.off("webrtc:end-call", handleEndCall);
    };
  }, [socket, isConnected, createPeerConnection, endCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    callData,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    initiateCall,
    acceptCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}
