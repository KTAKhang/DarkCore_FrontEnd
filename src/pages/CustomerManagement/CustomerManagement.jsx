import { Card, Table, Button, Tag, Space, Typography, Statistic, Row, Col, Badge, Avatar, Tooltip, Spin, message } from "antd";
import { EditOutlined, EyeOutlined, ShoppingCartOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

import {
  getAllCustomersRequest
} from "../../redux/actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
const CustomerManagement = () => {
  const { customers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCustomersRequest());

  }, [dispatch]);

  console.log("Fetching customers...", customers.user);
  // Dữ liệu demo
  const displayStats = {
    total: 120,
    active: 85,
    inactive: 35,
  };

  const dataSource = [
    {
      _id: "SP001",
      name: "Sản phẩm A",
      categoryDetail: { name: "Điện thoại", status: true },
      price: 1200000,
      createdAt: new Date(),
      status: true,
      image: "",
    },
    {
      _id: "SP002",
      name: "Sản phẩm B",
      categoryDetail: { name: "Laptop", status: false },
      price: 25000000,
      createdAt: new Date(),
      status: false,
      image: "",
    },
  ];

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} icon={<ShoppingCartOutlined />} style={{ backgroundColor: "#13C2C2" }} onError={() => false} />
          <div>
            <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>
              {record.name}
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: 12, cursor: "pointer" }}
              onClick={() => {
                navigator.clipboard.writeText(record._id);
                message.success("Đã copy ID vào clipboard");
              }}
              title="Click để copy ID"
            >
              <ShoppingCartOutlined style={{ marginRight: 4 }} />ID: {record._id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#0D364C", display: "block", fontSize: 14 }}>{record.categoryDetail?.name || "N/A"}</Text>
          {record.categoryDetail && (
            <Tag color={record.categoryDetail.status ? "#52c41a" : "#ff4d4f"} style={{ fontSize: 11, marginTop: 4 }}>
              {record.categoryDetail.status ? "Hoạt động" : "Ngừng hoạt động"}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Tag color="#13C2C2" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}>
          {(price || 0).toLocaleString("vi-VN")}đ
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <div>
          <Text style={{ color: "#0D364C", fontSize: 14, display: "block" }}>
            {createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "N/A"}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {createdAt ? new Date(createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status ? "success" : "error"}
          text={
            <Tag color={status ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
              {status ? "Hiển thị" : "Ẩn"}
            </Tag>
          }
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} style={{ color: "#13C2C2" }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} style={{ color: "#0D364C" }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={false} size="small">
              <Statistic
                title={<Text style={{ color: "#0D364C" }}>Tổng sản phẩm</Text>}
                value={displayStats.total}
                prefix={<ShoppingCartOutlined style={{ color: "#13C2C2" }} />}
                valueStyle={{ color: "#13C2C2", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={false} size="small">
              <Statistic
                title={<Text style={{ color: "#0D364C" }}>Đang hiển thị</Text>}
                value={displayStats.active}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={false} size="small">
              <Statistic
                title={<Text style={{ color: "#0D364C" }}>Đang ẩn</Text>}
                value={displayStats.inactive}
                prefix={<StopOutlined style={{ color: "#ff4d4f" }} />}
                valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Bảng sản phẩm */}
      <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
        <Table columns={columns} dataSource={dataSource} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default CustomerManagement;
