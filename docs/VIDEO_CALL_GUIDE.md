# Video Call Integration Guide

## Overview

Video call feature has been successfully integrated into the chat system. This allows employers and freelancers to have 1-on-1 video conversations directly from the messages page.

## Features

- ✅ WebRTC peer-to-peer video calling
- ✅ Socket.IO signaling for real-time connection
- ✅ Audio/Video mute controls
- ✅ Incoming call notifications with accept/decline
- ✅ Beautiful UI with avatar fallbacks
- ✅ Auto-camera access on call initiation

## Architecture

### Backend (Already Deployed)

- **REST API**: `/api/video/calls` - Create, join, end, get call sessions
- **Socket Events**:
  - `webrtc:call` - Initiate call
  - `webrtc:offer` - Send SDP offer
  - `webrtc:answer` - Send SDP answer
  - `webrtc:ice-candidate` - Exchange ICE candidates
  - `webrtc:end-call` - End call notification

### Frontend (Just Integrated)

- **API Client**: `api.videoCall.*` functions in `/lib/api.ts`
- **Hook**: `useVideoCall` in `/messages/hooks/useVideoCall.ts`
- **Component**: `VideoCallModal` in `/messages/components/VideoCallModal.tsx`
- **UI**: "Video Call" button in conversation header

## Files Modified/Created

### Created

1. **Backend (jobboost-backend)**

   - `src/models/videoCall.model.js`
   - `src/controllers/videoCallController.js`
   - `src/routes/videoCallRoutes.js`
   - `src/docs/video-call.md`

2. **Frontend (exe-frontend)**
   - `src/app/(dashboard)/messages/hooks/useVideoCall.ts`
   - `src/app/(dashboard)/messages/components/VideoCallModal.tsx`
   - `docs/VIDEO_CALL_GUIDE.md` (this file)

### Modified

1. **Backend**

   - `src/config/socket.js` - Added WebRTC signaling handlers
   - `src/routes/index.js` - Registered video call routes

2. **Frontend**
   - `src/lib/api.ts` - Added `videoCall` API namespace
   - `src/app/(dashboard)/messages/components/ConversationHeader.tsx` - Added Video Call button
   - `src/app/(dashboard)/messages/components/ConversationView.tsx` - Pass onStartCall prop
   - `src/app/(dashboard)/messages/components/index.ts` - Export video call components
   - `src/app/(dashboard)/messages/page.tsx` - Integrated useVideoCall hook and VideoCallModal

## How to Use

### For Employers

1. Navigate to Messages page
2. Select a conversation with a freelancer
3. Click the **"Video Call"** button in the conversation header
4. Wait for the freelancer to accept
5. Once connected, use controls to mute/unmute or turn video on/off
6. Click the red phone icon to end the call

### For Freelancers

1. When an employer calls, a modal will appear automatically
2. You'll see the employer's name and avatar
3. Click the green phone icon to **Accept**
4. Click the red phone icon to **Decline**
5. Once connected, use controls as needed

## Testing Checklist

### Prerequisites

- [ ] Backend server running (`npm run dev` in jobboost-backend)
- [ ] Frontend running (`npm run dev` in exe-frontend)
- [ ] Two users logged in (one employer, one freelancer) in different browsers/tabs
- [ ] Existing conversation between the two users

### Test Flow

1. **Call Initiation**

   - [ ] Employer clicks "Video Call" button
   - [ ] Modal opens showing "Calling..." state
   - [ ] Freelancer receives incoming call notification

2. **Call Acceptance**

   - [ ] Freelancer sees incoming call with caller's name
   - [ ] Freelancer clicks Accept
   - [ ] Both sides show "Connecting..." state
   - [ ] Video streams appear (local + remote)

3. **During Call**

   - [ ] Both users can see each other's video
   - [ ] Audio works bidirectionally
   - [ ] Mute button works (audio off/on)
   - [ ] Video toggle works (camera off/on)
   - [ ] Local video shows mirrored (selfie mode)
   - [ ] Remote video fills main screen

4. **Call Termination**

   - [ ] Either user can click "End Call"
   - [ ] Other user receives end notification
   - [ ] Modal shows "Call Ended" state
   - [ ] Camera/microphone stop (no red indicator in browser)
   - [ ] Can close modal and return to chat

5. **Edge Cases**
   - [ ] Decline incoming call - works cleanly
   - [ ] Close modal during "ringing" - call cancelled
   - [ ] Network disconnect during call - shows error
   - [ ] Multiple calls not allowed simultaneously

## Troubleshooting

### Camera/Microphone Not Working

- Check browser permissions (chrome://settings/content)
- Ensure HTTPS or localhost (required for getUserMedia)
- Try different browser (Chrome/Edge recommended)

### Connection Failed

- Check browser console for WebRTC errors
- Verify Socket.IO connection (green dot in messages header)
- Check STUN servers are accessible (firewall)
- May need TURN server for restrictive NATs

### No Incoming Call Notification

- Verify Socket.IO is connected on both sides
- Check backend logs for `webrtc:call` event
- Ensure both users are in the same conversation
- Refresh page and try again

### Video Black Screen

- Check camera is not used by another app
- Try toggling video off/on
- Check browser DevTools for errors
- Verify stream tracks are active (console.log)

## Production Considerations

### Security

- [ ] Update Socket.IO CORS to specific domains (currently `*`)
- [ ] Add rate limiting for call creation
- [ ] Validate user permissions (can only call conversation participants)

### Performance

- [ ] Implement TURN server for NAT traversal (coturn recommended)
- [ ] Add call quality indicators
- [ ] Implement bandwidth adaptation
- [ ] Add call history/logging

### UX Improvements

- [ ] Add ringtone sound for incoming calls
- [ ] Add call timer
- [ ] Screen sharing support
- [ ] Recording functionality
- [ ] Call quality feedback

## API Reference

### REST Endpoints

```typescript
// Create call
POST /api/video/calls
Body: { room_name?: string }
Response: { success: true, data: VideoCall }

// Join call
POST /api/video/calls/:callId/join
Response: { success: true, data: VideoCall }

// End call
POST /api/video/calls/:callId/end
Response: { success: true, data: VideoCall }

// Get call info
GET /api/video/calls/:callId
Response: { success: true, data: VideoCall }
```

### Socket Events (Client → Server)

```typescript
socket.emit("webrtc:call", {
  to: "<userId>",
  callId: "<uuid>",
  room_name: "optional",
});

socket.emit("webrtc:offer", {
  to: "<userId>",
  sdp: RTCSessionDescription,
  callId: "<uuid>",
});

socket.emit("webrtc:answer", {
  to: "<userId>",
  sdp: RTCSessionDescription,
  callId: "<uuid>",
});

socket.emit("webrtc:ice-candidate", {
  to: "<userId>",
  candidate: RTCIceCandidate,
  callId: "<uuid>",
});

socket.emit("webrtc:end-call", {
  to: "<userId>",
  callId: "<uuid>",
});
```

### Socket Events (Server → Client)

```typescript
socket.on("webrtc:incoming-call", (data) => {
  // data: { from: '<userId>', callId: '<uuid>', room_name?: 'optional' }
});

socket.on("webrtc:offer", (data) => {
  // data: { from: '<userId>', sdp: RTCSessionDescription, callId: '<uuid>' }
});

socket.on("webrtc:answer", (data) => {
  // data: { from: '<userId>', sdp: RTCSessionDescription, callId: '<uuid>' }
});

socket.on("webrtc:ice-candidate", (data) => {
  // data: { from: '<userId>', candidate: RTCIceCandidate, callId: '<uuid>' }
});

socket.on("webrtc:end-call", (data) => {
  // data: { from: '<userId>', callId: '<uuid>' }
});
```

## Support

For issues or questions:

1. Check backend docs: `jobboost-backend/src/docs/video-call.md`
2. Review browser console for errors
3. Test with simple-peer or other WebRTC libraries if needed
4. Consider using Agora/Twilio SDK for production (easier but paid)

---

**Status**: ✅ Feature Complete - Ready for Testing
**Last Updated**: October 25, 2025
