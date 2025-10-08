import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Typography, Space, Image } from "antd";
import { CheckCircleOutlined, StopOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ViewNewsDetail = ({ visible, onClose, newsData }) => {
  if (!newsData) return null;

  // Truncate content nếu quá dài
  const truncatedContent = newsData.content?.length > 500
    ? `${newsData.content.substring(0, 500)}...`
    : newsData.content;

  const items = [
    {
      key: "title",
      label: <Text strong style={{ color: "#0D364C" }}>Tiêu đề</Text>,
      children: <Title level={4} style={{ margin: 0, color: "#0D364C" }}>{newsData.title}</Title>,
      span: 2,
    },
    {
      key: "excerpt",
      label: <Text strong style={{ color: "#0D364C" }}>Tóm tắt</Text>,
      children: <Paragraph style={{ margin: 0, color: "#666" }}>{newsData.excerpt || "Không có tóm tắt"}</Paragraph>,
      span: 2,
    },
    {
      key: "image",
      label: <Text strong style={{ color: "#0D364C" }}>Hình ảnh</Text>,
      children: newsData.image ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Image
            src={newsData.image}
            width={200}
            height={150}
            preview={{ mask: false }}
            style={{ borderRadius: 8 }}
          />
          <a href={newsData.image} target="_blank" rel="noopener noreferrer" style={{ color: "#13C2C2" }}>
            Xem ảnh đầy đủ
          </a>
        </Space>
      ) : (
        <Text type="secondary">Không có hình ảnh</Text>
      ),
      span: 2,
    },
    {
      key: "content",
      label: <Text strong style={{ color: "#0D364C" }}>Nội dung</Text>,
      children: (
        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
          {truncatedContent}
        </Paragraph>
      ),
      span: 2,
    },
    {
      key: "tags",
      label: <Text strong style={{ color: "#0D364C" }}>Tags</Text>,
      children: newsData.tags && newsData.tags.length > 0 ? (
        <Space wrap>
          {newsData.tags.map((t, i) => (
            <Tag key={i} color="#13C2C2" style={{ borderRadius: 16 }}>
              {t}
            </Tag>
          ))}
        </Space>
      ) : (
        <Text type="secondary">Không có tags</Text>
      ),
      span: 2,
    },
    {
      key: "author",
      label: <Text strong style={{ color: "#0D364C" }}>Tác giả</Text>,
      children: (
        <Space>
          <UserOutlined style={{ color: "#13C2C2" }} />
          <Text>{newsData.author?.name || "N/A"}</Text>
        </Space>
      ),
      span: 1,
    },
    {
      key: "views",
      label: <Text strong style={{ color: "#0D364C" }}>Lượt xem</Text>,
      children: <Text>{newsData.views || 0}</Text>,
      span: 1,
    },
    {
      key: "status",
      label: <Text strong style={{ color: "#0D364C" }}>Trạng thái</Text>,
      children: (() => {
        let color, icon, text;
        switch (newsData.status) {
          case "published":
            color = "#52c41a"; icon = <CheckCircleOutlined />; text = "Đã xuất bản";
            break;
          case "draft":
            color = "#faad14"; icon = <StopOutlined />; text = "Bản nháp";
            break;
          case "archived":
            color = "#ff4d4f"; icon = <DeleteOutlined />; text = "Đã lưu trữ";
            break;
          default:
            color = "#d9d9d9"; icon = null; text = newsData.status;
        }
        return (
          <Tag color={color} icon={icon} style={{ borderRadius: 16, fontWeight: 500 }}>
            {text}
          </Tag>
        );
      })(),
      span: 1,
    },
    {
      key: "publishedAt",
      label: <Text strong style={{ color: "#0D364C" }}>Ngày xuất bản</Text>,
      children: (
        <Text>
          {newsData.publishedAt
            ? new Date(newsData.publishedAt).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "Chưa xuất bản"}
        </Text>
      ),
      span: 1,
    },
    {
      key: "createdAt",
      label: <Text strong style={{ color: "#0D364C" }}>Ngày tạo</Text>,
      children: (
        <Text>
          {newsData.createdAt
            ? new Date(newsData.createdAt).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "N/A"}
        </Text>
      ),
      span: 1,
    },
    {
      key: "updatedAt",
      label: <Text strong style={{ color: "#0D364C" }}>Ngày cập nhật</Text>,
      children: (
        <Text>
          {newsData.updatedAt
            ? new Date(newsData.updatedAt).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "N/A"}
        </Text>
      ),
      span: 1,
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Chi Tiết Tin Tức</Title>
        </Space>
      }
      width={800}
      style={{ borderRadius: 12 }}
    >
      <Descriptions bordered column={1} items={items} style={{ borderColor: "#13C2C230" }} />
    </Modal>
  );
};

ViewNewsDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newsData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.oneOf(["draft", "published", "archived"]),
    publishedAt: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    image: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
    }),
    views: PropTypes.number,
  }),
};

export default ViewNewsDetail;