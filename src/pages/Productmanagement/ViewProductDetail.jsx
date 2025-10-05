import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Image, Typography } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ViewProductDetail = ({ visible, onClose, productData }) => {
  if (!productData) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("vi-VN")} lúc ${date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Helper function to create description items
  const createItem = (key, label, children) => ({ key, label, children, span: 2 });

  // Simple styles object
  const styles = {
    imageContainer: { marginBottom: 16 },
    image: { borderRadius: 8 },
    createdAt: { color: "#0D364C" },
    updatedAt: { color: "#13C2C2" }
  };

  // Helper function to render product image
  const renderProductImage = () => {
    if (!productData.image) return null;
    return (
      <div style={styles.imageContainer}>
        <Image src={productData.image} alt={productData.name} width={200} style={styles.image} />
      </div>
    );
  };

  const items = [
    createItem("name", "Tên sản phẩm", <Text strong>{productData.name}</Text>),
    createItem("id", "ID", <Text code>{productData._id}</Text>),
    createItem("category", "Danh mục", <Text>{productData.categoryDetail?.name || productData.category?.name || "N/A"}</Text>),
    createItem("price", "Giá", <Text>{(productData.price || 0).toLocaleString("vi-VN")}đ</Text>),
    createItem("brand", "Thương hiệu", <Text>{productData.brand || "Không có"}</Text>),
    createItem(
      "status", 
      "Trạng thái", 
      <Tag color={productData.status ? "#52c41a" : "#ff4d4f"} icon={productData.status ? <CheckCircleOutlined /> : <StopOutlined />}>
        {productData.status ? "Hiển thị" : "Ẩn"}
      </Tag>
    ),
    createItem("createdAt", "Ngày tạo", <Text style={styles.createdAt}>{formatDateTime(productData.createdAt)}</Text>),
    createItem("updatedAt", "Cập nhật gần nhất", <Text style={styles.updatedAt}>{formatDateTime(productData.updatedAt)}</Text>),
    createItem("short_desc", "Mô tả ngắn", <Text>{productData.short_desc || productData.description || ""}</Text>),
    createItem("detail_desc", "Mô tả chi tiết", <Text>{productData.detail_desc || productData.warrantyDetails || ""}</Text>),
  ];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết Sản phẩm" width={700}>
      {renderProductImage()}
      <Descriptions bordered column={2} items={items} />
    </Modal>
  );
};

ViewProductDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productData: PropTypes.object,
};

export default ViewProductDetail;


