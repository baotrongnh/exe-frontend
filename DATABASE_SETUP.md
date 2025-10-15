# Database Schema Setup cho Employer Registration

## Hướng dẫn tạo bảng `employer_profiles` trong Supabase

### Bước 1: Mở Supabase SQL Editor
1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com/)
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)

### Bước 2: Tạo bảng `employer_profiles`

Chạy câu lệnh SQL sau:

```sql
-- Tạo bảng employer_profiles
CREATE TABLE employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_website TEXT,
  company_logo TEXT,
  company_description TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng hiệu suất truy vấn
CREATE INDEX idx_employer_profiles_user_id ON employer_profiles(user_id);
CREATE INDEX idx_employer_profiles_is_verified ON employer_profiles(is_verified);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động cập nhật updated_at khi có thay đổi
CREATE TRIGGER update_employer_profiles_updated_at
BEFORE UPDATE ON employer_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Bước 3: Thiết lập Row Level Security (RLS)

```sql
-- Bật RLS cho bảng employer_profiles
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ có thể xem profile của chính họ
CREATE POLICY "Users can view their own employer profile"
ON employer_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: User chỉ có thể tạo profile cho chính họ
CREATE POLICY "Users can create their own employer profile"
ON employer_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: User chỉ có thể update profile của chính họ
CREATE POLICY "Users can update their own employer profile"
ON employer_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: User chỉ có thể delete profile của chính họ
CREATE POLICY "Users can delete their own employer profile"
ON employer_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Mọi người có thể xem các employer đã verified (cho trang công khai)
CREATE POLICY "Anyone can view verified employer profiles"
ON employer_profiles
FOR SELECT
USING (is_verified = TRUE);
```

### Bước 4: Kiểm tra

Chạy câu lệnh sau để kiểm tra bảng đã được tạo:

```sql
SELECT * FROM employer_profiles;
```

## Schema Structure

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | ID duy nhất của employer profile |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → auth.users(id) | ID của user (liên kết với auth.users) |
| `company_name` | TEXT | NOT NULL | Tên công ty |
| `company_website` | TEXT | NULLABLE | Website công ty |
| `company_logo` | TEXT | NULLABLE | URL logo công ty |
| `company_description` | TEXT | NULLABLE | Mô tả về công ty |
| `industry` | TEXT | NULLABLE | Ngành nghề |
| `company_size` | TEXT | CHECK constraint | Quy mô công ty (1-10, 11-50, 51-200, 201-500, 501-1000, 1000+) |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Trạng thái xác minh của employer |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Thời gian cập nhật gần nhất |

## RLS Policies

1. **Users can view their own employer profile**: User chỉ có thể xem profile của chính họ
2. **Users can create their own employer profile**: User chỉ có thể tạo profile cho chính họ
3. **Users can update their own employer profile**: User chỉ có thể update profile của chính họ
4. **Users can delete their own employer profile**: User chỉ có thể delete profile của chính họ
5. **Anyone can view verified employer profiles**: Mọi người có thể xem employer profile đã được xác minh

## Notes

- Mỗi user chỉ có thể có **1 employer profile** (UNIQUE constraint trên `user_id`)
- `company_size` có CHECK constraint để đảm bảo chỉ nhận các giá trị hợp lệ
- `is_verified` mặc định là `FALSE`, chỉ admin mới có thể set thành `TRUE`
- `updated_at` sẽ tự động cập nhật mỗi khi có thay đổi trong record
- RLS policies đảm bảo data security: user chỉ có thể truy cập/thay đổi profile của chính họ
