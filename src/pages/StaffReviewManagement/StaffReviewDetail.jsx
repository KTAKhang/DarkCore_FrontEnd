import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Row, Col, Card, Typography, Avatar, Space, Tag, Spin } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  StarOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CloseOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getReviewDetailStaffRequest } from '../../redux/actions/reviewStaffActions';

const { Title, Text, Paragraph } = Typography;

const StaffReviewDetail = ({ visible, onClose, review: initialReview }) => {
  const dispatch = useDispatch();
  const { reviewDetail } = useSelector((state) => state.reviewStaff);
  const { data: review, loading } = reviewDetail;

  // Use detailed review if available, otherwise use initial review
  const displayReview = review || initialReview;

  // Load detailed review when modal opens
  useEffect(() => {
    if (visible && initialReview?._id) {
      dispatch(getReviewDetailStaffRequest(initialReview._id));
    }
  }, [visible, initialReview?._id, dispatch]);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !displayReview) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarOutlined
        key={i}
        style={{
          color: i < rating ? "#fadb14" : "#d9d9d9",
          fontSize: 24,
        }}
      />
    ));
  };

  const product = displayReview.product_id || {};
  const user = displayReview.user_id || {};
  const orderDetail = displayReview.order_detail_id || {};

  const productImage = product.images && product.images.length > 0 
    ? (typeof product.images[0] === "string" ? product.images[0] : product.images[0].url)
    : null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      styles={{ body: { padding: 0 } }}
      closeIcon={<CloseOutlined style={{ fontSize: 20, color: "#0D364C" }} />}
    >
      <div style={{ maxHeight: '85vh', overflow: 'auto' }}>
        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.75)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8
          }}>
            <Spin size="large" tip="Đang tải thông tin đánh giá..." />
          </div>
        )}

        {/* Header with Rating and Basic Info */}
        <div style={{
          background: 'linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)',
          padding: '40px 24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ marginBottom: 16 }}>
            {renderStars(displayReview.rating || 0)}
          </div>
          <Title level={2} style={{ color: '#fff', marginTop: 16, marginBottom: 8 }}>
            Đánh giá {displayReview.rating || 0}/5 sao
          </Title>
          <div style={{ marginTop: 12 }}>
            <Tag
              icon={displayReview.status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              color={displayReview.status ? "#52c41a" : "#ff4d4f"}
              style={{ borderRadius: 16, padding: '4px 12px', fontSize: 14 }}
            >
              {displayReview.status ? "Đang hiển thị" : "Đang ẩn"}
            </Tag>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Product Information */}
          <Card
            title={
              <Space>
                <ShoppingOutlined style={{ color: "#13C2C2" }} />
                <Text strong style={{ color: "#0D364C" }}>Thông tin sản phẩm</Text>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                {productImage && (
                  <Avatar
                    shape="square"
                    size={120}
                    src={productImage}
                    icon={<ShoppingOutlined />}
                    style={{ width: 120, height: 120 }}
                  />
                )}
              </Col>
              <Col xs={24} md={16}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Tên sản phẩm</Text>
                    <Text strong style={{ color: "#0D364C", fontSize: 16 }}>{product.name || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>ID Sản phẩm</Text>
                    <Text style={{ color: "#0D364C" }}>{product._id || 'N/A'}</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* User Information */}
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: "#13C2C2" }} />
                <Text strong style={{ color: "#0D364C" }}>Thông tin người đánh giá</Text>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Avatar
                  size={80}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#13C2C2" }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Tên người dùng</Text>
                    <Text strong style={{ color: "#0D364C", fontSize: 16 }}>{user.user_name || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Email</Text>
                    <Text style={{ color: "#0D364C" }}>{user.email || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>ID Người dùng</Text>
                    <Text style={{ color: "#0D364C", fontSize: 12 }}>{user._id || 'N/A'}</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Order Detail Information */}
          {orderDetail && (
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: "#13C2C2" }} />
                  <Text strong style={{ color: "#0D364C" }}>Thông tin đơn hàng</Text>
                </Space>
              }
              style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Tên sản phẩm trong đơn</Text>
                  <Text strong style={{ color: "#0D364C" }}>{orderDetail.productName || 'N/A'}</Text>
                </Col>
                <Col xs={24} md={12}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Số lượng</Text>
                  <Text strong style={{ color: "#0D364C" }}>{orderDetail.quantity || 'N/A'}</Text>
                </Col>
                <Col xs={24} md={12}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Giá</Text>
                  <Text strong style={{ color: "#0D364C" }}>
                    {orderDetail.price ? `${parseInt(orderDetail.price).toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                  </Text>
                </Col>
                <Col xs={24} md={12}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Tổng tiền</Text>
                  <Text strong style={{ color: "#0D364C" }}>
                    {orderDetail.totalPrice ? `${parseInt(orderDetail.totalPrice).toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                  </Text>
                </Col>
              </Row>
            </Card>
          )}

          {/* Review Content */}
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#13C2C2" }} />
                <Text strong style={{ color: "#0D364C" }}>Nội dung đánh giá</Text>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
            size="small"
          >
            <Paragraph style={{
              color: "#0D364C",
              fontSize: 14,
              lineHeight: 1.8,
              marginBottom: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {displayReview.review_content || 'Không có nội dung đánh giá'}
            </Paragraph>
          </Card>

          {/* Timestamps */}
          <Card
            style={{ borderRadius: 8, border: "1px solid #13C2C220", backgroundColor: "#fafafa" }}
            size="small"
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Space>
                  <CalendarOutlined style={{ color: "#13C2C2" }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Ngày tạo:</Text>
                    <br />
                    <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
                      {formatDate(displayReview.createdAt)}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space>
                  <CalendarOutlined style={{ color: "#13C2C2" }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Cập nhật lần cuối:</Text>
                    <br />
                    <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
                      {formatDate(displayReview.updatedAt)}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

StaffReviewDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  review: PropTypes.shape({
    _id: PropTypes.string,
    rating: PropTypes.number,
    review_content: PropTypes.string,
    status: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    product_id: PropTypes.object,
    user_id: PropTypes.object,
    order_detail_id: PropTypes.object,
  }),
};

export default StaffReviewDetail;

