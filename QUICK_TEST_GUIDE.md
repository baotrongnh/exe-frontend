# 🧪 Quick Testing Guide

## ✅ Prerequisite
- Backend API running on `http://localhost:3000`
- Frontend running on `http://localhost:3001` (or different port)
- User logged in with Supabase Auth

---

## 🔍 Testing Checklist

### 1️⃣ Jobs APIs
- [ ] Browse jobs at `/find-jobs`
- [ ] Click job detail
- [ ] Apply for a job
- [ ] Check Network tab: All requests to `/api/v1/jobs`

### 2️⃣ Applications APIs
- [ ] View applications at `/my-applications`
- [ ] Check pagination
- [ ] Check Network tab: Requests to `/api/v1/applications`

### 3️⃣ CVs APIs
- [ ] Go to `/my-cv`
- [ ] Upload a PDF CV
- [ ] Download a CV
- [ ] Delete a CV
- [ ] Check Network tab: All requests to `/api/v1/cvs`

### 4️⃣ Employer APIs
- [ ] Register as employer at `/employer/register`
- [ ] View dashboard at `/employer/dashboard`
- [ ] Check Network tab: Requests to `/api/employer`

---

## 🔧 Network Verification

Open DevTools → Network → Filter by **Fetch/XHR**

Check each request:
1. ✅ URL starts with `http://localhost:3000/api/`
2. ✅ Has `Authorization: Bearer <token>` header
3. ✅ Response status is `200` or `201`
4. ✅ Response has `{ success: true, data: ... }` format

---

## ❌ Common Issues

### Issue: 401 Unauthorized
**Solution:** Log out and log in again

### Issue: CORS Error
**Solution:** Check backend CORS settings allow frontend origin

### Issue: 404 Not Found
**Solution:** Verify backend is running and endpoint exists

### Issue: "No CV found"
**Solution:** Upload at least one CV before applying

---

## 📝 Expected Behavior

### Jobs
- Load list of jobs with pagination
- Click job → Show detail page
- Apply → Success toast → Redirect or update count

### Applications
- Show all user's applications
- Each shows: job title, status, date

### CVs
- Show all uploaded CVs
- Upload new CV → Add to list
- Download → File downloads
- Delete → Remove from list

### Employer
- Register → Save profile → Redirect to dashboard
- Dashboard → Show company info

---

## ✅ Success Criteria

All these should work:
- ✅ No console errors
- ✅ All API calls return success
- ✅ JWT token auto-injected
- ✅ Data displays correctly
- ✅ Actions work (apply, upload, delete)

---

**Ready to test! 🚀**
