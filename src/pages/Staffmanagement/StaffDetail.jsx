import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Descriptions,
  Button,
  Spin,
  Alert,
  Avatar,
  Tag,
  Badge,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const StaffDetail = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await axios.get(`http://localhost:3000/staff/${id}` , { headers });
        setStaff(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "50vh" 
    }}>
      <Spin size="large" tip="Đang tải thông tin nhân viên..." />
    </div>
  );
  
  if (error) return (
    <div style={{ padding: 24 }}>
      <Alert 
        type="error" 
        message="Lỗi tải dữ liệu" 
        description={error}
        showIcon
        action={
          <Button size="small" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        }
      />
    </div>
  );
  
  if (!staff) return (
    <div style={{ padding: 24 }}>
      <Alert 
        type="warning" 
        message="Không tìm thấy nhân viên" 
        description="Nhân viên có thể đã bị xóa hoặc không tồn tại."
        showIcon
        action={
          <Button type="primary" size="small">
            <Link to="/admin/staff">Quay lại danh sách</Link>
          </Button>
        }
      />
    </div>
  );

  const getRoleDisplayName = (roleName) => {
    switch (roleName) {
      case "sales-staff":
        return "Nhân viên bán hàng";
      case "repair-staff":
        return "Nhân viên sửa chữa";
      default:
        return roleName || "Chưa xác định";
    }
  };

  const getStatusDisplay = (status) => {
    return status === "active" ? "Hoạt động" : "Ngừng hoạt động";
  };

  return (
    <div
      style={{
        padding: 24,
        background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              size={80}
              src={staff.avatar || ""}
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: staff.avatar ? "transparent" : "#13C2C2",
                border: staff.avatar ? "1px solid #d9d9d9" : "none"
              }}
            />
            <div style={{ flex: 1 }}>
              <Title level={2} style={{ margin: 0, color: "#0D364C" }}>
                {staff.user_name}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {staff.email}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Badge
                  status={staff.status === "active" ? "success" : "error"}
                  text={
                    <Tag
                      color={staff.status === "active" ? "#52c41a" : "#ff4d4f"}
                      icon={staff.status === "active" ? <CheckCircleOutlined /> : <StopOutlined />}
                      style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
                    >
                      {getStatusDisplay(staff.status)}
                    </Tag>
                  }
                />
              </div>
            </div>
            <Space direction="vertical" align="end">
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(staff._id || staff.id);
                  message.success("Đã copy ID vào clipboard");
                }}
                style={{ color: "#13C2C2" }}
              >
                Copy ID
              </Button>
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}
              >
                <Link to="/admin/staff">Quay lại</Link>
              </Button>
            </Space>
          </Space>
        </Card>

        {/* Details */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: "#13C2C2" }} />
                  <span style={{ color: "#0D364C" }}>Thông tin cá nhân</span>
                </Space>
              }
              style={{ 
                borderRadius: 16, 
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid #13C2C220"
              }}
            >
              <Descriptions column={1} size="middle">
                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined style={{ color: "#13C2C2" }} />
                      <span>Họ tên</span>
                    </Space>
                  }
                >
                  <Text strong style={{ fontSize: 16 }}>{staff.user_name}</Text>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <Space>
                      <MailOutlined style={{ color: "#13C2C2" }} />
                      <span>Email</span>
                    </Space>
                  }
                >
                  <Text copyable style={{ fontSize: 14 }}>{staff.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <Space>
                      <PhoneOutlined style={{ color: "#13C2C2" }} />
                      <span>Số điện thoại</span>
                    </Space>
                  }
                >
                  <Text copyable style={{ fontSize: 14 }}>{staff.phone || "Chưa cập nhật"}</Text>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <Space>
                      <HomeOutlined style={{ color: "#13C2C2" }} />
                      <span>Địa chỉ</span>
                    </Space>
                  }
                >
                  <Text style={{ fontSize: 14 }}>{staff.address || "Chưa cập nhật"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <CrownOutlined style={{ color: "#13C2C2" }} />
                  <span style={{ color: "#0D364C" }}>Thông tin công việc</span>
                </Space>
              }
              style={{ 
                borderRadius: 16, 
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid #13C2C220"
              }}
            >
              <Descriptions column={1} size="middle">
                <Descriptions.Item 
                  label={
                    <Space>
                      <CrownOutlined style={{ color: "#13C2C2" }} />
                      <span>Vai trò</span>
                    </Space>
                  }
                >
                  <Tag
                    color={staff.role_name === "sales-staff" ? "#13C2C2" : "#52c41a"}
                    style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px", fontSize: 14 }}
                  >
                    {getRoleDisplayName(staff.role_name)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <Space>
                      <CheckCircleOutlined style={{ color: "#13C2C2" }} />
                      <span>Trạng thái</span>
                    </Space>
                  }
                >
                  <Badge
                    status={staff.status === "active" ? "success" : "error"}
                    text={
                      <Tag
                        color={staff.status === "active" ? "#52c41a" : "#ff4d4f"}
                        icon={staff.status === "active" ? <CheckCircleOutlined /> : <StopOutlined />}
                        style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
                      >
                        {getStatusDisplay(staff.status)}
                      </Tag>
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined style={{ color: "#13C2C2" }} />
                      <span>ID Nhân viên</span>
                    </Space>
                  }
                >
                  <Text 
                    copyable 
                    style={{ 
                      fontSize: 12, 
                      color: "#999",
                      fontFamily: "monospace"
                    }}
                  >
                    {staff._id || staff.id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={
                    <Space>
                      <UserOutlined style={{ color: "#13C2C2" }} />
                      <span>Ngày tạo</span>
                    </Space>
                  }
                >
                  <Text style={{ fontSize: 14 }}>
                    {staff.createdAt 
                      ? new Date(staff.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"
                    }
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StaffDetail;
