import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Spin,
  Space,
  Avatar,
  Row,
  Col,
  Descriptions,
  Tag,
  Empty,
} from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { aboutInfoRequest, aboutDeleteRequest } from "../../redux/actions/aboutActions";
import DeleteAboutUs from "./DeleteAboutUs";

const { Title, Text } = Typography;

const AboutUsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: aboutData, loading, deleting } = useSelector((state) => state.about);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    dispatch(aboutInfoRequest());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(aboutInfoRequest());
    toast.info("Đang tải lại dữ liệu...");
  };

  const handleCreate = () => {
    if (aboutData) {
      toast.error("About Us đã tồn tại! Vui lòng sử dụng chức năng cập nhật.", {
        toastId: "aboutus-already-exists"
      });
      return;
    }
    navigate("/admin/about-us/create");
  };

  const handleUpdate = () => {
    if (!aboutData) {
      toast.warning("Chưa có thông tin About Us. Vui lòng tạo mới.", {
        toastId: "aboutus-not-exists"
      });
      return;
    }
    navigate("/admin/about-us/update");
  };

  const handlePreview = () => {
    if (!aboutData) {
      toast.warning("Chưa có thông tin About Us để xem trước.", {
        toastId: "aboutus-not-exists-preview"
      });
      return;
    }
    window.open("/about", "_blank");
  };

  const handleShowDeleteModal = () => {
    if (!aboutData) {
      toast.warning("Chưa có thông tin About Us để xóa.", {
        toastId: "aboutus-not-exists-delete"
      });
      return;
    }
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleConfirmDelete = () => {
    dispatch(aboutDeleteRequest());
    setIsDeleteModalVisible(false);
  };

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Card 
        style={{ 
          borderRadius: 16, 
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", 
          border: "1px solid #13C2C220" 
        }} 
        title={
          <Space>
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<InfoCircleOutlined />} />
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>
              Quản lý About Us
            </Title>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Toolbar */}
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <Space>
              <Button
                type="primary"
                onClick={handleCreate}
                icon={<PlusOutlined />}
                style={{ 
                  backgroundColor: "#13C2C2", 
                  borderColor: "#13C2C2",
                  fontWeight: 600
                }}
              >
                Tạo mới
              </Button>
              <Button
                type="primary"
                onClick={handleUpdate}
                icon={<EditOutlined />}
                style={{ 
                  backgroundColor: "#13C2C2", 
                  borderColor: "#13C2C2",
                  fontWeight: 600
                }}
              >
                Cập nhật
              </Button>
              <Button
                onClick={handlePreview}
                icon={<EyeOutlined />}
                style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
              >
                Xem trước
              </Button>
              <Button
                danger
                onClick={handleShowDeleteModal}
                icon={<DeleteOutlined />}
                loading={deleting}
              >
                Xóa
              </Button>
            </Space>
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loading}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Làm mới
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block", color: "#0D364C" }}>Đang tải dữ liệu...</Text>
            </div>
          ) : aboutData ? (
            /* Display About Us Info */
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card 
                  title="Thông tin cơ bản" 
                  style={{ borderRadius: 8, border: "1px solid #13C2C220" }}
                >
                  {aboutData.logo && (
                    <div style={{ marginBottom: 16, textAlign: "center" }}>
                      <img 
                        src={aboutData.logo} 
                        alt="Logo" 
                        style={{ 
                          maxWidth: 200, 
                          maxHeight: 200, 
                          borderRadius: 8,
                          objectFit: "contain"
                        }} 
                      />
                    </div>
                  )}
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Tên cửa hàng" span={2}>
                      <Text strong style={{ fontSize: 16 }}>{aboutData.storeName}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Slogan" span={2}>
                      {aboutData.slogan || <Text type="secondary">Chưa có</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                      <Tag color={aboutData.status ? "success" : "error"}>
                        {aboutData.status ? "Hiển thị" : "Ẩn"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {aboutData.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      {aboutData.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={2}>
                      {aboutData.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giờ làm việc" span={2}>
                      {aboutData.workingHours || <Text type="secondary">Chưa có</Text>}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card 
                  title="Sứ mệnh" 
                  style={{ borderRadius: 8, border: "1px solid #13C2C220", height: "100%" }}
                >
                  <Text>{aboutData.mission || <Text type="secondary">Chưa có</Text>}</Text>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card 
                  title="Tầm nhìn" 
                  style={{ borderRadius: 8, border: "1px solid #13C2C220", height: "100%" }}
                >
                  <Text>{aboutData.vision || <Text type="secondary">Chưa có</Text>}</Text>
                </Card>
              </Col>

              <Col span={24}>
                <Card 
                  title="Câu chuyện" 
                  style={{ borderRadius: 8, border: "1px solid #13C2C220" }}
                >
                  <Text style={{ whiteSpace: "pre-line" }}>
                    {aboutData.story || <Text type="secondary">Chưa có</Text>}
                  </Text>
                </Card>
              </Col>

              <Col span={24}>
                <Card 
                  title="Giá trị cốt lõi" 
                  style={{ borderRadius: 8, border: "1px solid #13C2C220" }}
                >
                  {aboutData.coreValues && aboutData.coreValues.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {aboutData.coreValues.map((value, index) => (
                        <Col xs={24} md={8} key={index}>
                          <Card size="small" style={{ textAlign: "center" }}>
                            {value.icon && (
                              <img 
                                src={value.icon} 
                                alt={value.title} 
                                style={{ width: 50, height: 50, marginBottom: 8 }}
                              />
                            )}
                            <Title level={5}>{value.title}</Title>
                            <Text type="secondary">{value.description}</Text>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Text type="secondary">Chưa có giá trị cốt lõi</Text>
                  )}
                </Card>
              </Col>

              <Col span={24}>
                <Card 
                  title="Thống kê" 
                  style={{ borderRadius: 8, border: "1px solid #13C2C220" }}
                >
                  {aboutData.stats ? (
                    <Row gutter={16}>
                      <Col xs={12} md={6}>
                        <Card style={{ textAlign: "center", background: "#f0f5ff" }}>
                          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                            {aboutData.stats.yearsOfOperation || 0}+
                          </Title>
                          <Text type="secondary">Năm hoạt động</Text>
                        </Card>
                      </Col>
                      <Col xs={12} md={6}>
                        <Card style={{ textAlign: "center", background: "#f6ffed" }}>
                          <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
                            {aboutData.stats.totalCustomers?.toLocaleString() || 0}+
                          </Title>
                          <Text type="secondary">Khách hàng</Text>
                        </Card>
                      </Col>
                      <Col xs={12} md={6}>
                        <Card style={{ textAlign: "center", background: "#fff7e6" }}>
                          <Title level={3} style={{ margin: 0, color: "#fa8c16" }}>
                            {aboutData.stats.totalProducts?.toLocaleString() || 0}+
                          </Title>
                          <Text type="secondary">Sản phẩm</Text>
                        </Card>
                      </Col>
                      <Col xs={12} md={6}>
                        <Card style={{ textAlign: "center", background: "#fff0f6" }}>
                          <Title level={3} style={{ margin: 0, color: "#eb2f96" }}>
                            {aboutData.stats.totalOrders?.toLocaleString() || 0}+
                          </Title>
                          <Text type="secondary">Đơn hàng</Text>
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    <Text type="secondary">Chưa có thống kê</Text>
                  )}
                </Card>
              </Col>
            </Row>
          ) : (
            /* Empty State */
            <Empty
              description={
                <Space direction="vertical">
                  <Text type="secondary">Chưa có thông tin About Us</Text>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                    style={{ 
                      backgroundColor: "#13C2C2", 
                      borderColor: "#13C2C2" 
                    }}
                  >
                    Tạo mới ngay
                  </Button>
                </Space>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Space>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteAboutUs
        visible={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
};

export default AboutUsManagement;

