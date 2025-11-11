import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Switch,
  InputNumber,
  Space,
  Card,
  Upload,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  founderCreateRequest,
} from "../../redux/actions/founderActions";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateFounderModal = ({ visible, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { creating, message: successMessage, error } = useSelector((state) => state.founder);
  const [form] = Form.useForm();
  const [socialMedia, setSocialMedia] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [prevCreating, setPrevCreating] = useState(false);
  const [hasCalledSuccess, setHasCalledSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Helper function để convert file sang base64 cho preview
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      // Toast sẽ được hiển thị từ saga nếu có lỗi
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      // Toast sẽ được hiển thị từ saga nếu có lỗi
      return Upload.LIST_IGNORE;
    }
    setAvatarFile(file);
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setAvatarFile(null);
  };

  // Handle success - close modal when action completes successfully
  useEffect(() => {
    if (prevCreating && !creating && successMessage && !error && !hasCalledSuccess) {
      setHasCalledSuccess(true);
      onSuccess();
    }
    setPrevCreating(creating);
  }, [creating, prevCreating, successMessage, error, hasCalledSuccess, onSuccess]);

  // Handle error from backend - display on form field if it's about fullName
  useEffect(() => {
    if (error && !creating) {
      // Check if error is about duplicate fullName
      if (error.includes("đã tồn tại") || error.includes("tồn tại trong hệ thống")) {
        form.setFields([
          {
            name: 'fullName',
            errors: [error],
          },
        ]);
      }
    }
  }, [error, creating, form]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setHasCalledSuccess(false);
      form.resetFields();
      // Clear any field errors
      form.setFields([]);
      form.setFieldsValue({
        status: true,
      });
      setSocialMedia({});
      setAchievements([]);
      setAvatarFile(null);
    }
  }, [visible, form]);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      socialMedia,
      achievements,
    };

    // Thêm avatarFile vào payload nếu có
    if (avatarFile) {
      payload.avatarFile = avatarFile;
    }

    dispatch(founderCreateRequest(payload));
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", description: "", year: null }]);
  };

  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const updateAchievement = (index, field, value) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    setAchievements(updated);
  };

  const updateSocialMedia = (key, value) => {
    setSocialMedia({ ...socialMedia, [key]: value });
  };

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          Thêm Founder mới
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Basic Information */}
          <Card title="Thông tin cơ bản" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                    { max: 100, message: "Tên không được vượt quá 100 ký tự!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Chức vụ"
                  name="position"
                  rules={[
                    { required: true, message: "Vui lòng nhập chức vụ!" },
                    { max: 100, message: "Chức vụ không được vượt quá 100 ký tự!" },
                  ]}
                >
                  <Input placeholder="Nhập chức vụ" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Avatar">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onRemove={handleRemove}
                accept="image/*"
                fileList={avatarFile ? [{
                  uid: '-1',
                  name: avatarFile.name,
                  status: 'done',
                  url: URL.createObjectURL(avatarFile),
                  originFileObj: avatarFile,
                }] : []}
              >
                {!avatarFile && (
                  <div>
                    <UploadOutlined style={{ fontSize: 24, color: "#13C2C2" }} />
                    <div style={{ marginTop: 8, color: "#13C2C2" }}>Tải avatar lên</div>
                    <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 5MB</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            
            <Modal
              open={previewVisible}
              title="Xem trước avatar"
              footer={null}
              onCancel={() => setPreviewVisible(false)}
            >
              <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>

            <Form.Item
              label="Tiểu sử"
              name="bio"
              rules={[
                { required: true, message: "Vui lòng nhập tiểu sử!" },
                { max: 2000, message: "Tiểu sử không được vượt quá 2000 ký tự!" },
              ]}
            >
              <TextArea rows={4} placeholder="Nhập tiểu sử" />
            </Form.Item>

            <Form.Item
              label="Trích dẫn"
              name="quote"
              rules={[{ max: 500, message: "Trích dẫn không được vượt quá 500 ký tự!" }]}
            >
              <TextArea rows={2} placeholder="Nhập trích dẫn" />
            </Form.Item>
          </Card>

          {/* Contact Information */}
          <Card title="Thông tin liên hệ" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ max: 20, message: "Số điện thoại không được vượt quá 20 ký tự!" }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Social Media */}
          <Card title="Mạng xã hội" size="small">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Text strong>Facebook:</Text>
                <Input
                  placeholder="Nhập URL Facebook"
                  value={socialMedia.facebook || ""}
                  onChange={(e) => updateSocialMedia("facebook", e.target.value)}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Instagram:</Text>
                <Input
                  placeholder="Nhập URL Instagram"
                  value={socialMedia.instagram || ""}
                  onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Twitter:</Text>
                <Input
                  placeholder="Nhập URL Twitter"
                  value={socialMedia.twitter || ""}
                  onChange={(e) => updateSocialMedia("twitter", e.target.value)}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Text strong>LinkedIn:</Text>
                <Input
                  placeholder="Nhập URL LinkedIn"
                  value={socialMedia.linkedin || ""}
                  onChange={(e) => updateSocialMedia("linkedin", e.target.value)}
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          </Card>

          {/* Achievements */}
          <Card
            title="Thành tựu"
            extra={
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addAchievement}
                size="small"
              >
                Thêm thành tựu
              </Button>
            }
            size="small"
          >
            {achievements.length === 0 ? (
              <Text type="secondary">Chưa có thành tựu nào. Vui lòng thêm mới.</Text>
            ) : (
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    size="small"
                    extra={
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeAchievement(index)}
                        size="small"
                      >
                        Xóa
                      </Button>
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={8}>
                        <Input
                          placeholder="Tiêu đề"
                          value={achievement.title}
                          onChange={(e) => updateAchievement(index, "title", e.target.value)}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <InputNumber
                          placeholder="Năm"
                          min={1900}
                          max={2100}
                          value={achievement.year}
                          onChange={(value) => updateAchievement(index, "year", value)}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <TextArea
                          rows={2}
                          placeholder="Mô tả"
                          value={achievement.description}
                          onChange={(e) => updateAchievement(index, "description", e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            )}
          </Card>

          {/* Settings */}
          <Card title="Cài đặt" size="small">
            <Form.Item
              label="Hiển thị"
              name="status"
              valuePropName="checked"
              tooltip="Bật để hiển thị Founder trên trang web"
            >
              <Switch />
            </Form.Item>
  
          </Card>

          {/* Submit Button */}
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Space>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={creating}
                style={{
                  backgroundColor: "#13C2C2",
                  borderColor: "#13C2C2",
                }}
              >
                Tạo mới
              </Button>
            </Space>
          </div>
        </Space>
      </Form>
    </Modal>
  );
};

CreateFounderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CreateFounderModal;

