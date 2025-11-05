"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Video } from "lucide-react";
import { Candidate } from "./types";

interface ConversationHeaderProps {
  candidate: Candidate;
  onViewProfile: () => void;
  onStartCall?: () => void;
}

export function ConversationHeader({
  candidate,
  onViewProfile,
  onStartCall,
}: ConversationHeaderProps) {
  const initials = candidate.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={candidate.avatar} alt={candidate.name} />
            <AvatarFallback className="bg-[#E9EBFD] text-[#4640DE] font-medium text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {candidate.name}
            </h2>
            <p className="text-gray-600">{candidate.title}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {onStartCall && (
            <Button
              onClick={onStartCall}
              className="gap-2 bg-[#4640DE] text-white hover:bg-[#3730B8]"
            >
              <Video className="w-4 h-4" />
              Video Call
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onViewProfile}
            className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#E9EBFD]"
          >
            <ExternalLink className="w-4 h-4" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
