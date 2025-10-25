"use client";

import { useEffect } from "react";
import { Message, Candidate } from "./types";
import { ConversationHeader } from "./ConversationHeader";
import { MessageList } from "./MessageList";
import { useScrollManager } from "./useScrollManager";

interface ConversationViewProps {
  messages: Message[];
  candidate: Candidate;
  threadId: string;
  onViewProfile: () => void;
  onStartCall?: () => void;
  typingUsers: Set<string>;
  isSending?: boolean;
}

export function ConversationView({
  messages,
  candidate,
  threadId,
  onViewProfile,
  onStartCall,
  typingUsers = new Set(),
  isSending = false,
}: ConversationViewProps) {
  const { messagesEndRef, messagesContainerRef, scrollToBottom } =
    useScrollManager({
      messages,
      threadId,
      isSending,
    });

  // Handle typing indicator - scroll when someone starts typing
  useEffect(() => {
    if (typingUsers.size > 0) {
      // Scroll to bottom when typing indicator appears
      setTimeout(() => scrollToBottom("smooth"), 100);
    }
  }, [typingUsers.size, scrollToBottom]);

  // Force scroll to bottom when component first mounts or thread changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom("auto");
    }, 100);

    return () => clearTimeout(timer);
  }, [threadId, scrollToBottom]);

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden">
      <ConversationHeader
        candidate={candidate}
        onViewProfile={onViewProfile}
        onStartCall={onStartCall}
      />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-50"
      >
        <div className="max-w-full">
          <MessageList
            messages={messages}
            candidate={candidate}
            typingUsers={typingUsers}
          />
        </div>

        {/* Auto scroll target - add small height to ensure it's scrollable */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
}
