import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { staffListRequest, staffCreateRequest, updateStaffRequest } from "../../redux/actions/staffActions";
import { useNavigate } from "react-router-dom";
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
  Spin,
  message,
  Select,
  Alert,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Modal, Form } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const StaffManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list = [], loading, pagination: pageMeta = { page: 1, limit: 10, total: 0 } } = useSelector((state) => state.staff || {});

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form] = Form.useForm();

  // Load staff with current filters
  const loadStaff = useCallback((query = {}) => {
    const payload = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      sortBy: query.sortBy ?? sortBy,
      sortOrder: query.sortOrder ?? sortOrder,
    };
    if (query.status) payload.status = query.status;
    if (query.role) payload.role = query.role;
    if (query.keyword) payload.keyword = query.keyword;
    dispatch(staffListRequest(payload));
  }, [dispatch, sortBy, sortOrder]);
  useEffect(() => {
    // Initial load
    loadStaff({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" });
  }, []);

  // Auto-load when filters change with debounce for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const query = {};
      let hasFilters = false;

      if (statusFilter !== "all") {
        query.status = statusFilter;
        hasFilters = true;
      }

      if (roleFilter !== "all") {
        query.role = roleFilter;
        hasFilters = true;
      }

      if (searchText.trim()) {
        query.keyword = searchText.trim();
        hasFilters = true;
      }

      loadStaff({ ...query, page: 1 });
    }, searchText.trim() ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchText, statusFilter, roleFilter, loadStaff]);

  // Debug check dữ liệu lấy từ Redux
  console.log("📌 Redux staff list:", list);

  const staff = useMemo(() => {
    return (list || []);
  }, [list]);

  const filteredStaff = staff;

  // Check if any filters are active
  const hasActiveFilters = searchText.trim() || statusFilter !== "all" || roleFilter !== "all";

  // Create filter summary text
  const getFilterSummary = () => {
    const filters = [];
    if (statusFilter !== "all") {
      filters.push(`Trạng thái: ${statusFilter === "active" ? "Hoạt động" : "Ngừng hoạt động"}`);
    }
    if (roleFilter !== "all") {
      filters.push(`Vai trò: ${roleFilter === "sales-staff" ? "Nhân viên bán hàng" : "Nhân viên sửa chữa"}`);
    }
    if (searchText.trim()) {
      filters.push(`Tìm kiếm: "${searchText.trim()}"`);
    }
    return filters.length > 0 ? filters.join(" • ") : "";
  };

  // Helpers to support both boolean and legacy string status values
  const isActive = (status) => status === true || status === "active";
  const toDisplayStatusText = (status) => (isActive(status) ? "Hoạt động" : "Ngừng hoạt động");

  // Calculate stats
  const displayStats = {
    total: staff.length,
    active: staff.filter(s => isActive(s.status)).length,
    inactive: staff.filter(s => !isActive(s.status)).length,
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  const handleRefresh = useCallback(() => {
    setLoadingRefresh(true);
    const query = { page: pageMeta.page, limit: pageMeta.limit, sortBy, sortOrder };
    if (statusFilter !== "all") query.status = statusFilter;
    if (roleFilter !== "all") query.role = roleFilter;
    if (searchText.trim()) query.keyword = searchText.trim();

    loadStaff(query);
    setTimeout(() => setLoadingRefresh(false), 450);
  }, [loadStaff, statusFilter, roleFilter, searchText, pageMeta.page, pageMeta.limit, sortBy, sortOrder]);

  const handleStatusToggle = (record) => {
    const current = record.status;
    const newStatus = typeof current === "boolean" ? !current : (current === "active" ? "inactive" : "active");
    dispatch(updateStaffRequest(record._id || record.id, { status: newStatus }));
    message.success(`Đã ${typeof newStatus === "boolean" ? (newStatus ? "kích hoạt" : "vô hiệu hóa") : (newStatus === "active" ? "kích hoạt" : "vô hiệu hóa")} nhân viên ${record.user_name}`);
  };

  const handleViewDetail = (record) => {
    setSelectedStaff(record);
    setIsDetailOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        title: "Thông tin nhân viên",
        key: "user_name",
        dataIndex: "user_name",
        sorter: true,
        render: (_, record, index) => (
          <Space>
            <Avatar
              size={50}
              src={record.avatar || ""}
              icon={<UserOutlined />}
              style={{
                backgroundColor: record.avatar ? "transparent" : "#13C2C2",
                border: record.avatar ? "1px solid #d9d9d9" : "none"
              }}
            />
            <div>
              <div style={{ color: "#0D364C", fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
                {record.user_name}
              </div>
              <div style={{ color: "#666", fontSize: 14, marginBottom: 4 }}>
                {record.email}
              </div>
              <div
                style={{ fontSize: 12, color: "#999", cursor: "pointer" }}
                onClick={() => {
                  navigator.clipboard.writeText(record._id || record.id);
                  message.success("Đã copy ID vào clipboard");
                }}
                title="Click để copy ID"
              >
                <UserOutlined style={{ marginRight: 4 }} />
                ID: {record._id || record.id}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (value) => {
          if (!value) return <span style={{ color: "#999" }}>N/A</span>;
          const d = new Date(value);
          const formatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
          return <span style={{ color: "#0D364C" }}>{formatted}</span>;
        }
      },
      {
        title: "Thông tin liên hệ",
        key: "contact",
        render: (_, record) => (
          <div>
            <div style={{ color: "#0D364C", fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
              📞 {record.phone || "N/A"}
            </div>
            <div style={{ color: "#666", fontSize: 12 }}>
              📍 {record.address || "N/A"}
            </div>
          </div>
        ),
      },
      {
        title: "Vai trò",
        dataIndex: "role_name",
        key: "role_name",
        render: (roleName) => (
          <Tag
            color={roleName === "sales-staff" ? "#13C2C2" : "#52c41a"}
            style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
          >
            {roleName === "sales-staff" ? "Nhân viên bán hàng" : "Nhân viên sửa chữa"}
          </Tag>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Badge
            status={isActive(status) ? "success" : "error"}
            text={
              <Tag
                color={isActive(status) ? "#52c41a" : "#ff4d4f"}
                icon={isActive(status) ? <CheckCircleOutlined /> : <StopOutlined />}
                style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
              >
                {toDisplayStatusText(status)}
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
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
                style={{ color: "#13C2C2" }}
              />
            </Tooltip>
            <Tooltip title={isActive(record.status) ? "Vô hiệu hóa" : "Kích hoạt"}>
              <Button
                type="text"
                icon={isActive(record.status) ? <StopOutlined /> : <CheckCircleOutlined />}
                onClick={() => handleStatusToggle(record)}
                style={{ color: isActive(record.status) ? "#ff4d4f" : "#52c41a" }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleViewDetail, handleStatusToggle]
  );

  const tablePagination = useMemo(
    () => ({
      current: pageMeta.page,
      pageSize: pageMeta.limit,
      total: pageMeta.total,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => (
        <span style={{ color: "#0D364C" }}>
          Hiển thị {range[0]}-{range[1]} trong tổng số {total} nhân viên
          {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
        </span>
      ),
    }),
    [pageMeta.page, pageMeta.limit, pageMeta.total, hasActiveFilters]
  );

  const handleTableChange = (paginationConfig, filters, sorter) => {
    const nextPage = paginationConfig.current || 1;
    const nextLimit = paginationConfig.pageSize || 10;
    let nextSortBy = sortBy;
    let nextSortOrder = sortOrder;
    const sortField = sorter?.columnKey || sorter?.field;
    if (sortField) {
      if (sortField === "user_name") nextSortBy = "name";
      else if (sortField === "createdAt") nextSortBy = "createdAt";
      nextSortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);

    const query = { page: nextPage, limit: nextLimit, sortBy: nextSortBy, sortOrder: nextSortOrder };
    if (statusFilter !== "all") query.status = statusFilter;
    if (roleFilter !== "all") query.role = roleFilter;
    if (searchText.trim()) query.keyword = searchText.trim();
    loadStaff(query);
  };

  return (
    <div
      style={{
        padding: 24,
        background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic
              title={<span style={{ color: "#0D364C" }}>Tổng nhân viên</span>}
              value={displayStats.total}
              prefix={<UserOutlined style={{ color: "#13C2C2" }} />}
              valueStyle={{ color: "#13C2C2", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic
              title={<span style={{ color: "#0D364C" }}>Đang hoạt động</span>}
              value={displayStats.active}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic
              title={<span style={{ color: "#0D364C" }}>Ngừng hoạt động</span>}
              value={displayStats.inactive}
              prefix={<StopOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
        title={
          <Space>
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<UserOutlined />} />
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Nhân viên</Title>
          </Space>
        }
      >
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
              onSearch={(value) => setSearchText(value)}
            />
            <Select
              value={sortBy === "createdAt" ? "createdAt" : "name"}
              onChange={(val) => {
                const nextSortBy = val;
                const nextSortOrder = val === "createdAt" ? "desc" : "asc";
                setSortBy(nextSortBy);
                setSortOrder(nextSortOrder);
                const query = { page: 1, limit: pageMeta.limit, sortBy: nextSortBy, sortOrder: nextSortOrder };
                if (statusFilter !== "all") query.status = statusFilter;
                if (roleFilter !== "all") query.role = roleFilter;
                if (searchText.trim()) query.keyword = searchText.trim();
                loadStaff(query);
              }}
              style={{ width: 200 }}
              size="large"
              placeholder="Sắp xếp"
            >
              <Select.Option value="createdAt">Sắp xếp: Ngày tạo (mới nhất)</Select.Option>
              <Select.Option value="name">Sắp xếp: Theo chữ cái (A→Z)</Select.Option>
            </Select>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo vai trò"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả vai trò</Select.Option>
              <Select.Option value="sales-staff">Nhân viên bán hàng</Select.Option>
              <Select.Option value="repair-staff">Nhân viên sửa chữa</Select.Option>
            </Select>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              size="large"
              placeholder="Lọc theo trạng thái"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loadingRefresh}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}
            >
              Thêm Nhân viên
            </Button>
          </Space>
        </div>

        {/* Filter status indicator */}
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
                  setRoleFilter("all");
                }}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={loading || loadingRefresh} tip={loading ? "Đang tải nhân viên..." : undefined}>
          <Table
            rowKey={(record) => record._id || record.id}
            columns={columns}
            dataSource={filteredStaff}
            pagination={tablePagination}
            onChange={handleTableChange}
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}
            size="middle"
            locale={{ emptyText: "Không có nhân viên nào" }}
          />
        </Spin>

        {/* Create Staff Modal */}
        <Modal
          open={isCreateOpen}
          title={null}
          onCancel={() => setIsCreateOpen(false)}
          footer={null}
          destroyOnClose
          width={720}
        >
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C220" }}>
            <Title level={3} style={{ marginTop: 0, color: "#0D364C" }}>Tạo nhân viên</Title>
            <Form form={form} layout="vertical" size="large" onFinish={(values) => {
              dispatch(staffCreateRequest(values));
              setIsCreateOpen(false);
              setTimeout(() => handleRefresh(), 600);
            }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="user_name" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }, { min: 3, message: "Họ tên phải có ít nhất 3 ký tự" }]}>
                    <Input placeholder="Nhập họ tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }, { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }]}>
                    <Input.Password placeholder="Mật khẩu" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" dependencies={["password"]} rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu" }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue("password") === value) return Promise.resolve(); return Promise.reject(new Error("Mật khẩu xác nhận không khớp!")); } })]}>
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }, { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có đúng 10 chữ số" }]}>
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }, { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" }]}>
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
                    <Select placeholder="Chọn vai trò">
                      <Select.Option value="sales-staff">Nhân viên bán hàng</Select.Option>
                      <Select.Option value="repair-staff">Nhân viên sửa chữa</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setIsCreateOpen(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">Tạo</Button>
              </Space>
            </Form>
          </Card>
        </Modal>

        {/* View Detail Modal */}
        <Modal
          open={isDetailOpen}
          title={null}
          onCancel={() => setIsDetailOpen(false)}
          footer={null}
          destroyOnClose
          width={800}
        >
          {selectedStaff && (
            <Card style={{ borderRadius: 12, border: "1px solid #13C2C220" }}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Space align="center">
                  <Avatar size={64} src={selectedStaff.avatar || ""} icon={<UserOutlined />} />
                  <div>
                    <Title level={3} style={{ margin: 0 }}>{selectedStaff.user_name}</Title>
                    <div>{selectedStaff.email}</div>
                  </div>
                </Space>
                <Row gutter={[16, 16]}>
                  <Col span={12}>📞 {selectedStaff.phone || "N/A"}</Col>
                  <Col span={12}>📍 {selectedStaff.address || "N/A"}</Col>
                  <Col span={12}>Vai trò: {selectedStaff.role_name}</Col>
                  <Col span={12}>Trạng thái: {toDisplayStatusText(selectedStaff.status)}</Col>
                </Row>
              </Space>
            </Card>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default StaffManagement;