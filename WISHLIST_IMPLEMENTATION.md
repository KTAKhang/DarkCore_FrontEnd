# Trang Sản phẩm Yêu thích - WishlistPage

## Tổng quan

Trang WishlistPage được tạo dựa trên cấu trúc của HomePage và ShowAllProduct, cung cấp chức năng quản lý danh sách sản phẩm yêu thích cho người dùng.

## Tính năng chính

### 1. Quản lý Wishlist

- **Thêm/Xóa sản phẩm**: Người dùng có thể thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
- **Lưu trữ local**: Dữ liệu wishlist được lưu trong localStorage để duy trì khi reload trang
- **Context Management**: Sử dụng React Context để quản lý state wishlist toàn cục

### 2. Giao diện người dùng

- **Responsive Design**: Thiết kế responsive với Tailwind CSS
- **Search & Filter**: Tìm kiếm sản phẩm trong danh sách yêu thích
- **Sorting**: Sắp xếp theo giá, đánh giá, ngày tạo
- **Empty State**: Hiển thị trạng thái trống với hướng dẫn người dùng

### 3. Tích hợp với hệ thống

- **Header Integration**: Icon wishlist trong header hiển thị số lượng sản phẩm
- **Navigation**: Breadcrumb và navigation links
- **Redux Integration**: Tích hợp với Redux để quản lý state sản phẩm

## Cấu trúc File

```
src/
├── pages/CustomerVIew/
│   └── WishlistPage.jsx          # Component chính của trang wishlist
├── contexts/
│   └── WishlistContext.jsx       # Context quản lý wishlist state
├── components/Header/
│   └── Header.jsx                # Header với wishlist icon và counter
├── routes/
│   └── index.jsx                 # Routes configuration
└── App.jsx                       # App với WishlistProvider
```

## Cách sử dụng

### 1. Truy cập trang Wishlist

- Click vào icon ❤️ trong header
- Hoặc truy cập trực tiếp `/wishlist`

### 2. Thêm sản phẩm vào wishlist

- Tại trang sản phẩm hoặc trang chủ, click vào icon ❤️ trên sản phẩm
- Sản phẩm sẽ được thêm vào wishlist và lưu vào localStorage

### 3. Quản lý wishlist

- **Tìm kiếm**: Sử dụng ô tìm kiếm để lọc sản phẩm
- **Sắp xếp**: Chọn tiêu chí sắp xếp từ dropdown
- **Xóa sản phẩm**: Click vào icon ❤️ trên sản phẩm để xóa
- **Xóa tất cả**: Sử dụng nút "Xóa tất cả" để xóa toàn bộ wishlist

## API và State Management

### Backend API Integration

Trang WishlistPage đã được tích hợp hoàn toàn với backend API:

#### API Endpoints

- **GET** `/producthome/favorites` - Lấy danh sách sản phẩm yêu thích
- **PUT** `/producthome/:id/favorite` - Toggle trạng thái yêu thích của sản phẩm

#### Redux Actions

```javascript
// Lấy danh sách sản phẩm yêu thích
dispatch(
  productHomeFavoritesRequest({
    page: 1,
    limit: 8,
    keyword: "search term",
    sortBy: "price",
    sortOrder: "asc",
  })
);

// Toggle favorite status
dispatch(productHomeToggleFavoriteRequest(productId));
```

#### Redux State Structure

```javascript
state.productHome = {
  favorites: {
    items: [],           // Array of favorite products
    pagination: {...},   // Pagination info
    loading: false,      // Loading state
    error: null          // Error state
  },
  toggleFavorite: {
    loading: false,      // Toggle loading state
    error: null          // Toggle error state
  }
}
```

### WishlistContext (Legacy - vẫn có sẵn)

```javascript
const {
  wishlist, // Array of product IDs
  addToWishlist, // Function to add product
  removeFromWishlist, // Function to remove product
  toggleWishlist, // Function to toggle product
  clearWishlist, // Function to clear all
  isInWishlist, // Function to check if product is in wishlist
  getWishlistCount, // Function to get wishlist count
} = useWishlist();
```

### Local Storage (Fallback)

- **Key**: `wishlist`
- **Format**: JSON array of product IDs
- **Persistence**: Tự động lưu và khôi phục khi reload trang
- **Usage**: Chỉ sử dụng khi không kết nối được backend

## Styling và UI Components

### ProductCard

- Tái sử dụng component từ HomePage và ShowAllProduct
- Hiển thị thông tin sản phẩm đầy đủ
- Nút thêm vào giỏ hàng và xem chi tiết
- Icon wishlist với trạng thái active/inactive

### Empty State

- Hiển thị khi wishlist trống
- Hướng dẫn người dùng khám phá sản phẩm
- Button chuyển đến trang sản phẩm

### Loading State

- Hiển thị khi đang tải dữ liệu
- Fallback data khi không kết nối được backend

## Tương thích và Fallback

### Backend Integration

- **Full API Integration**: Tích hợp hoàn toàn với backend API
- **Real-time Updates**: Cập nhật trạng thái yêu thích real-time
- **Server-side Persistence**: Dữ liệu yêu thích được lưu trên server
- **Fallback Data**: Fallback data khi API không khả dụng
- **Error Handling**: Xử lý lỗi và user feedback đầy đủ
- **Loading States**: Hiển thị trạng thái loading cho tất cả operations

### Browser Compatibility

- Sử dụng localStorage API
- Fallback graceful khi localStorage không khả dụng
- Responsive design cho mobile và desktop

## Cải tiến trong tương lai

1. ✅ **Server-side Wishlist**: Đã hoàn thành - Lưu wishlist trên server
2. **User Authentication**: Tích hợp với hệ thống đăng nhập để lưu wishlist theo user
3. **Wishlist Sharing**: Chia sẻ danh sách yêu thích
4. **Price Tracking**: Theo dõi thay đổi giá sản phẩm trong wishlist
5. **Wishlist Categories**: Phân loại sản phẩm trong wishlist
6. **Export/Import**: Xuất nhập danh sách yêu thích
7. **Bulk Operations**: Thao tác hàng loạt (thêm/xóa nhiều sản phẩm)
8. **Wishlist Analytics**: Thống kê và phân tích wishlist

## Lưu ý kỹ thuật

- Sử dụng `useMemo` để tối ưu performance
- PropTypes validation cho type safety
- Error boundary và error handling
- Cleanup functions trong useEffect
- Accessibility considerations
