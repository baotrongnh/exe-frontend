# ✅ API Integration Complete - Employer Registration System

**Date**: October 15, 2025  
**Branch**: `klong/auth`  
**Status**: ✅ Ready for Testing

---

## 📋 Summary

Frontend đã được tích hợp hoàn toàn với Backend API cho Employer Registration System. Tất cả calls đã được chuyển từ Next.js API routes sang Backend Express API.

---

## 🔄 Changes Made

### 1. **API Client Updated** - `src/lib/api.ts`

✅ Added complete Employer API endpoints:

```typescript
employer: {
  register(employerData)      // POST /api/employer/register
  getProfile()                // GET /api/employer/profile  
  updateProfile(employerData) // PUT /api/employer/profile
  getVerifiedEmployers(params)// GET /api/employers
  getById(id)                 // GET /api/employers/:id
}

admin: {
  verifyEmployer(id, status)  // PATCH /api/admin/employers/:id/verify
}
```

**Features**:
- ✅ Auto JWT token injection via axios interceptor
- ✅ Automatic error handling & logging
- ✅ TypeScript type definitions
- ✅ Consistent response format

### 2. **Registration Page** - `src/app/employer/register/page.tsx`

**Before**:
```typescript
// Called Next.js API route
const response = await fetch('/api/employer/register', {...})
```

**After**:
```typescript
// Calls Backend API via api client
await api.employer.register(employerData)
```

**Changes**:
- ✅ Removed manual fetch() call
- ✅ Removed manual token header setup
- ✅ Using api.employer.register()
- ✅ Automatic JWT token injection
- ✅ Better error handling from axios interceptor

### 3. **Dashboard Page** - `src/app/employer/dashboard/page.tsx`

**Before**:
```typescript
// Direct Supabase query
const { data } = await supabase
  .from('employer_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

**After**:
```typescript
// Calls Backend API
const data = await api.employer.getProfile()
```

**Changes**:
- ✅ Removed Supabase direct database access
- ✅ Using api.employer.getProfile()
- ✅ Cleaner code with single source of truth
- ✅ Backend handles all database logic

### 4. **Cleanup**

✅ **Deleted**: `src/app/api/employer/` (Next.js API routes)
- No longer needed since Backend handles all API logic
- Reduces code duplication
- Cleaner separation of concerns

---

## 🎯 API Endpoints Being Used

### Registration Flow

```
1. User fills form → Submit
2. Frontend: api.employer.register()
   → POST https://exe201-sgk6.onrender.com/api/v1/employer/register
   → Headers: { Authorization: Bearer {jwt} }
   → Body: { company_name, company_website, ... }
3. Backend: Creates employer profile
4. Frontend: Updates Supabase user metadata (role: 'employer')
5. Frontend: Redirects to /employer/dashboard
```

### Dashboard Flow

```
1. User visits /employer/dashboard
2. Frontend: api.employer.getProfile()
   → GET https://exe201-sgk6.onrender.com/api/v1/employer/profile
   → Headers: { Authorization: Bearer {jwt} }
3. Backend: Returns employer profile data
4. Frontend: Displays profile information
```

---

## 🔐 Authentication Flow

### How JWT Token Works:

1. **User logs in** → Supabase Auth returns JWT token
2. **Token stored** in Supabase session (auto-managed)
3. **API client intercepts** all requests:
   ```typescript
   // In src/lib/api.ts
   apiClient.interceptors.request.use(async (config) => {
     const { data: { session } } = await supabase.auth.getSession()
     if (session?.access_token) {
       config.headers.Authorization = `Bearer ${session.access_token}`
     }
     return config
   })
   ```
4. **Backend verifies** JWT token on each request
5. **Backend extracts** user_id from token
6. **Backend processes** request with authenticated user context

---

## ✅ Testing Checklist

### Prerequisites
- [ ] Backend server running at `https://exe201-sgk6.onrender.com`
- [ ] Frontend dev server running (`npm run dev`)
- [ ] User logged in with valid Supabase account
- [ ] User role is 'normal' (not already employer)

### Test Scenarios

#### 1. Employer Registration
- [ ] Navigate to `/employer/register`
- [ ] Fill in form with:
  - Company name: "Test Company" (required)
  - Company website: "https://test.com" (optional)
  - Company size: "11-50" (optional)
  - Industry: "Technology" (optional)
  - Description: "Test description" (optional)
- [ ] Click "Đăng ký Employer"
- [ ] Should see loading state
- [ ] Should see success message
- [ ] Should redirect to `/employer/dashboard` after 2 seconds
- [ ] Check browser console for: "Employer profile created successfully"

**Expected API Call**:
```
POST https://exe201-sgk6.onrender.com/api/v1/employer/register
Authorization: Bearer eyJhbGc...
Body: { "company_name": "Test Company", ... }
```

**Expected Response**:
```json
{
  "message": "Employer profile created successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "company_name": "Test Company",
    "is_verified": false,
    "created_at": "2025-10-15T..."
  }
}
```

#### 2. Dashboard Profile Display
- [ ] After registration, should be at `/employer/dashboard`
- [ ] Should see loading spinner initially
- [ ] Should see profile information:
  - Company name
  - Company website (if provided)
  - Industry (if provided)
  - Company size (if provided)
  - Description (if provided)
  - Verification status: "⏳ Chờ xác minh"
- [ ] Should see warning banner: "Tài khoản chưa được xác minh"
- [ ] Action buttons should be disabled (labeled "Chờ xác minh")
- [ ] Check browser console for: "Employer profile loaded: {...}"

**Expected API Call**:
```
GET https://exe201-sgk6.onrender.com/api/v1/employer/profile
Authorization: Bearer eyJhbGc...
```

**Expected Response**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "company_name": "Test Company",
  "company_website": "https://test.com",
  "company_logo": null,
  "company_description": "Test description",
  "industry": "Technology",
  "company_size": "11-50",
  "is_verified": false,
  "created_at": "2025-10-15T...",
  "updated_at": "2025-10-15T..."
}
```

#### 3. Error Handling
- [ ] **Duplicate Registration**: Try registering again with same user
  - Should show error: "User already has an employer profile"
  - Status code: 409 Conflict
  
- [ ] **Missing Token**: Logout and try accessing `/employer/dashboard`
  - Should redirect to `/login`
  
- [ ] **Invalid Token**: Use expired/invalid token
  - Should show 401 Unauthorized error
  - Check console for auth error logs

#### 4. Network Debugging
Check browser DevTools → Network tab:
- [ ] POST request to `/employer/register` shows 201 status
- [ ] GET request to `/employer/profile` shows 200 status
- [ ] Authorization header is present in all requests
- [ ] Response bodies match expected format

---

## 🐛 Troubleshooting

### Issue: "No token provided" error

**Symptom**: API returns 401 with message "No token provided!"

**Solution**:
1. Check if user is logged in
2. Check Supabase session exists:
   ```typescript
   const { data: { session } } = await supabase.auth.getSession()
   console.log('Session:', session)
   ```
3. Verify token in request headers (Network tab)
4. Clear browser cache and re-login

### Issue: "User already has an employer profile"

**Symptom**: API returns 409 Conflict

**Solution**:
- This is expected behavior (user can only register once)
- To test again, either:
  1. Use a different user account
  2. Delete employer profile from database
  3. Or update existing profile instead

### Issue: Profile not loading on dashboard

**Symptom**: Dashboard shows loading spinner forever or error message

**Check**:
1. Backend server is running
2. API endpoint is correct in `src/lib/api.ts`
3. JWT token is valid (not expired)
4. Employer profile exists in database
5. Check browser console for error logs

**Debug**:
```typescript
// Add console logs in dashboard page
console.log('User:', user)
console.log('User Role:', userRole)
console.log('Fetching profile...')
```

### Issue: CORS errors

**Symptom**: Browser console shows CORS policy errors

**Solution**:
- Backend should have CORS configured for frontend URL
- Check backend CORS settings allow `http://localhost:3000`
- Verify OPTIONS preflight requests succeed

---

## 📊 Backend API Contract

### Expected Request/Response Formats

Backend implementation should match these formats:

#### POST /api/employer/register

**Request**:
```json
{
  "company_name": "string (required)",
  "company_website": "string (optional, URL)",
  "company_logo": "string (optional, URL)",
  "company_description": "string (optional)",
  "industry": "string (optional)",
  "company_size": "string (optional, enum)"
}
```

**Success Response (201)**:
```json
{
  "message": "Employer profile created successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "company_name": "string",
    "is_verified": false,
    "created_at": "timestamp"
  }
}
```

**Error Response (409)**:
```json
{
  "error": "User already has an employer profile"
}
```

#### GET /api/employer/profile

**Success Response (200)**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "company_name": "string",
  "company_website": "string | null",
  "company_logo": "string | null",
  "company_description": "string | null",
  "industry": "string | null",
  "company_size": "string | null",
  "is_verified": boolean,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Error Response (404)**:
```json
{
  "error": "Employer profile not found"
}
```

---

## 📝 Environment Variables

Ensure these are set in `.env.local`:

```env
# Supabase (for auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API is hardcoded in src/lib/api.ts
# const API_BASE_URL = "https://exe201-sgk6.onrender.com/api/v1"
```

---

## 🚀 Next Steps

### Immediate Actions
1. ✅ Test registration flow end-to-end
2. ✅ Test dashboard profile display
3. ✅ Verify JWT token flow works
4. ✅ Check error handling scenarios

### Future Enhancements
- [ ] Add profile update functionality (PUT /api/employer/profile)
- [ ] Add file upload for company logo
- [ ] Add employer profile image optimization
- [ ] Add admin verification UI
- [ ] Add employer search/filter on public page
- [ ] Add analytics tracking for employer registrations

---

## 📞 Support

If integration issues occur:

1. **Check Backend Status**: Verify backend is running at `https://exe201-sgk6.onrender.com`
2. **Check API Docs**: Review `EMPLOYER_API_IMPLEMENTATION.md` for backend details
3. **Check Console Logs**: Both browser DevTools and terminal logs
4. **Check Network Tab**: Verify requests/responses
5. **Test with cURL**: Bypass frontend to isolate backend issues

---

## 📚 Related Files

### Frontend Files Modified
- ✅ `src/lib/api.ts` - Added employer APIs
- ✅ `src/app/employer/register/page.tsx` - Uses api.employer.register()
- ✅ `src/app/employer/dashboard/page.tsx` - Uses api.employer.getProfile()

### Frontend Files Deleted
- ✅ `src/app/api/employer/register/route.ts` - No longer needed

### Backend Files (Reference)
- `src/controllers/employerController.js`
- `src/routes/employerRoutes.js`
- `src/models/employerProfile.model.js`

### Documentation
- `BACKEND_API_REQUIREMENTS.md` - API specifications
- `EMPLOYER_API_IMPLEMENTATION.md` - Backend implementation details
- `DATABASE_SETUP.md` - Database schema

---

**Status**: ✅ Integration Complete  
**Testing Status**: ⏳ Pending Tests  
**Last Updated**: October 15, 2025
