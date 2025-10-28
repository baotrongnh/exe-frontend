# Video Call Debugging Guide

## 🐛 Improvements Made

### 1. **Enhanced ICE Servers Configuration**
Added multiple STUN and TURN servers for better NAT traversal:

```typescript
const ICE_SERVERS = {
  iceServers: [
    // Multiple STUN servers for redundancy
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    
    // FREE TURN servers for NAT traversal
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
```

**Why this matters:**
- **STUN servers**: Help discover your public IP address (works on same network)
- **TURN servers**: Relay traffic when direct P2P connection fails (needed for different networks/firewalls)
- **Multiple servers**: Provides redundancy and failover options

---

### 2. **Improved Media Constraints**
Enhanced audio settings for better quality and echo cancellation:

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  },
  audio: {
    echoCancellation: true,  // Prevents echo feedback
    noiseSuppression: true,   // Reduces background noise
    autoGainControl: true,    // Normalizes audio levels
  },
});
```

---

### 3. **Comprehensive Logging**
Added detailed console logs throughout the WebRTC flow:

#### **Call Flow Logging:**
```
📞 Initiating call to: user123
🔄 Creating call session via API...
✅ Call session created: call-id-456
🎥 Getting user media...
✅ User media obtained
📤 Sending call notification to: user123
✅ Call notification sent
```

#### **Media Track Logging:**
```
✅ Got media stream: {
  id: "stream-123",
  active: true,
  videoTracks: 1,
  audioTracks: 1
}
📹 Track video: {
  id: "track-456",
  label: "Front Camera",
  enabled: true,
  muted: false,
  readyState: "live"
}
📹 Track audio: {
  id: "track-789",
  label: "Built-in Microphone",
  enabled: true,
  muted: false,
  readyState: "live"
}
```

#### **ICE Candidate Logging:**
```
🧊 Sending ICE candidate: {
  type: "host",
  protocol: "udp",
  address: "192.168.1.100"
}
📥 Received ICE candidate from: user456 {
  type: "srflx",
  candidate: "candidate:..."
}
✅ Added ICE candidate successfully
```

#### **Connection State Logging:**
```
🧊 ICE gathering state: gathering
🧊 ICE connection state: checking
🧊 ICE connection state: connected
🔗 Connection state: connected
```

---

## 🧪 How to Debug

### **Step 1: Open Browser Console**
On both machines, open Developer Tools (F12) and check Console tab.

### **Step 2: Look for These Patterns**

#### ✅ **Successful Connection:**
```
📞 Initiating call...
✅ User media obtained
🔧 Creating peer connection...
🧊 ICE gathering state: gathering
🧊 Sending ICE candidate: type: "host"
🧊 Sending ICE candidate: type: "srflx"  ← Public IP discovered (STUN working)
📥 Received ICE candidate...
🧊 ICE connection state: connected  ← SUCCESS!
🔗 Connection state: connected
```

#### ❌ **Failed Connection (No TURN):**
```
🧊 ICE gathering state: gathering
🧊 Sending ICE candidate: type: "host"
🧊 ICE gathering state: complete
🧊 ICE connection state: checking
🧊 ICE connection state: failed  ← TURN servers needed!
❌ ICE connection failed - may need TURN servers
```

#### ⚠️ **One-Way Video (Firewall Issue):**
```
Machine A: ✅ Connected
Machine B: 🧊 ICE connection state: checking (stuck)
         → Check firewall settings
         → TURN server might be blocked
```

#### 🔇 **No Audio:**
```
📹 Track audio: {
  enabled: true,
  muted: true  ← Audio muted!
}
→ Check microphone permissions
→ Check if audio track is added to peer connection
```

---

## 🔧 Common Issues & Solutions

### **Issue 1: No Connection Between Different Networks**
**Symptoms:**
- Works on same WiFi
- Fails across different networks
- ICE state stuck on "checking"

**Solution:**
- ✅ **Already Fixed!** TURN servers added
- If still fails, TURN servers might be overloaded
- Consider using paid TURN servers (Twilio, Xirsys)

---

### **Issue 2: Audio Not Working**
**Symptoms:**
- Video works fine
- No audio on either side

**Checklist:**
1. ✅ Check browser permissions (microphone access)
2. ✅ Verify audio track in logs: `audioTracks: 1`
3. ✅ Check if audio track is `enabled: true, muted: false`
4. ✅ Look for "Adding audio track" in createPeerConnection logs
5. ✅ Test microphone in other apps (ensure hardware works)

**Debug Command:**
```javascript
// In browser console, check local stream:
localStreamRef.current?.getAudioTracks().forEach(track => {
  console.log('Audio track:', track.label, 'enabled:', track.enabled, 'muted:', track.muted);
});
```

---

### **Issue 3: One-Way Video**
**Symptoms:**
- User A sees User B's camera
- User B sees nothing

**Possible Causes:**
1. **Asymmetric NAT**: One side can receive but not send
2. **Firewall**: Blocking incoming connections on one side
3. **Track not added**: Remote track not attached to video element

**Debug:**
```
Machine A (sender):
✅ Adding video track to peer connection
✅ ICE candidates sent

Machine B (receiver):
📥 Received ICE candidate (check this!)
❌ ontrack event not fired (problem!)
```

**Solution:**
- ✅ **Already Fixed!** Added comprehensive track logging
- Check if `pc.ontrack` event fires on receiver
- Verify remote stream is attached to `<video>` element

---

### **Issue 4: Connection Drops After Few Seconds**
**Symptoms:**
- Call connects successfully
- Drops after 5-30 seconds

**Possible Causes:**
1. **ICE restart needed**: Connection state changed
2. **TURN server timeout**: Free TURN servers have limits
3. **Network switch**: Device changed WiFi/cellular

**Debug:**
```
🔗 Connection state: connected
🔗 Connection state: disconnected  ← Connection lost
🔗 Connection state: failed
```

**Solution:**
- Implement ICE restart mechanism (not yet done)
- Use paid TURN servers for production
- Add connection quality monitoring

---

## 📊 Testing Checklist

### **Before Testing:**
- [ ] Clear browser cache
- [ ] Grant camera/microphone permissions
- [ ] Check firewall settings (allow WebRTC ports)
- [ ] Ensure stable internet connection

### **Test Scenarios:**

#### **Scenario 1: Same Network**
- [ ] Both users on same WiFi
- [ ] Expected: Direct P2P connection (host candidates)
- [ ] Check logs: Should see `type: "host"` candidates only

#### **Scenario 2: Different Networks**
- [ ] Users on different WiFi/cellular
- [ ] Expected: STUN/TURN relay connection
- [ ] Check logs: Should see `type: "srflx"` or `type: "relay"` candidates

#### **Scenario 3: Behind Corporate Firewall**
- [ ] One user behind strict firewall
- [ ] Expected: TURN relay required
- [ ] Check logs: Should eventually use `type: "relay"` candidates

---

## 🚀 Next Steps If Still Not Working

### **1. Verify TURN Servers Are Working**
Test with this command:
```bash
# Install webrtc-testing-tool
npm install -g webrtc-testing-tool

# Test TURN server
webrtc-test --turn turn:openrelay.metered.ca:80 --username openrelayproject --credential openrelayproject
```

### **2. Use Alternative TURN Servers**
If openrelay.metered.ca is overloaded, try these:

#### **Twilio (Free Tier)**
```typescript
{
  urls: "turn:global.turn.twilio.com:3478?transport=udp",
  username: "your-twilio-username",
  credential: "your-twilio-credential",
}
```

#### **Xirsys (Free Trial)**
```typescript
{
  urls: "turn:xirsys-turn-server.com:80?transport=tcp",
  username: "your-xirsys-username",
  credential: "your-xirsys-credential",
}
```

### **3. Check Backend Socket.IO**
Ensure signaling server properly relays messages:
```javascript
// Backend should log:
console.log('Forwarding offer to:', data.to);
console.log('Forwarding answer to:', data.to);
console.log('Forwarding ICE candidate to:', data.to);
```

### **4. Network Diagnostics**
Check if ports are blocked:
```bash
# Test UDP ports (WebRTC uses UDP)
nc -u -v -z openrelay.metered.ca 80

# Check if STUN works
stunclient stun.l.google.com 19302
```

---

## 📝 Reading the Logs

### **Complete Successful Call Flow:**

**Machine A (Caller):**
```
📞 Initiating call to: userB
✅ Call session created
🎥 Getting user media...
✅ Got media stream: videoTracks: 1, audioTracks: 1
📤 Sending call notification
✅ Call accepted by: userB
🔧 Creating peer connection...
🎬 Creating offer...
✅ Local description (offer) set
📤 Sending offer to: userB
🧊 ICE gathering state: gathering
🧊 Sending ICE candidate: type: "host"
🧊 Sending ICE candidate: type: "srflx"
📥 Received answer from: userB
✅ Remote description (answer) set
📥 Received ICE candidate from: userB
✅ Added ICE candidate successfully
🧊 ICE connection state: connected
🔗 Connection state: connected
```

**Machine B (Receiver):**
```
📲 Incoming call from: userA
✅ Accepting call
🔄 Joining call via API...
🎥 Getting user media...
✅ Got media stream: videoTracks: 1, audioTracks: 1
📤 Sending call-accepted notification
📥 Received offer from: userA
🔧 Setting remote description (offer)...
✅ Remote description set
🎬 Creating answer...
✅ Local description (answer) set
📤 Sending answer to: userA
🧊 ICE gathering state: gathering
🧊 Sending ICE candidate: type: "host"
📥 Received ICE candidate from: userA
✅ Added ICE candidate successfully
🧊 ICE connection state: connected
🔗 Connection state: connected
```

---

## 🎯 Summary of Changes

| Component | Before | After | Impact |
|-----------|--------|-------|--------|
| **STUN servers** | 2 servers | 5 servers | Better redundancy |
| **TURN servers** | ❌ None | ✅ 3 configs | Works across networks |
| **Audio constraints** | Basic | Enhanced (echo cancel, noise suppress) | Better quality |
| **Logging** | Minimal | Comprehensive | Easy debugging |
| **Media track info** | None | Detailed | Track issues faster |
| **ICE candidate info** | Basic | Full details | Diagnose connectivity |
| **Connection states** | Limited | All states logged | Monitor health |

---

## 💡 Tips for Production

1. **Use Paid TURN Servers**: Free servers are unreliable for production
2. **Implement Reconnection**: Auto-reconnect if connection drops
3. **Monitor Quality**: Track packet loss, latency, jitter
4. **Fallback to Audio-Only**: If video fails, try audio-only call
5. **User Feedback**: Show connection quality indicator to users
6. **Analytics**: Log connection success/failure rates

---

## 📞 Support

If issues persist after checking all logs:
1. Share console logs from both machines
2. Note exact error messages
3. Specify network setup (WiFi, cellular, VPN, corporate)
4. Test with different browsers (Chrome, Firefox, Safari)

Good luck debugging! 🚀
