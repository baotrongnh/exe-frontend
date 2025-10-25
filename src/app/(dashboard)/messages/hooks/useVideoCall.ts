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
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
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

      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local stream tracks to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          if (localStreamRef.current) {
            pc.addTrack(track, localStreamRef.current);
          }
        });
      }

      // Handle incoming tracks (remote stream)
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("webrtc:ice-candidate", {
            to: remoteUserId,
            candidate: event.candidate,
            callId: callId,
          });
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setCallData((prev) => ({ ...prev, status: "connected" }));
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error(
        "Error accessing media devices:",
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
      if (!socket || !isConnected) {
        console.error("Socket not connected");
        return;
      }

      try {
        setCallData((prev) => ({
          ...prev,
          status: "initiating",
          remoteUserId,
        }));

        // Create call session via REST API
        const response = await api.videoCall.create();
        const { data: call } = response;

        setCallData((prev) => ({
          ...prev,
          callId: call.id,
          status: "ringing",
        }));

        // Get user media
        await getUserMedia();

        // Notify remote user via socket
        socket.emit("webrtc:call", {
          to: remoteUserId,
          callId: call.id,
          room_name: call.room_name,
        });
      } catch (error) {
        console.error("Error initiating call:", error);
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
      if (!socket || !isConnected) {
        console.error("Socket not connected");
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
        await api.videoCall.join(callId);

        // Get user media
        await getUserMedia();

        // Notify caller that we accepted (so they can start sending offer)
        socket.emit("webrtc:call-accepted", {
          to: fromUserId,
          callId: callId,
        });
      } catch (error) {
        console.error("Error accepting call:", error);
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
      try {
        // Ensure we have local stream
        if (!localStreamRef.current) {
          await getUserMedia();
        }

        setCallData((prev) => ({ ...prev, status: "connecting" }));

        const pc = createPeerConnection(data.from, data.callId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        if (socket) {
          socket.emit("webrtc:offer", {
            to: data.from,
            sdp: offer,
            callId: data.callId,
          });
        }
      } catch (error) {
        console.error("Error sending offer after acceptance:", error);
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
      try {
        setCallData((prev) => ({
          ...prev,
          remoteUserId: data.from,
          callId: data.callId,
        }));

        await new Promise((resolve) => setTimeout(resolve, 50));

        const pc = createPeerConnection(data.from, data.callId);
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc:answer", {
          to: data.from,
          sdp: answer,
          callId: data.callId,
        });

        setCallData((prev) => ({ ...prev, status: "connected" }));
      } catch (error) {
        console.error("Error handling offer:", error);
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
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp)
          );
          setCallData((prev) => ({ ...prev, status: "connected" }));
        }
      } catch (error) {
        console.error("Error handling answer:", error);
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
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
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
