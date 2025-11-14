import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Statistic,
  Tag,
  Progress,
  Alert,
  Tooltip,
  Divider,
  Spin,
} from "antd";
import {
  ReloadOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  StarFilled,
  WarningOutlined,
} from "@ant-design/icons";
import { fetchSaleStaffDashboardRequest } from "../../redux/actions/statisticsStaffActions";

const { Title, Text } = Typography;

const gradientPalette = {
  total: ["#13C2C2", "#0D364C"],
  pending: ["#faad14", "#d46b08"],
  completed: ["#52c41a", "#237804"],
  cancelled: ["#ff4d4f", "#a8071a"],
  reviews: ["#9254de", "#391085"],
};

const StatisticsStaff = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error, lastUpdated } = useSelector(
    (state) => state.statisticsStaff || {}
  );
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    dispatch(fetchSaleStaffDashboardRequest());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchSaleStaffDashboardRequest());
  };

  const orders = useMemo(() => dashboardData?.orders || {}, [dashboardData]);
  const reviews = useMemo(() => dashboardData?.reviews || {}, [dashboardData]);
  const ratingOverview = useMemo(() => reviews?.ratingOverview || {}, [reviews]);

  const orderCards = useMemo(
    () => [
      {
        key: "total",
        title: "Tổng đơn hàng",
        value: orders.total || 0,
        icon: <ShoppingCartOutlined style={{ fontSize: 28 }} />,
        palette: gradientPalette.total,
      },
      {
        key: "pending",
        title: "Đơn đang chờ",
        value: orders.pending || 0,
        icon: <ClockCircleOutlined style={{ fontSize: 28 }} />,
        palette: gradientPalette.pending,
      },
      {
        key: "completed",
        title: "Đơn đã giao",
        value: orders.completed || 0,
        icon: <CheckCircleOutlined style={{ fontSize: 28 }} />,
        palette: gradientPalette.completed,
      },
      {
        key: "cancelled",
        title: "Đơn bị hủy",
        value: orders.cancelled || 0,
        icon: <CloseCircleOutlined style={{ fontSize: 28 }} />,
        palette: gradientPalette.cancelled,
      },
    ],
    [orders]
  );

  const reviewBadges = useMemo(
    () => [
      {
        label: "Tổng đánh giá",
        value: reviews.total || 0,
        color: "processing",
      },
      {
        label: "Đang ẩn",
        value: reviews.pending || 0,
        color: "warning",
      },
      {
        label: "Bị báo cáo",
        value: reviews.reported || 0,
        color: "error",
      },
    ],
    [reviews]
  );

  const ratingPercent = ratingOverview.average
    ? Math.min(100, Math.round((ratingOverview.average / (ratingOverview.scale || 5)) * 100))
    : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)",
      }}
    >
      <Card
        style={{
          borderRadius: 20,
          border: "none",
          marginBottom: 24,
          boxShadow: "0 15px 40px rgba(13, 54, 76, 0.12)",
          background: "linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)",
          color: "#fff",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ color: "white", margin: 0 }}>
              Dashboard Nhân Viên Bán Hàng
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.7)" }}>
              Cập nhật hoạt động đơn hàng và đánh giá từ khách hàng
            </Text>
          </Col>
          <Col>
            <Space>
              {lastUpdated && (
                <Tooltip title="Thời điểm tải dữ liệu gần nhất">
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Lần cập nhật: {new Date(lastUpdated).toLocaleString("vi-VN")}
                  </Text>
                </Tooltip>
              )}
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                style={{
                  borderColor: "#fff",
                  color: "#0D364C",
                  backgroundColor: "#fff",
                }}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {error && (
        <Alert
          type="error"
          message="Không thể tải dữ liệu thống kê"
          description={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={loading}>
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {orderCards.map((card) => (
            <Col xs={24} sm={12} lg={6} key={card.key}>
              <Card
                onMouseEnter={() => setHoveredCard(card.key)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  borderRadius: 20,
                  border: "none",
                  background: `linear-gradient(135deg, ${card.palette[0]} 0%, ${card.palette[1]} 100%)`,
                  color: "white",
                  boxShadow:
                    hoveredCard === card.key
                      ? `0 20px 40px ${card.palette[0]}30`
                      : "0 8px 24px rgba(0,0,0,0.15)",
                  transform: hoveredCard === card.key ? "translateY(-6px)" : "translateY(0)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                  <div>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                      {card.title}
                    </Text>
                    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
                      {card.value.toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    {card.icon}
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card
              title="Chi tiết đơn hàng"
              extra={
                <Tag color="blue" icon={<ShoppingCartOutlined />}>
                  Theo dõi trạng thái
                </Tag>
              }
              style={{ borderRadius: 18 }}
              bodyStyle={{ padding: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Tỷ lệ hoàn thành"
                    value={
                      orders.total
                        ? ((orders.completed || 0) / orders.total) * 100
                        : 0
                    }
                    precision={1}
                    suffix="%"
                  />
                  <Progress
                    percent={
                      orders.total
                        ? Math.min(100, Math.round(((orders.completed || 0) / orders.total) * 100))
                        : 0
                    }
                    status="success"
                    strokeColor="#52c41a"
                    style={{ marginTop: 8 }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Tỷ lệ bị hủy"
                    value={
                      orders.total
                        ? ((orders.cancelled || 0) / orders.total) * 100
                        : 0
                    }
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                  <Progress
                    percent={
                      orders.total
                        ? Math.min(100, Math.round(((orders.cancelled || 0) / orders.total) * 100))
                        : 0
                    }
                    strokeColor="#ff4d4f"
                    style={{ marginTop: 8 }}
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card
                    style={{ borderRadius: 14, textAlign: "center" }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <ClockCircleOutlined style={{ fontSize: 28, color: "#faad14" }} />
                    <Text style={{ display: "block", marginTop: 8, color: "#6b7280" }}>
                      Đơn chờ xử lý
                    </Text>
                    <Title level={3} style={{ margin: 0 }}>
                      {orders.pending || 0}
                    </Title>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card
                    style={{ borderRadius: 14, textAlign: "center" }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <CheckCircleOutlined style={{ fontSize: 28, color: "#52c41a" }} />
                    <Text style={{ display: "block", marginTop: 8, color: "#6b7280" }}>
                      Đơn đã giao
                    </Text>
                    <Title level={3} style={{ margin: 0 }}>
                      {orders.completed || 0}
                    </Title>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card
                    style={{ borderRadius: 14, textAlign: "center" }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <CloseCircleOutlined style={{ fontSize: 28, color: "#ff4d4f" }} />
                    <Text style={{ display: "block", marginTop: 8, color: "#6b7280" }}>
                      Đơn hủy mới
                    </Text>
                    <Title level={3} style={{ margin: 0 }}>
                      {orders.cancelled || 0}
                    </Title>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card
              title="Phản hồi của khách hàng"
              extra={
                <Tag color="purple" icon={<MessageOutlined />}>
                  Đánh giá & báo cáo
                </Tag>
              }
              style={{ borderRadius: 18 }}
              bodyStyle={{ padding: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12} style={{ textAlign: "center" }}>
                  <Progress
                    type="dashboard"
                    percent={ratingPercent}
                    width={150}
                    strokeColor={{
                      "0%": gradientPalette.reviews[0],
                      "100%": gradientPalette.reviews[1],
                    }}
                    format={() => (
                      <div>
                        <StarFilled style={{ color: "#fadb14", fontSize: 26 }} />
                        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>
                          {ratingOverview.average ? ratingOverview.average.toFixed(1) : "0.0"}
                        </div>
                        <Text style={{ color: "#6b7280", fontSize: 12 }}>
                          / {ratingOverview.scale || 5} sao
                        </Text>
                      </div>
                    )}
                  />
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {reviewBadges.map((badge) => (
                      <Card
                        key={badge.label}
                        size="small"
                        style={{ borderRadius: 12 }}
                        bodyStyle={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text>{badge.label}</Text>
                        <Tag color={badge.color}>{badge.value}</Tag>
                      </Card>
                    ))}
                  </Space>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card style={{ borderRadius: 14 }} bodyStyle={{ padding: 16 }}>
                    <Text style={{ color: "#6b7280" }}>Đánh giá hôm nay</Text>
                    <Title level={3} style={{ margin: "4px 0" }}>
                      {ratingOverview.reviewsToday || 0}
                    </Title>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ borderRadius: 14 }} bodyStyle={{ padding: 16 }}>
                    <Text style={{ color: "#6b7280" }}>Đánh giá tuần này</Text>
                    <Title level={3} style={{ margin: "4px 0" }}>
                      {ratingOverview.reviewsThisWeek || 0}
                    </Title>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>

      {!loading && !error && !dashboardData && (
        <Alert
          type="info"
          message="Chưa có dữ liệu thống kê"
          description="Hệ thống chưa ghi nhận đơn hàng hoặc đánh giá nào để hiển thị."
          showIcon
          icon={<WarningOutlined />}
        />
      )}
    </div>
  );
};

export default StatisticsStaff;
