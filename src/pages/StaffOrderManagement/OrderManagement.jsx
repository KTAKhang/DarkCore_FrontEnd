import { useState, useCallback, useEffect, useRef } from "react";
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
  Avatar,
  Tooltip,
  Spin,
  Select,
  Alert,
  message,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import UpdateOrder from "./UpdateOrder";
import ViewOrderDetail from "./ViewOrderDetail";
import {
  staffOrderListRequest,
  staffOrderStatsRequest,
  staffOrderStatusesRequest,
  staffOrderUpdateStatusRequest,
  staffOrderDetailRequest,
  staffOrderClearMessages,
} from "../../redux/actions/orderStaffAction";

const { Title, Text } = Typography;

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { items: orderItems, stats: orderStats, statuses, pagination: apiPagination, currentOrder, loadingList, loadingStats, loadingDetail, updating, error, success } = useSelector((state) => state.orderStaffReducer);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchText: "",
    status: "all"
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [sort, setSort] = useState({ sortBy: "createdat_desc" });

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);
  const sortRef = useRef(sort);

  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { paginationRef.current = pagination; }, [pagination]);
  useEffect(() => { sortRef.current = sort; }, [sort]);


  const fetchOrders = useCallback((params = {}) => {
    const currentFilters = filtersRef.current;
    const currentPagination = paginationRef.current;
    const currentSort = sortRef.current;
    const query = {
      page: currentPagination.current,
      limit: currentPagination.pageSize,
      sortBy: currentSort.sortBy,
      ...params
    };
    if (currentFilters.status !== "all") query.status = currentFilters.status;
    if (currentFilters.searchText.trim()) {
      query.search = currentFilters.searchText.trim();
    }
    dispatch(staffOrderListRequest(query));
  }, [dispatch]);


  useEffect(() => {
    // fetchOrders({ page: 1 });
    dispatch(staffOrderStatsRequest());
    dispatch(staffOrderStatusesRequest());
  }, []);


  useEffect(() => {
    if (success && success.includes("cập nhật thành công")) {
      const t = setTimeout(() => {
        fetchOrders();
        dispatch(staffOrderStatsRequest());
        dispatch(staffOrderClearMessages());
      }, 100);
      return () => clearTimeout(t);
    }
  }, [success]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders({ page: 1 });
    }, filters.searchText.trim() ? 800 : 0);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchOrders]);



  useEffect(() => {
    fetchOrders({ page: 1 });
  }, [sort, fetchOrders]);

  const getStatusInfo = useCallback((orderStatusId) => {
    if (!orderStatusId || !statuses || statuses.length === 0) {
      return { name: "pending", color: "#faad14", description: "Chờ xác nhận" };
    }
    if (typeof orderStatusId === 'object' && orderStatusId.name) {
      return {
        name: orderStatusId.name,
        color: orderStatusId.color || "#faad14",
        description: orderStatusId.description || orderStatusId.name,
        id: orderStatusId._id
      };
    }

    const statusInfo = statuses.find(status => status._id === orderStatusId);
    if (statusInfo) {
      return {
        name: statusInfo.name,
        color: statusInfo.color || "#faad14",
        description: statusInfo.description || statusInfo.name,
        id: statusInfo._id
      };
    }

    return { name: "pending", color: "#faad14", description: "Chờ xác nhận" };
  }, [statuses]);


  const orders = (orderItems || []).map((order) => {
    const statusInfo = getStatusInfo(order.orderStatusId);

    return {
      ...order,
      customerName: order.receiverName || order.userId?.user_name || "N/A",
      customerEmail: order.userId?.email || "N/A",
      customerPhone: order.receiverPhone || order.userId?.phone || "N/A",
      customer: {
        _id: order.userId?._id,
        name: order.receiverName || order.userId?.user_name,
        email: order.userId?.email,
        phone: order.receiverPhone || order.userId?.phone
      },
      status: statusInfo.name,
      statusColor: statusInfo.color,
      statusId: statusInfo.id,
      statusDescription: statusInfo.description,
      totalAmount: order.totalPrice,
      totalPrice: order.totalPrice,
      itemsCount: order.orderDetails?.length || 0,
      items: order.orderDetails || [],
      shippingAddress: order.receiverAddress,
      receiverAddress: order.receiverAddress,
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee || 0,
      discount: order.discount || 0,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      cancelledReason: order.cancelledReason,
    };
  });

  const hasActiveFilters = filters.searchText.trim() || filters.status !== "all";


  const statusMap = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
    returned: "Trả hàng"
  };


  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== "all") {
      activeFilters.push(`Trạng thái: ${statusMap[filters.status] || filters.status}`);
    }
    if (filters.searchText.trim()) {
      activeFilters.push(`Tìm kiếm: "${filters.searchText.trim()}"`);
    }
    return activeFilters.join(" • ");
  };

  const displayStats = {
    total: orderStats?.total || 0,
    pending: orderStats?.pending || 0,
    confirmed: orderStats?.confirmed || 0,
    processing: orderStats?.processing || 0,
    shipped: orderStats?.shipped || 0,
    delivered: orderStats?.delivered || 0,
    cancelled: orderStats?.cancelled || 0,
    returned: orderStats?.returned || 0,
  };


  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchOrders({ page: 1 });
    dispatch(staffOrderStatsRequest());
    setTimeout(() => setLoading(false), 450);
  }, [dispatch, fetchOrders]);


  const handleOpenUpdateModal = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalVisible(true);
  };


  const handleOpenViewDetailModal = (order) => {
    setSelectedOrder(order);
    setIsViewDetailModalVisible(true);
    dispatch(staffOrderDetailRequest(order._id));
  };


  const handleUpdateSuccess = useCallback((updated) => {
    if (!updated?._id) return;
    dispatch(staffOrderUpdateStatusRequest(updated._id, {
      orderStatusId: updated.orderStatusId,

    }));
    setIsUpdateModalVisible(false);
    setSelectedOrder(null);
  }, [dispatch]);




  const handleSortChange = (value) => {
    const sortMap = {
      default: { sortBy: "createdat_asc" },
      cnewest: { sortBy: "createdat_desc" },
      coldest: { sortBy: "createdat_asc" },
      unewest: { sortBy: "updatedat_desc" },
      uoldest: { sortBy: "updatedat_asc" },
      high: { sortBy: "totalprice_desc" },
      low: { sortBy: "totalprice_asc" }
    };

    setSort(sortMap[value] || sortMap.default);
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { color: "#faad14", icon: <ClockCircleOutlined />, text: "Chờ xác nhận" },
      confirmed: { color: "#1890ff", icon: <CheckCircleOutlined />, text: "Đã xác nhận" },
      processing: { color: "#722ed1", icon: <ShoppingCartOutlined />, text: "Đang xử lý" },
      shipped: { color: "#1890ff", icon: <ShoppingCartOutlined />, text: "Đang giao" },
      delivered: { color: "#52c41a", icon: <CheckCircleOutlined />, text: "Đã giao" },
      cancelled: { color: "#ff4d4f", icon: <CloseCircleOutlined />, text: "Đã hủy" },
      returned: { color: "#fa8c16", icon: <CloseCircleOutlined />, text: "Trả hàng" },
      shipping: { color: "#1890ff", icon: <ShoppingCartOutlined />, text: "Đang giao" },
      completed: { color: "#52c41a", icon: <CheckCircleOutlined />, text: "Hoàn thành" }
    };
    return statusMap[status] || statusMap.pending;
  };


  const columns = [
    {
      title: "Đơn hàng",
      key: "order",
      render: (_, record) => (
        <Space>
          <Avatar icon={<FileTextOutlined />} style={{ backgroundColor: "#13C2C2" }} />
          <div>
            <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>{record.orderNumber}</Text>
            {/* Click để copy ID vào clipboard */}
            <Text type="secondary" style={{ fontSize: 12, cursor: "pointer" }} onClick={() => {
              navigator.clipboard.writeText(record._id);
              message.success("Đã copy ID vào clipboard");
            }} title="Click để copy ID">
              ID: {record._id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#0D364C", display: "block", fontSize: 14 }}>{record.customerName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.customerEmail}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{record.customerPhone}</Text>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Tag color="#13C2C2" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}>
          {(amount || 0).toLocaleString("vi-VN")}đ
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
            {createdAt ? new Date(createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => (
        <div>
          <Text style={{ color: "#0D364C", fontSize: 14, display: "block" }}>
            {updatedAt ? new Date(updatedAt).toLocaleDateString("vi-VN") : "N/A"}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {updatedAt ? new Date(updatedAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleOpenViewDetailModal(record)} style={{ color: "#13C2C2" }} />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} style={{ color: "#0D364C" }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tablePagination = {
    current: apiPagination?.page || pagination.current,
    pageSize: apiPagination?.limit || pagination.pageSize,
    total: apiPagination?.total || 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    showTotal: (total, range) => (
      <Text style={{ color: "#0D364C" }}>
        Hiển thị {range[0]}-{range[1]} trong tổng số {total} đơn hàng
        {hasActiveFilters && <span style={{ color: "#13C2C2" }}> (đã lọc)</span>}
      </Text>
    ),
    onChange: (page, pageSize) => {
      setPagination({ current: page, pageSize });
      fetchOrders({ page, limit: pageSize });
    },
    onShowSizeChange: (current, size) => {
      setPagination({ current, pageSize: size });
      fetchOrders({ page: current, limit: size });
    },
  };

  const dataForPage = orders;

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }} >
      {/* Phần hiển thị thống kê đơn hàng */}
      < Row Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Tổng đơn hàng</Text>} value={displayStats.total} prefix={<FileTextOutlined style={{ color: "#13C2C2" }} />} valueStyle={{ color: "#13C2C2", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Chờ xác nhận</Text>} value={displayStats.pending} prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />} valueStyle={{ color: "#faad14", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đã xác nhận</Text>} value={displayStats.confirmed} prefix={<CheckCircleOutlined style={{ color: "#1890ff" }} />} valueStyle={{ color: "#1890ff", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đang xử lý</Text>} value={displayStats.processing} prefix={<ShoppingCartOutlined style={{ color: "#722ed1" }} />} valueStyle={{ color: "#722ed1", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đang giao</Text>} value={displayStats.shipped} prefix={<ShoppingCartOutlined style={{ color: "#1890ff" }} />} valueStyle={{ color: "#1890ff", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đã giao</Text>} value={displayStats.delivered} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} valueStyle={{ color: "#52c41a", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Trả hàng</Text>} value={displayStats.returned} prefix={<CloseCircleOutlined style={{ color: "#fa8c16" }} />} valueStyle={{ color: "#fa8c16", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Spin spinning={loadingStats} size="small">
              <Statistic title={<Text style={{ color: "#0D364C" }}>Đã hủy</Text>} value={displayStats.cancelled} prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />} valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }} />
            </Spin>
          </Card>
        </Col>

      </Row>
      {/* Card chính - Bảng quản lý đơn hàng */}
      < Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={< Space ><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<FileTextOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Đơn hàng</Title></Space >}>
        {/* Toolbar: Search, Filter, Sort, Refresh */}
        < div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={filters.searchText}
              onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
              style={{ width: 320, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
              onSearch={(value) => {
                setFilters(prev => ({ ...prev, searchText: value }));
                setTimeout(() => {
                  setPagination(prev => ({ ...prev, current: 1 }));
                  fetchOrders({ page: 1 });
                }, 100);
              }}
            />
            <Select
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              style={{ width: 150 }}
              size="large"
              placeholder="Lọc theo trạng thái"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="pending">Chờ xác nhận</Select.Option>
              <Select.Option value="confirmed">Đã xác nhận</Select.Option>
              <Select.Option value="processing">Đang xử lý</Select.Option>
              <Select.Option value="shipped">Đang giao</Select.Option>
              <Select.Option value="delivered">Đã giao</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
              <Select.Option value="returned">Trả hàng</Select.Option>
            </Select>
            <Select
              onChange={handleSortChange}
              style={{ width: 200 }}
              size="large"
              placeholder="Sắp xếp"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}>

              <Select.Option value="default">Mặc định</Select.Option>
              <Select.Option value="cnewest">Ngày tạo mới nhất</Select.Option>
              <Select.Option value="coldest">Ngày tạo cũ nhất</Select.Option>
              <Select.Option value="unewest">Ngày cập nhật mới nhất</Select.Option>
              <Select.Option value="uoldest">Ngày cập nhật cũ nhất</Select.Option>
              <Select.Option value="high">Giá cao nhất</Select.Option>
              <Select.Option value="low">Giá thấp nhất</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
          </Space>
        </div >

        {/* Hiển thị thông báo lỗi (nếu có) */}
        {
          error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(staffOrderClearMessages())}
              style={{
                marginBottom: 16,
                borderColor: "#ff4d4f",
                backgroundColor: "#fff2f0"
              }}
            />
          )
        }

        {/* Hiển thị thông báo thành công (nếu có) */}
        {
          success && (
            <Alert
              message={success}
              type="success"
              showIcon
              closable
              onClose={() => dispatch(staffOrderClearMessages())}
              style={{
                marginBottom: 16,
                borderColor: "#52c41a",
                backgroundColor: "#f6ffed"
              }}
            />
          )
        }

        {/* Hiển thị trạng thái filter đang active */}
        {
          hasActiveFilters && (
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
                  onClick={() => setFilters({ searchText: "", status: "all" })}
                  style={{ color: "#13C2C2" }}
                >
                  Xóa bộ lọc
                </Button>
              }
            />
          )
        }

        {/* Bảng danh sách đơn hàng */}
        <Spin spinning={loading || loadingList || updating} tip={loadingList ? "Đang tải đơn hàng..." : updating ? "Đang cập nhật..." : undefined}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataForPage}
            pagination={tablePagination}
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}
            size="middle"
            locale={{
              emptyText: "Không có dữ liệu đơn hàng"
            }}
          />
        </Spin>
      </Card >

      {/* Modal cập nhật đơn hàng */}
      {
        selectedOrder && (
          <UpdateOrder
            orderData={selectedOrder}
            visible={isUpdateModalVisible}
            onClose={() => {
              setSelectedOrder(null);
              setIsUpdateModalVisible(false);
            }}
            onSuccess={handleUpdateSuccess}
          />
        )
      }

      {/* Modal xem chi tiết đơn hàng */}
      {
        selectedOrder && (
          <ViewOrderDetail
            visible={isViewDetailModalVisible}
            orderData={currentOrder || selectedOrder}
            loading={loadingDetail}
            onClose={() => {
              setIsViewDetailModalVisible(false);
              setSelectedOrder(null);
            }}
          />
        )
      }
    </div >
  );
};

export default OrderManagement;
