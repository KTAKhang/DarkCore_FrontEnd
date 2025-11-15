import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Typography, Card, Row, Col, Divider, Table, Space, Spin } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.toLocaleDateString("vi-VN")} lúc ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
};

const getStatusConfig = (status) => {
  const statusMap = {
    pending: { color: "#faad14", icon: <ClockCircleOutlined />, text: "Chờ xác nhận" },
    confirmed: { color: "#1890ff", icon: <CheckCircleOutlined />, text: "Đã xác nhận" },
    shipping: { color: "#722ed1", icon: <ShoppingCartOutlined />, text: "Đang giao" },
    completed: { color: "#52c41a", icon: <CheckCircleOutlined />, text: "Hoàn thành" },
    cancelled: { color: "#ff4d4f", icon: <CloseCircleOutlined />, text: "Đã hủy" },
  };
  return statusMap[status] || statusMap.pending;
};

const getPaymentMethodText = (method) => {
  const methodMap = {
    cod: "Thanh toán COD",
    vnpay: "VNPay",
  };
  return methodMap[method] || method || "N/A";
};

const getValidImageUrl = (record) => {
  const placeholder = "https://via.placeholder.com/64x64?text=No+Image";
  const fromProduct = record.product && typeof record.product === "object" ? record.product.images?.[0] : null;
  const imageUrl = fromProduct || record.productImage;
  if (imageUrl && !imageUrl.includes("example.com")) return imageUrl;
  return placeholder;
};

const buildSummaryBlocks = (subtotal, discount, total, highlightColor) => [
  { key: "subtotal", label: "Tạm tính", value: subtotal, color: "#0D364C" },
  {
    key: "discount",
    label: "Giảm giá",
    value: discount,
    color: discount > 0 ? "#ff4d4f" : "#0D364C",
    prefix: discount > 0 ? "- " : "",
  },
  { key: "total", label: "Tổng cộng", value: total, color: highlightColor, emphasize: true },
];

const ViewOrderDetail = ({ visible, onClose, orderData, loading = false }) => {
  if (!orderData || typeof orderData !== "object") return null;

  const orderDetails = Array.isArray(orderData.items)
    ? orderData.items
    : Array.isArray(orderData.orderDetails)
    ? orderData.orderDetails
    : Array.isArray(orderData.orderdetails)
    ? orderData.orderdetails
    : [];

  const subtotal = Number(orderData.subtotal || orderData.subTotal || 0);
  const discountAmount = Number(orderData.discount || orderData.discountAmount || 0);
  const finalTotal = Number(orderData.totalPrice || orderData.totalAmount || 0);
  const statusConfig = getStatusConfig(orderData.status);

  const createItem = (key, label, children) => ({ key, label, children, span: 2 });

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
    createItem("totalAmount", "Tổng tiền", <Text style={{ color: "#13C2C2", fontSize: 18, fontWeight: "bold" }}>{finalTotal.toLocaleString("vi-VN")}đ</Text>),
    createItem(
      "paymentMethod",
      "Phương thức thanh toán",
      <Tag color="#0D364C" style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }} icon={<CreditCardOutlined />}>
        {getPaymentMethodText(orderData.paymentMethod)}
      </Tag>
    ),
    createItem("createdAt", "Ngày tạo", <Text style={{ color: "#0D364C" }}>{formatDateTime(orderData.createdAt)}</Text>),
    createItem("updatedAt", "Cập nhật gần nhất", <Text style={{ color: "#13C2C2" }}>{formatDateTime(orderData.updatedAt)}</Text>),
  ];

  const customerItems = [
    createItem(
      "receiverName",
      "Tên khách hàng",
      <Text strong>
        {orderData.receiverName ||
          orderData.customer?.name ||
          orderData.userId?.user_name ||
          orderData.customerName ||
          "N/A"}
      </Text>
    ),
    createItem("customerEmail", "Email", <Text>{orderData.customer?.email || orderData.userId?.email || orderData.customerEmail || "N/A"}</Text>),
    createItem(
      "receiverPhone",
      "Số điện thoại",
      <Text>{orderData.receiverPhone || orderData.customer?.phone || orderData.userId?.phone || orderData.customerPhone || "N/A"}</Text>
    ),
    createItem("shippingAddress", "Địa chỉ giao hàng", <Text>{orderData.receiverAddress || orderData.shippingAddress || "Địa chỉ chưa được cung cấp"}</Text>),
  ];

  const itemColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        const productName =
          record.product?.name || record.productName || (typeof record.product === "string" ? record.product : "N/A");
        const productId =
          record.product?._id || record.productId || (typeof record.product === "object" ? record.product?._id : "N/A");

        return (
          <Space>
            <img
              src={getValidImageUrl(record)}
              alt={productName}
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #d9d9d9" }}
              onError={(e) => {
                if (e.target.src !== "https://via.placeholder.com/64x64?text=No+Image") {
                  e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                }
              }}
            />
            <div>
              <Text strong style={{ color: "#0D364C", fontSize: 14 }}>{productName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>ID: {productId}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      render: (_, record) => {
        const price = Number(record.product?.price || record.price || 0);
        return (
          <Text style={{ color: "#13C2C2", fontWeight: 500 }}>{price.toLocaleString("vi-VN")}đ</Text>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <Tag color="#0D364C" style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
          {Number(quantity) || 0}
        </Tag>
      ),
    },
    {
      title: "Giảm giá",
      key: "discount",
      render: (_, record) => {
        const discount = Number(record.discount || 0);
        return (
          <Text style={{ color: discount > 0 ? "#ff4d4f" : "#0D364C", fontWeight: 500 }}>
            {discount > 0 ? `-${discount.toLocaleString("vi-VN")}đ` : "0đ"}
          </Text>
        );
      },
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => {
        const total = Number(record.totalPrice || record.total || 0);
        return (
          <Text strong style={{ color: "#0D364C", fontSize: 14 }}>{total.toLocaleString("vi-VN")}đ</Text>
        );
      },
    },
  ];

  const summaryBlocks = buildSummaryBlocks(subtotal, discountAmount, finalTotal, "#13C2C2");

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
              rowKey={(record, index) =>
                record._id || record.id || record.productId || `order-item-${index}`
              }
              size="small"
            />

            <Divider />

            <Row gutter={[24, 16]} justify="end">
              {summaryBlocks.map((block) => (
                <Col key={block.key} xs={12} sm={6}>
                  <div style={{ textAlign: "right" }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {block.label}
                    </Text>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: block.color,
                        fontSize: block.emphasize ? 18 : 15,
                      }}
                    >
                      {block.prefix || ""}
                      {block.value.toLocaleString("vi-VN")}đ
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>

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
};

ViewOrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderData: PropTypes.object,
  loading: PropTypes.bool,
};

export default ViewOrderDetail;
