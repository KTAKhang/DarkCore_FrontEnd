import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col, Card, Typography, Avatar, Space, Tag, Divider, Empty } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  TrophyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SortAscendingOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ViewDetailsFounderModal = ({ visible, onClose, founder, loading = false }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !founder) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get social media icon
  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: <FacebookOutlined style={{ fontSize: 18, color: "#1877f2" }} />,
      twitter: <TwitterOutlined style={{ fontSize: 18, color: "#1da1f2" }} />,
      linkedin: <LinkedinOutlined style={{ fontSize: 18, color: "#0a66c2" }} />,
      instagram: <InstagramOutlined style={{ fontSize: 18, color: "#e4405f" }} />
    };
    return iconMap[platform] || <UserOutlined />;
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      styles={{ body: { padding: 0 } }}
      closeIcon={<CloseOutlined style={{ fontSize: 20, color: "#0D364C" }} />}
    >
      <div style={{ maxHeight: '85vh', overflow: 'auto' }}>
        {/* Loading Overlay */}
        {loading && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: 'rgba(255,255,255,0.75)', 
            zIndex: 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 8
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #13C2C2',
                borderRadius: '50%',
                width: 48,
                height: 48,
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }} />
              <Text style={{ color: '#666' }}>Đang tải thông tin founder...</Text>
            </div>
          </div>
        )}

        {/* Header with Avatar and Basic Info */}
        <div style={{ 
          background: 'linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)',
          padding: '40px 24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <Avatar
            size={120}
            src={founder.avatar}
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#fff',
              border: '4px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          />
          <Title level={2} style={{ color: '#fff', marginTop: 16, marginBottom: 8 }}>
            {founder.fullName}
          </Title>
          <Text style={{ color: '#fff', fontSize: 16, opacity: 0.9 }}>
            {founder.position}
          </Text>
          <div style={{ marginTop: 12 }}>
            <Tag 
              icon={founder.status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              color={founder.status ? "#52c41a" : "#ff4d4f"}
              style={{ borderRadius: 16, padding: '4px 12px', fontSize: 14 }}
            >
              {founder.status ? "Đang hiển thị" : "Đang ẩn"}
            </Tag>
            <Tag 
              icon={<SortAscendingOutlined />}
              color="#13C2C2"
              style={{ borderRadius: 16, padding: '4px 12px', fontSize: 14, marginLeft: 8 }}
            >
              Thứ tự: {founder.sortOrder || 1}
            </Tag>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Contact Information */}
          <Card 
            title={
              <Space>
                <MailOutlined style={{ color: "#13C2C2" }} />
                <Text strong style={{ color: "#0D364C" }}>Thông tin liên hệ</Text>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space>
                  <MailOutlined style={{ color: "#13C2C2", fontSize: 18 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Email</Text>
                    <Text strong style={{ color: "#0D364C" }}>{founder.email || 'Chưa cung cấp'}</Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space>
                  <PhoneOutlined style={{ color: "#13C2C2", fontSize: 18 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Số điện thoại</Text>
                    <Text strong style={{ color: "#0D364C" }}>{founder.phone || 'Chưa cung cấp'}</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Biography */}
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: "#13C2C2" }} />
                <Text strong style={{ color: "#0D364C" }}>Tiểu sử</Text>
              </Space>
            }
            style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
            size="small"
          >
            <Paragraph style={{ 
              color: "#0D364C", 
              fontSize: 14, 
              lineHeight: 1.8,
              marginBottom: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {founder.bio || 'Chưa có thông tin tiểu sử'}
            </Paragraph>
          </Card>

          {/* Quote */}
          {founder.quote && (
            <Card 
              style={{ 
                marginBottom: 16, 
                borderRadius: 8, 
                border: "2px solid #13C2C220",
                backgroundColor: "#f0fdff"
              }}
              size="small"
            >
              <div style={{ 
                fontSize: 18, 
                fontStyle: 'italic', 
                color: "#0D364C",
                padding: '8px 0',
                position: 'relative'
              }}>
                <span style={{ fontSize: 32, color: "#13C2C2", opacity: 0.5 }}>"</span>
                {founder.quote}
                <span style={{ fontSize: 32, color: "#13C2C2", opacity: 0.5 }}>"</span>
              </div>
            </Card>
          )}

          {/* Social Media */}
          {founder.socialMedia && Object.keys(founder.socialMedia).some(key => founder.socialMedia[key]) && (
            <Card 
              title={
                <Space>
                  <FacebookOutlined style={{ color: "#13C2C2" }} />
                  <Text strong style={{ color: "#0D364C" }}>Mạng xã hội</Text>
                </Space>
              }
              style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
              size="small"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {Object.entries(founder.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <div key={platform}>
                      <Space>
                        {getSocialIcon(platform)}
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: "#13C2C2" }}
                        >
                          {url}
                        </a>
                      </Space>
                    </div>
                  );
                })}
              </Space>
            </Card>
          )}

          {/* Achievements */}
          {founder.achievements && founder.achievements.length > 0 && (
            <Card 
              title={
                <Space>
                  <TrophyOutlined style={{ color: "#13C2C2" }} />
                  <Text strong style={{ color: "#0D364C" }}>Thành tựu ({founder.achievements.length})</Text>
                </Space>
              }
              style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
              size="small"
            >
              {founder.achievements.map((achievement, index) => (
                <Card
                  key={index}
                  size="small"
                  style={{ 
                    marginBottom: index < founder.achievements.length - 1 ? 12 : 0,
                    backgroundColor: "#f8fdfd",
                    border: "1px solid #13C2C220"
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: "#0D364C", fontSize: 16 }}>
                        {achievement.title}
                      </Text>
                      {achievement.year && (
                        <Tag color="#13C2C2" style={{ borderRadius: 16, fontWeight: 500 }}>
                          {achievement.year}
                        </Tag>
                      )}
                    </div>
                    {achievement.description && (
                      <Text style={{ color: "#666", fontSize: 14 }}>
                        {achievement.description}
                      </Text>
                    )}
                  </Space>
                </Card>
              ))}
            </Card>
          )}

          {/* Empty Achievements Message */}
          {(!founder.achievements || founder.achievements.length === 0) && (
            <Card 
              style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #13C2C220" }}
              size="small"
            >
              <Empty 
                description="Chưa có thành tựu nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}

          {/* Timestamps */}
          <Card 
            style={{ borderRadius: 8, border: "1px solid #13C2C220", backgroundColor: "#fafafa" }}
            size="small"
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Ngày tạo:</Text>
                <br />
                <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
                  {formatDate(founder.createdAt)}
                </Text>
              </Col>
              <Col xs={24} md={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Cập nhật lần cuối:</Text>
                <br />
                <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
                  {formatDate(founder.updatedAt)}
                </Text>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      {/* Add CSS animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Modal>
  );
};

ViewDetailsFounderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  founder: PropTypes.shape({
    _id: PropTypes.string,
    fullName: PropTypes.string,
    position: PropTypes.string,
    avatar: PropTypes.string,
    bio: PropTypes.string,
    quote: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    socialMedia: PropTypes.object,
    achievements: PropTypes.array,
    sortOrder: PropTypes.number,
    status: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default ViewDetailsFounderModal;

