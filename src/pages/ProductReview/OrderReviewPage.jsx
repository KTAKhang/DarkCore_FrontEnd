import React, { useEffect, useState } from 'react';
import { Star, Check, Lightbulb, ChevronRight, X } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearReviewMessages, createProductReviewRequest, getReviewByOrderIdRequest, updateProductReviewRequest } from '../../redux/actions/reviewActions';

export default function OrderReviewPage() {
    const [reviewModal, setReviewModal] = useState({
        open: false,
        order_detail_id: null,
        product: null,
    });
    const [rating, setRating] = useState(5);
    const [reviewContent, setReviewContent] = useState("");
    const [editModal, setEditModal] = useState({
        open: false,
        review: null,
        product: null,
    });
    const [editRating, setEditRating] = useState(5);
    const [editContent, setEditContent] = useState("");
    const { id } = useParams();
    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.review?.orderReviews);
    const { createReviewSuccess, updateReviewSuccess } = useSelector((state) => state.review);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        dispatch(getReviewByOrderIdRequest(id));
    }, [dispatch, id]);

    useEffect(() => {
        if ((createReviewSuccess || updateReviewSuccess)) {
            dispatch(getReviewByOrderIdRequest(id));
            dispatch(clearReviewMessages());
        }
    }, [createReviewSuccess, updateReviewSuccess, id, dispatch]);

    console.log("reviews", reviews)
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <a href="/" className="hover:text-gray-900">Trang chủ</a>
                <ChevronRight className="w-4 h-4" />
                <a href="/customer/orders" className="hover:text-gray-900">Lịch sử đơn hàng</a>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">Đánh giá đơn hàng #{id}</span>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Đánh giá đơn hàng #{id}
                        </h1>
                    </div>
                </div>

                {/* Status Banner */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <Check className="text-green-500 w-5 h-5 mr-2" />
                        <span className="text-green-800 font-medium">
                            Đơn hàng đã được giao thành công
                        </span>
                    </div>
                </div>
            </div>

            {/* Product Review Section */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Đánh giá sản phẩm trong đơn hàng
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Chia sẻ trải nghiệm của bạn để giúp khách hàng khác
                    </p>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Đang tải đánh giá...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">Lỗi: {error}</div>
                    ) : reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((item, idx) => (
                                <div key={item.order_detail_id} className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover object-top"
                                            src={item.product?.image}
                                        />
                                    </div>
                                    {/* Product Details & Review */}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">{item.product?.name}</h3>
                                        {item.review ? (
                                            <>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-sm text-gray-600">Đánh giá:</span>
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < item.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">"{item.review.content}"</p>
                                                <p className="text-xs text-gray-500">Đánh giá ngày: {new Date(item.review.updatedAt).toLocaleDateString("vi-VN")}</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3 mt-3">

                                                    <span className="text-gray-500 text-sm">Chưa có đánh giá</span>
                                                    <button
                                                        className="inline-flex gap-2 ml-[350px] px-5 ml py-2 rounded-lg bg-gradient-to-r from-[#13C2C2] to-[#0D364C] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
                                                        onClick={() => setReviewModal({ open: true, order_detail_id: item.order_detail_id, product: item.product })}
                                                    >
                                                        <Star className="w-4 h-4" />
                                                        Viết đánh giá
                                                    </button>


                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {/* Edit Button - only show when review exists */}
                                    {item.review && (
                                        <button
                                            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                                            onClick={() => {
                                                setEditModal({ open: true, review: item.review, product: item.product });
                                                setEditRating(item.review.rating);
                                                setEditContent(item.review.content);
                                            }}
                                        >
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">Không có sản phẩm nào trong đơn hàng này.</div>
                    )}

                    {/* Tips Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <div className="flex items-start">
                            <Lightbulb className="text-blue-500 w-5 h-5 mr-3 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-1">
                                    Mẹo viết đánh giá hữu ích
                                </h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Chia sẻ trải nghiệm thực tế về chất lượng sản phẩm</li>
                                    <li>• Đánh giá về tính năng, hiệu suất và độ bền</li>
                                    <li>• Thêm hình ảnh thực tế để minh họa</li>
                                    <li>• Đưa ra lời khuyên cho người mua khác</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-200">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    Đánh giá sản phẩm
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                    {reviewModal.product?.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setReviewModal({ open: false, order_detail_id: null, product: null })}
                                className="ml-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Rating Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Đánh giá của bạn
                                </label>
                                <div className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="transition-transform hover:scale-110 active:scale-95"
                                            onClick={() => setRating(i + 1)}
                                        >
                                            <Star
                                                className={`w-10 h-10 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {rating}/5
                                    </span>
                                </div>
                            </div>

                            {/* Review Content Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung đánh giá
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#13C2C2] focus:border-transparent transition-all resize-none"
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    value={reviewContent}
                                    onChange={e => setReviewContent(e.target.value)}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {reviewContent.length}/500 ký tự
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <button
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                onClick={() => setReviewModal({ open: false, order_detail_id: null, product: null })}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#13C2C2] to-[#0D364C] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!reviewContent.trim() || reviewContent.length > 500}
                                onClick={() => {
                                    if (reviewContent.length > 500) return;
                                    dispatch(createProductReviewRequest({
                                        user_id: user._id,
                                        product_id: reviewModal.product._id,
                                        order_detail_id: reviewModal.order_detail_id,
                                        rating,
                                        review_content: reviewContent,
                                    }));
                                    setReviewModal({ open: false, order_detail_id: null, product: null });
                                    setRating(5);
                                    setReviewContent("");
                                }}
                            >
                                Gửi đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-200">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    Chỉnh sửa đánh giá
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                    {editModal.product?.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setEditModal({ open: false, review: null, product: null })}
                                className="ml-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Rating Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Đánh giá của bạn
                                </label>
                                <div className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="transition-transform hover:scale-110 active:scale-95"
                                            onClick={() => setEditRating(i + 1)}
                                        >
                                            <Star
                                                className={`w-10 h-10 ${i < editRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {editRating}/5
                                    </span>
                                </div>
                            </div>

                            {/* Review Content Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung đánh giá
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#13C2C2] focus:border-transparent transition-all resize-none"
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {editContent.length}/500 ký tự
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <button
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                onClick={() => setEditModal({ open: false, review: null, product: null })}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#13C2C2] to-[#0D364C] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!editContent.trim() || editContent.length > 500}
                                onClick={async () => {
                                    if (editContent.length > 500) return;
                                    await dispatch(updateProductReviewRequest(
                                        editModal.review._id,
                                        { rating: editRating, review_content: editContent },
                                        user._id
                                    ));
                                    setEditModal({ open: false, review: null, product: null });
                                    dispatch(getReviewByOrderIdRequest(id));
                                }}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}