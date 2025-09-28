# Token Refresh Implementation Guide

## Tổng quan

Hệ thống đã được cập nhật để tự động refresh token khi token hết hạn, thay vì yêu cầu người dùng đăng nhập lại.

## Các thay đổi chính

### 1. Axios Configuration (`src/utils/axiosConfig.js`)

- Tạo axios instance với interceptors
- Request interceptor: Tự động thêm token vào mọi request
- Response interceptor: Xử lý token refresh khi gặp lỗi 401

### 2. Token Refresh Flow

1. **Request được gửi với token hiện tại**
2. **Nếu token hết hạn (401 error):**
   - Axios interceptor tự động gọi `/auth/refresh-token`
   - Cập nhật token mới vào localStorage
   - Retry request gốc với token mới
3. **Nếu refresh thất bại:**
   - Hiển thị thông báo "Phiên đăng nhập đã hết hạn"
   - Redirect về trang login

### 3. Console Logs để Debug

Các console.log đã được thêm vào để debug:

- `🔑 Token stored:` - Khi lưu token mới
- `📤 Request sent with token:` - Khi gửi request
- `🔄 Received new token from backend:` - Khi nhận token mới từ backend
- `🔄 Token expired, attempting refresh...` - Khi bắt đầu refresh
- `✅ Token refresh successful:` - Khi refresh thành công
- `❌ Token refresh failed:` - Khi refresh thất bại

### 4. Saga Updates

Tất cả saga đã được cập nhật:

- Sử dụng `apiClient` thay vì `axios` trực tiếp
- Xử lý lỗi 401 được chuyển cho axios interceptor
- Thêm console.log để debug

## Cách test

### 1. Sử dụng TokenRefreshTest Component

```jsx
import TokenRefreshTest from "../components/TokenRefreshTest";

// Thêm vào component để test
<TokenRefreshTest />;
```

### 2. Manual Testing

1. Đăng nhập vào hệ thống
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Thực hiện các thao tác quản lý category/product
5. Quan sát console logs để xem token refresh process

### 3. Expected Behavior

- **Token còn hạn:** API calls hoạt động bình thường
- **Token hết hạn:** Tự động refresh và retry request
- **Refresh thất bại:** Hiển thị thông báo và redirect login

## Backend Requirements

Backend cần hỗ trợ:

1. **Refresh token endpoint:** `POST /auth/refresh-token`
2. **New-Access-Token header:** Gửi token mới trong response header
3. **Cookie refreshToken:** Lưu refresh token trong cookie

## Troubleshooting

### 1. Token không được refresh

- Kiểm tra console logs
- Đảm bảo refresh token endpoint hoạt động
- Kiểm tra cookie refreshToken có tồn tại

### 2. Infinite refresh loop

- Kiểm tra refresh token có hết hạn không
- Đảm bảo backend trả về đúng format response

### 3. 403 Access Denied

- Kiểm tra user có role admin không
- Đảm bảo token chứa đúng thông tin role

## Console Log Examples

### Successful Token Refresh

```
🔑 Token stored: eyJhbGciOiJIUzI1NiIs...
📤 Request sent with token: eyJhbGciOiJIUzI1NiIs...
🔄 Token expired, attempting refresh...
✅ Token refresh successful: {token: {access_token: "new_token"}}
🔄 Retrying original request with new token
```

### Failed Token Refresh

```
🔑 Token stored: eyJhbGciOiJIUzI1NiIs...
📤 Request sent with token: eyJhbGciOiJIUzI1NiIs...
🔄 Token expired, attempting refresh...
❌ Token refresh failed: Failed to refresh token
🚪 Logging out user due to token refresh failure
```
