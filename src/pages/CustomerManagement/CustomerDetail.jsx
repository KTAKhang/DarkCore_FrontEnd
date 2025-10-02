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

export default function CustomerDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedCustomer, loading } = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(getCustomerByIdRequest(id));
    }, [dispatch, id]);

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white p-2 shadow-xl ring-4 ring-white">
                                    <img
                                        alt={customer.user_name}
                                        className="w-full h-full object-cover rounded-xl"
                                        src={customer.avatar}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 sm:ml-6 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{customer.user_name}</h2>
                                        <p className="text-gray-600 flex items-center justify-center sm:justify-start space-x-2 mb-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{customer.email}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start space-x-2">
                                            <Shield className="w-4 h-4" />
                                            <span className="capitalize">{customer.role_name}</span>
                                        </p>
                                    </div>
                                    <div className="mt-4 sm:mt-0">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${customer.status
                                            ? "bg-green-100 text-green-700 ring-2 ring-green-200"
                                            : "bg-gray-100 text-gray-700 ring-2 ring-gray-200"
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${customer.status ? "bg-green-500" : "bg-gray-500"}`}></span>
                                            {customer.status ? "Hoạt động" : "Không hoạt động"}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-mono">ID: {customer._id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                                <Contact className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Thông tin liên hệ</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email</label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-gray-900 font-medium break-all">{customer.email}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Số điện thoại</label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-900 font-medium">{customer.phone || "Chưa cập nhật"}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Địa chỉ</label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="text-gray-900 font-medium">{customer.address || "Chưa cập nhật"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                                <UserCog className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Thông tin tài khoản</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Vai trò</label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <UserCircle className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="text-gray-900 font-medium capitalize">{customer.role_name}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Trạng thái</label>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${customer.status ? "bg-green-100" : "bg-red-100"
                                        }`}>
                                        {customer.status ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                    </div>
                                    <span className="text-gray-900 font-medium">{customer.status ? "Đang hoạt động" : "Đang ẩn"}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Loại tài khoản</label>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${customer.isGoogleAccount ? "bg-red-100" : "bg-blue-100"
                                        }`}>
                                        <Shield className={`w-4 h-4 ${customer.isGoogleAccount ? "text-red-600" : "text-blue-600"}`} />
                                    </div>
                                    <span className="text-gray-900 font-medium">{customer.isGoogleAccount ? "Tài khoản Google" : "Tài khoản thường"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mr-3">
                            <Clock className="w-5 h-5 text-cyan-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Thông tin thời gian</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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