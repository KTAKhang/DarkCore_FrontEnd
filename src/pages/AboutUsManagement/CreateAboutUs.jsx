import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Space,
  Avatar,
  Button,
} from "antd";
import {
  InfoCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { aboutInfoRequest, aboutCreateOrUpdateRequest } from "../../redux/actions/aboutActions";
//SỬ dụng AboutUsForm để tạo AboutUs

import AboutUsForm from "./AboutUsForm";

const { Title } = Typography;

const CreateAboutUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: aboutData, loading, creating, error } = useSelector((state) => state.about);
  const isCreatingRef = useRef(false); // Track xem có đang trong quá trình tạo không

  useEffect(() => {
    dispatch(aboutInfoRequest());
  }, [dispatch]);

  // Kiểm tra nếu AboutUs đã tồn tại VÀ KHÔNG PHẢI đang trong quá trình tạo
  useEffect(() => {
    if (aboutData && !loading && !isCreatingRef.current) {
      toast.error("About Us đã tồn tại! Vui lòng sử dụng chức năng cập nhật.", {
        toastId: "aboutus-exists"
      });
      navigate("/admin/about-us");
    }
  }, [aboutData, loading, navigate]);

  const handleCreate = (values) => {
    isCreatingRef.current = true; // Đánh dấu là đang tạo
    dispatch(aboutCreateOrUpdateRequest(values));
  };

  const handleBack = () => {
    navigate("/admin/about-us");
  };

  // Redirect sau khi tạo thành công
  useEffect(() => {
    if (!creating && !error && aboutData && isCreatingRef.current) {
      // Delay nhỏ để toast từ saga hiển thị trước khi redirect
      const timer = setTimeout(() => {
        navigate("/admin/about-us");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [creating, error, aboutData, navigate]);

  // Nếu đang loading hoặc AboutUs đã tồn tại, không hiển thị form
  if (loading || aboutData) {
    return null;
  }

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
              Tạo mới About Us
            </Title>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Toolbar */}
          <div style={{ marginBottom: 24 }}>
            <Button
              onClick={handleBack}
              icon={<ArrowLeftOutlined />}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Quay lại
            </Button>
          </div>

          {/* Form */}
          <AboutUsForm
            initialData={null}
            onSubmit={handleCreate}
            loading={creating}
          />
        </Space>
      </Card>
    </div>
  );
};

export default CreateAboutUs;

