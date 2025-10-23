# Job Post API Documentation

## Updated: Post Cost Instead of Budget Range

### Changes Made:

Previously, the job posting form used:

- `budget_min` (minimum budget)
- `budget_max` (maximum budget)

**Now updated to:**

- `post_cost` (single cost value for posting the job)

---

## API Request

### Endpoint:

```
POST http://14.169.15.9:3003/api/jobs
```

### Request Headers:

```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

### Request Body:

```json
{
  "title": "Full Stack Developer",
  "description": "We are looking for an experienced Full Stack Developer...",
  "job_type": "FULL_TIME",
  "budget_type": "FIXED",
  "post_cost": 10000000,
  "currency": "VND",
  "experience_level": "JUNIOR",
  "deadline": "2025-12-31",
  "skills_required": ["React", "Node.js", "PostgreSQL"]
}
```

### Field Descriptions:

| Field              | Type   | Required | Description                                       | Example                                          |
| ------------------ | ------ | -------- | ------------------------------------------------- | ------------------------------------------------ |
| `title`            | string | Yes      | Job title                                         | "Full Stack Developer"                           |
| `description`      | string | Yes      | Detailed job description                          | "We are looking for..."                          |
| `job_type`         | enum   | Yes      | Type of employment                                | "FULL_TIME", "PART_TIME", "FREELANCE", "PROJECT" |
| `budget_type`      | enum   | Yes      | How the cost is calculated                        | "FIXED", "HOURLY"                                |
| `post_cost`        | number | Yes      | Cost to post this job (in smallest currency unit) | 10000000 (VND)                                   |
| `currency`         | string | Yes      | Currency code                                     | "VND", "USD"                                     |
| `experience_level` | enum   | Yes      | Required experience level                         | "INTERN", "JUNIOR", "MIDDLE", "SENIOR"           |
| `deadline`         | string | No       | Application deadline (ISO date)                   | "2025-12-31"                                     |
| `skills_required`  | array  | Yes      | Required skills                                   | ["React", "Node.js"]                             |

---

## Form Implementation

### State Management:

```typescript
const [formData, setFormData] = useState({
  title: "",
  description: "",
  job_type: "FULL_TIME",
  budget_type: "FIXED",
  post_cost: "", // ← Single cost field
  currency: "VND",
  experience_level: "JUNIOR",
  deadline: "",
  skills_required: "",
});
```

### Data Transformation:

```typescript
const jobData = {
  title: formData.title,
  description: formData.description,
  job_type: formData.job_type,
  budget_type: formData.budget_type,
  post_cost: parseInt(formData.post_cost) || 0, // ← Convert to number
  currency: formData.currency,
  experience_level: formData.experience_level,
  deadline: formData.deadline || null,
  skills_required: skillsArray, // ← Converted from comma-separated string
};
```

---

## Form UI

### Post Cost Input Field:

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Post Cost *
  </label>
  <input
    type="number"
    name="post_cost"
    value={formData.post_cost}
    onChange={handleChange}
    required
    placeholder="e.g. 10000000"
    min="0"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  />
  <p className="text-xs text-gray-500 mt-1">Cost to post this job</p>
</div>
```

---

## Expected Response

### Success Response (201 Created):

```json
{
  "success": true,
  "job": {
    "id": "job_uuid",
    "title": "Full Stack Developer",
    "description": "...",
    "job_type": "FULL_TIME",
    "budget_type": "FIXED",
    "post_cost": 10000000,
    "currency": "VND",
    "experience_level": "JUNIOR",
    "deadline": "2025-12-31T00:00:00.000Z",
    "skills_required": ["React", "Node.js", "PostgreSQL"],
    "status": "pending",
    "created_at": "2025-10-21T...",
    "updated_at": "2025-10-21T..."
  }
}
```

### Error Response (400 Bad Request):

```json
{
  "success": false,
  "message": "Validation error: post_cost is required"
}
```

---

## Testing Checklist

- [x] ✅ Remove `budget_min` and `budget_max` from state
- [x] ✅ Add `post_cost` to state
- [x] ✅ Update form to show single cost input
- [x] ✅ Update API call to send `post_cost`
- [x] ✅ Add placeholder and help text
- [x] ✅ Add min="0" validation
- [ ] 🔄 Test job creation with various cost values
- [ ] 🔄 Verify backend receives `post_cost` correctly
- [ ] 🔄 Check admin approval flow

---

## Example Usage

### VND Currency (Vietnam Dong):

```json
{
  "post_cost": 10000000, // 10 million VND
  "currency": "VND"
}
```

### USD Currency:

```json
{
  "post_cost": 500, // $500
  "currency": "USD"
}
```

---

## Notes

- **post_cost** represents the cost to post the job listing, not the budget for the job itself
- The value should be in the smallest currency unit (e.g., for VND: actual value, for USD: cents if applicable)
- The field is required and must be a positive number
- Currency should match the employer's or system's default currency
