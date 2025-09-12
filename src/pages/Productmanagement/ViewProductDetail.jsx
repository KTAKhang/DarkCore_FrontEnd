import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Image, Typography } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ViewProductDetail = ({ visible, onClose, productData }) => {
  if (!productData) return null;

  const items = [
    { key: "name", label: "Tên sản phẩm", children: <Text strong>{productData.name}</Text>, span: 2 },
    { key: "id", label: "ID", children: <Text code>{productData._id}</Text>, span: 2 },
    { key: "category", label: "Danh mục", children: <Text>{productData.categoryDetail?.name || "N/A"}</Text>, span: 2 },
    { key: "price", label: "Giá", children: <Text>{(productData.price || 0).toLocaleString("vi-VN")}đ</Text>, span: 2 },
    {
      key: "status",
      label: "Trạng thái",
      children: <Tag color={productData.status ? "#52c41a" : "#ff4d4f"} icon={productData.status ? <CheckCircleOutlined /> : <StopOutlined />}>{productData.status ? "Hiển thị" : "Ẩn"}</Tag>,
      span: 2,
    },
    { key: "short_desc", label: "Mô tả ngắn", children: <Text>{productData.short_desc || ""}</Text>, span: 2 },
    { key: "detail_desc", label: "Mô tả chi tiết", children: <Text>{productData.detail_desc || ""}</Text>, span: 2 },
  ];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết Sản phẩm" width={700}>
      {productData.image && (
        <div style={{ marginBottom: 16 }}>
          <Image src={productData.image} alt={productData.name} width={200} style={{ borderRadius: 8 }} />
        </div>
      )}
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


