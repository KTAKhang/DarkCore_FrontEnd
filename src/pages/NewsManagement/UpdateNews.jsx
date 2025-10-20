import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Card, Select, Upload, Modal, Typography, Space, Divider, message, Spin, Popconfirm } from "antd";
import { EditOutlined, CameraOutlined, TagsOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/actions/newsActions";

const { Title, Text } = Typography;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const UpdateNews = ({ visible, onClose, onSuccess, newsData }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (visible && newsData) {
      form.setFieldsValue({
        title: newsData.title,
        excerpt: newsData.excerpt || "",
        content: newsData.content || "",
        tags: newsData.tags || [],
        status: newsData.status || "draft",
        image: newsData.image ? [{ uid: "-1", name: "current-image", status: "done", url: newsData.image }] : [],
      });
      setImageFile(null);
      setLoading(false);
    } else {
      form.resetFields();
      setImageFile(null);
      setLoading(false);
    }
  }, [visible, newsData, form]);

  const handleFinish = async (values) => {
    const trimmedTitle = values.title?.trim();
    const trimmedContent = values.content?.trim();

    if (!trimmedTitle) {
      message.error("Vui lòng nhập tiêu đề tin tức!");
      return;
    }
    if (!trimmedContent) {
      message.error("Vui lòng nhập nội dung tin tức!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", trimmedTitle);
    formData.append("excerpt", values.excerpt?.trim() || "");
    formData.append("content", trimmedContent);
    formData.append("tags", Array.isArray(values.tags) ? values.tags.join(",") : (values.tags || ""));
    formData.append("status", values.status || "draft");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      dispatch(actions.newsUpdateRequest(newsData._id, formData));
      // message.success("Cập nhật tin tức thành công!");
      if (onSuccess) onSuccess(newsData);
      onClose();
    } catch (error) {
      console.error("Update news error:", error);
      message.error("Cập nhật tin tức thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file) => {
    const src = file.url || (file.originFileObj ? await getBase64(file.originFileObj) : "");
    setPreviewImage(src);
    setModalVisible(true);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được phép tải lên file hình ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước file phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }
    setImageFile(file);
    return false;
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    form.setFieldsValue({ image: [] });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined spin /> : <CameraOutlined />}
      <div style={{ marginTop: 8, color: "#13C2C2", fontWeight: 500, fontSize: 14 }}>Thay thế ảnh</div>
      <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 2MB</div>
    </div>
  );

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
    <>
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
                  Cập Nhật Tin Tức
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Chỉnh sửa thông tin tin tức
                </Text>
              </div>

              <Divider style={customStyles.divider} />

              <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
                <Form.Item
                  label={<span style={customStyles.label}>Tiêu đề</span>}
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                >
                  <Input placeholder="Nhập tiêu đề tin tức" style={customStyles.input} disabled={loading} />
                </Form.Item>

                <Form.Item label={<span style={customStyles.label}>Tóm tắt</span>} name="excerpt">
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập tóm tắt ngắn gọn (tùy chọn)"
                    style={{ borderRadius: 8 }}
                    maxLength={200}
                    showCount
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={customStyles.label}>Nội dung</span>}
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Nhập nội dung tin tức chi tiết"
                    style={{ borderRadius: 8 }}
                    maxLength={5000}
                    showCount
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item label={<span style={customStyles.label}>Tags</span>} name="tags">
                  <Select
                    mode="tags"
                    placeholder="Nhập tags, nhấn Enter hoặc space để thêm"
                    style={{ width: "100%" }}
                    tokenSeparators={[" ", ","]}
                    suffixIcon={<TagsOutlined style={{ color: "#13C2C2" }} />}
                    disabled={loading}
                  />
                </Form.Item>

                <div>
                  <span style={customStyles.label}>Hình ảnh</span>
                  <Form.Item
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (e && e.fileList ? e.fileList : [])}
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={beforeUpload}
                      onPreview={handlePreview}
                      accept="image/*"
                      fileList={form.getFieldValue("image") || []}
                      onRemove={handleRemoveImage}
                      disabled={loading}
                    >
                      {(form.getFieldValue("image") || []).length < 1 ? uploadButton : null}
                    </Upload>
                  </Form.Item>
                  {newsData?.image && !imageFile && (
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
                      Ảnh hiện tại: <a href={newsData.image} target="_blank" rel="noopener noreferrer">Xem</a>{" "}
                      <Popconfirm
                        title="Xóa ảnh hiện tại?"
                        onConfirm={handleRemoveImage}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button type="link" icon={<DeleteOutlined />} size="small" danger>
                          Xóa ảnh
                        </Button>
                      </Popconfirm>
                    </Text>
                  )}
                </div>

                <Form.Item label={<span style={customStyles.label}>Trạng thái</span>} name="status">
                  <Select placeholder="Chọn trạng thái" disabled={loading}>
                    <Select.Option value="draft">Bản nháp</Select.Option>
                    <Select.Option value="published">Đã xuất bản</Select.Option>
                    <Select.Option value="archived">Đã lưu trữ</Select.Option>
                  </Select>
                </Form.Item>

                <Divider style={customStyles.divider} />

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Button
                      onClick={onClose}
                      size="large"
                      style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }}
                      disabled={loading}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={loading ? <LoadingOutlined spin /> : <EditOutlined />}
                      size="large"
                      style={{ ...customStyles.primaryButton, minWidth: 140 }}
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? "Đang cập nhật..." : "Lưu Thay Đổi"}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Space>
          </div>
        </Card>
      </Modal>

      <Modal open={modalVisible} footer={null} onCancel={() => setModalVisible(false)} width={400}>
        <img alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 400, objectFit: "contain" }} src={previewImage} />
      </Modal>

      <style>{`
        .ant-upload-select-picture-card { border: 2px dashed #13C2C2 !important; border-radius: 8px !important; background-color: #f8fdfd !important; }
        .ant-upload-select-picture-card:hover { border-color: #0D364C !important; }
        .ant-input:focus { border-color: #13C2C2 !important; box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important; }
        .ant-btn-primary:hover { background-color: #0D364C !important; border-color: #0D364C !important; }
        .ant-modal-content { border-radius: 12px !important; }
        .ant-card { border-radius: 8px !important; }
        .ant-select-selector { border-radius: 8px !important; border-color: #d9d9d9 !important; }
        .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector { border-color: #13C2C2 !important; box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important; }
      `}</style>
    </>
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
    image: PropTypes.string,
  }),
};

export default UpdateNews;