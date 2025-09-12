import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Image, Typography } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ViewCategoryDetail = ({ visible, onClose, categoryData }) => {
  if (!categoryData) return null;

  const items = [
    {
      key: "name",
      label: "Tên Category",
      children: <Text strong>{categoryData.name}</Text>,
      span: 2,
    },
    {
      key: "id",
      label: "ID",
      children: <Text code>{categoryData._id}</Text>,
      span: 2,
    },
    {
      key: "status",
      label: "Trạng thái",
      children: (
        <Tag color={categoryData.status ? "#52c41a" : "#ff4d4f"} icon={categoryData.status ? <CheckCircleOutlined /> : <StopOutlined />}>{categoryData.status ? "Hiển thị" : "Ẩn"}</Tag>
      ),
      span: 2,
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      children: (
        <Text>
          {categoryData.createdAt
            ? new Date(categoryData.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </Text>
      ),
      span: 2,
    },
  ];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết Category" width={600}>
      {categoryData.image && (
        <div style={{ marginBottom: 16 }}>
          <Image src={categoryData.image} alt={categoryData.name} width={160} style={{ borderRadius: 8 }} />
        </div>
      )}
      <Descriptions bordered column={2} items={items} />
    </Modal>
  );
};

ViewCategoryDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categoryData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    status: PropTypes.bool,
    createdAt: PropTypes.string,
  }),
};

export default ViewCategoryDetail;


