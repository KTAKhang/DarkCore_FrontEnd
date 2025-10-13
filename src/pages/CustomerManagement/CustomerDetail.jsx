import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerByIdRequest } from "../../redux/actions/customerAction";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    UserCircle,
    Shield,
    CheckCircle,
    XCircle,
    Calendar,
    RefreshCw,
    Clock,
    User,
    UserCog,
    Contact
} from "lucide-react";
import { Alert } from "antd";

export default function CustomerDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedCustomer, loading, error } = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(getCustomerByIdRequest(id));
    }, [dispatch, id]);

    // Hiển thị lỗi nếu có
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <Alert
                        message="Lỗi khi tải dữ liệu khách hàng"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                    <button
                        onClick={() => navigate("/admin/customer")}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Quay lại danh sách khách hàng
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !selectedCustomer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu khách hàng...</p>
                </div>
            </div>
        );
    }

    const customer = selectedCustomer;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate("/admin/customer")}
                            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết khách hàng</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Xem và quản lý thông tin khách hàng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Section - Horizontal */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left: Avatar & Basic Info */}
                        <div className="lg:w-1/3 bg-gradient-to-br from-[#0D364C] via-[#13C2C2] to-[#0D364C] p-8 flex flex-col items-center justify-center text-white">
                            <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white p-2 shadow-xl ring-4 ring-white/30 mb-6">
                                <img
                                    alt={customer.user_name}
                                    className="w-full h-full object-cover rounded-xl"
                                    src={customer.avatar}
                                />
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-center">{customer.user_name}</h2>
                            <p className="text-white/90 mb-2 flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{customer.email}</span>
                            </p>
                            <div className="flex items-center space-x-2 mb-4">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm capitalize">{customer.role_name}</span>
                            </div>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${customer.status
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                                }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${customer.status ? "bg-green-500" : "bg-gray-500"}`}></span>
                                {customer.status ? "Hoạt động" : "Không hoạt động"}
                            </span>
                            <p className="text-xs text-white/60 mt-4 font-mono">ID: {customer._id}</p>
                        </div>

                        {/* Right: Detailed Information Grid */}
                        <div className="lg:w-2/3 p-8">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
                                {/* Contact Information */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <Contact className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Thông tin liên hệ</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-900 text-sm font-medium break-all">{customer.email}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Số điện thoại</label>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span className="text-gray-900 text-sm font-medium">{customer.phone || "Chưa cập nhật"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Địa chỉ</label>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                                <span className="text-gray-900 text-sm font-medium">{customer.address || "Chưa cập nhật"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                            <UserCog className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Thông tin tài khoản</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vai trò</label>
                                            <div className="flex items-center space-x-2">
                                                <UserCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                                <span className="text-gray-900 text-sm font-medium capitalize">{customer.role_name}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trạng thái</label>
                                            <div className="flex items-center space-x-2">
                                                {customer.status ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                                )}
                                                <span className="text-gray-900 text-sm font-medium">{customer.status ? "Đang hoạt động" : "Đang ẩn"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Loại tài khoản</label>
                                            <div className="flex items-center space-x-2">
                                                <Shield className={`w-4 h-4 flex-shrink-0 ${customer.isGoogleAccount ? "text-red-600" : "text-blue-600"}`} />
                                                <span className="text-gray-900 text-sm font-medium">{customer.isGoogleAccount ? "Tài khoản Google" : "Tài khoản thường"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline - Horizontal */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mr-3">
                            <Clock className="w-5 h-5 text-cyan-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Thông tin thời gian</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                            <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">Ngày tạo tài khoản</label>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-gray-900 font-semibold">
                                    {customer.createdAt ? new Date(customer.createdAt).toLocaleString("vi-VN", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : "Chưa có thông tin"}
                                </span>
                            </div>
                        </div>
                        {customer.updatedAt && (
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                <label className="block text-xs font-semibold text-purple-700 uppercase mb-2">Cập nhật lần cuối</label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <RefreshCw className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-gray-900 font-semibold">
                                        {new Date(customer.updatedAt).toLocaleString("vi-VN", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}