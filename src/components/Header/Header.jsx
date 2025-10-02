import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartGetRequest } from "../../redux/actions/cartActions";




const Header = ({ searchTerm, setSearchTerm }) => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart); // lấy cart từ redux

    // giả sử userId = "user123", sau này bạn thay bằng user thực tế
    useEffect(() => {
        dispatch(cartGetRequest("user123"));
    }, [dispatch]);

    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link className="flex items-center space-x-2" to="/">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">💻</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">TechStore</span>
                    </Link>

                    {/* Menu */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link className="text-gray-700 hover:text-blue-600 transition-colors" to="/">Trang chủ</Link>
                        <Link className="text-gray-700 hover:text-blue-600 transition-colors" to="/products">Sản phẩm</Link>
                        <Link className="text-gray-700 hover:text-blue-600 transition-colors" to="/repair">Sửa chữa</Link>
                        <Link className="text-gray-700 hover:text-blue-600 transition-colors" to="/about">Về chúng tôi</Link>
                        <Link className="text-gray-700 hover:text-blue-600 transition-colors" to="/contact">Liên hệ</Link>
                    </nav>

                    {/* Search + Cart + User */}
                    <div className="flex items-center space-x-4">
                        {/* Search box */}
                        <div className="relative transition-all duration-300 w-64">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm laptop, máy tính bảng..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Wishlist + Cart + Login */}
                        <div className="flex items-center space-x-2">
                            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <span className="text-lg">🤍</span>
                            </button>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                                style={{ color: '#13C2C2' }}
                            >
                                <span className="text-lg">🛒</span>
                                {items?.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {items.length}
                                    </span>
                                )}
                            </Link>

                            {/* Login */}
                            <Link
                                to="/login"
                                className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                                style={{ color: '#13C2C2' }}
                            >
                                <span className="text-lg">👤</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
