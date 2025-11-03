import PropTypes from "prop-types";
import { Modal, Typography, Space, Alert } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const DeleteFounderModal = ({ visible, founder, onConfirm, onCancel, loading }) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 24 }} />
          <Text strong style={{ fontSize: 18, color: "#0D364C" }}>
            Xác nhận xóa vĩnh viễn Founder
          </Text>
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa vĩnh viễn"
      cancelText="Hủy"
      okButtonProps={{ 
        danger: true, 
        loading,
        icon: <DeleteOutlined />
      }}
      width={500}
      centered
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Alert
          message="⚠️ Cảnh báo: Hành động này không thể hoàn tác!"
          description="Founder sẽ bị xóa vĩnh viễn khỏi hệ thống, bao gồm cả ảnh avatar trên Cloudinary."
          type="warning"
          showIcon
        />

        {founder && (
          <div>
            <Paragraph>
              Bạn có chắc chắn muốn <Text strong type="danger">xóa vĩnh viễn</Text> founder sau:
            </Paragraph>
            <div style={{ 
              padding: 16, 
              background: "#f5f5f5", 
              borderRadius: 8,
              borderLeft: "4px solid #ff4d4f" 
            }}>
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: 16, color: "#0D364C" }}>
                  {founder.fullName}
                </Text>
                <Text type="secondary">{founder.position}</Text>
                {founder.email && <Text type="secondary">{founder.email}</Text>}
              </Space>
            </div>
          </div>
        )}
      </Space>
    </Modal>
  );
};

DeleteFounderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  founder: PropTypes.shape({
    _id: PropTypes.string,
    fullName: PropTypes.string,
    position: PropTypes.string,
    email: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

DeleteFounderModal.defaultProps = {
  founder: null,
  loading: false,
};

export default DeleteFounderModal;

