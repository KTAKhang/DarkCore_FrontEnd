import PropTypes from "prop-types";
import { Modal, Descriptions, Tag, Typography } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ViewNewsDetail = ({ visible, onClose, newsData }) => {
  if (!newsData) return null;

  const items = [
    {
      key: "title",
      label: "Tiêu đề",
      children: <Text strong>{newsData.title}</Text>,
      span: 2,
    },
    {
      key: "excerpt",
      label: "Tóm tắt",
      children: <Text>{newsData.excerpt || "Không có tóm tắt"}</Text>,
      span: 2,
    },
    {
      key: "content",
      label: "Nội dung",
      children: <Text>{newsData.content}</Text>,
      span: 2,
    },
    {
      key: "tags",
      label: "Tags",
      children: newsData.tags && newsData.tags.length > 0 ? newsData.tags.map((t, i) => (
        <Tag key={i} style={{ marginBottom: 4 }}>{t}</Tag>
      )) : <Text>Không có tags</Text>,
      span: 2,
    },
    {
      key: "status",
      label: "Trạng thái",
      children: (
        <Tag
          color={newsData.status === "published" ? "#52c41a" : "#ff4d4f"}
          icon={newsData.status === "published" ? <CheckCircleOutlined /> : <StopOutlined />}
        >
          {newsData.status === "published" ? "Published" : "Draft"}
        </Tag>
      ),
      span: 2,
    },
    {
      key: "publishedAt",
      label: "Ngày xuất bản",
      children: (
        <Text>
          {newsData.publishedAt
            ? new Date(newsData.publishedAt).toLocaleDateString("vi-VN", {
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
    {
      key: "createdAt",
      label: "Ngày tạo",
      children: (
        <Text>
          {newsData.createdAt
            ? new Date(newsData.createdAt).toLocaleDateString("vi-VN", {
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
    {
      key: "updatedAt",
      label: "Ngày cập nhật",
      children: (
        <Text>
          {newsData.updatedAt
            ? new Date(newsData.updatedAt).toLocaleDateString("vi-VN", {
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
    <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết News" width={700}>
      <Descriptions bordered column={2} items={items} />
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
    status: PropTypes.string,
    publishedAt: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default ViewNewsDetail;
