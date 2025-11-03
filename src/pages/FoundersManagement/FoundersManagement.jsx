import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Typography,
  InputNumber,
  Avatar,
  Tooltip,
  Spin,
  Input,
  Select,
  Alert,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  founderListRequest,
  founderDeleteRequest,
  founderUpdateSortOrderRequest,
  founderClearMessages,
} from "../../redux/actions/founderActions";
import CreateFounderModal from "./CreateFounderModal";
import UpdateFounderModal from "./UpdateFounderModal";
import ViewDetailsFounderModal from "./ViewDetailsFounderModal";
import DeleteFounderModal from "./DeleteFounderModal";

const { Title, Text } = Typography;

const FoundersManagement = () => {
  const dispatch = useDispatch();
  const { items: founders, loadingList, deleting, message: successMessage, error, pagination: apiPagination } = useSelector((state) => state.founder);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3 });

  // Load data with filters and pagination
  const loadFounders = useCallback((paginationParams = {}) => {
    const params = {
      page: paginationParams.page || pagination.current,
      limit: paginationParams.limit || pagination.pageSize,
    };
    
    if (searchText) params.search = searchText;
    if (statusFilter !== "all") params.status = statusFilter;
    
    dispatch(founderListRequest(params));
  }, [dispatch, searchText, statusFilter, pagination]);

  // Load data on mount
  useEffect(() => {
    loadFounders({ page: 1 });
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload when filters change
  useEffect(() => {
    setPagination({ current: 1, pageSize: pagination.pageSize });
    loadFounders({ page: 1 });
  }, [searchText, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle success/error messages - Toast từ saga đã xử lý, chỉ cần reload và clear
  useEffect(() => {
    if (successMessage) {
      dispatch(founderClearMessages());
      // Đóng delete modal nếu đang mở
      if (isDeleteModalVisible) {
        setIsDeleteModalVisible(false);
        setSelectedFounder(null);
      }
      // Reload với current pagination và filters
      loadFounders();
    }
    if (error) {
      dispatch(founderClearMessages());
    }
  }, [successMessage, error, dispatch, isDeleteModalVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleEdit = (founder) => {
    setSelectedFounder(founder);
    setIsUpdateModalVisible(true);
  };

  const handleViewDetail = (founder) => {
    setSelectedFounder(founder);
    setIsViewDetailModalVisible(true);
  };

  const handleDeleteClick = (founder) => {
    setSelectedFounder(founder);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFounder) {
      dispatch(founderDeleteRequest(selectedFounder._id));
      // Không đóng modal ngay, để success/error message xử lý
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedFounder(null);
  };

  const handleSortOrderChange = (id, newSortOrder) => {
    dispatch(founderUpdateSortOrderRequest(id, newSortOrder));
  };

  const handleRefresh = () => {
    loadFounders();
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter("all");
  };

  // Check if has active filters
  const hasActiveFilters = searchText.trim() || statusFilter !== "all";

  const getFilterSummary = () => {
    const activeFilters = [];
    if (statusFilter !== "all") {
      activeFilters.push(`Trạng thái: ${statusFilter ? "Đang hiển thị" : "Đang ẩn"}`);
    }
    if (searchText.trim()) {
      activeFilters.push(`Tìm kiếm: "${searchText.trim()}"`);
    }
    return activeFilters.join(" • ");
  };

  const handleCreateModalClose = useCallback(() => {
    setIsCreateModalVisible(false);
  }, []);

  const handleUpdateModalClose = useCallback(() => {
    setIsUpdateModalVisible(false);
    setSelectedFounder(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setSelectedFounder(null);
    loadFounders();
  }, [loadFounders]);

  const columns = [
    {
      title: "Founder",
      key: "founder",
      render: (_, record) => (
        <Space>
          <Avatar
            size={50}
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#13C2C2" }}
          />
          <div>
            <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>{record.fullName}</Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{record.position}</Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Thứ tự hiển thị",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 180,
      render: (sortOrder, record) => (
        <Space>
          <Tooltip title="Giảm thứ tự">
            <Button
              size="small"
              icon={<ArrowUpOutlined />}
              onClick={() => handleSortOrderChange(record._id, sortOrder - 1)}
              disabled={sortOrder <= 1}
              style={{ color: "#13C2C2", borderColor: "#13C2C2" }}
            />
          </Tooltip>
          <InputNumber
            min={1}
            precision={0}
            value={sortOrder}
            onChange={(value) => handleSortOrderChange(record._id, value)}
            style={{ width: 70 }}
          />
          <Tooltip title="Tăng thứ tự">
            <Button
              size="small"
              icon={<ArrowDownOutlined />}
              onClick={() => handleSortOrderChange(record._id, sortOrder + 1)}
              style={{ color: "#13C2C2", borderColor: "#13C2C2" }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      render: (_, record) => (
        <Tag 
          color={record.status ? "#52c41a" : "#ff4d4f"} 
          icon={record.status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
        >
          {record.status ? "Hiển thị" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      fixed: 'right',
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
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#0D364C" }}
            />
          </Tooltip>
          <Tooltip title="Xóa vĩnh viễn">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record)}
              loading={deleting}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<UserOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Founders</Title></Space>}>
        {/* Toolbar */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên founder..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 320, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo trạng thái"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value={true}>Đang hiển thị</Select.Option>
              <Select.Option value={false}>Đang ẩn</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button 
              onClick={handleRefresh} 
              icon={<ReloadOutlined />} 
              loading={loadingList} 
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
              Thêm Founder
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
                onClick={handleClearFilters}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

          {/* Table */}
          <Spin spinning={loadingList} tip="Đang tải founders...">
            <Table
              columns={columns}
              dataSource={founders}
              rowKey="_id"
              pagination={{
                current: apiPagination?.currentPage || pagination.current,
                pageSize: apiPagination?.limit || pagination.pageSize,
                total: apiPagination?.total || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showTotal: (total, range) => (
                  <Text style={{ color: "#0D364C" }}>
                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} founders
                    {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
                  </Text>
                ),
                onChange: (page, pageSize) => {
                  setPagination({ current: page, pageSize });
                  loadFounders({ page, limit: pageSize });
                },
                onShowSizeChange: (current, size) => {
                  setPagination({ current, pageSize: size });
                  loadFounders({ page: current, limit: size });
                },
              }}
              scroll={{ x: 1200 }}
              style={{ borderRadius: 12, overflow: "hidden" }}
              size="middle"
              locale={{
                emptyText: "Không có dữ liệu founders"
              }}
            />
          </Spin>
      </Card>

      <CreateFounderModal
        visible={isCreateModalVisible}
        onClose={handleCreateModalClose}
        onSuccess={handleModalSuccess}
      />

      <UpdateFounderModal
        visible={isUpdateModalVisible}
        onClose={handleUpdateModalClose}
        onSuccess={handleModalSuccess}
        founder={selectedFounder}
      />

      <ViewDetailsFounderModal
        visible={isViewDetailModalVisible}
        onClose={() => {
          setIsViewDetailModalVisible(false);
          setSelectedFounder(null);
        }}
        founder={selectedFounder}
        loading={loadingList}
      />

      <DeleteFounderModal
        visible={isDeleteModalVisible}
        founder={selectedFounder}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
    </div>
  );
};

export default FoundersManagement;

