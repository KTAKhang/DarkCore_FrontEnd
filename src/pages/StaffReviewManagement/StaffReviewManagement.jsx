import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Avatar,
  Tooltip,
  Spin,
  Input,
  Select,
  Alert,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CommentOutlined,
  StarOutlined,
  FileTextOutlined,
  UserOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  getAllReviewsForStaffRequest,
  clearReviewStaffMessages,
  getReviewDetailStaffRequest,
} from "../../redux/actions/reviewStaffActions";
import StaffReviewDetail from "./StaffReviewDetail";
import StaffReviewUpdate from "./StaffReviewUpdate";

const { Title, Text } = Typography;

const StaffReviewManagement = () => {
  const dispatch = useDispatch();
  const { reviews, pagination, loading, error } = useSelector((state) => state.reviewStaff);
  const { updateStatusLoading, updateStatusError, updatedStatusData } = useSelector((state) => ({
    updateStatusLoading: state.reviewStaff?.updateStatusLoading,
    updateStatusError: state.reviewStaff?.updateStatusError,
    updatedStatusData: state.reviewStaff?.updatedStatusData,
  }));

  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [tablePagination, setTablePagination] = useState({ current: 1, pageSize: 5 });
  const paginationRef = useRef(tablePagination);

  useEffect(() => {
    paginationRef.current = tablePagination;
  }, [tablePagination]);

  // Load data with filters and pagination
  const loadReviews = useCallback(
    (paginationParams = {}) => {
      const currentPagination = paginationRef.current;
      const params = {
        page: paginationParams.page || currentPagination.current,
        limit: paginationParams.limit || currentPagination.pageSize,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (ratingFilter !== "all") {
        params.rating = parseInt(ratingFilter, 10);
      }
      if (searchKeyword) {
        params.search = searchKeyword;
      }

      const sortMap = {
        newest: "desc",
        oldest: "asc",
      };
      const sortValue = sortMap[sortOption];
      if (sortValue) {
        params.sort = sortValue;
      }

      dispatch(getAllReviewsForStaffRequest(params));
    },
    [dispatch, statusFilter, ratingFilter, searchKeyword, sortOption]
  );

  // Load data on mount
  useEffect(() => {
    loadReviews({ page: 1 });
  }, [loadReviews]);

  // Reload when filters change
  useEffect(() => {
    setTablePagination((prev) => ({ ...prev, current: 1 }));
    loadReviews({ page: 1 });
  }, [statusFilter, ratingFilter, sortOption, searchKeyword, loadReviews]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchKeyword(searchInput.trim());
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reload data after successful update
  useEffect(() => {
    if (updatedStatusData) {
      dispatch(clearReviewStaffMessages());
      loadReviews({ page: paginationRef.current.current });
    }
    if (updateStatusError) {
      dispatch(clearReviewStaffMessages());
    }
  }, [updatedStatusData, updateStatusError, dispatch, loadReviews]);

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setIsDetailModalVisible(true);
    dispatch(getReviewDetailStaffRequest(review._id));
  };

  const handleRefresh = () => {
    loadReviews({ page: paginationRef.current.current });
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    setSearchKeyword(value.trim());
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleRatingFilterChange = (value) => {
    setRatingFilter(value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchKeyword("");
    setStatusFilter("all");
    setRatingFilter("all");
    setSortOption("default");
  };

  // Check if has active filters
  const hasActiveFilters =
    statusFilter !== "all" || ratingFilter !== "all" || searchKeyword || sortOption !== "default";

  const getFilterSummary = () => {
    const activeFilters = [];
    if (statusFilter !== "all") {
      activeFilters.push(`Trạng thái: ${statusFilter === "true" || statusFilter === true ? "Đang hiển thị" : "Đang ẩn"}`);
    }
    if (ratingFilter !== "all") {
      activeFilters.push(`Số sao: ${ratingFilter} sao`);
    }
    if (sortOption !== "default") {
      const sortLabel = sortOption === "oldest" ? "Cũ nhất" : "Mới nhất";
      activeFilters.push(`Sắp xếp: ${sortLabel}`);
    }
    if (searchKeyword) {
      activeFilters.push(`Tìm kiếm: "${searchKeyword}"`);
    }
    return activeFilters.join(" • ");
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarOutlined
        key={i}
        style={{
          color: i < rating ? "#fadb14" : "#d9d9d9",
          fontSize: 16,
        }}
      />
    ));
  };

  const columns = [
    {
      title: "ID",
      key: "review_id",
      width: 120,
      render: (_, record) => (
        <Text
          type="secondary"
          style={{ fontSize: 12, cursor: "pointer" }}
          onClick={() => {
            navigator.clipboard.writeText(record._id);
            toast.success("Đã copy ID vào clipboard");
          }}
          title={`Click để copy ID: ${record._id}`}
        >
          <FileTextOutlined style={{ marginRight: 4 }} />
          {record._id.slice(0, 8)}...
        </Text>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        const product = record.product_id || {};
        const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
        return (
          <Space>
            {productImage && (
              <Avatar
                shape="square"
                size={40}
                src={typeof productImage === "string" ? productImage : productImage.url}
                icon={<ShoppingOutlined />}
              />
            )}
            <div>
              <Text strong style={{ color: "#0D364C", display: "block" }}>
                {product.name || "N/A"}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Người đánh giá",
      key: "user",
      render: (_, record) => {
        const user = record.user_id || {};
        return (
          <Space>
            <Avatar
              size={40}
              src={user.avatar}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#13C2C2" }}
            />
            <div>
              <Text strong style={{ color: "#0D364C", display: "block" }}>
                {user.user_name || "N/A"}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.email || "N/A"}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 150,
      render: (_, record) => (
        <Space>
          {renderStars(record.rating)}
          <Text strong style={{ color: "#0D364C" }}>
            {record.rating}/5
          </Text>
        </Space>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "review_content",
      key: "content",
      ellipsis: true,
      render: (text) => (
        <Text ellipsis={{ tooltip: text || "—" }} style={{ maxWidth: 200 }}>
          {text || "—"}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => (
        <Tag
          color={status ? "#52c41a" : "#ff4d4f"}
          icon={status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
        >
          {status ? "Hiển thị" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "N/A"),
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
          <StaffReviewUpdate review={record} loading={updateStatusLoading} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Card
        style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
        title={
          <Space>
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<CommentOutlined />} />
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>
              Quản lý Đánh giá Sản phẩm
            </Title>
          </Space>
        }
      >
        {/* Toolbar */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Tìm kiếm theo sản phẩm, người dùng, email, nội dung..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 360, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
            />
            <Select
              value={ratingFilter}
              onChange={handleRatingFilterChange}
              style={{ width: 150 }}
              size="large"
              placeholder="Lọc sao"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả sao</Select.Option>
              <Select.Option value="5">5 sao</Select.Option>
              <Select.Option value="4">4 sao</Select.Option>
              <Select.Option value="3">3 sao</Select.Option>
              <Select.Option value="2">2 sao</Select.Option>
              <Select.Option value="1">1 sao</Select.Option>
            </Select>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc trạng thái"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="true">Đang hiển thị</Select.Option>
              <Select.Option value="false">Đang ẩn</Select.Option>
            </Select>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              style={{ width: 200 }}
              size="large"
              placeholder="Sắp xếp"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="default">Mặc định</Select.Option>
              <Select.Option value="newest">Mới nhất</Select.Option>
              <Select.Option value="oldest">Cũ nhất</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loading}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Làm mới
            </Button>
          </Space>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

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
        <Spin spinning={loading} tip="Đang tải đánh giá...">
          <Table
            columns={columns}
            dataSource={reviews}
            rowKey="_id"
            pagination={{
              current: pagination?.page || tablePagination.current,
              pageSize: pagination?.limit || tablePagination.pageSize,
              total: pagination?.total || 0,
              showSizeChanger: false,
              showQuickJumper: true,
              pageSizeOptions: ["5"],
              showTotal: (total, range) => (
                <Text style={{ color: "#0D364C" }}>
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} đánh giá
                  {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
                </Text>
              ),
              onChange: (page, pageSize) => {
                setTablePagination({ current: page, pageSize });
                loadReviews({ page, limit: pageSize });
              },
              onShowSizeChange: (current, size) => {
                setTablePagination({ current, pageSize: size });
                loadReviews({ page: current, limit: size });
              },
            }}
            scroll={{ x: 1200 }}
            style={{ borderRadius: 12, overflow: "hidden" }}
            size="middle"
            locale={{
              emptyText: "Không có đánh giá nào"
            }}
          />
        </Spin>
      </Card>

      {/* Detail Modal */}
      <StaffReviewDetail
        visible={isDetailModalVisible}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
      />
    </div>
  );
};

export default StaffReviewManagement;

