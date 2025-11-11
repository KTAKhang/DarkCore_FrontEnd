import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Typography, Space, Avatar, Tag, Divider, Row, Col, Spin } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { founderDetailRequest } from "../../redux/actions/founderActions";

const { Title, Text, Paragraph } = Typography;

const ShowFounderDetails = ({ visible, founderId, onClose }) => {
  const dispatch = useDispatch();
  const { item: founder, loadingDetail } = useSelector((state) => state.founder);

  useEffect(() => {
    if (visible && founderId) {
      dispatch(founderDetailRequest(founderId));
    }
  }, [visible, founderId, dispatch]);

  if (!founder && !loadingDetail) {
    return null;
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      style={{ top: 20 }}
    >
      <Spin spinning={loadingDetail}>
        {founder && (
          <div>
            {/* Header với Avatar và Thông tin cơ bản */}
            <div
              style={{
                background: "linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)",
                padding: "40px 24px 24px",
                textAlign: "center",
                borderRadius: "8px 8px 0 0",
                margin: "-24px -24px 24px -24px",
              }}
            >
              <Avatar
                size={120}
                src={founder.avatar}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#fff",
                  color: "#13C2C2",
                  border: "4px solid #fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  marginBottom: 16,
                }}
              />
              <Title level={2} style={{ color: "white", margin: 0, marginBottom: 8 }}>
                {founder.fullName}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, display: "block" }}>
                {founder.position}
              </Text>
              {founder.quote && (
                <div style={{ marginTop: 16, padding: "16px 24px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}>
                  <Text style={{ color: "white", fontStyle: "italic", fontSize: 16 }}>
                    &ldquo;{founder.quote}&rdquo;
                  </Text>
                </div>
              )}
            </div>

            {/* Thông tin chi tiết */}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Bio */}
              {founder.bio && (
                <div>
                  <Title level={4} style={{ color: "#0D364C", marginBottom: 12 }}>
                    Giới thiệu
                  </Title>
                  <Paragraph style={{ color: "#666", lineHeight: 1.8, fontSize: 15 }}>
                    {founder.bio}
                  </Paragraph>
                </div>
              )}

              <Divider />

              {/* Contact Information */}
              {(founder.email || founder.phone) && (
                <div>
                  <Title level={4} style={{ color: "#0D364C", marginBottom: 16 }}>
                    Thông tin liên hệ
                  </Title>
                  <Row gutter={[16, 16]}>
                    {founder.email && (
                      <Col xs={24} sm={12}>
                        <Space>
                          <MailOutlined style={{ color: "#13C2C2", fontSize: 20 }} />
                          <div>
                            <Text strong style={{ display: "block", color: "#0D364C" }}>
                              Email
                            </Text>
                            <a href={`mailto:${founder.email}`} style={{ color: "#13C2C2" }}>
                              {founder.email}
                            </a>
                          </div>
                        </Space>
                      </Col>
                    )}
                    {founder.phone && (
                      <Col xs={24} sm={12}>
                        <Space>
                          <PhoneOutlined style={{ color: "#13C2C2", fontSize: 20 }} />
                          <div>
                            <Text strong style={{ display: "block", color: "#0D364C" }}>
                              Điện thoại
                            </Text>
                            <a href={`tel:${founder.phone}`} style={{ color: "#13C2C2" }}>
                              {founder.phone}
                            </a>
                          </div>
                        </Space>
                      </Col>
                    )}
                  </Row>
                </div>
              )}

              {/* Social Media */}
              {founder.socialMedia &&
                (founder.socialMedia.facebook ||
                  founder.socialMedia.instagram ||
                  founder.socialMedia.twitter ||
                  founder.socialMedia.linkedin) && (
                  <>
                    <Divider />
                    <div>
                      <Title level={4} style={{ color: "#0D364C", marginBottom: 16 }}>
                        Mạng xã hội
                      </Title>
                      <Space size="large" wrap>
                        {founder.socialMedia.facebook && (
                          <a
                            href={founder.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 18, color: "#1877F2" }}
                          >
                            <Space>
                              <FacebookOutlined />
                              <Text>Facebook</Text>
                            </Space>
                          </a>
                        )}
                        {founder.socialMedia.instagram && (
                          <a
                            href={founder.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 18, color: "#E4405F" }}
                          >
                            <Space>
                              <InstagramOutlined />
                              <Text>Instagram</Text>
                            </Space>
                          </a>
                        )}
                        {founder.socialMedia.twitter && (
                          <a
                            href={founder.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 18, color: "#1DA1F2" }}
                          >
                            <Space>
                              <TwitterOutlined />
                              <Text>Twitter</Text>
                            </Space>
                          </a>
                        )}
                        {founder.socialMedia.linkedin && (
                          <a
                            href={founder.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 18, color: "#0077B5" }}
                          >
                            <Space>
                              <LinkedinOutlined />
                              <Text>LinkedIn</Text>
                            </Space>
                          </a>
                        )}
                      </Space>
                    </div>
                  </>
                )}

              {/* Achievements */}
              {founder.achievements && founder.achievements.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <Title level={4} style={{ color: "#0D364C", marginBottom: 16 }}>
                      <Space>
                        <TrophyOutlined style={{ color: "#FFD700" }} />
                        Thành tựu
                      </Space>
                    </Title>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                      {founder.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          style={{
                            padding: 16,
                            background: "#f5f5f5",
                            borderRadius: 8,
                            borderLeft: "4px solid #13C2C2",
                          }}
                        >
                          <Space direction="vertical" size="small" style={{ width: "100%" }}>
                            <div>
                              <Text strong style={{ fontSize: 16, color: "#0D364C" }}>
                                {achievement.title}
                              </Text>
                              {achievement.year && (
                                <Tag color="#13C2C2" style={{ marginLeft: 8 }}>
                                  {achievement.year}
                                </Tag>
                              )}
                            </div>
                            {achievement.description && (
                              <Text style={{ color: "#666", display: "block" }}>
                                {achievement.description}
                              </Text>
                            )}
                          </Space>
                        </div>
                      ))}
                    </Space>
                  </div>
                </>
              )}
            </Space>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

ShowFounderDetails.propTypes = {
  visible: PropTypes.bool.isRequired,
  founderId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

ShowFounderDetails.defaultProps = {
  founderId: null,
};

export default ShowFounderDetails;

