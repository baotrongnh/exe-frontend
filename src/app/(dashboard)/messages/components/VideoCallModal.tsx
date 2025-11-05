"use client";

import { useEffect, useRef } from "react";
import { X, Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CallStatus } from "../hooks/useVideoCall";

interface VideoCallModalProps {
  isOpen: boolean;
  callStatus: CallStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  remoteName: string;
  remoteAvatar?: string;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function VideoCallModal({
  isOpen,
  callStatus,
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  remoteName,
  remoteAvatar,
  onClose,
  onAccept,
  onDecline,
  onToggleMute,
  onToggleVideo,
  onEndCall,
}: VideoCallModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch((err) => {
        console.error("Failed to play local video:", err);
      });
    }
  }, [localStream, callStatus]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => {
        console.error("Failed to play remote video:", err);
      });
    }
  }, [remoteStream, callStatus]);

  if (!isOpen) return null;

  const initials = remoteName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const renderContent = () => {
    // Incoming call (ringing state with onAccept)
    if (callStatus === "ringing" && onAccept) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#4640DE] to-[#6B5DD3] text-white p-8">
          <Avatar className="w-32 h-32 mb-6 border-4 border-white shadow-xl">
            <AvatarImage src={remoteAvatar} alt={remoteName} />
            <AvatarFallback className="bg-white text-[#4640DE] text-4xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold mb-2">{remoteName}</h2>
          <p className="text-xl mb-8 opacity-90">Incoming video call...</p>

          <div className="flex gap-6">
            <Button
              onClick={onDecline}
              size="lg"
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            <Button
              onClick={onAccept}
              size="lg"
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 transition-all"
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </div>
      );
    }

    // Outgoing call (initiating/ringing without onAccept)
    if (
      callStatus === "initiating" ||
      (callStatus === "ringing" && !onAccept)
    ) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#4640DE] to-[#6B5DD3] text-white p-8">
          <Avatar className="w-32 h-32 mb-6 border-4 border-white shadow-xl">
            <AvatarImage src={remoteAvatar} alt={remoteName} />
            <AvatarFallback className="bg-white text-[#4640DE] text-4xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold mb-2">{remoteName}</h2>
          <p className="text-xl mb-8 opacity-90">Calling...</p>

          <div className="flex gap-4 items-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-300"></div>
          </div>

          <Button
            onClick={onEndCall}
            size="lg"
            className="mt-8 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      );
    }

    // Connecting state
    if (callStatus === "connecting") {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#4640DE] to-[#6B5DD3] text-white p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
          <p className="text-lg opacity-90">Setting up the call</p>
        </div>
      );
    }

    // Connected - show video
    if (callStatus === "connected") {
      return (
        <div className="relative w-full h-full bg-black">
          {/* Remote video (main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-900"
          />

          {/* Remote user avatar fallback when no video */}
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4640DE] to-[#6B5DD3]">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={remoteAvatar} alt={remoteName} />
                <AvatarFallback className="bg-white text-[#4640DE] text-4xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover mirror bg-gray-800"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Remote user name */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-full">
            <p className="text-white font-medium">{remoteName}</p>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              onClick={onToggleMute}
              size="lg"
              className={`w-14 h-14 rounded-full transition-all ${
                isMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            <Button
              onClick={onToggleVideo}
              size="lg"
              className={`w-14 h-14 rounded-full transition-all ${
                isVideoOff
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </Button>

            <Button
              onClick={onEndCall}
              size="lg"
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      );
    }

    // Error state
    if (callStatus === "error") {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <PhoneOff className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Failed</h2>
          <p className="text-gray-600 mb-8">Could not establish connection</p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      );
    }

    // Ended state
    if (callStatus === "ended") {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-6">
            <Phone className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Ended</h2>
          <p className="text-gray-600 mb-8">The call has ended</p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl max-h-screen">
        {/* Close button (hidden during active call) */}
        {callStatus !== "connected" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}

        {renderContent()}
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
