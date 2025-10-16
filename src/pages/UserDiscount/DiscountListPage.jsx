import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Gift, Calendar, Percent } from 'lucide-react';
import Header from '@/components/Header/Header';
import DiscountCard from '@/components/DiscountCard';
import {
  discountActiveRequest,
  discountClearMessages,
} from '@/redux/actions/discountActions';

const DiscountListPage = () => {
  const dispatch = useDispatch();
  const { activeItems, loadingActive, error } = useSelector((state) => state.discount);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(discountActiveRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log('DiscountListPage error:', error);
      dispatch(discountClearMessages());
    }
  }, [error, dispatch]);

  const filteredDiscounts = activeItems.filter(discount =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDiscounts = filteredDiscounts.filter(discount => {
    const now = new Date();
    return discount.isActive && 
           now >= new Date(discount.startDate) && 
           now <= new Date(discount.endDate);
  });

  const expiredDiscounts = filteredDiscounts.filter(discount => {
    const now = new Date();
    return !discount.isActive || now > new Date(discount.endDate);
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Mã giảm giá</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá các mã giảm giá hấp dẫn và tiết kiệm chi phí mua sắm của bạn
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm mã giảm giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Loading */}
          {loadingActive && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Đang tải mã giảm giá...</h3>
            </div>
          )}

          {/* Active Discounts */}
          {!loadingActive && activeDiscounts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Percent className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mã giảm giá đang hoạt động</h2>
                <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {activeDiscounts.length} mã
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeDiscounts.map((discount) => (
                  <DiscountCard key={discount._id} discount={discount} />
                ))}
              </div>
            </div>
          )}

          {/* Expired Discounts */}
          {!loadingActive && expiredDiscounts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mã giảm giá đã hết hạn</h2>
                <span className="ml-3 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {expiredDiscounts.length} mã
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {expiredDiscounts.map((discount) => (
                  <DiscountCard key={discount._id} discount={discount} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loadingActive && filteredDiscounts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'Không tìm thấy mã giảm giá' : 'Chưa có mã giảm giá nào'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Các mã giảm giá sẽ được cập nhật sớm'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="bg-blue-50 rounded-xl p-8 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Cách sử dụng mã giảm giá</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-6 rounded-lg">
                  <div className="text-blue-600 text-3xl mb-3">1️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Chọn mã giảm giá</h4>
                  <p className="text-gray-600 text-sm">
                    Sao chép mã giảm giá phù hợp với đơn hàng của bạn
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <div className="text-blue-600 text-3xl mb-3">2️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Thêm vào giỏ hàng</h4>
                  <p className="text-gray-600 text-sm">
                    Nhập mã vào ô "Mã giảm giá" trong trang giỏ hàng
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <div className="text-blue-600 text-3xl mb-3">3️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Áp dụng và thanh toán</h4>
                  <p className="text-gray-600 text-sm">
                    Nhấn "Áp dụng" để giảm giá và hoàn tất đơn hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountListPage;
