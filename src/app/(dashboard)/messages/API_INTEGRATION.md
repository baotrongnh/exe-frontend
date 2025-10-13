# Chat API Integration Documentation

## Overview

The Messages feature has been successfully integrated with the backend API structure as defined in `chat-feature.md`. The implementation includes both real API calls and mock functionality for development.

## Integration Details

### API Structure Added to `/lib/api.ts`

```typescript
conversations: {
  // Get all conversations for the authenticated user
  getAll: async () => Promise<ApiResponse>;

  // Create a new conversation
  create: async (data: { freelancerId: string; jobId?: string }) => Promise<ApiResponse>;

  // Get messages in a conversation
  getMessages: async (conversationId: string, params?: { limit?: number; offset?: number }) => Promise<ApiResponse>;

  // Send a message in a conversation
  sendMessage: async (conversationId: string, data: MessageData) => Promise<ApiResponse>;

  // Mark messages as read
  markAsRead: async (conversationId: string) => Promise<ApiResponse>;

  // Get unread message count
  getUnreadCount: async () => Promise<ApiResponse>;
}
```

### Mock Implementation Features

1. **Environment Toggle**: `USE_MOCK_API` flag in `mockApi.ts` to switch between mock and real API
2. **Data Transformation**: Functions to convert API responses to UI-compatible formats
3. **Fallback Handling**: Graceful fallback to mock data if API calls fail
4. **Real-time Updates**: Mock data updates to simulate real API behavior

### Key Functions

#### `getMessageThreads()`

- Fetches all conversations for the current user
- Transforms API `ApiConversation[]` to UI `MessageThread[]`
- Handles unread count calculation

#### `getMessagesByThreadId(threadId)`

- Fetches messages for a specific conversation
- Transforms API `ApiMessage[]` to UI `Message[]`
- Handles sender type detection (employer vs candidate)

#### `sendMessage(threadId, content)`

- Sends a new message to a conversation
- Updates local state to reflect changes immediately
- Returns the new message in UI format

#### `markMessagesAsRead(threadId)`

- Marks all unread messages in a conversation as read
- Updates UI state to reflect read status
- Called automatically when opening conversations

### Data Flow

1. **UI Components** → Call functions from `mockApi.ts`
2. **Mock API Functions** → Check `USE_MOCK_API` flag
3. **If TRUE** → Use mock data with simulated delays
4. **If FALSE** → Call real API via `/lib/api.ts`
5. **Transform Data** → Convert API response to UI format
6. **Update UI** → Return data to components

### Usage in Components

```typescript
// In Messages page component
const loadThreads = useCallback(async () => {
  const threadsData = await getMessageThreads();
  setThreads(threadsData);
}, []);

const loadMessages = useCallback(async (threadId: string) => {
  const messagesData = await getMessagesByThreadId(threadId);
  setMessages(messagesData);

  // Auto-mark as read
  await markMessagesAsRead(threadId);
}, []);
```

### Switching to Real API

To switch from mock to real API:

1. Set `USE_MOCK_API = false` in `mockApi.ts`
2. Ensure backend server is running
3. Update API base URL in `/lib/api.ts` if needed
4. All existing functionality will work with real API

### Error Handling

- API errors gracefully fall back to mock data
- Console logging for debugging
- UI remains functional even with API failures

### Future Enhancements

When ready for production:

1. Remove mock data and functions
2. Add proper error handling UI
3. Implement Socket.IO for real-time messaging
4. Add file upload capabilities
5. Add typing indicators

## API Endpoints Supported

- ✅ `GET /api/v1/conversations` - Get all conversations
- ✅ `POST /api/v1/conversations` - Create conversation
- ✅ `GET /api/v1/conversations/{id}/messages` - Get messages
- ✅ `POST /api/v1/conversations/{id}/messages` - Send message
- ✅ `PATCH /api/v1/conversations/{id}/read` - Mark as read
- ✅ `GET /api/v1/conversations/unread-count` - Get unread count

All endpoints are properly typed and ready for backend integration.
