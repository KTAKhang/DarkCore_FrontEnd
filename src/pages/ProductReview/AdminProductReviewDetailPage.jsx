import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getReviewDetailRequest,
} from "../../redux/actions/reviewActions";
import {
    ArrowLeft,
    Star,
    Mail,
    Clock,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Alert, Button } from "antd";

export default function AdminProductReviewDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const reviewDetailState = useSelector(
        (state) => state.review?.reviewDetail || {}
    );
    const { data: review, loading, error } = reviewDetailState;

    useEffect(() => {
        if (id) dispatch(getReviewDetailRequest(id));
    }, [dispatch, id]);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="max-w-lg w-full text-center">
                    <Alert
                        message="Lỗi khi tải chi tiết đánh giá"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                    <div className="flex justify-center">
                        <Button onClick={() => navigate(-1)} type="primary">
                            Quay lại
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading || !review) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">
                        Đang tải chi tiết đánh giá...
                    </p>
                </div>
            </div>
        );
    }

    const createdAt = review.createdAt
        ? new Date(review.createdAt).toLocaleString("vi-VN")
        : "N/A";
    const updatedAt = review.updatedAt
        ? new Date(review.updatedAt).toLocaleString("vi-VN")
        : null;
    const product = review.product || {};
    const user = review.user || {};

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-7 h-7 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 backdrop-blur-sm bg-white/90 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="group flex items-center justify-center w-11 h-11 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Chi tiết Đánh giá
                                </h1>
                                <p className="text-base text-gray-500 mt-1 font-mono">
                                    #{review._id}
                                </p>
                            </div>
                        </div>
                        <div
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold ${review.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {review.status ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <XCircle className="w-5 h-5" />
                            )}
                            {review.status ? "Đang hiển thị" : "Đã ẩn"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Left column - Product */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex-1 flex flex-col">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
                                <h2 className="text-white font-semibold text-xl">
                                    Sản phẩm được đánh giá
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col flex-1 justify-between">
                                <div>
                                    <div className="relative group mb-6">
                                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center space-y-3">
                                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                            {product.name || "—"}
                                        </h3>
                                        <p className="text-base text-gray-500 font-mono">
                                            ID: {product._id || "—"}
                                        </p>
                                    </div>
                                </div>
                                {product.price != null && (
                                    <div className="mt-6 flex justify-center">
                                        <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-md">
                                            {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Review details */}
                    <div className="w-full lg:w-2/3 flex flex-col">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex-1 flex flex-col">
                            <div className="bg-gradient-to-r from-[#0D364C] via-[#13C2C2] to-[#0D364C] p-6 text-white">

                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex">{renderStars(review.rating || 0)}</div>
                                        <span className="text-4xl font-bold">
                                            {review.rating || 0}.0
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.user_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.user_name
                                                        ? user.user_name[0].toUpperCase()
                                                        : "U"
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 text-xl">
                                                {user.user_name || "Người dùng"}
                                            </div>
                                            <div className="flex items-center text-base text-gray-500 mt-1">
                                                <Mail className="w-5 h-5 mr-2" />
                                                {user.email || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {createdAt}
                                                </div>
                                                {updatedAt && (
                                                    <div className="text-blue-600">
                                                        Cập nhật: {updatedAt}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                            Nội dung đánh giá
                                        </h3>
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                                            <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                                                {review.content || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-400 font-mono">
                                        Review ID: {review._id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
