import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Typography, Space, Image, Divider, Empty } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HourglassOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ContactDetailModel = ({ visible, onClose, contactData }) => {
  if (!contactData) return null;

  const renderStatusTag = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Tag color="orange" icon={<HourglassOutlined />}>
            Đang chờ xử lý
          </Tag>
        );
      case "In Progress":
        return (
          <Tag color="blue" icon={<ClockCircleOutlined />}>
            Đang xử lý
          </Tag>
        );
      case "Resolved":
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Đã giải quyết
          </Tag>
        );
      case "Closed":
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Đã đóng
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const items = [
    {
      key: "subject",
      label: <Text strong style={{ color: "#0D364C" }}>Chủ đề</Text>,
      children: (
        <Title level={4} style={{ margin: 0, color: "#0D364C" }}>
          {contactData.subject}
        </Title>
      ),
      span: 3,
    },
    {
      key: "ticketId",
      label: <Text strong style={{ color: "#0D364C" }}>Mã ticket</Text>,
      children: <Text code>#{contactData.ticketId}</Text>,
      span: 1,
    },
    {
      key: "reason",
      label: <Text strong style={{ color: "#0D364C" }}>Lý do</Text>,
      children: <Tag color="#13C2C2">{contactData.reason || "Không có lý do"}</Tag>,
      span: 1,
    },
    {
      key: "status",
      label: <Text strong style={{ color: "#0D364C" }}>Trạng thái</Text>,
      children: renderStatusTag(contactData.status),
      span: 1,
    },
    {
      key: "userInfo",
      label: <Text strong style={{ color: "#0D364C" }}>Người gửi</Text>,
      children: (
        <Space direction="vertical">
          <Space>
            <UserOutlined style={{ color: "#13C2C2" }} />
            <Text strong>{contactData.userId?.user_name || "Ẩn danh"}</Text>
          </Space>
          <Space>
            <MailOutlined style={{ color: "#13C2C2" }} />
            <Text>{contactData.userId?.email || "Không có email"}</Text>
          </Space>
        </Space>
      ),
      span: 3,
    },
    {
      key: "message",
      label: <Text strong style={{ color: "#0D364C" }}>Nội dung</Text>,
      children: (
        <div style={{ maxHeight: 240, overflowY: "auto", width: "100%", minWidth: 0 }}>
          <div style={{ maxWidth: "100%", width: "100%", overflow: "hidden" }}>
            <Paragraph
              style={{
                color: "#555",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                wordWrap: "break-word",
                margin: 0,
                width: "100%",
              }}
            >
              {contactData.message}
            </Paragraph>
          </div>
        </div>
      ),
      span: 3,
    },
    {
      key: "createdAt",
      label: <Text strong style={{ color: "#0D364C" }}>Ngày tạo</Text>,
      children: (
        <Text>
          {new Date(contactData.createdAt).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ),
      span: 1,
    },
    {
      key: "updatedAt",
      label: <Text strong style={{ color: "#0D364C" }}>Cập nhật gần nhất</Text>,
      children: (
        <Text>
          {new Date(contactData.updatedAt).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ),
      span: 2,
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          <Title level={3} style={{ margin: 0, color: "#0D364C" }}>
            Chi Tiết Liên Hệ
          </Title>
        </Space>
      }
      width={900}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "75vh", overflowY: "auto" }}
    >
      <Descriptions bordered column={3} items={items} size="middle" />

      {contactData.replies && contactData.replies.length > 0 && (
        <>
          <Divider orientation="left">
            <Title level={4} style={{ color: "#0D364C", margin: 0 }}>
              Lịch sử phản hồi ({contactData.replies.length})
            </Title>
          </Divider>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {contactData.replies.map((reply, idx) => (
              <div
                key={reply._id || idx}
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 12,
                  background: reply.senderRole === "admin" ? "#f0f7ff" : "#fafafa",
                  borderLeft: reply.senderRole === "admin" ? "4px solid #1890ff" : "4px solid #52c41a",
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space>
                    <Text strong style={{ color: reply.senderRole === "admin" ? "#1890ff" : "#52c41a" }}>
                      {reply.senderRole === "admin" ? "Admin" : "Khách hàng"}
                    </Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">{reply.senderId?.user_name || "Unknown"}</Text>
                    {reply.isInternal && (
                      <Tag color="orange" style={{ marginLeft: 8 }}>
                        Nội bộ
                      </Tag>
                    )}
                  </Space>

                  <Paragraph
                    style={{
                      margin: "8px 0",
                      color: "#555",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {reply.message}
                  </Paragraph>

                  {reply.attachments && reply.attachments.length > 0 && (
                    <Space wrap>
                      {reply.attachments.map((file, i) => (
                        <a
                          key={i}
                          href={file.url || file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#13C2C2", fontSize: 12 }}
                        >
                          {file.originalName || `Attachment ${i + 1}`}
                        </a>
                      ))}
                    </Space>
                  )}

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(reply.createdAt).toLocaleString("vi-VN")}
                  </Text>
                </Space>
              </div>
            ))}
          </div>
        </>
      )}

      {(!contactData.replies || contactData.replies.length === 0) && (
        <>
          <Divider />
          <Empty description="Chưa có phản hồi nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </>
      )}
    </Modal>
  );
};

ContactDetailModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  contactData: PropTypes.shape({
    _id: PropTypes.string,
    ticketId: PropTypes.string,
    subject: PropTypes.string,
    reason: PropTypes.string,
    message: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    attachments: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string,
          originalName: PropTypes.string,
        })
      ])
    ),
    image: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    userId: PropTypes.shape({
      user_name: PropTypes.string,
      email: PropTypes.string,
    }),
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        senderRole: PropTypes.string,
        senderId: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            user_name: PropTypes.string,
          }),
        ]),
        message: PropTypes.string,
        isInternal: PropTypes.bool,
        attachments: PropTypes.array,
        createdAt: PropTypes.string,
      })
    ),
  }),
};

export default ContactDetailModel;