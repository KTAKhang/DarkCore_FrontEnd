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
import {
    discountApplyRequest,
    discountClearApplied,
    discountClearMessages
} from '@/redux/actions/discountActions';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { cart, loading, error } = useSelector((state) => state.cart || {});
    const { appliedDiscount, applying, error: discountError } = useSelector((state) => state.discount || {});
    const [searchTerm, setSearchTerm] = useState('');
    const [couponCode, setCouponCode] = useState('');

    // Debug log
    useEffect(() => {
        console.log('CartPage state:', { cart, loading, error });
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('CartPage: No token found, redirecting to login');
            toast.error('Vui lòng đăng nhập để xem giỏ hàng');
            navigate('/login');
            return;
        }
        console.log('CartPage: Dispatching cartGetRequest with token:', token);
        dispatch(cartGetRequest());
    }, [dispatch, navigate]);

    // Handle cart errors - FIX: Chỉ log và clear, không toast để tránh duplicate với saga
    useEffect(() => {
        if (error) {
            console.log('CartPage error:', error);
            // toast.error(error || 'Lỗi khi tải giỏ hàng');  // ← XÓA: GÂY DUPLICATE TOAST
            dispatch(cartClearMessage());
        }
    }, [error, dispatch]);

    // Handle discount errors
    useEffect(() => {
        if (discountError) {
            console.log('CartPage discount error:', discountError);
            dispatch(discountClearMessages());
        }
    }, [discountError, dispatch]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const calculateSubtotal = () => {
        return cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    };

    const updateQuantity = (productId, change) => {
        const item = cart?.items?.find((i) => i.productId === productId);
        if (!item) return;
        const newQuantity = Math.max(1, item.quantity + change);
        console.log('CartPage: Updating quantity', { productId, newQuantity });
        dispatch(cartUpdateRequest(productId, newQuantity));
    };

    const removeItem = (productId) => {
        console.log('CartPage: Removing item', { productId });
        dispatch(cartRemoveRequest(productId));
    };

    const clearCart = () => {
        console.log('CartPage: Clearing cart');
        dispatch(cartClearRequest());
    };

    //xử lý áp dụng mã giảm giá
    const handleApplyDiscount = () => {
        if (!couponCode.trim()) {
            toast.error('Vui lòng nhập mã giảm giá');
            return;
        }
        
        const orderTotal = calculateSubtotal();
        if (orderTotal === 0) {
            toast.error('Giỏ hàng trống, không thể áp dụng mã giảm giá');
            return;
        }
        
        console.log('CartPage: Applying discount', { code: couponCode, orderTotal });
        dispatch(discountApplyRequest(couponCode.trim().toUpperCase(), orderTotal));
    };

    const handleRemoveDiscount = () => {
        dispatch(discountClearApplied());
        setCouponCode('');
    };

    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Debug log trước render
    console.log('CartPage render:', { loading, cartItems: cart?.items, totalItems });

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
                                        
                                        {/* Discount Section */}
                                        {appliedDiscount && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-green-700 font-medium">Giảm giá ({appliedDiscount.code}):</span>
                                                    <span className="text-green-600 font-bold">-{formatPrice(appliedDiscount.discountAmount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-green-700 font-medium">Tổng sau giảm:</span>
                                                    <span className="text-green-600 font-bold">{formatPrice(appliedDiscount.totalAfterDiscount)}</span>
                                                </div>
                                            </div>
                                        )}
                                        
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
                                                    {formatPrice(appliedDiscount ? appliedDiscount.totalAfterDiscount : calculateSubtotal())}
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
                                    {/* Phần áp dụng mã giảm giá */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-bold text-gray-900 mb-3">Ưu đãi & Khuyến mãi</h3>
                                        {appliedDiscount ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-green-700 font-medium">Mã đã áp dụng:</span>
                                                    <span className="text-green-600 font-bold">{appliedDiscount.code}</span>
                                                </div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-green-700 text-sm">Giảm {appliedDiscount.discountPercent}%</span>
                                                    <span className="text-green-600 font-bold">-{formatPrice(appliedDiscount.discountAmount)}</span>
                                                </div>
                                                <button
                                                    onClick={handleRemoveDiscount}
                                                    className="w-full bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                                >
                                                    Xóa mã giảm giá
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập mã giảm giá"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    disabled={applying}
                                                />
                                                <button 
                                                    onClick={handleApplyDiscount}
                                                    disabled={applying || !couponCode.trim()}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50"
                                                >
                                                    {applying ? 'Đang áp dụng...' : 'Áp dụng'}
                                                </button>
                                            </div>
                                        )}
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