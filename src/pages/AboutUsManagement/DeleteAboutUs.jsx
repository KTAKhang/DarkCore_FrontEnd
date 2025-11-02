import { Modal, Button, Typography, Space } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Text } = Typography;

const DeleteAboutUs = ({ visible, onCancel, onConfirm, loading }) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: "#faad14", fontSize: 22 }} />
          <span>Xác nhận xóa About Us</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          loading={loading}
          onClick={onConfirm}
          icon={<DeleteOutlined />}
        >
          Xóa
        </Button>,
      ]}
      centered
      closable={!loading}
      maskClosable={!loading}
    >
      <div style={{ padding: "20px 0" }}>
        <Text>
          Bạn có chắc chắn muốn xóa thông tin <Text strong>About Us</Text> không?
        </Text>
        <br />
        <br />
        <Text type="danger">
          ⚠️ Hành động này không thể hoàn tác. Tất cả thông tin về cửa hàng, 
          câu chuyện, giá trị cốt lõi, và thống kê sẽ bị xóa vĩnh viễn.
        </Text>
      </div>
    </Modal>
  );
};

DeleteAboutUs.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

DeleteAboutUs.defaultProps = {
  loading: false,
};

export default DeleteAboutUs;

