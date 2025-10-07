import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Card, Switch, Modal, Typography, Space, Divider, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UpdateNews = ({ visible, onClose, onSuccess, newsData }) => {
  const [form] = Form.useForm();
  const [switchValue, setSwitchValue] = useState(true);

  useEffect(() => {
    if (visible && newsData) {
      form.setFieldsValue({
        title: newsData.title,
        excerpt: newsData.excerpt || "",
        content: newsData.content || "",
        tags: newsData.tags ? newsData.tags.join(", ") : "",
        status: !!newsData.status && newsData.status === "published",
      });
      setSwitchValue(!!newsData.status && newsData.status === "published");
    } else {
      form.resetFields();
      setSwitchValue(true);
    }
  }, [visible, newsData, form]);

  const handleFinish = (values) => {
    const trimmedTitle = values.title?.trim();
    const trimmedExcerpt = values.excerpt?.trim();
    const trimmedContent = values.content?.trim();

    if (!trimmedTitle) {
      message.error("Vui lòng nhập tiêu đề news!");
      return;
    }
    if (!trimmedContent) {
      message.error("Vui lòng nhập nội dung news!");
      return;
    }

    const payload = {
      _id: newsData?._id,
      title: trimmedTitle,
      excerpt: trimmedExcerpt || "",
      content: trimmedContent,
      tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      status: switchValue ? "published" : "draft",
    };

    onSuccess && onSuccess(payload);
  };

  const handleSwitchChange = (checked) => {
    setSwitchValue(checked);
  };

  const customStyles = useMemo(
    () => ({
      card: { borderRadius: 8, border: "none", boxShadow: "none" },
      primaryButton: {
        backgroundColor: "#13C2C2",
        borderColor: "#13C2C2",
        height: 44,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 16,
      },
      title: { color: "#0D364C", marginBottom: 24, fontWeight: 700 },
      label: { color: "#0D364C", fontWeight: 600, fontSize: 14 },
      input: { borderRadius: 8, height: 40, borderColor: "#d9d9d9" },
      divider: { borderColor: "#13C2C2", opacity: 0.3 },
    }),
    []
  );

  return (
    <Modal open={visible} title={null} onCancel={onClose} footer={null} destroyOnClose width={600}>
      <Card style={customStyles.card}>
        <div style={{ padding: "8px 0" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#0D364C",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <EditOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <Title level={3} style={customStyles.title}>
                Cập nhật News
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Chỉnh sửa thông tin news
              </Text>
            </div>

            <Divider style={customStyles.divider} />

            <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
              <Form.Item
                label={<span style={customStyles.label}>Tiêu đề</span>}
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề news!" }]}
              >
                <Input placeholder="Nhập tiêu đề news" style={customStyles.input} />
              </Form.Item>

              <Form.Item
                label={<span style={customStyles.label}>Tóm tắt</span>}
                name="excerpt"
              >
                <Input.TextArea rows={2} placeholder="Nhập tóm tắt news" style={{ borderRadius: 8 }} maxLength={200} showCount />
              </Form.Item>

              <Form.Item
                label={<span style={customStyles.label}>Nội dung</span>}
                name="content"
                rules={[{ required: true, message: "Vui lòng nhập nội dung news!" }]}
              >
                <Input.TextArea rows={5} placeholder="Nhập nội dung news" style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                label={<span style={customStyles.label}>Tags (phân cách bằng dấu ,)</span>}
                name="tags"
              >
                <Input placeholder="vd: tech, news, update" style={customStyles.input} />
              </Form.Item>

              <Form.Item label={<span style={customStyles.label}>Trạng thái</span>} name="status" valuePropName="checked">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Switch checkedChildren="Published" unCheckedChildren="Draft" checked={switchValue} onChange={handleSwitchChange} />
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {switchValue ? "News sẽ được công khai" : "News đang ở chế độ nháp"}
                  </Text>
                </div>
              </Form.Item>

              <Divider style={customStyles.divider} />

              <Form.Item style={{ marginBottom: 0 }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <Button onClick={onClose} size="large" style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }}>
                    Hủy bỏ
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<EditOutlined />} size="large" style={{ ...customStyles.primaryButton, minWidth: 140 }}>
                    Lưu thay đổi
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Space>
        </div>
      </Card>
    </Modal>
  );
};

UpdateNews.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  newsData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
  }),
};

export default UpdateNews;
