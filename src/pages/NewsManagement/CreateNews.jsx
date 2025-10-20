import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Card, Select, Upload, Modal, Typography, Space, Divider, message, Spin } from "antd";
import { PlusOutlined, CameraOutlined, TagsOutlined, UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/actions/newsActions"; // Thay đường dẫn đúng đến newsActions.js

const { Title, Text } = Typography; // Destructure Typography để sử dụng Title và Text

// Hàm chuyển đổi file thành base64 để preview ảnh
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Tạo FileReader để đọc file
        reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
        reader.onload = () => resolve(reader.result); // Trả về kết quả khi đọc thành công
        reader.onerror = (error) => reject(error); // Ném lỗi nếu đọc thất bại
    });
}

// Component để tạo tin tức mới
const CreateNews = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm(); // Khởi tạo form từ Ant Design
    const [previewImage, setPreviewImage] = useState(""); // State lưu URL ảnh để preview
    const [modalVisible, setModalVisible] = useState(false); // State kiểm soát hiển thị modal preview ảnh
    const [imageFile, setImageFile] = useState(null); // State lưu file ảnh được chọn
    const [loading, setLoading] = useState(false); // State quản lý trạng thái loading khi submit form

    const dispatch = useDispatch(); // Khởi tạo hook useDispatch để dispatch action

    // Reset form và state khi modal mở
    useEffect(() => {
        if (visible) {
            form.resetFields(); // Reset các trường trong form
            form.setFieldsValue({ status: "draft" }); // Đặt trạng thái mặc định là draft
            setImageFile(null); // Reset file ảnh
            setLoading(false); // Reset trạng thái loading
        }
    }, [visible, form]); // Chạy lại khi visible hoặc form thay đổi

    // Xử lý submit form
    const handleFinish = async (values) => {
        // Cắt bỏ khoảng trắng ở tiêu đề và nội dung
        const trimmedTitle = values.title?.trim();
        const trimmedContent = values.content?.trim();

        // Kiểm tra các trường bắt buộc
        if (!trimmedTitle) {
            message.error("Vui lòng nhập tiêu đề tin tức!"); // Hiển thị lỗi nếu thiếu tiêu đề
            return;
        }
        if (!trimmedContent) {
            message.error("Vui lòng nhập nội dung tin tức!"); // Hiển thị lỗi nếu thiếu nội dung
            return;
        }

        setLoading(true); // Bật trạng thái loading

        // Tạo FormData để gửi dữ liệu
        const formData = new FormData();
        formData.append("title", trimmedTitle); // Thêm tiêu đề
        formData.append("excerpt", values.excerpt?.trim() || ""); // Thêm đoạn trích, mặc định rỗng
        formData.append("content", trimmedContent); // Thêm nội dung
        // Xử lý tags: chuyển mảng thành chuỗi, hoặc dùng giá trị mặc định
        formData.append("tags", Array.isArray(values.tags) ? values.tags.join(",") : (values.tags || ""));
        formData.append("status", values.status || "draft"); // Thêm trạng thái, mặc định là draft
        if (imageFile) {
            formData.append("image", imageFile); // Thêm file ảnh nếu có
        }

        // Dispatch action tạo tin tức (saga sẽ xử lý lỗi/thành công)
        dispatch(actions.newsCreateRequest(formData));

        // Gọi onSuccess và đóng modal (không chờ response vì saga xử lý toast)
        onSuccess && onSuccess(null); // Gọi callback onSuccess với null
        onClose(); // Đóng modal

        // Reset loading sau 2 giây để tránh UI bị treo
        setTimeout(() => setLoading(false), 2000);
    };

    // Xử lý preview ảnh
    const handlePreview = async (file) => {
        // Lấy URL của ảnh từ file hoặc chuyển đổi file thành base64
        const src = file.url || (file.originFileObj ? await getBase64(file.originFileObj) : "");
        setPreviewImage(src); // Cập nhật state previewImage
        setModalVisible(true); // Mở modal preview
    };

    // Kiểm tra file trước khi upload
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/"); // Kiểm tra file có phải ảnh
        if (!isImage) {
            message.error("Chỉ được phép tải lên file hình ảnh!"); // Hiển thị lỗi nếu không phải ảnh
            return Upload.LIST_IGNORE; // Bỏ qua file
        }
        const isLt2M = file.size / 1024 / 1024 < 2; // Kiểm tra kích thước file < 2MB
        if (!isLt2M) {
            message.error("Kích thước file phải nhỏ hơn 2MB!"); // Hiển thị lỗi nếu file quá lớn
            return Upload.LIST_IGNORE; // Bỏ qua file
        }
        setImageFile(file); // Lưu file ảnh vào state
        return false; // Ngăn upload tự động vì backend xử lý
    };

    // Component nút upload ảnh
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined spin /> : <CameraOutlined />} {/* Hiển thị icon loading hoặc camera */}
            <div style={{ marginTop: 8, color: "#13C2C2", fontWeight: 500, fontSize: 14 }}>Tải ảnh lên</div>
            <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>PNG, JPG tối đa 2MB</div>
        </div>
    );

    // Định nghĩa các style tùy chỉnh bằng useMemo để tối ưu hiệu suất
    const customStyles = useMemo(
        () => ({
            card: { borderRadius: 8, border: "none", boxShadow: "none" }, // Style cho card
            primaryButton: {
                backgroundColor: "#13C2C2",
                borderColor: "#13C2C2",
                height: 44,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
            }, // Style cho nút chính
            title: { color: "#0D364C", marginBottom: 24, fontWeight: 700 }, // Style cho tiêu đề
            label: { color: "#0D364C", fontWeight: 600, fontSize: 14 }, // Style cho nhãn
            input: { borderRadius: 8, height: 40, borderColor: "#d9d9d9" }, // Style cho input
            divider: { borderColor: "#13C2C2", opacity: 0.3 }, // Style cho đường phân cách
        }),
        [] // Chỉ tính toán một lần khi component mount
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

                                <Form.Item label={<span style={customStyles.label}>Hình ảnh</span>} name="image" valuePropName="fileList" getValueFromEvent={(e) => (e && e.fileList ? e.fileList : [])}>
                                    <Upload
                                        listType="picture-card"
                                        maxCount={1}
                                        beforeUpload={beforeUpload}
                                        onPreview={handlePreview}
                                        accept="image/*"
                                        fileList={imageFile ? [imageFile] : []} // Hiển thị file đã chọn
                                    >
                                        {imageFile ? null : uploadButton}
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
                                        <Button onClick={onClose} size="large" style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }} disabled={loading}>Hủy bỏ</Button>
                                        <Button type="primary" htmlType="submit" icon={loading ? <LoadingOutlined spin /> : <PlusOutlined />} size="large" style={{ ...customStyles.primaryButton, minWidth: 140 }} loading={loading} disabled={loading}>
                                            {loading ? "Đang tạo..." : "Tạo Tin Tức"}
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

CreateNews.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

export default CreateNews;