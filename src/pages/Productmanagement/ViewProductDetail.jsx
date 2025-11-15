import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Image, Typography } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const styles = {
  imageWrapper: { marginBottom: 16, textAlign: "center" },
  image: { borderRadius: 8, maxHeight: 220, objectFit: "cover" },
  createdAt: { color: "#0D364C" },
  updatedAt: { color: "#13C2C2" },
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.toLocaleDateString("vi-VN")} lúc ${date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const getSafeText = (value, fallback = "Không có") => {
  if (typeof value === "string" && value.trim()) return value;
  return fallback;
};

const ViewProductDetail = ({ visible, onClose, productData }) => {
  if (!productData) return null;

  const detailItems = [
    { key: "name", label: "Tên sản phẩm", children: <Text strong>{getSafeText(productData.name, "N/A")}</Text> },
    { key: "id", label: "ID", children: <Text code>{productData._id || "N/A"}</Text> },
    {
      key: "category",
      label: "Danh mục",
      children: <Text>{productData.categoryDetail?.name || productData.category?.name || "N/A"}</Text>,
    },
    { key: "price", label: "Giá", children: <Text>{(productData.price || 0).toLocaleString("vi-VN")}đ</Text> },
    { key: "brand", label: "Thương hiệu", children: <Text>{getSafeText(productData.brand)}</Text> },
    {
      key: "status",
      label: "Trạng thái",
      children: (
        <Tag
          color={productData.status ? "#52c41a" : "#ff4d4f"}
          icon={productData.status ? <CheckCircleOutlined /> : <StopOutlined />}
          style={{ padding: "2px 12px", borderRadius: 16 }}
        >
          {productData.status ? "Hiển thị" : "Ẩn"}
        </Tag>
      ),
    },
    { key: "createdAt", label: "Ngày tạo", children: <Text style={styles.createdAt}>{formatDateTime(productData.createdAt)}</Text> },
    { key: "updatedAt", label: "Cập nhật gần nhất", children: <Text style={styles.updatedAt}>{formatDateTime(productData.updatedAt)}</Text> },
    {
      key: "short_desc",
      label: "Mô tả ngắn",
      children: <Text>{getSafeText(productData.short_desc || productData.description, "Chưa có mô tả")}</Text>,
    },
    {
      key: "detail_desc",
      label: "Mô tả chi tiết",
      children: <Text>{getSafeText(productData.detail_desc || productData.warrantyDetails, "Chưa có chi tiết")}</Text>,
    },
  ];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết Sản phẩm" width={700}>
      {productData.image && (
        <div style={styles.imageWrapper}>
          <Image src={productData.image} alt={productData.name} width={220} style={styles.image} />
        </div>
      )}
      <Descriptions bordered column={2} items={detailItems} />
    </Modal>
  );
};

ViewProductDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productData: PropTypes.object,
};

export default ViewProductDetail;


