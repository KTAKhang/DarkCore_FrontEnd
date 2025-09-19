import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { staffListRequest, updateStaffRequest } from "../../redux/actions/staffActions";
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

  // Load staff with current filters
  const loadStaff = useCallback((query = {}) => {
    const payload = {
      page: query.page ?? pageMeta.page ?? 1,
      limit: query.limit ?? pageMeta.limit ?? 10,
      sortBy: query.sortBy ?? sortBy,
      sortOrder: query.sortOrder ?? sortOrder,
    };
    if (query.status) payload.status = query.status;
    if (query.role) payload.role = query.role;
    if (query.keyword) payload.keyword = query.keyword;
    dispatch(staffListRequest(payload));
  }, [dispatch, pageMeta.page, pageMeta.limit, sortBy, sortOrder]);

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

  // Calculate stats
  const displayStats = {
    total: staff.length,
    active: staff.filter(s => s.status === "active").length,
    inactive: staff.filter(s => s.status === "inactive").length,
  };

  const handleCreate = () => {
    navigate("/admin/staff/create");
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
    const newStatus = record.status === "active" ? "inactive" : "active";
    dispatch(updateStaffRequest(record._id || record.id, { status: newStatus }));
    message.success(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} nhân viên ${record.user_name}`);
  };

  const handleViewDetail = (record) => {
    navigate(`/admin/staff/${record._id || record.id}`);
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
          const formatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
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
            status={status === "active" ? "success" : "error"}
            text={
              <Tag
                color={status === "active" ? "#52c41a" : "#ff4d4f"}
                icon={status === "active" ? <CheckCircleOutlined /> : <StopOutlined />}
                style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
              >
                {status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
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
            <Tooltip title={record.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}>
              <Button
                type="text"
                icon={record.status === "active" ? <StopOutlined /> : <CheckCircleOutlined />}
                onClick={() => handleStatusToggle(record)}
                style={{ color: record.status === "active" ? "#ff4d4f" : "#52c41a" }}
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
      </Card>
    </div>
  );
};

export default StaffManagement;
