import axios from 'axios';
import { supabase } from './supabase';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://14.169.93.37:3003/api/v1',
     timeout: 10000,
     headers: {
          'Content-Type': 'application/json',
     },
});

// Request interceptor để tự động thêm access token vào header
apiClient.interceptors.request.use(
     async (config) => {
          try {
               // Lấy session hiện tại từ Supabase
               const { data: { session }, error } = await supabase.auth.getSession();

               if (session?.access_token && !error) {
                    // Thêm Bearer token vào Authorization header
                    config.headers.Authorization = `Bearer ${session.access_token}`;
               }
          } catch (error) {
               console.error('Error getting session for API request:', error);
          }

          return config;
     },
     (error) => {
          return Promise.reject(error);
     }
);

// Response interceptor để xử lý lỗi authentication
apiClient.interceptors.response.use(
     (response) => {
          return response;
     },
     async (error) => {
          if (error.response?.status === 401) {
               // Token hết hạn hoặc không hợp lệ
               console.error('Authentication failed:', error.response.data);

               // Có thể redirect về trang login hoặc refresh token
               // window.location.href = '/login';
          }

          return Promise.reject(error);
     }
);

export default apiClient;