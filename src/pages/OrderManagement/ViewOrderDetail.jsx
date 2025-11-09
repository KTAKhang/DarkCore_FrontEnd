import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Typography, Card, Row, Col, Divider, Table, Space, Spin } from "antd";
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined, 
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const ViewOrderDetail = ({ visible, onClose, orderData, loading = false }) => {
  if (!orderData) return null;
  
  // Safety check to ensure orderData is valid
  if (typeof orderData !== 'object' || orderData === null) {
    console.error("Invalid orderData:", orderData);
    return null;
  }

  // Debug log to see the order data structure
  console.log("🔍 ViewOrderDetail - orderData:", orderData);
  console.log("🔍 ViewOrderDetail - orderDetails:", orderData.items || orderData.orderDetails || orderData.orderdetails);
  
  // Debug the order details structure - try multiple possible field names
  const orderDetails = orderData.items || orderData.orderDetails || orderData.orderdetails || [];
  console.log("🔍 ViewOrderDetail - orderDetails array:", orderDetails);
  if (orderDetails.length > 0) {
    console.log("🔍 ViewOrderDetail - first order detail:", orderDetails[0]);
    console.log("🔍 ViewOrderDetail - first order detail product:", orderDetails[0]?.product);
    
    // Check if any field contains objects that might cause rendering issues
    const firstDetail = orderDetails[0];
    Object.keys(firstDetail).forEach(key => {
      const value = firstDetail[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        console.log(`🔍 ViewOrderDetail - Found object in field '${key}':`, value);
      }
    });
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("vi-VN")} lúc ${date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { color: "#faad14", icon: <ClockCircleOutlined />, text: "Chờ xác nhận" },
      confirmed: { color: "#1890ff", icon: <CheckCircleOutlined />, text: "Đã xác nhận" },
      shipping: { color: "#722ed1", icon: <ShoppingCartOutlined />, text: "Đang giao" },
      completed: { color: "#52c41a", icon: <CheckCircleOutlined />, text: "Hoàn thành" },
      cancelled: { color: "#ff4d4f", icon: <CloseCircleOutlined />, text: "Đã hủy" }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    const methodMap = {
      cod: "Thanh toán COD",
      vnpay: "VNPay",
    };
    return methodMap[method] || method;
  };

  const statusConfig = getStatusConfig(orderData.status);

  // Helper để validate và lấy ảnh hợp lệ
  const getValidImageUrl = (record) => {
    let imageUrl = null;
    
    try {
      // Try to get image from various possible fields
      if (record.product && typeof record.product === 'object') {
        imageUrl = record.product.images?.[0] || record.productImage;
      } else {
        imageUrl = record.productImage;
      }
      
      // Check if URL is valid (not from example.com)
      if (imageUrl && !imageUrl.includes('example.com')) {
        return imageUrl;
      }
    } catch (error) {
      console.error("Error extracting image:", error);
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/64x64?text=No+Image';
  };

  // Order items table columns
  const itemColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        // Safely extract product information with additional checks
        let productName = "N/A";
        let productId = "N/A";
        
        try {
          if (record.product && typeof record.product === 'object') {
            productName = record.product.name || record.productName || "N/A";
            productId = record.product._id || record.productId || "N/A";
          } else {
            productName = record.productName || "N/A";
            productId = record.productId || "N/A";
          }
          
          // Ensure we have strings, not objects
          productName = String(productName);
          
          // Special handling for productId to convert objects to strings
          if (productId && typeof productId === 'object') {
            productId = productId.toString ? productId.toString() : JSON.stringify(productId);
          } else {
            productId = String(productId);
          }
        } catch (error) {
          console.error("Error extracting product info:", error);
          productName = "N/A";
          productId = "N/A";
        }
        
        return (
          <Space>
            <img
              src={getValidImageUrl(record)}
              alt={productName}
              style={{
                width: 64,
                height: 64,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid #d9d9d9'
              }}
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/64x64?text=No+Image') {
                  e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                }
              }}
            />
            <div>
              <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
                {productName}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {productId}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      render: (_, record) => {
        let price = 0;
        try {
          if (record.product && typeof record.product === 'object') {
            price = record.product.price || record.price || 0;
          } else {
            price = record.price || 0;
          }
          price = Number(price) || 0;
        } catch (error) {
          console.error("Error extracting price:", error);
          price = 0;
        }
        
        return (
          <Text style={{ color: "#13C2C2", fontWeight: 500 }}>
            {price.toLocaleString("vi-VN")}đ
          </Text>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => {
        const qty = Number(quantity) || 0;
        return (
          <Tag color="#0D364C" style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
            {qty}
          </Tag>
        );
      },
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => {
        const total = Number(record.totalPrice || record.total || 0);
        return (
          <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
            {total.toLocaleString("vi-VN")}đ
          </Text>
        );
      },
    },
  ];

  // Helper function to create description items
  const createItem = (key, label, children) => ({ key, label, children, span: 2 });

  const styles = {
    createdAt: { color: "#0D364C" },
    updatedAt: { color: "#13C2C2" },
    totalAmount: { color: "#13C2C2", fontSize: 18, fontWeight: "bold" }
  };

  // Main order information
  const orderItems = [
    createItem("orderNumber", "Mã đơn hàng", <Text code>{orderData.orderNumber || "N/A"}</Text>),
    createItem("id", "ID", <Text code>{orderData._id || "N/A"}</Text>),
    createItem(
      "status", 
      "Trạng thái", 
      <Tag color={statusConfig.color} icon={statusConfig.icon} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
        {statusConfig.text}
      </Tag>
    ),
    createItem("totalAmount", "Tổng tiền", <Text style={styles.totalAmount}>{(orderData.totalAmount || orderData.totalPrice || 0).toLocaleString("vi-VN")}đ</Text>),
    createItem("paymentMethod", "Phương thức thanh toán", <Tag color="#0D364C" style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }} icon={<CreditCardOutlined />}>{getPaymentMethodText(orderData.paymentMethod)}</Tag>),
    createItem("createdAt", "Ngày tạo", <Text style={styles.createdAt}>{formatDateTime(orderData.createdAt)}</Text>),
    createItem("updatedAt", "Cập nhật gần nhất", <Text style={styles.updatedAt}>{formatDateTime(orderData.updatedAt)}</Text>),
  ];

  // Customer information (Receiver information - người nhận hàng)
  // Try multiple sources for email: customer object, userId object, or direct field
  const customerEmail = orderData.customer?.email || orderData.userId?.email || orderData.customerEmail || "N/A";
  
  const customerItems = [
    createItem("receiverName", "Tên khách hàng", <Text strong>{orderData.receiverName || orderData.customer?.name || orderData.userId?.user_name || orderData.customerName || "N/A"}</Text>),
    createItem("customerEmail", "Email", <Text>{customerEmail}</Text>),
    createItem("receiverPhone", "Số điện thoại", <Text>{orderData.receiverPhone || orderData.customer?.phone || orderData.userId?.phone || orderData.customerPhone || "N/A"}</Text>),
    createItem("shippingAddress", "Địa chỉ giao hàng", <Text>{orderData.receiverAddress || orderData.shippingAddress || "Địa chỉ chưa được cung cấp"}</Text>),
  ];

  try {
    return (
      <Modal 
        open={visible} 
        onCancel={onClose} 
        footer={null} 
        title={
          <Space>
            <FileTextOutlined style={{ color: "#13C2C2" }} />
            <span>Chi tiết Đơn hàng</span>
          </Space>
        } 
        width={900}
        style={{ top: 20 }}
      >
        <Spin spinning={loading} tip="Đang tải chi tiết đơn hàng...">
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Order Information */}
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: "#13C2C2" }} />
                <span>Thông tin Đơn hàng</span>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8 }}
            size="small"
          >
            <Descriptions bordered column={2} items={orderItems} size="small" />
          </Card>

          {/* Customer Information */}
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: "#13C2C2" }} />
                <span>Thông tin Khách hàng</span>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8 }}
            size="small"
          >
            <Descriptions bordered column={2} items={customerItems} size="small" />
          </Card>

          {/* Order Items */}
          <Card 
            title={
              <Space>
                <ShoppingCartOutlined style={{ color: "#13C2C2" }} />
                <span>Chi tiết Sản phẩm ({orderDetails.length} sản phẩm)</span>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8 }}
            size="small"
          >
            <Table
              columns={itemColumns}
              dataSource={orderDetails}
              pagination={false}
              rowKey={(record) => record._id || record.id || Math.random().toString(36)}
              size="small"
              style={{ borderRadius: 8 }}
            />
            
            <Divider />
            
            <Row justify="end">
              <Col>
                <Space size="large">
                  <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                  <Text strong style={styles.totalAmount}>
                    {(orderData.totalAmount || orderData.totalPrice || 0).toLocaleString("vi-VN")}đ
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Additional Information */}
          {(orderData.notes || orderData.shippingNotes) && (
            <Card 
              title={
                <Space>
                  <FileTextOutlined style={{ color: "#13C2C2" }} />
                  <span>Ghi chú</span>
                </Space>
              }
              style={{ borderRadius: 8 }}
              size="small"
            >
              {orderData.notes && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong style={{ color: "#0D364C", display: "block", marginBottom: 4 }}>Ghi chú đơn hàng:</Text>
                  <Text>{orderData.notes}</Text>
                </div>
              )}
              {orderData.shippingNotes && (
                <div>
                  <Text strong style={{ color: "#0D364C", display: "block", marginBottom: 4 }}>Ghi chú giao hàng:</Text>
                  <Text>{orderData.shippingNotes}</Text>
                </div>
              )}
            </Card>
          )}
          </div>
        </Spin>
      </Modal>
    );
  } catch (error) {
    console.error("Error rendering ViewOrderDetail:", error);
    return (
      <Modal 
        open={visible} 
        onCancel={onClose} 
        footer={null} 
        title="Chi tiết Đơn hàng"
        width={900}
        style={{ top: 20 }}
      >
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Text type="danger">Có lỗi xảy ra khi hiển thị chi tiết đơn hàng. Vui lòng thử lại.</Text>
        </div>
      </Modal>
    );
  }
};

ViewOrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderData: PropTypes.object,
  loading: PropTypes.bool,
};

export default ViewOrderDetail;
