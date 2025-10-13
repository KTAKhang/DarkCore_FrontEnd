import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Button,
  Tag,
  Input,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Badge,
  Avatar,
  Tooltip,
  Spin,
  Select,
  Alert,
  message,
  Modal,
} from "antd";
import {
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getAllCustomersRequest,
  updateCustomerStatusRequest,
} from "../../redux/actions/customerAction";
import CustomerDetail from "../CustomerManagement/CustomerDetail";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const statusOptions = [
  { value: "all", label: "Tất cả status" },
  { value: "true", label: "Đang hiển thị" },
  { value: "false", label: "Đang ẩn" },
];
const googleOptions = [
  { value: "all", label: "Lọc theo Google" },
  { value: "true", label: "Có" },
  { value: "false", label: "Không" },
];
const sortOptions = [
  { value: "default", label: "Sắp xếp theo thời gian tạo" },
  { value: "desc", label: "Mới nhất" },
  { value: "asc", label: "Cũ nhất" },
];

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, error, updateStatusLoading } = useSelector((state) => state.customer);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [googleFilter, setGoogleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [loadingTable, setLoadingTable] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const displayStats = {
    total: customers?.total?.totalUser || 0,
    active: customers?.total?.totalActive || 0,
    inactive: customers?.total?.totalInactive || 0,
  };

  const hasActiveFilters = searchText.trim() || statusFilter !== "all" || googleFilter !== "all";
  const getFilterSummary = () => {
    const filters = [];
    if (statusFilter !== "all") {
      filters.push(`Trạng thái: ${statusFilter === "active" ? "Đang hiển thị" : "Đang ẩn"}`);
    }
    if (googleFilter !== "all") {
      filters.push(`Google: ${googleFilter === "true" ? "Có" : "Không"}`);
    }
    if (searchText.trim()) {
      filters.push(`Tìm kiếm: "${searchText.trim()}"`);
    }
    return filters.length > 0 ? filters.join(" • ") : "";
  };

  useEffect(() => {
    setLoadingTable(true);
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      sort: sortBy === "default" ? undefined : sortBy,
      search: searchText.trim() ? searchText.trim() : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      isGoogleAccount: googleFilter !== "all" ? googleFilter : undefined,
    };
    dispatch(getAllCustomersRequest(params));
    setTimeout(() => setLoadingTable(false), 400);
  }, [dispatch, searchText, statusFilter, googleFilter, sortBy, pagination]);

  const dataSource = useMemo(() => (customers?.user || []).map((item) => ({
    _id: item._id,
    name: item.user_name,
    email: item.email,
    phone: item.phone || "",
    status: item.status,
    createdAt: item.createdAt,
    image: item.avatar || "",
    isGoogleAccount: item.isGoogleAccount,
  })), [customers]);

  const handleToggleStatus = (customer) => {
    const newStatus = !customer.status;
    Modal.confirm({
      title: newStatus ? "Bạn có chắc muốn mở khóa tài khoản này?" : "Bạn có chắc muốn khóa tài khoản này?",
      content: newStatus
        ? "Tài khoản sẽ được mở khóa và có thể đăng nhập lại."
        : "Sau khi khóa, khách hàng sẽ không thể đăng nhập vào hệ thống. Bạn chắc chắn muốn thực hiện?",
      okText: newStatus ? "Mở khóa" : "Khóa",
      okType: newStatus ? "primary" : "danger",
      cancelText: "Hủy",
      onOk() {
        dispatch(updateCustomerStatusRequest(customer._id, newStatus));
      },
    });
  };

  const columns = [
    {
      title: "Thông tin khách hàng",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} alt="avatar" style={{ backgroundColor: "#13C2C2" }} />

          <div>
            <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12, cursor: "pointer" }}
              onClick={() => {
                navigator.clipboard.writeText(record._id);
                message.success("Đã copy ID vào clipboard");
              }}
              title="Click để copy ID"
            >
              <ShoppingCartOutlined style={{ marginRight: 4 }} />ID: {record._id}
            </Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <Tag color="#13C2C2" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}>
          {phone || "Chưa cập nhật"}
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
        <Tag color={status ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
          {status ? "Hiển thị" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: "Đăng nhập bằng Google",
      dataIndex: "isGoogleAccount",
      key: "isGoogleAccount",
      render: (isGoogleAccount) => (
        <Tag color={isGoogleAccount ? "#52c41a" : "#faad14"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
          {isGoogleAccount ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              style={{ color: "#13C2C2" }}
              onClick={() => {
                navigate(`/admin/customer/${record._id}`);
              }}
            />
          </Tooltip>
          <Tooltip title={record.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
            <Button
              type="text"
              icon={record.status ? <LockOutlined /> : <UnlockOutlined />}
              style={{ color: record.status ? "#ff4d4f" : "#52c41a" }}
              loading={updateStatusLoading}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];


  const totalUser = customers?.total?.totalUser || 0;

  const tablePagination = useMemo(() => ({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: totalUser,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    showTotal: (total, range) => (
      <Text style={{ color: "#0D364C" }}>
        Hiển thị {range[0]}-{range[1]} trong tổng số {total} khách hàng
        {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
      </Text>
    ),
    onChange: (page, pageSize) => {
      setPagination({ current: page, pageSize });
    },
    onShowSizeChange: (current, size) => {
      setPagination({ current, pageSize: size });
    },
  }), [pagination, totalUser, hasActiveFilters]);

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loading} size="small">
              <Statistic
                title={<Text style={{ color: "#0D364C" }}>Tổng Khách Hàng</Text>}
                value={displayStats.total}
                prefix={<ShoppingCartOutlined style={{ color: "#13C2C2" }} />}
                valueStyle={{ color: "#13C2C2", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loading} size="small">
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
            <Spin spinning={loading} size="small">
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

      <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<UserOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Khách hàng</Title></Space>}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên, email hoặc ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
              onSearch={(value) => setSearchText(value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              size="large"
              placeholder="Lọc theo trạng thái"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              {statusOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
            <Select
              value={googleFilter}
              onChange={setGoogleFilter}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo Google"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              {googleOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 200 }}
              size="large"
              placeholder="Sắp xếp"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              {sortOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />} loading={loadingTable} onClick={() => {
              setSearchText("");
              setStatusFilter("all");
              setGoogleFilter("all");
              setSortBy("default");
              setPagination({ current: 1, pageSize: 5 });
            }} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
          </Space>
        </div>

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

        {hasActiveFilters && (
          <Alert
            message={`Đang hiển thị kết quả đã lọc: ${getFilterSummary()}`}
            type="info"
            showIcon
            closable={false}
            style={{
              marginBottom: 16,
              borderColor: "#13C2C2",
              backgroundColor: "#f0fdff",
              border: "1px solid #13C2C220"
            }}
            action={
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("all");
                  setGoogleFilter("all");
                }}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={loadingTable || loading} tip={loading ? "Đang tải khách hàng..." : undefined}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataSource}
            pagination={tablePagination}
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}
            size="middle"
            locale={{
              emptyText: "Không tồn tại khách hàng nào!",
            }}
          />
        </Spin>
      </Card>
      {/* Modal chi tiết khách hàng */}
      <Modal
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={700}
        centered
        destroyOnClose
        title="Chi tiết khách hàng"
      >
        {selectedCustomer && (
          <CustomerDetail customer={selectedCustomer} onClose={() => setIsDetailModalVisible(false)} />
        )}
      </Modal>
    </div>
  );
};

export default CustomerManagement;
