# Messages Feature

This directory contains the complete messaging system for the employer dashboard.

## Components

### MessageThreadItem

- Displays individual message threads in the left sidebar
- Shows candidate avatar, name, title, last message preview, and timestamp
- Indicates unread message count with a badge

### ConversationView

- Shows the full conversation between employer and candidate
- Displays candidate information with "View Profile" button
- Renders chat bubbles for both employer and candidate messages
- Scrollable message history

### MessageInput

- Text input component for sending new messages
- Supports Enter key to send (Shift+Enter for new line)
- Shows loading state while sending
- Auto-clears after successful send

## API Functions

### getMessageThreads()

Returns a list of all message threads with candidate information and last message preview.

### getMessagesByThreadId(id)

Fetches all messages for a specific conversation thread.

### sendMessage(threadId, text)

Sends a new message and updates the conversation.

### getCandidateById(id)

Retrieves candidate profile information.

## Features

- **Real-time messaging interface** - Clean, modern chat UI
- **Search functionality** - Filter conversations by candidate name, title, or message content
- **Responsive design** - Adapts to different screen sizes
- **Professional styling** - Consistent with job platform branding
- **Loading states** - Smooth user experience with loading indicators
- **Error handling** - Graceful error management

## Usage

Navigate to `/messages` in the dashboard to access the messaging interface. The page will automatically load recent conversations and allow you to:

1. Browse message threads in the left sidebar
2. Search for specific conversations
3. Select a thread to view full conversation
4. Send replies to candidates
5. View candidate profiles

## Mock Data

The system includes comprehensive mock data with 5 example candidates and realistic conversation threads to demonstrate functionality.
