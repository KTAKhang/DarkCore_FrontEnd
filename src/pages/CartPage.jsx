import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Minus, Plus, Trash2, ArrowLeft, Shield, Truck, Headphones } from 'lucide-react';
import Header from '../components/Header/Header';
import {
    cartGetRequest,
    cartUpdateRequest,
    cartRemoveRequest,
    cartClearRequest,
    cartClearMessage
} from '../redux/actions/cartActions';

const CartPage = () => {
    const navigate = useNavigate(); // Khởi tạo hook useNavigate để điều hướng
    const dispatch = useDispatch(); // Khởi tạo hook useDispatch để dispatch action

    // Lấy state từ Redux store (cart, loading, error)
    const { cart, loading, error } = useSelector((state) => state.cart || {});
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu giá trị tìm kiếm
    const [couponCode, setCouponCode] = useState(''); // State để lưu mã giảm giá

    // Debug log trạng thái ban đầu
    useEffect(() => {
        console.log('CartPage state:', { cart, loading, error }); // Ghi log trạng thái Redux để debug
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (!token) {
            console.log('CartPage: No token found, redirecting to login'); // Ghi log nếu không có token
            toast.error('Vui lòng đăng nhập để xem giỏ hàng'); // Hiển thị thông báo lỗi
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
            return;
        }
        console.log('CartPage: Dispatching cartGetRequest with token:', token); // Ghi log khi dispatch action
        dispatch(cartGetRequest()); // Dispatch action để lấy giỏ hàng
    }, [dispatch, navigate]); // Chạy lại khi dispatch hoặc navigate thay đổi

    // Xử lý lỗi giỏ hàng
    useEffect(() => {
        if (error) {
            console.log('CartPage error:', error); // Ghi log lỗi để debug
            dispatch(cartClearMessage()); // Dispatch action để xóa thông báo lỗi
        }
    }, [error, dispatch]); // Chạy lại khi error hoặc dispatch thay đổi

    // Hàm định dạng giá tiền sang định dạng VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫'; // Định dạng giá với dấu ₫
    };

    // Tính tổng tạm tính của giỏ hàng
    const calculateSubtotal = () => {
        return cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0; // Tính tổng giá (giá * số lượng)
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = (productId, change) => {
        const item = cart?.items?.find((i) => i.productId === productId); // Tìm sản phẩm trong giỏ hàng
        if (!item) return; // Thoát nếu không tìm thấy sản phẩm
        const newQuantity = Math.max(1, item.quantity + change); // Đảm bảo số lượng không nhỏ hơn 1
        console.log('CartPage: Updating quantity', { productId, newQuantity }); // Ghi log khi cập nhật số lượng
        dispatch(cartUpdateRequest(productId, newQuantity)); // Dispatch action cập nhật số lượng
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = (productId) => {
        console.log('CartPage: Removing item', { productId }); // Ghi log khi xóa sản phẩm
        dispatch(cartRemoveRequest(productId)); // Dispatch action xóa sản phẩm
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        console.log('CartPage: Clearing cart'); // Ghi log khi xóa toàn bộ giỏ hàng
        dispatch(cartClearRequest()); // Dispatch action xóa giỏ hàng
    };

    // Tính tổng số lượng sản phẩm trong giỏ
    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0; // Tổng số lượng sản phẩm

    // Debug log trước khi render
    console.log('CartPage render:', { loading, cartItems: cart?.items, totalItems }); // Ghi log trạng thái trước render

    return (
        <>
            {/* <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> */}
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
                        <p className="text-gray-600">{totalItems} sản phẩm trong giỏ hàng</p>
                    </div>

                    {/* FIX: XÓA ALERT ĐỎ TRÊN UI ĐỂ TRÁNH DUPLICATE VISUAL VỚI TOAST TỪ SAGA */}
                    {/* {error && (
                        <div className="text-center py-12 text-red-600">
                            <h3 className="text-xl font-medium mb-2">Lỗi: {error || 'Không thể tải giỏ hàng'}</h3>
                            <button
                                onClick={() => dispatch(cartGetRequest())}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    )} */}
                    {loading && !error && (
                        <div className="text-center py-12">
                            {console.log('CartPage: Loading state', loading)}
                            <div className="text-6xl mb-4">⏳</div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Đang tải giỏ hàng...</h3>
                        </div>
                    )}
                    {!loading && !error && (!cart || !cart.items || cart.items.length === 0) && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    )}
                    {!loading && !error && cart?.items?.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900">Sản phẩm</h2>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {cart.items.map((item) => (
                                            <div key={item.productId} className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            alt={item.name || 'Sản phẩm'}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                            src={item.image || '/placeholder-product.jpg'}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 mb-2">{item.name || 'Sản phẩm'}</h3>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.productId, -1)}
                                                                        disabled={loading || item.quantity <= 1}
                                                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Minus className="w-4 h-4 text-gray-600" />
                                                                    </button>
                                                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.productId, 1)}
                                                                        disabled={loading}
                                                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Plus className="w-4 h-4 text-gray-600" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => removeItem(item.productId)}
                                                                    disabled={loading}
                                                                    className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-red-600 text-lg">
                                                                    {formatPrice(item.price * item.quantity)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Tiếp tục mua sắm
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        disabled={loading}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa tất cả
                                    </button>
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng kết đơn hàng</h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tạm tính:</span>
                                            <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span className="font-medium">Miễn phí</span>
                                        </div>
                                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg flex items-center">
                                            <Truck className="w-4 h-4 mr-2" />
                                            Miễn phí vận chuyển cho đơn hàng trên 50 triệu
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                                                <span className="text-2xl font-bold text-red-600">
                                                    {formatPrice(calculateSubtotal())}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <button
                                            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
                                            disabled={loading || !cart?.items?.length}
                                        >
                                            Thanh toán ngay
                                        </button>
                                        <button
                                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                            disabled={loading || !cart?.items?.length}
                                        >
                                            Mua trước trả sau
                                        </button>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-bold text-gray-900 mb-3">Ưu đãi & Khuyến mãi</h3>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nhập mã giảm giá"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap">
                                                Áp dụng
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            <span>Bảo hành chính hãng</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                                            <Truck className="w-4 h-4 text-blue-500" />
                                            <span>Giao hàng toàn quốc</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                                            <Headphones className="w-4 h-4 text-purple-500" />
                                            <span>Hỗ trợ 24/7</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartPage;