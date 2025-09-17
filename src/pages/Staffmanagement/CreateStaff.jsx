import React, { useEffect } from "react";
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Card, 
  Typography, 
  Space, 
  Avatar,
  message,
  Divider
} from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { staffCreateRequest, updateStaffRequest } from "../../redux/actions/staffActions";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CrownOutlined,
  LockOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const StaffForm = ({ visible, onClose, initialData }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleFinish = (values) => {
    if (initialData && (initialData._id || initialData.id)) {
      dispatch(updateStaffRequest(initialData._id || initialData.id, values));
      message.success("Cập nhật nhân viên thành công!");
    } else {
      dispatch(staffCreateRequest(values));
      message.success("Tạo nhân viên thành công!");
      // Navigate back to staff management after successful create
      setTimeout(() => {
        navigate("/admin/staff");
      }, 1500);
    }
    onClose();
  };

  return (
    <div
      style={{
        padding: 24,
        background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <Card
          style={{ 
            marginBottom: 24, 
            borderRadius: 16, 
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid #13C2C220"
          }}
        >
          <Space size="large" style={{ width: "100%" }}>
            <Avatar
              size={60}
              icon={<PlusOutlined />}
              style={{ backgroundColor: "#13C2C2" }}
            />
            <div style={{ flex: 1 }}>
              <Title level={2} style={{ margin: 0, color: "#0D364C" }}>
                {initialData ? "Cập nhật nhân viên" : "Tạo nhân viên mới"}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {initialData ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới vào hệ thống"}
              </Text>
            </div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/staff")}
              style={{ color: "#13C2C2" }}
            >
              Quay lại
            </Button>
          </Space>
        </Card>

        {/* Form */}
        <Card
          style={{ 
            borderRadius: 16, 
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid #13C2C220"
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
          >
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <UserOutlined style={{ color: "#13C2C2" }} />
                      <span>Họ tên</span>
                    </Space>
                  }
                  name="user_name"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên" },
                    { min: 3, message: "Họ tên phải có ít nhất 3 ký tự" }
                  ]}
                >
                  <Input 
                    placeholder="Nhập họ tên nhân viên" 
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <MailOutlined style={{ color: "#13C2C2" }} />
                      <span>Email</span>
                    </Space>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" }
                  ]}
                >
                  <Input 
                    placeholder="Nhập email nhân viên" 
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {!initialData && (
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        <LockOutlined style={{ color: "#13C2C2" }} />
                        <span>Mật khẩu</span>
                      </Space>
                    }
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu" },
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                    ]}
                  >
                    <Input.Password 
                      placeholder="Nhập mật khẩu" 
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        <LockOutlined style={{ color: "#13C2C2" }} />
                        <span>Xác nhận mật khẩu</span>
                      </Space>
                    }
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: "Vui lòng xác nhận mật khẩu" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      placeholder="Nhập lại mật khẩu" 
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <PhoneOutlined style={{ color: "#13C2C2" }} />
                      <span>Số điện thoại</span>
                    </Space>
                  }
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                  ]}
                >
                  <Input 
                    placeholder="Nhập số điện thoại" 
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      <HomeOutlined style={{ color: "#13C2C2" }} />
                      <span>Địa chỉ</span>
                    </Space>
                  }
                  name="address"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ" },
                    { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" }
                  ]}
                >
                  <Input 
                    placeholder="Nhập địa chỉ" 
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Space>
                      <CrownOutlined style={{ color: "#13C2C2" }} />
                      <span>Vai trò</span>
                    </Space>
                  }
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                  <Select 
                    placeholder="Chọn vai trò cho nhân viên" 
                    style={{ borderRadius: 8 }}
                    size="large"
                  >
                    <Option value="sales-staff">
                      <Space>
                        <UserOutlined style={{ color: "#13C2C2" }} />
                        <span>Nhân viên bán hàng</span>
                      </Space>
                    </Option>
                    <Option value="repair-staff">
                      <Space>
                        <UserOutlined style={{ color: "#52c41a" }} />
                        <span>Nhân viên sửa chữa</span>
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button 
                  onClick={() => navigate("/admin/staff")} 
                  block 
                  size="large"
                  style={{ borderRadius: 8 }}
                >
                  Hủy
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  icon={<PlusOutlined />}
                  style={{ 
                    backgroundColor: "#0D364C", 
                    borderColor: "#0D364C",
                    borderRadius: 8
                  }}
                >
                  {initialData ? "Cập nhật" : "Tạo nhân viên"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default StaffForm;