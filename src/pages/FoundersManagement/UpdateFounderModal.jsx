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
  message,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  founderUpdateRequest,
} from "../../redux/actions/founderActions";

const { Title, Text } = Typography;
const { TextArea } = Input;

const UpdateFounderModal = ({ visible, onClose, onSuccess, founder }) => {
  const dispatch = useDispatch();
  const { updating, message: successMessage, error } = useSelector((state) => state.founder);
  const [form] = Form.useForm();
  const [socialMedia, setSocialMedia] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [prevUpdating, setPrevUpdating] = useState(false);
  const [hasCalledSuccess, setHasCalledSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
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
      message.error("Chỉ được phép tải lên file hình ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Kích thước file phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }
    setAvatarFile(file);
    setAvatarRemoved(false); // Reset removed flag khi upload ảnh mới
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setAvatarFile(null);
    setAvatarRemoved(true);
  };

  // Handle success - close modal when action completes successfully
  useEffect(() => {
    if (prevUpdating && !updating && successMessage && !error && !hasCalledSuccess) {
      setHasCalledSuccess(true);
      onSuccess();
    }
    setPrevUpdating(updating);
  }, [updating, prevUpdating, successMessage, error, hasCalledSuccess, onSuccess]);

  // Load founder data when modal opens
  useEffect(() => {
    if (visible) {
      setHasCalledSuccess(false);
      setAvatarFile(null);
      setAvatarRemoved(false);

      if (founder && founder._id) {
        form.setFieldsValue({
          fullName: founder.fullName || "",
          position: founder.position || "",
          bio: founder.bio || "",
          quote: founder.quote || "",
          email: founder.email || "",
          phone: founder.phone || "",
          sortOrder: founder.sortOrder || 0,
          status: founder.status !== undefined ? founder.status : true,
        });
        setSocialMedia(founder.socialMedia || {});
        setAchievements(founder.achievements || []);
      }
    }
  }, [visible, founder, form]);

  const handleSubmit = (values) => {
    if (!founder || !founder._id) {
      message.error("Không tìm thấy thông tin Founder!");
      return;
    }

    const payload = {
      ...values,
      socialMedia,
      achievements,
    };

    // Xóa avatar khỏi values (nếu có) vì không phải là field form
    delete payload.avatar;

    // Thêm avatarFile vào payload nếu có
    if (avatarFile) {
      payload.avatarFile = avatarFile;
    }

    dispatch(founderUpdateRequest(founder._id, payload));
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
          Cập nhật Founder
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
                }] : (founder?.avatar && !avatarRemoved) ? [{
                  uid: '-1',
                  name: 'avatar.png',
                  status: 'done',
                  url: founder.avatar,
                }] : []}
              >
                {(!avatarFile && (!founder?.avatar || avatarRemoved)) && (
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
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Thứ tự hiển thị"
                  name="sortOrder"
                  tooltip="Số thứ tự càng nhỏ sẽ hiển thị càng trước"
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Hiển thị"
                  name="status"
                  valuePropName="checked"
                  tooltip="Bật để hiển thị Founder trên trang web"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Submit Button */}
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Space>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updating}
                style={{
                  backgroundColor: "#13C2C2",
                  borderColor: "#13C2C2",
                }}
              >
                Cập nhật
              </Button>
            </Space>
          </div>
        </Space>
      </Form>
    </Modal>
  );
};

UpdateFounderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  founder: PropTypes.shape({
    _id: PropTypes.string,
    fullName: PropTypes.string,
    position: PropTypes.string,
    avatar: PropTypes.string,
    bio: PropTypes.string,
    quote: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    sortOrder: PropTypes.number,
    status: PropTypes.bool,
    socialMedia: PropTypes.object,
    achievements: PropTypes.array,
  }),
};

export default UpdateFounderModal;

