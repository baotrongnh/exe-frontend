# 🧪 Quick Testing Guide - Employer Registration API Integration

## ✅ Pre-Test Checklist

- [ ] Backend server running: `https://exe201-sgk6.onrender.com`
- [ ] Frontend dev server running: `npm run dev`
- [ ] User logged in (Supabase Auth)
- [ ] User is 'normal' role (not employer yet)
- [ ] Browser DevTools open (Console + Network tabs)

---

## 🚀 Test 1: Employer Registration

### Steps:
1. Login với tài khoản có role 'normal'
2. Click "Become Employer" ở Navbar
3. Điền form:
   - Company name: "Test Company" ✅ (required)
   - Company website: "https://test.com" (optional)
   - Company size: "11-50" (optional)
   - Industry: "Technology" (optional)
4. Click "Đăng ký Employer"

### Expected Results:
- ✅ Loading spinner hiện
- ✅ Console log: "Employer profile created successfully"
- ✅ Success message hiện
- ✅ Auto redirect to `/employer/dashboard` sau 2 giây
- ✅ Navbar đổi từ "Become Employer" → "Dashboard"

### Check Network Tab:
```
POST https://exe201-sgk6.onrender.com/api/v1/employer/register
Status: 201 Created
Headers: Authorization: Bearer eyJ...
Response: { "message": "...", "data": { "id": "...", ... } }
```

---

## 🎯 Test 2: Dashboard Profile Display

### Steps:
1. After registration, should be at `/employer/dashboard`
2. Wait for profile to load

### Expected Results:
- ✅ Loading spinner → Profile info
- ✅ Console log: "Employer profile loaded: {...}"
- ✅ Company name displayed: "Test Company"
- ✅ Verification status: "⏳ Chờ xác minh"
- ✅ Warning banner: "Tài khoản chưa được xác minh"
- ✅ Action buttons disabled (labeled "Chờ xác minh")

### Check Network Tab:
```
GET https://exe201-sgk6.onrender.com/api/v1/employer/profile
Status: 200 OK
Headers: Authorization: Bearer eyJ...
Response: { "id": "...", "company_name": "Test Company", ... }
```

---

## 🐛 Test 3: Error Handling

### Test 3.1: Duplicate Registration
**Steps**: Try registering again with same user

**Expected**:
- ❌ Error message: "User already has an employer profile"
- Status: 409 Conflict

### Test 3.2: Unauthorized Access
**Steps**: 
1. Logout
2. Try access `/employer/dashboard`

**Expected**:
- ✅ Redirect to `/login`

### Test 3.3: Invalid Token
**Steps**: Clear session storage and try API call

**Expected**:
- ❌ 401 Unauthorized error
- Console logs auth error

---

## 📊 Quick Debug Commands

### Check Session:
```typescript
// In browser console
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
console.log('Token:', session?.access_token)
```

### Check User Role:
```typescript
// In browser console
const { data: { user } } = await supabase.auth.getUser()
console.log('User metadata:', user?.user_metadata)
console.log('Role:', user?.user_metadata?.role)
```

### Manual API Test:
```bash
# Get your JWT token from browser
TOKEN="your_jwt_token_here"

# Test registration
curl -X POST https://exe201-sgk6.onrender.com/api/v1/employer/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Test Company"}'

# Test get profile
curl -X GET https://exe201-sgk6.onrender.com/api/v1/employer/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Success Criteria

All these should work:
- ✅ User can register as employer
- ✅ Profile saved to backend database
- ✅ User role updated to 'employer' in Supabase
- ✅ Dashboard displays profile correctly
- ✅ Navbar updates based on role
- ✅ Duplicate registration blocked
- ✅ Unauthorized access blocked
- ✅ All API calls use JWT token
- ✅ Error messages display properly

---

## 📝 Test Results

Date: ___________
Tester: ___________

| Test | Result | Notes |
|------|--------|-------|
| Registration | ☐ Pass ☐ Fail | |
| Dashboard Load | ☐ Pass ☐ Fail | |
| Duplicate Block | ☐ Pass ☐ Fail | |
| Auth Required | ☐ Pass ☐ Fail | |
| Network Calls | ☐ Pass ☐ Fail | |

**Overall**: ☐ All Tests Pass ☐ Issues Found

Issues:
______________________________________________
______________________________________________
______________________________________________
