import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Card, Select, Upload, Modal, Typography, Space, Divider, message } from "antd";
import { PlusOutlined, CameraOutlined, TagsOutlined, UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const CreateNews = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            form.setFieldsValue({ status: "draft" });
        }
    }, [visible, form]);

    const handleFinish = async (values) => {
        // Validate required fields
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

        const newNews = {
            _id: undefined,
            title: trimmedTitle,
            excerpt: values.excerpt?.trim() || "",
            content: trimmedContent,
            tags: values.tags || [],
            imageFile: imageFile || null, // Optional if adding image field
            status: values.status || "draft",
            createdAt: new Date().toISOString(),
        };

        onSuccess && onSuccess(newNews);
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
                                <div style={{ width: 60, height: 60, backgroundColor: "#13C2C2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <PlusOutlined style={{ fontSize: 24, color: "white" }} />
                                </div>
                                <Title level={3} style={customStyles.title}>Tạo Tin Tức Mới</Title>
                                <Text type="secondary" style={{ fontSize: 14 }}>Thêm tin tức mới vào hệ thống của bạn</Text>
                            </div>

                            <Divider style={customStyles.divider} />

                            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ status: "draft" }} size="large">
                                <Form.Item label={<span style={customStyles.label}>Tiêu đề</span>} name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
                                    <Input placeholder="Nhập tiêu đề tin tức" style={customStyles.input} />
                                </Form.Item>

                                <Form.Item label={<span style={customStyles.label}>Tóm tắt</span>} name="excerpt">
                                    <Input.TextArea rows={3} placeholder="Nhập tóm tắt ngắn gọn (tùy chọn)" style={{ borderRadius: 8 }} maxLength={200} showCount />
                                </Form.Item>

                                <Form.Item label={<span style={customStyles.label}>Nội dung</span>} name="content" rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}>
                                    <Input.TextArea rows={6} placeholder="Nhập nội dung tin tức chi tiết" style={{ borderRadius: 8 }} maxLength={5000} showCount />
                                </Form.Item>

                                <Form.Item label={<span style={customStyles.label}>Tags</span>} name="tags">
                                    <Select
                                        mode="tags"
                                        placeholder="Nhập tags, nhấn Enter để thêm"
                                        style={{ width: "100%" }}
                                        tokenSeparators={[',']}
                                        suffixIcon={<TagsOutlined style={{ color: "#13C2C2" }} />}
                                    />
                                </Form.Item>

                                {/* Optional Image Upload - if adding image field to model */}
                                <Form.Item label={<span style={customStyles.label}>Hình ảnh</span>} name="image">
                                    <Upload listType="picture-card" maxCount={1} beforeUpload={beforeUpload} onPreview={handlePreview} accept="image/*">
                                        <div style={{ padding: "20px 0" }}>
                                            <CameraOutlined style={{ color: "#13C2C2", fontSize: 24 }} />
                                            <div style={{ marginTop: 8, color: "#13C2C2", fontWeight: 500, fontSize: 14 }}>Tải ảnh lên</div>
                                            <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 2MB</div>
                                        </div>
                                    </Upload>
                                </Form.Item>

                                <Form.Item label={<span style={customStyles.label}>Trạng thái</span>} name="status">
                                    <Select placeholder="Chọn trạng thái">
                                        <Select.Option value="draft">Bản nháp</Select.Option>
                                        <Select.Option value="published">Đã xuất bản</Select.Option>
                                        <Select.Option value="archived">Đã lưu trữ</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Divider style={customStyles.divider} />

                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                        <Button onClick={onClose} size="large" style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }}>Hủy bỏ</Button>
                                        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large" style={{ ...customStyles.primaryButton, minWidth: 140 }}>Tạo Tin Tức</Button>
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

CreateNews.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

export default CreateNews;