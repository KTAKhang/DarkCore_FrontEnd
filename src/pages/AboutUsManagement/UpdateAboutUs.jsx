import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Spin,
  Alert,
  Space,
  Avatar,
} from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { aboutInfoRequest, aboutCreateOrUpdateRequest } from "../../redux/actions/aboutActions";
import AboutUsForm from "./AboutUsForm";

const { Title, Text } = Typography;

const UpdateAboutUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: aboutData, loading, creating, error } = useSelector((state) => state.about);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(aboutInfoRequest());
  }, [dispatch]);

  useEffect(() => {
    if (aboutData) {
      setFormData(aboutData);
    }
  }, [aboutData]);

  // Kiểm tra nếu AboutUs chưa tồn tại
  useEffect(() => {
    if (!aboutData && !loading) {
      toast.warning("Chưa có thông tin About Us. Vui lòng tạo mới.", {
        toastId: "aboutus-not-exists"
      });
      navigate("/admin/about-us/create");
    }
  }, [aboutData, loading, navigate]);

  const handleUpdate = (values) => {
    dispatch(aboutCreateOrUpdateRequest(values));
  };

  const handleRefresh = () => {
    dispatch(aboutInfoRequest());
    toast.info("Đang tải lại dữ liệu...");
  };

  const handleBack = () => {
    navigate("/admin/about-us");
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
              Cập nhật About Us
            </Title>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Toolbar */}
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <Button
              onClick={handleBack}
              icon={<ArrowLeftOutlined />}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Quay lại
            </Button>
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loading}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Làm mới
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{
                marginBottom: 16,
                borderColor: "#ff4d4f",
                backgroundColor: "#fff2f0"
              }}
            />
          )}

          {/* Loading State */}
          {loading && !aboutData ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <Text style={{ marginTop: 16, display: "block", color: "#0D364C" }}>Đang tải dữ liệu...</Text>
            </div>
          ) : (
            /* Main Content - Form */
            aboutData && (
              <AboutUsForm
                initialData={formData}
                onSubmit={handleUpdate}
                loading={creating}
              />
            )
          )}
        </Space>
      </Card>
    </div>
  );
};

export default UpdateAboutUs;

