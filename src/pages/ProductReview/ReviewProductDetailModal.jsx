import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, MoreHorizontal, Star } from 'lucide-react';

const ReviewProductDetailModal = () => {
    const [activeTab, setActiveTab] = useState('reviews');
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const reviews = [
        {
            id: 1,
            userName: 'KTAKhang',
            userInitial: 'K',
            orderCode: '#65d21e8a01b2c3d4e5f6a85',
            rating: 5,
            date: '21:30 14/01/2025',
            content: 'Sản phẩm rất tốt, chất lượng cao, giao hàng nhanh. Laptop chạy mượt mà, thiết kế đẹp và hiện đại. Rất hài lòng với sản phẩm này.',
            likes: 12
        }
    ];

    const ratingStats = [
        { stars: 5, count: 1, percentage: 100 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 }
    ];

    const tabs = [
        { id: 'description', label: 'Mô tả sản phẩm' },
        { id: 'specifications', label: 'Thông số kỹ thuật' },
        { id: 'reviews', label: 'Đánh giá (1)' }
    ];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
        ));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border mt-8">
            {/* Tabs */}
            <div className="border-b">
                <div className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="space-y-6">
                    {/* Rating Summary */}


                    {/* Filters and Sort */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {/* <label className="text-sm font-medium text-gray-700">Lọc theo:</label> */}
                                <select
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="5">5 sao</option>
                                    <option value="4">4 sao</option>
                                    <option value="3">3 sao</option>
                                    <option value="2">2 sao</option>
                                    <option value="1">1 sao</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="highest">Điểm cao nhất</option>
                                <option value="lowest">Điểm thấp nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {review.userInitial}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{review.userName}</div>
                                            <div className="text-sm text-gray-500">
                                                Đã mua hàng • Mã đơn: {review.orderCode}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 mb-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <div className="text-sm text-gray-500">{review.date}</div>
                                    </div>
                                </div>
                                <div className="text-gray-700 leading-relaxed">{review.content}</div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>Hữu ích</span>
                                            <span className="text-gray-400">({review.likes})</span>
                                        </button>
                                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Trả lời</span>
                                        </button>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Write Review Button */}
                    <div className="text-center pt-6 border-t border-gray-200">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
                            Viết đánh giá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewProductDetailModal;