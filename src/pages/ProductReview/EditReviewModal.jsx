import React, { useState, useEffect, useRef } from "react";

/**
 * EditReviewModal - Enhanced Design
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onSubmit: ({ rating, comment, files }) => void
 *  - review: { title, subtitle, orderId, image, rating, comment } (optional)
 */
export default function EditReviewModal({ open = true, onClose, onSubmit, review = {} }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(review.comment ?? "");
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const maxChars = 500;
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setRating(review.rating ?? 5);
            setComment(review.comment ?? "");
            setFiles([]);
            setPreviews([]);
        }
    }, [open, review]);

    useEffect(() => {
        return () => {
            previews.forEach((p) => URL.revokeObjectURL(p));
        };
    }, [previews]);

    const handleFileChange = (e) => {
        const chosen = Array.from(e.target.files || []);
        const limited = [...files, ...chosen].slice(0, 5);
        setFiles(limited);
        const newPreviews = limited.map((f) => URL.createObjectURL(f));
        previews.forEach((p) => URL.revokeObjectURL(p));
        setPreviews(newPreviews);
    };

    const removeFileAt = (index) => {
        const newFiles = files.slice();
        newFiles.splice(index, 1);
        setFiles(newFiles);
        const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
        previews.forEach((p) => URL.revokeObjectURL(p));
        setPreviews(newPreviews);
    };

    const handleSubmit = () => {
        if (comment.trim() === "") return;
        if (onSubmit) onSubmit({ rating, comment: comment.trim(), files });
    };

    if (!open) return null;

    return (
        <>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
            <div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
                aria-modal="true"
                role="dialog"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Sửa đánh giá
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">Chia sẻ trải nghiệm của bạn</p>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-700 hover:bg-white rounded-full p-2 transition-all duration-200 hover:shadow-md"
                            onClick={onClose}
                            aria-label="Đóng"
                        >
                            <i className="ri-close-line text-2xl" />
                        </button>
                    </div>

                    {/* Product info */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-blue-100">
                                <img
                                    alt={review.title ?? "Sản phẩm"}
                                    className="w-full h-full object-cover object-top"
                                    src={
                                        review.image ||
                                        "https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%2013%20inch%20laptop%20computer%20on%20clean%20white%20background%2C%20modern%20sleek%20design%2C%20space%20gray%20color%2C%20minimalist%20product%20photography%2C%20high%20quality%2C%20professional%20lighting&width=400&height=400&seq=1&orientation=squarish"
                                    }
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">{review.title ?? "MacBook Air M2 13 inch"}</h3>
                                <p className="text-sm text-gray-600 mt-1">{review.subtitle ?? "8GB RAM, 256GB SSD, Midnight"}</p>
                                <div className="flex items-center mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        <i className="ri-shopping-bag-3-line mr-1" />
                                        {review.orderId ? `#${review.orderId}` : "#ORD001"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-6">
                        {/* Rating */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100">
                            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <i className="ri-star-line mr-2 text-yellow-500" />
                                Đánh giá sao *
                            </label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const active = hoverRating ? i <= hoverRating : i <= rating;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setRating(i)}
                                            onMouseEnter={() => setHoverRating(i)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className={`text-4xl transition-all duration-200 transform hover:scale-110 ${active ? "text-yellow-400 drop-shadow-lg" : "text-gray-300 hover:text-yellow-300"
                                                }`}
                                            aria-label={`Chọn ${i} sao`}
                                        >
                                            <i className="ri-star-fill" />
                                        </button>
                                    );
                                })}
                                <span className="ml-4 text-base font-medium text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                                    {rating}/5 sao
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <i className="ri-edit-line mr-2 text-blue-500" />
                                Nội dung đánh giá *
                            </label>
                            <textarea
                                name="comment"
                                required
                                rows={5}
                                maxLength={maxChars}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-all duration-200 hover:border-gray-300"
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">
                                    <i className="ri-information-line mr-1" />
                                    Đánh giá chi tiết giúp người khác đưa ra quyết định tốt hơn
                                </span>
                                <span className={`text-xs font-medium ${comment.length > maxChars * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                                    {comment.length}/{maxChars}
                                </span>
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <i className="ri-image-line mr-2 text-purple-500" />
                                Hình ảnh <span className="text-gray-500 font-normal ml-1">(tối đa 5 ảnh)</span>
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    {previews.map((p, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-200">
                                                <img src={p} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFileAt(idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                                aria-label="Xóa ảnh"
                                            >
                                                <i className="ri-close-line text-sm" />
                                            </button>
                                        </div>
                                    ))}

                                    {previews.length < 5 && (
                                        <label className="cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 flex items-center justify-center w-24 h-24 group">
                                            <div className="text-center">
                                                <i className="ri-camera-line text-gray-400 group-hover:text-blue-500 text-3xl mb-1 transition-colors duration-200" />
                                                <p className="text-xs text-gray-600 group-hover:text-blue-600 font-medium transition-colors duration-200">
                                                    Thêm ảnh
                                                </p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                multiple
                                                accept="image/*"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 flex items-center">
                                    <i className="ri-lightbulb-line mr-1" />
                                    Hình ảnh rõ nét giúp đánh giá của bạn hữu ích hơn
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 text-sm font-medium whitespace-nowrap transition-all duration-200"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 text-sm font-medium whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <i className="ri-check-line mr-1" />
                                Cập nhật đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}