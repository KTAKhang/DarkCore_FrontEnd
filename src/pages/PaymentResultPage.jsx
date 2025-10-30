import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { cartClearRequest } from '../redux/actions/cartActions';

const PaymentResultPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    handlePaymentResult();
  }, []);

  const handlePaymentResult = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin từ URL params
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');
      const vnp_TxnRef = searchParams.get('vnp_TxnRef');
      const vnp_Amount = searchParams.get('vnp_Amount');
      const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
      
      // Lấy thông tin order từ localStorage
      const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
      
      let result = {
        success: false,
        message: '',
        orderId: vnp_TxnRef || pendingOrder.orderId,
        orderNumber: pendingOrder.orderNumber,
        amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : pendingOrder.amount
      };
      
      if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
        // Thanh toán thành công - chỉ xóa giỏ hàng
        result.success = true;
        result.message = 'Thanh toán thành công! Đơn hàng đã được xác nhận.';
        
        // Xóa giỏ hàng sau khi thanh toán thành công
        dispatch(cartClearRequest());

        // Xóa thông tin pending order
        localStorage.removeItem('pendingOrder');

        toast.success('Thanh toán thành công! Đơn hàng đã được xác nhận.');
      } else if (vnp_ResponseCode === '24') {
        // Người dùng hủy thanh toán
        result.success = false;
        result.message = 'Bạn đã hủy thanh toán. Đơn hàng vẫn được tạo với trạng thái chờ thanh toán.';
        
        toast.warning('Bạn đã hủy thanh toán. Vui lòng thanh toán lại nếu muốn.');
      } else {
        // Thanh toán thất bại
        result.success = false;
        result.message = 'Thanh toán thất bại. Vui lòng thử lại.';
        
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      }

      setPaymentResult(result);
    } catch (error) {
      console.error('Error handling payment result:', error);
      setPaymentResult({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán.',
        orderId: null,
        orderNumber: null,
        amount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className={`p-8 text-center ${paymentResult?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            {paymentResult?.success ? (
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            )}
            
            <h1 className={`text-2xl font-bold mb-2 ${paymentResult?.success ? 'text-green-800' : 'text-red-800'}`}>
              {paymentResult?.success ? 'Thanh toán thành công!' : 'Thanh toán không thành công'}
            </h1>
            
            <p className={`text-lg ${paymentResult?.success ? 'text-green-700' : 'text-red-700'}`}>
              {paymentResult?.message}
            </p>
          </div>

          {/* Order Info */}
          {paymentResult?.orderId && (
            <div className="p-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin đơn hàng</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{paymentResult.orderNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-red-600">
                    {formatPrice(paymentResult.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${paymentResult.success ? 'text-green-600' : 'text-orange-600'}`}>
                    {paymentResult.success ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-8 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Về trang chủ
              </button>
              
              {!paymentResult?.success && (
                <button
                  onClick={() => navigate('/customer/checkout')}
                  className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Thanh toán lại
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="p-6 bg-blue-50 border-t border-blue-100">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Lưu ý quan trọng</h3>
                <p className="text-sm text-blue-700">
                  {paymentResult?.success 
                    ? 'Đơn hàng của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.'
                    : 'Nếu bạn đã thanh toán nhưng vẫn thấy thông báo lỗi, vui lòng liên hệ với chúng tôi để được hỗ trợ.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;