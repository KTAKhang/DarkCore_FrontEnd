import { useMemo, useState, useEffect } from "react";
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
  const [switchValue, setSwitchValue] = useState(true);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ status: true });
      setSwitchValue(true);
    } else {
      form.resetFields();
      setSwitchValue(true);
      setFileList([]);
      setPreviewImage("");
    }
  }, [visible, form]);

  const activeCategories = categories.filter((c) => c.status !== false);

  const handleFinish = async (values) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (!fileList.length) {
        message.error("Vui lòng chọn hình ảnh cho sản phẩm!");
        setIsSubmitting(false);
        return;
      }

      const images = fileList
        .map((f) => f?.originFileObj || f)
        .filter((f) => f instanceof File);

      console.log("=== CreateProduct Form Values ===");
      console.log("values.short_desc:", values.short_desc);
      console.log("values.detail_desc:", values.detail_desc);
      
      const payload = {
        _id: undefined,
        name: values.name.trim(),
        category_id: values.category_id,
        price: values.price,
        short_desc: (values.short_desc || "").trim(),
        detail_desc: (values.detail_desc || "").trim(),
        brand: (values.brand || "").trim(),
        quantity: values.quantity,
        status: values.status !== undefined ? values.status : true,
        images,
      };

      console.log("=== CreateProduct Payload ===");
      console.log("payload.short_desc:", payload.short_desc);
      console.log("payload.detail_desc:", payload.detail_desc);
      console.log("Full payload:", payload);

      onSuccess && onSuccess(payload);
      setIsSubmitting(false);
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
      setModalVisible(false);
    } catch {
      message.error("Có lỗi xảy ra khi tạo sản phẩm");
      setIsSubmitting(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview || "");
    setModalVisible(true);
  };

  const customStyles = useMemo(
    () => ({
      card: { borderRadius: 8, border: "none", boxShadow: "none" },
      primaryButton: { backgroundColor: "#13C2C2", borderColor: "#13C2C2", height: 44, borderRadius: 8, fontWeight: 600, fontSize: 16 },
      title: { color: "#0D364C", marginBottom: 24, fontWeight: 700 },
      label: { color: "#0D364C", fontWeight: 600, fontSize: 14 },
      input: { borderRadius: 8, height: 40, borderColor: "#d9d9d9" },
      divider: { borderColor: "#13C2C2", opacity: 0.3 },
    }),
    []
  );

  return (
    <>
      <Modal open={visible} title={null} onCancel={onClose} footer={null} destroyOnClose width={600} styles={{ body: { padding: 0 }, header: { display: "none" } }}>
        <Card style={customStyles.card}>
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 60, height: 60, backgroundColor: "#13C2C2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <PlusOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <Title level={3} style={customStyles.title}>Tạo Sản phẩm Mới</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>Thêm sản phẩm mới vào hệ thống của bạn</Text>
              </div>

              <Divider style={customStyles.divider} />

              <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ quantity: 1, price: 1000, status: true, short_desc: "", detail_desc: "", brand: "" }} size="large">
                <Form.Item label={<Space><AppstoreOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Danh mục sản phẩm</span></Space>} name="category_id" rules={[{ required: true, message: "Vui lòng chọn danh mục sản phẩm!" }]}>
                  <Select placeholder="Chọn danh mục sản phẩm" style={customStyles.input}>
                    {activeCategories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label={<Space><ShoppingOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Tên sản phẩm</span></Space>} name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }, { min: 2, message: "Ít nhất 2 ký tự" }, { max: 100, message: "Tối đa 100 ký tự" }]}>
                  <Input placeholder="Nhập tên sản phẩm" style={customStyles.input} maxLength={100} showCount />
                </Form.Item>

                <Form.Item label={<Space><DollarOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Giá sản phẩm</span></Space>} name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
                  <InputNumber min={1000} max={1000000000} style={{ width: "100%", ...customStyles.input }} placeholder="Nhập giá sản phẩm" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(v) => v.replace(/\$\s?|(,*)/g, "")} />
                </Form.Item>

                <Form.Item label={<Space><ShoppingOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Số lượng</span></Space>} name="quantity" rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}>
                  <InputNumber min={1} max={100000} style={{ width: "100%", ...customStyles.input }} placeholder="Nhập số lượng" precision={0} />
                </Form.Item>

                <Form.Item label={<Space><ShoppingOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Thương hiệu</span></Space>} name="brand">
                  <Input placeholder="Nhập thương hiệu (tuỳ chọn)" style={customStyles.input} maxLength={50} showCount />
                </Form.Item>

                <Form.Item label={<Space><InfoCircleOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Mô tả ngắn</span></Space>} name="short_desc">
                  <Input.TextArea rows={2} placeholder="Nhập mô tả ngắn (tuỳ chọn)" style={{ borderRadius: 8 }} showCount maxLength={200} />
                </Form.Item>
                
                <Form.Item label={<Space><InfoCircleOutlined style={{ color: "#13C2C2" }} /><span style={customStyles.label}>Mô tả chi tiết</span></Space>} name="detail_desc">
                  <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết (tuỳ chọn)" style={{ borderRadius: 8 }} showCount maxLength={1000} />
                </Form.Item>

                <Form.Item label={<span style={customStyles.label}>Hình ảnh sản phẩm</span>} name="image" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)} rules={[{ required: true, message: "Vui lòng chọn hình ảnh cho sản phẩm!" }]}>
                  <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} onPreview={handlePreview} onChange={({ fileList: newFileList }) => setFileList(newFileList)} fileList={fileList}>
                    {fileList.length < 1 && (
                      <div style={{ padding: "20px 0" }}>
                        <CameraOutlined style={{ color: "#13C2C2", fontSize: 24 }} />
                        <div style={{ marginTop: 8, color: "#13C2C2", fontWeight: 500, fontSize: 14 }}>Tải ảnh lên</div>
                        <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 2MB</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item label={<span style={customStyles.label}>Trạng thái hiển thị</span>} name="status" valuePropName="checked">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" onChange={(checked) => { setSwitchValue(checked); form.setFieldsValue({ status: checked }); }} defaultChecked />
                    <Text style={{ color: "#666", fontSize: 14 }}>{switchValue ? "Sản phẩm sẽ được hiển thị công khai" : "Sản phẩm sẽ được ẩn"}</Text>
                  </div>
                </Form.Item>

                <Divider style={customStyles.divider} />

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Button onClick={onClose} size="large" disabled={isSubmitting} style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }}>Hủy bỏ</Button>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} icon={<PlusOutlined />} size="large" disabled={isSubmitting} style={{ ...customStyles.primaryButton, minWidth: 140 }}>
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


