import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Card, Upload, Modal, InputNumber, Select, Typography, Space, Divider, message, Switch } from "antd";
import { PlusOutlined, CameraOutlined, AppstoreOutlined, ShoppingOutlined, DollarOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const CreateProduct = ({ visible, onClose, onSuccess, categories = [] }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ status: true });
    } else {
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
    }
  }, [visible, form]);

  // Filter active categories
  const activeCategories = categories.filter((c) => c.status !== false);

  // Helper function to reset form
  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setPreviewImage("");
    setModalVisible(false);
  };

  const handleFinish = async (values) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Check if image is selected
    if (!fileList.length) {
      message.error("Vui lòng chọn hình ảnh cho sản phẩm!");
      setIsSubmitting(false);
      return;
    }

    // Get images from file list
    const images = fileList
      .map((f) => f?.originFileObj || f)
      .filter((f) => f instanceof File);

    // Create payload with trimmed values
    const payload = {
      _id: undefined,
      name: values.name?.trim(),
      category_id: values.category_id,
      price: values.price,
      short_desc: values.short_desc?.trim(),
      detail_desc: values.detail_desc?.trim(),
      brand: values.brand?.trim(),
      quantity: values.quantity,
      status: values.status !== undefined ? values.status : true,
      images,
    };

    // Call success callback
    onSuccess?.(payload);
    
    // Reset form and states
    setIsSubmitting(false);
    resetForm();
  };

  const handlePreview = async (file) => {
    let imageUrl = file.url || file.preview;
    
    if (!imageUrl && file.originFileObj) {
      imageUrl = await getBase64(file.originFileObj);
    }
    
    setPreviewImage(imageUrl);
    setModalVisible(true);
  };

  // Simple inline styles - no need for useMemo
  const styles = {
    card: { borderRadius: 8, border: "none", boxShadow: "none" },
    primaryButton: { backgroundColor: "#13C2C2", borderColor: "#13C2C2", height: 44, borderRadius: 8, fontWeight: 600, fontSize: 16 },
    title: { color: "#0D364C", marginBottom: 24, fontWeight: 700 },
    label: { color: "#0D364C", fontWeight: 600, fontSize: 14 },
    input: { borderRadius: 8, height: 40, borderColor: "#d9d9d9" },
    divider: { borderColor: "#13C2C2", opacity: 0.3 },
  };

  return (
    <>
      <Modal open={visible} title={null} onCancel={onClose} footer={null} destroyOnClose width={600} styles={{ body: { padding: 0 }, header: { display: "none" } }}>
        <Card style={styles.card}>
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 60, height: 60, backgroundColor: "#13C2C2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <PlusOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <Title level={3} style={styles.title}>Tạo Sản phẩm Mới</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>Thêm sản phẩm mới vào hệ thống của bạn</Text>
              </div>

              <Divider style={styles.divider} />

              <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ quantity: 1, price: 1000, status: true }} size="large">
                <Form.Item label={<Space><AppstoreOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Danh mục sản phẩm</span></Space>} name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục sản phẩm!" }]}>
                  <Select placeholder="Chọn danh mục sản phẩm" style={styles.input}>
                    {activeCategories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label={<Space><ShoppingOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Tên sản phẩm</span></Space>} name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
                  <Input placeholder="Nhập tên sản phẩm" style={styles.input} maxLength={200} showCount />
                </Form.Item>

                <Form.Item label={<Space><DollarOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Giá sản phẩm</span></Space>} name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
                  <InputNumber min={0} max={999999999} style={{ width: "100%", ...styles.input }} placeholder="Nhập giá sản phẩm" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(v) => v.replace(/\$\s?|(,*)/g, "")} />
                </Form.Item>

                <Form.Item label={<Space><ShoppingOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Số lượng</span></Space>} name="quantity" rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}>
                  <InputNumber min={0} max={999999} style={{ width: "100%", ...styles.input }} placeholder="Nhập số lượng" precision={0} />
                </Form.Item>

                <Form.Item label={<Space><ShoppingOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Thương hiệu</span></Space>} name="brand" rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}>
                  <Input placeholder="Nhập thương hiệu" style={styles.input} maxLength={50} showCount />
                </Form.Item>

                <Form.Item label={<Space><InfoCircleOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Mô tả ngắn</span></Space>} name="short_desc" rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn!" }]}>
                  <Input.TextArea rows={2} placeholder="Nhập mô tả ngắn" style={{ borderRadius: 8 }} showCount maxLength={200} />
                </Form.Item>
                
                <Form.Item label={<Space><InfoCircleOutlined style={{ color: "#13C2C2" }} /><span style={styles.label}>Mô tả chi tiết</span></Space>} name="detail_desc" rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết!" }]}>
                  <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" style={{ borderRadius: 8 }} showCount maxLength={1000} />
                </Form.Item>

                <Form.Item label={<span style={styles.label}>Hình ảnh sản phẩm</span>} rules={[{ required: true, message: "Vui lòng chọn hình ảnh cho sản phẩm!" }]}>
                  <Upload 
                    listType="picture-card" 
                    maxCount={1} 
                    beforeUpload={() => false} 
                    onPreview={handlePreview} 
                    onChange={({ fileList: newFileList }) => setFileList(newFileList)} 
                    fileList={fileList}
                  >
                    {fileList.length < 1 && (
                      <div style={{ padding: "20px 0" }}>
                        <CameraOutlined style={{ color: "#13C2C2", fontSize: 24 }} />
                        <div style={{ marginTop: 8, color: "#13C2C2", fontWeight: 500, fontSize: 14 }}>Tải ảnh lên</div>
                        <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 2MB</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item label={<span style={styles.label}>Trạng thái hiển thị</span>} name="status" valuePropName="checked">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" defaultChecked />
                    <Text style={{ color: "#666", fontSize: 14 }}>Sản phẩm sẽ được hiển thị công khai</Text>
                  </div>
                </Form.Item>

                <Divider style={styles.divider} />

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Button onClick={onClose} size="large" disabled={isSubmitting} style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }}>Hủy bỏ</Button>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} icon={<PlusOutlined />} size="large" disabled={isSubmitting} style={{ ...styles.primaryButton, minWidth: 140 }}>
                      {isSubmitting ? "Đang tạo..." : "Tạo Sản phẩm"}
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
        .ant-switch-checked { background-color: #52c41a !important; }
        .ant-switch:not(.ant-switch-checked) { background-color: #ff4d4f !important; }
        .ant-input:focus { border-color: #13C2C2 !important; box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important; }
        .ant-btn-primary:hover { background-color: #0D364C !important; border-color: #0D364C !important; }
        .ant-modal-content { border-radius: 12px !important; }
        .ant-card { border-radius: 8px !important; }
      `}</style>
    </>
  );
};

CreateProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  categories: PropTypes.array,
};

export default CreateProduct;


