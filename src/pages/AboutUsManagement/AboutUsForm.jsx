import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Form,
  Input,
  Button,
  Card,
  Switch,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Upload,
  Modal,
  message,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { TextArea } = Input;

const AboutUsForm = ({ initialData, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [coreValues, setCoreValues] = useState([]);
  const [socialMedia, setSocialMedia] = useState({});
  const [stats, setStats] = useState({});
  const [images, setImages] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
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
    setLogoFile(file);
    setLogoRemoved(false); // Reset removed flag khi upload ảnh mới
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setLogoFile(null);
    setLogoRemoved(true);
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        storeName: initialData.storeName,
        slogan: initialData.slogan,
        story: initialData.story,
        mission: initialData.mission,
        vision: initialData.vision,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        workingHours: initialData.workingHours,
        status: initialData.status !== undefined ? initialData.status : true,
      });
      setCoreValues(initialData.coreValues || []);
      setSocialMedia(initialData.socialMedia || {});
      setStats(initialData.stats || {});
      setImages(initialData.images || []);
      setLogoFile(null); // Reset logo file khi load data
      setLogoRemoved(false); // Reset logo removed khi load data
    } else {
      // Reset form khi không có initialData (tạo mới)
      form.resetFields();
      form.setFieldsValue({
        status: true,
      });
      setCoreValues([]);
      setSocialMedia({});
      setStats({});
      setImages([]);
      setLogoFile(null);
      setLogoRemoved(false);
    }
  }, [initialData, form]);

  const handleSubmit = (values) => {
    // Validate Logo - Bắt buộc phải có logo (file mới hoặc logo cũ)
    if (!logoFile && !initialData?.logo) {
      message.error("Vui lòng tải lên logo cho cửa hàng!");
      return;
    }

    // Validate Core Values
    if (coreValues.length > 0) {
      const invalidCoreValues = coreValues.filter(
        (value) => !value.title || !value.description
      );
      
      if (invalidCoreValues.length > 0) {
        message.error("Vui lòng điền đầy đủ Tiêu đề và Mô tả cho tất cả Giá trị cốt lõi!");
        return;
      }
    }

    const payload = {
      ...values,
      coreValues,
      socialMedia,
      stats,
      images,
    };
    
    // Xóa logo khỏi values (nếu có) vì không phải là field form
    delete payload.logo;
    
    // Thêm logoFile vào payload nếu có
    if (logoFile) {
      payload.logoFile = logoFile;
    }
    
    onSubmit(payload);
  };

  const addCoreValue = () => {
    setCoreValues([...coreValues, { title: "", description: "", icon: "" }]);
  };

  const removeCoreValue = (index) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const updateCoreValue = (index, field, value) => {
    const updated = [...coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setCoreValues(updated);
  };

  const updateSocialMedia = (key, value) => {
    setSocialMedia({ ...socialMedia, [key]: value });
  };

  const updateStats = (key, value) => {
    setStats({ ...stats, [key]: value });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      size="large"
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Basic Information */}
        <Card title="Thông tin cơ bản" style={{ borderRadius: 8 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên cửa hàng"
                name="storeName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cửa hàng!" },
                  { max: 100, message: "Tên cửa hàng không được vượt quá 100 ký tự!" },
                ]}
              >
                <Input placeholder="Nhập tên cửa hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Slogan"
                name="slogan"
                rules={[{ max: 200, message: "Slogan không được vượt quá 200 ký tự!" }]}
              >
                <Input placeholder="Nhập slogan" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label={
              <span>
                Logo <Text type="danger">*</Text>
              </span>
            }
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={beforeUpload}
              onPreview={handlePreview}
              onRemove={handleRemove}
              accept="image/*"
              fileList={logoFile ? [{
                uid: '-1',
                name: logoFile.name,
                status: 'done',
                url: URL.createObjectURL(logoFile),
                originFileObj: logoFile,
              }] : (initialData?.logo && !logoRemoved) ? [{
                uid: '-1',
                name: 'logo.png',
                status: 'done',
                url: initialData.logo,
              }] : []}
            >
              {(!logoFile && (!initialData?.logo || logoRemoved)) && (
                <div>
                  <UploadOutlined style={{ fontSize: 24, color: "#13C2C2" }} />
                  <div style={{ marginTop: 8, color: "#13C2C2" }}>Tải logo lên (bắt buộc)</div>
                  <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 5MB</div>
                </div>
              )}
            </Upload>
            {!logoFile && !initialData?.logo && (
              <Text type="danger" style={{ fontSize: 12 }}>
                Logo là bắt buộc. Vui lòng tải lên logo cho cửa hàng.
              </Text>
            )}
          </Form.Item>
          
          <Modal
            open={previewVisible}
            title="Xem trước logo"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>

          <Form.Item
            label="Câu chuyện"
            name="story"
            rules={[
              { required: true, message: "Vui lòng nhập câu chuyện!" },
              { max: 5000, message: "Câu chuyện không được vượt quá 5000 ký tự!" },
            ]}
          >
            <TextArea rows={6} placeholder="Nhập câu chuyện của cửa hàng" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Sứ mệnh"
                name="mission"
                rules={[{ max: 1000, message: "Sứ mệnh không được vượt quá 1000 ký tự!" }]}
              >
                <TextArea rows={4} placeholder="Nhập sứ mệnh" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tầm nhìn"
                name="vision"
                rules={[{ max: 1000, message: "Tầm nhìn không được vượt quá 1000 ký tự!" }]}
              >
                <TextArea rows={4} placeholder="Nhập tầm nhìn" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Core Values */}
        <Card
          title="Giá trị cốt lõi"
          extra={
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addCoreValue}
            >
              Thêm giá trị
            </Button>
          }
          style={{ borderRadius: 8 }}
        >
          {coreValues.length === 0 ? (
            <Text type="secondary">Chưa có giá trị cốt lõi nào. Vui lòng thêm mới.</Text>
          ) : (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {coreValues.map((value, index) => (
                <Card
                  key={index}
                  size="small"
                  extra={
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeCoreValue(index)}
                    >
                      Xóa
                    </Button>
                  }
                >
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" style={{ width: "100%" }} size={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Tiêu đề <Text type="danger">*</Text>
                        </Text>
                        <Input
                          placeholder="Nhập tiêu đề (bắt buộc)"
                          value={value.title}
                          onChange={(e) => updateCoreValue(index, "title", e.target.value)}
                          status={!value.title ? "error" : ""}
                        />
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" style={{ width: "100%" }} size={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Icon URL (tùy chọn)
                        </Text>
                        <Input
                          placeholder="Nhập URL icon"
                          value={value.icon}
                          onChange={(e) => updateCoreValue(index, "icon", e.target.value)}
                        />
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" style={{ width: "100%" }} size={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Mô tả <Text type="danger">*</Text>
                        </Text>
                        <TextArea
                          rows={2}
                          placeholder="Nhập mô tả (bắt buộc)"
                          value={value.description}
                          onChange={(e) => updateCoreValue(index, "description", e.target.value)}
                          status={!value.description ? "error" : ""}
                        />
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          )}
        </Card>

        {/* Contact Information */}
        <Card title="Thông tin liên hệ" style={{ borderRadius: 8 }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  { max: 20, message: "Số điện thoại không được vượt quá 20 ký tự!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Giờ làm việc"
                name="workingHours"
                rules={[{ max: 200, message: "Giờ làm việc không được vượt quá 200 ký tự!" }]}
              >
                <Input placeholder="VD: 8:00 - 22:00" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ!" },
              { max: 255, message: "Địa chỉ không được vượt quá 255 ký tự!" },
            ]}
          >
            <TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>
        </Card>

        {/* Social Media */}
        <Card title="Mạng xã hội" style={{ borderRadius: 8 }}>
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
              <Text strong>YouTube:</Text>
              <Input
                placeholder="Nhập URL YouTube"
                value={socialMedia.youtube || ""}
                onChange={(e) => updateSocialMedia("youtube", e.target.value)}
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

        {/* Statistics */}
        <Card title="Thống kê" style={{ borderRadius: 8 }}>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Text strong>Năm hoạt động:</Text>
              <InputNumber
                min={0}
                placeholder="Số năm"
                value={stats.yearsOfOperation || 0}
                onChange={(value) => updateStats("yearsOfOperation", value || 0)}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Text strong>Tổng khách hàng:</Text>
              <InputNumber
                min={0}
                placeholder="Số lượng"
                value={stats.totalCustomers || 0}
                onChange={(value) => updateStats("totalCustomers", value || 0)}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Text strong>Tổng sản phẩm:</Text>
              <InputNumber
                min={0}
                placeholder="Số lượng"
                value={stats.totalProducts || 0}
                onChange={(value) => updateStats("totalProducts", value || 0)}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Text strong>Tổng đơn hàng:</Text>
              <InputNumber
                min={0}
                placeholder="Số lượng"
                value={stats.totalOrders || 0}
                onChange={(value) => updateStats("totalOrders", value || 0)}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Col>
          </Row>
        </Card>

        {/* Status */}
        <Card title="Trạng thái" style={{ borderRadius: 8 }}>
          <Form.Item
            label="Hiển thị"
            name="status"
            valuePropName="checked"
            tooltip="Bật để hiển thị thông tin About Us trên trang web"
          >
            <Switch />
          </Form.Item>
        </Card>

        {/* Submit Button */}
        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            size="large"
            style={{
              backgroundColor: "#13C2C2",
              borderColor: "#13C2C2",
              height: 44,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              minWidth: 150,
            }}
          >
            Lưu thông tin
          </Button>
        </div>
      </Space>
    </Form>
  );
};

AboutUsForm.propTypes = {
  initialData: PropTypes.shape({
    storeName: PropTypes.string,
    slogan: PropTypes.string,
    logo: PropTypes.string,
    story: PropTypes.string,
    mission: PropTypes.string,
    vision: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    workingHours: PropTypes.string,
    status: PropTypes.bool,
    coreValues: PropTypes.array,
    socialMedia: PropTypes.object,
    stats: PropTypes.object,
    images: PropTypes.array,
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AboutUsForm;

