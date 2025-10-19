import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Button, Upload, Space, Tag, message } from "antd";
import { PaperClipOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const ContactUpdateModal = ({ visible, contactData, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (visible && contactData) {
      form.setFieldsValue({
        status: contactData.status,
      });
    }
  }, [visible, contactData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!values.status && !values.replyMessage?.trim()) {
        message.warning("Vui lòng cập nhật status hoặc gửi reply!");
        return;
      }

      const payload = {
        status: values.status,
        replyMessage: values.replyMessage?.trim() || "",
        isInternal: values.isInternal || false,
        attachments,
      };

      console.log("📤 Submit payload:", payload);
      onSubmit(payload); // CHỈ GỬI payload
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };



  const handleCancel = () => {
    form.resetFields();
    setAttachments([]);
    onClose();
  };

  const handleUpload = ({ file }) => {
    // Giả lập upload - trong thực tế bạn cần upload lên Cloudinary
    const newAttachment = {
      url: URL.createObjectURL(file),
      publicId: `temp_${Date.now()}`,
      originalName: file.name,
    };
    setAttachments([...attachments, newAttachment]);
    message.success(`${file.name} đã được thêm`);
    return false; // Ngăn upload tự động
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Modal
      title={
        <div>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Cập nhật liên hệ</span>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            #{contactData?.ticketId} - {contactData?.subject}
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        {/* Status */}
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: false, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Pending">
              <Tag color="gold">Pending</Tag>
            </Option>
            <Option value="Resolved">
              <Tag color="green">Resolved</Tag>
            </Option>
            {/* <Option value="Closed">
              <Tag color="volcano">Closed</Tag>
            </Option> */}
          </Select>
        </Form.Item>

        {/* Reply Message */}
        <Form.Item
          label="Phản hồi"
          name="replyMessage"
          rules={[{ required: false, message: "Vui lòng nhập nội dung phản hồi" }]}
        >
          <TextArea
            rows={6}
            placeholder="Nhập nội dung phản hồi cho khách hàng..."
            maxLength={2000}
            showCount
          />
        </Form.Item>

        {/* Internal Note */}
        {/* <Form.Item label="Loại phản hồi" name="isInternal" valuePropName="checked">
          <Select defaultValue={false} placeholder="Chọn loại phản hồi">
            <Option value={false}>
              <Tag color="blue">Công khai (Khách hàng có thể xem)</Tag>
            </Option>
            <Option value={true}>
              <Tag color="orange">Nội bộ (Chỉ Admin xem)</Tag>
            </Option>
          </Select>
        </Form.Item> */}

        {/* Attachments */}
        <Form.Item label="Đính kèm file">
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          >
            <Button icon={<PaperClipOutlined />}>Thêm file đính kèm</Button>
          </Upload>

          {attachments.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {attachments.map((file, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => removeAttachment(index)}
                  icon={<PaperClipOutlined />}
                  style={{ marginBottom: 8 }}
                >
                  {file.originalName}
                </Tag>
              ))}
            </div>
          )}
        </Form.Item>

        {/* Info Box */}
        {/* <div
          style={{
            background: "#f0f7ff",
            border: "1px solid #bae0ff",
            borderRadius: 8,
            padding: 12,
            marginTop: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "#0958d9" }}>
            💡 <strong>Lưu ý:</strong>
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>Bạn có thể chỉ cập nhật status mà không cần reply</li>
              <li>Hoặc vừa cập nhật status vừa gửi reply cùng lúc</li>
              <li>Phản hồi "Nội bộ" chỉ Admin có thể xem</li>
            </ul>
          </div>
        </div> */}
      </Form>
    </Modal>
  );
};

export default ContactUpdateModal;