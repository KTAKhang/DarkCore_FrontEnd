# CORS Fix Guide

## Vấn đề

Backend trả về `Access-Control-Allow-Origin: *` nhưng khi frontend sử dụng `withCredentials: true`, browser yêu cầu origin cụ thể thay vì wildcard.

## Giải pháp

### 1. Tạo Axios Config Không Credentials

- File: `src/utils/axiosConfigNoCredentials.js`
- Sử dụng `withCredentials: false` để tránh CORS issues
- Vẫn hỗ trợ token refresh thông qua Authorization header

### 2. Cập nhật Tất cả Saga

- `categorySaga.js`: Sử dụng `axiosConfigNoCredentials`
- `productSaga.js`: Sử dụng `axiosConfigNoCredentials`
- `authSaga.js`: Sử dụng `axiosConfigNoCredentials`
- `staffSaga.js`: Sử dụng `axiosConfigNoCredentials`

### 3. Token Refresh Strategy

- **API calls thường**: Không sử dụng credentials (tránh CORS)
- **Refresh token**: Vẫn sử dụng credentials để gửi cookie
- **Authorization header**: Vẫn hoạt động bình thường

## Backend CORS Configuration

Backend cần cập nhật CORS config:

```javascript
// Thay vì
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Sử dụng
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL cụ thể
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);
```

## Test Results Expected

### Trước khi fix:

```
Access to XMLHttpRequest at 'http://localhost:3000/catalog/api/categories'
from origin 'http://localhost:5173' has been blocked by CORS policy:
The value of the 'Access-Control-Allow-Origin' header in the response
must not be the wildcard '*' when the request's credentials mode is 'include'.
```

### Sau khi fix:

```
📤 Request sent with token: eyJhbGciOiJIUzI1NiIs...
📡 CategorySaga apiList - Response: {status: "OK", data: [...]}
✅ API call thành công: 200
```

## Console Logs để Debug

- `📤 Request sent with token:` - Request được gửi với token
- `📡 CategorySaga apiList - Response:` - Response từ API
- `🔄 Token expired, attempting refresh...` - Khi token hết hạn
- `✅ Token refresh successful:` - Khi refresh thành công
- `🌐 CORS error detected, trying without credentials...` - Khi phát hiện CORS error

## Troubleshooting

### 1. Vẫn gặp CORS error

- Kiểm tra backend CORS config
- Đảm bảo origin được set cụ thể thay vì "\*"
- Kiểm tra credentials setting

### 2. Token refresh không hoạt động

- Kiểm tra refresh token endpoint
- Đảm bảo cookie refreshToken tồn tại
- Kiểm tra console logs

### 3. API calls vẫn fail

- Kiểm tra Authorization header
- Đảm bảo token được gửi đúng format
- Kiểm tra backend middleware
