import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  Spin,
  Select,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

import {
  contactListRequest,
  contactStatsRequest,
  contactUpdateRequest,
} from "../../redux/actions/contactActions";
import ContactDetailModel from "./ContactDetailModel";
import ContactUpdateModal from "./ContactUpdateModal";

// Destructure Typography components
const { Title, Text } = Typography;

// Object mapping status với màu sắc tương ứng trong Ant Design
const STATUS_COLORS = {
  Pending: "warning",   // Màu vàng cho đang chờ
  Resolved: "success",  // Màu xanh cho đã giải quyết
};

const ContactManagement = () => {
  // Hook để dispatch actions đến Redux store
  const dispatch = useDispatch();
  
  // Lấy các state từ Redux store
  const { list, stats, pagination: apiPagination, loadingList, updatingStatus } =
    useSelector((state) => state.contact);
  // list: danh sách contacts
  // stats: thống kê (total, pending, resolved)
  // apiPagination: thông tin phân trang từ API
  // loadingList: trạng thái đang loading danh sách
  // updatingStatus: trạng thái đang update status

  // State quản lý các bộ lọc tìm kiếm
  const [filters, setFilters] = useState({
    searchText: "",    // Text tìm kiếm theo tên, email, chủ đề
    status: "all",     // Lọc theo status (all/Pending/Resolved)
  });
  
  // State quản lý phân trang local (current page và page size)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  
  // State quản lý hiển thị modal xem chi tiết contact
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  
  // State quản lý hiển thị modal cập nhật contact
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  
  // State lưu contact đang được chọn để xem/cập nhật
  const [selectedContact, setSelectedContact] = useState(null);

  // Ref để lưu giá trị filters mà không trigger re-render
  // Dùng trong callback để tránh stale closure
  const filtersRef = useRef(filters);
  
  // Ref để lưu giá trị pagination
  const paginationRef = useRef(pagination);

  // Effect đồng bộ filtersRef với filters state
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  
  // Effect đồng bộ paginationRef với pagination state
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  /**
   * Hàm fetch danh sách contacts với params tùy chỉnh
   * useCallback để memoize function, tránh re-create mỗi lần render
   */
  const fetchContacts = useCallback(
    (params = {}) => {
      // Build query object từ pagination và params truyền vào
      const query = {
        page: paginationRef.current.current,
        limit: paginationRef.current.pageSize,
        ...params, // Spread params để override nếu cần
      };

      // Thêm filter status nếu không phải "all"
      if (filtersRef.current.status !== "all") {
        query.status = filtersRef.current.status;
      }

      // Thêm search text nếu có (sau khi trim)
      if (filtersRef.current.searchText.trim()) query.search = filtersRef.current.searchText.trim();
      
      // Dispatch action để fetch contacts
      dispatch(contactListRequest(query));
    },
    [dispatch] // Chỉ phụ thuộc vào dispatch
  );

  /**
   * Hàm fetch thống kê contacts
   */
  const fetchStats = useCallback(() => {
    dispatch(contactStatsRequest());
  }, [dispatch]);

  /**
   * Effect chạy 1 lần khi component mount
   * Fetch stats và contacts trang đầu tiên
   */
  useEffect(() => {
    fetchStats();
    fetchContacts({ page: 1 });
  }, []); // Empty dependency array = chỉ chạy khi mount

  /**
   * Effect chạy khi pagination thay đổi
   * Fetch lại contacts với page và pageSize mới
   */
  useEffect(() => {
    fetchContacts({ page: pagination.current, limit: pagination.pageSize });
  }, [pagination.current, pagination.pageSize]);

  /**
   * Effect chạy khi filters thay đổi
   * Debounce 500ms trước khi fetch để tránh gọi API liên tục khi user đang gõ
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Reset về trang 1 khi thay đổi filter
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchContacts({ page: 1 });
    }, 500); // Debounce 500ms
    
    // Cleanup function để clear timeout khi filters thay đổi lại trước khi timeout chạy
    return () => clearTimeout(timeout);
  }, [filters]); // Dependency: filters

  /**
   * Handler để refresh toàn bộ data
   * Reset về trang 1 và fetch lại stats + contacts
   */
  const handleRefresh = useCallback(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchStats();
    fetchContacts({ page: 1 });
  }, [fetchStats, fetchContacts]);

  /**
   * Handler mở modal xem chi tiết contact
   * @param {object} contact - Contact object cần xem
   */
  const handleOpenDetailModal = useCallback((contact) => {
    setSelectedContact(contact);
    setIsViewModalVisible(true);
  }, []);

  /**
   * Handler mở modal cập nhật contact
   * @param {object} contact - Contact object cần cập nhật
   */
  const handleOpenUpdateModal = useCallback((contact) => {
    setSelectedContact(contact);
    setIsUpdateModalVisible(true);
  }, []);

  /**
   * Handler xử lý cập nhật contact
   * @param {string} contactId - ID của contact cần update
   * @param {object} payload - Dữ liệu cập nhật (status, reply...)
   */
  const handleUpdateContact = useCallback(
    (contactId, payload) => {
      // Validation: kiểm tra có đủ dữ liệu không
      if (!contactId || !payload) {
        return;
      }
      
      // Dispatch action để update contact
      dispatch(contactUpdateRequest(contactId, payload));
      
      // Đóng modal và clear selected contact
      setIsUpdateModalVisible(false);
      setSelectedContact(null);
      
      // Sau 500ms thì fetch lại data để cập nhật UI
      setTimeout(() => {
        fetchContacts({ page: pagination.current });
        fetchStats();
      }, 500);
    },
    [dispatch, fetchContacts, fetchStats, pagination.current]
  );

  /**
   * Memo để tránh re-calculate contactItems mỗi lần render
   * Chỉ re-calculate khi list thay đổi
   */
  const contactItems = useMemo(() => {
    return list?.data || [];
  }, [list]);
  
  /**
   * Memo stats với default values nếu chưa có data
   */
  const displayStats = useMemo(
    () => stats || { total: 0, pending: 0, resolved: 0 },
    [stats]
  );

  /**
   * Memo định nghĩa các cột của table
   * Chỉ re-create khi dependencies thay đổi
   */
  const columns = useMemo(
    () => [
      // Cột hiển thị thông tin người gửi
      {
        title: "Người gửi",
        key: "user",
        render: (_, record) => (
          <Space>
            {/* Avatar của user */}
            <Avatar src={record.userId?.avatar} icon={<UserOutlined />} />
            <div>
              {/* Tên user */}
              <Text strong>{record.userId?.user_name}</Text>
              {/* Email user */}
              <div style={{ fontSize: 12, color: "#666" }}>{record.userId?.email}</div>
            </div>
          </Space>
        ),
      },
      // Cột hiển thị chủ đề và ticket ID
      {
        title: "Chủ đề",
        dataIndex: "subject",
        key: "subject",
        render: (text, record) => (
          <div>
            {/* Subject */}
            <Text strong style={{ color: "#0D364C" }}>{text}</Text>
            {/* Ticket ID */}
            <div style={{ fontSize: 12, color: "#999" }}>#{record.ticketId}</div>
          </div>
        ),
      },
      // Cột hiển thị loại vấn đề (reason)
      {
        title: "Loại vấn đề",
        dataIndex: "reason",
        key: "reason",
        render: (reason) => <Tag color="#13C2C2">{reason}</Tag>,
      },
      // Cột hiển thị trạng thái với màu sắc tương ứng
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Badge
            status={STATUS_COLORS[status] || "default"}
            text={
              <Tag
                // Màu tag dựa trên status
                color={
                  STATUS_COLORS[status] === "success"
                    ? "green"
                    : STATUS_COLORS[status] === "warning"
                    ? "gold"
                    : "volcano"
                }
                style={{ borderRadius: 12 }}
              >
                {status}
              </Tag>
            }
          />
        ),
      },
      // Cột hiển thị ngày tạo (date + time)
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => (
          <div>
            {/* Ngày */}
            <Text>{new Date(date).toLocaleDateString("vi-VN")}</Text>
            {/* Giờ */}
            <div style={{ fontSize: 12, color: "#999" }}>
              {new Date(date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ),
      },
      // Cột action buttons (xem chi tiết, cập nhật)
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Space>
            {/* Button xem chi tiết */}
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleOpenDetailModal(record)}
              style={{ color: "#13C2C2" }}
              title="Xem chi tiết"
            />
            {/* Button cập nhật */}
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleOpenUpdateModal(record)}
              loading={updatingStatus} // Loading khi đang update
              title="Cập nhật"
              style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}
            >
              Cập nhật
            </Button>
          </Space>
        ),
      },
    ],
    [handleOpenDetailModal, handleOpenUpdateModal, updatingStatus]
  );

  /**
   * Memo config pagination cho table
   * Kết hợp pagination từ API và local state
   */
  const tablePagination = useMemo(() => {
    const effectiveTotal = apiPagination?.total || 0;
    return {
      current: apiPagination?.page || pagination.current, // Page hiện tại
      pageSize: pagination.pageSize,                       // Số items per page
      total: effectiveTotal,                               // Tổng số items
      showSizeChanger: true,                               // Cho phép thay đổi pageSize
      pageSizeOptions: ["5", "10", "20"],                  // Options cho pageSize
      // Text hiển thị "X-Y của Z contact"
      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} contact`,
      // Handler khi change page hoặc pageSize
      onChange: (page, pageSize) => {
        setPagination({ current: page, pageSize });
      },
      // Handler khi thay đổi pageSize
      onShowSizeChange: (current, size) => {
        setPagination({ current: 1, pageSize: size }); // Reset về page 1
      },
    };
  }, [apiPagination, pagination]);

  /**
   * Effect đồng bộ pagination từ API về local state
   * Chỉ update nếu page từ API khác với local
   */
  useEffect(() => {
    if (apiPagination?.page && apiPagination.page !== pagination.current) {
      setPagination((prev) => ({ ...prev, current: apiPagination.page }));
    }
  }, [apiPagination?.page]);

  return (
    <div
      style={{
        padding: 24,
        background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Stats Cards Row - 3 cards hiển thị thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Card: Tổng Contact */}
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingList} size="small">
              <Statistic
                title={<span style={{ color: "#0D364C" }}>Tổng Contact</span>}
                value={displayStats.total}
                prefix={<AppstoreOutlined style={{ color: "#13C2C2" }} />}
                valueStyle={{ color: "#13C2C2", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
        
        {/* Card: Đang chờ xử lý (Pending) */}
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingList} size="small">
              <Statistic
                title={<span style={{ color: "#0D364C" }}>Đang chờ xử lý</span>}
                value={displayStats.pending}
                prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                valueStyle={{ color: "#faad14", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
        
        {/* Card: Đã xử lý (Resolved) */}
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingList} size="small">
              <Statistic
                title={<span style={{ color: "#0D364C" }}>Đã xử lý</span>}
                value={displayStats.resolved}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Main Card chứa table contacts */}
      <Card
        style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
        title={
          <Space>
            {/* Avatar icon */}
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<AppstoreOutlined />} />
            {/* Title */}
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Liên hệ (Contact)</Title>
          </Space>
        }
      >
        {/* Filter và Action Bar */}
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
          {/* Left side: Search và Filter */}
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            {/* Search input */}
            <Input
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
              value={filters.searchText}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchText: e.target.value }))}
              style={{ width: 300 }}
              allowClear // Nút X để clear search
            />
            {/* Status filter select */}
            <Select
              value={filters.status}
              onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
              style={{ width: 150 }}
              placeholder="Trạng thái"
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Resolved">Resolved</Select.Option>
            </Select>
          </Space>
          
          {/* Right side: Refresh button */}
          <Space>
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loadingList}
              style={{ borderColor: "#13C2C2", color: "#13C2C2" }}
            >
              Làm mới
            </Button>
          </Space>
        </div>

        {/* Table hiển thị danh sách contacts */}
        <Spin spinning={loadingList}>
          <Table
            rowKey={(record) => record._id || record.id} // Unique key cho mỗi row
            columns={columns}                             // Cấu hình các cột
            dataSource={contactItems}                     // Dữ liệu contacts
            pagination={tablePagination}                  // Cấu hình phân trang
            locale={{ emptyText: "Không có liên hệ nào" }} // Text khi không có data
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}                          // Enable horizontal scroll trên mobile
            size="middle"                                 // Kích thước table
          />
        </Spin>
      </Card>

      {/* Modal xem chi tiết contact */}
      {selectedContact && (
        <ContactDetailModel
          visible={isViewModalVisible}
          contactData={selectedContact}
          onClose={() => {
            setIsViewModalVisible(false);
            setSelectedContact(null);
          }}
        />
      )}

      {/* Modal cập nhật contact */}
      {selectedContact && (
        <ContactUpdateModal
          visible={isUpdateModalVisible}
          contactData={selectedContact}
          onClose={() => {
            setIsUpdateModalVisible(false);
            setSelectedContact(null);
          }}
          // Handler khi submit form update
          onSubmit={(payload) => {
            if (!selectedContact) return;
            // Lấy ID từ contact
            const contactId = selectedContact._id || selectedContact.id;
            if (!contactId) return;
            // Gọi handler update
            handleUpdateContact(contactId, payload);
          }}
          loading={updatingStatus}
        />
      )}
    </div>
  );
};

export default ContactManagement;