import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
  orderListRequest,
  orderStatsRequest,
  orderStatusesRequest,
  orderUpdateStatusRequest,
  orderClearMessages,
  orderDetailRequest,
} from "../../redux/actions/orderActions";

const { Title, Text } = Typography;

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { items: orderItems, currentOrder, stats, statuses, pagination: apiPagination, loadingList, loadingDetail, loadingStats, loadingStatuses, updating, error, success } = useSelector((state) => state.order);
  
  // Debug Redux state
  useEffect(() => {
    console.log("🔍 OrderManagement Redux state:", {
      orderItems: orderItems?.length || 0,
      currentOrder: currentOrder?._id || null,
      stats,
      statuses: statuses?.length || 0,
      loadingList,
      loadingDetail,
      loadingStats,
      loadingStatuses,
      error,
      success
    });
    
    // Debug first order structure if available
    if (orderItems && orderItems.length > 0) {
      console.log("🔍 First order structure:", orderItems[0]);
      console.log("🔍 Order status info:", {
        orderStatusId: orderItems[0].orderStatusId,
        statusName: orderItems[0].orderStatusId?.name,
        statusColor: orderItems[0].orderStatusId?.color,
        statusDescription: orderItems[0].orderStatusId?.description
      });
    }
    
    // Debug currentOrder when it changes
    if (currentOrder) {
      console.log("✅ CurrentOrder loaded:", currentOrder);
      console.log("✅ CurrentOrder orderDetails:", currentOrder.orderDetails);
    }
  }, [orderItems, currentOrder, stats, loadingList, loadingDetail, loadingStats, error, success]);
  
  // Simplified state management
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchText: "",
    status: "all",
    paymentMethod: "all"
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [sort, setSort] = useState({ sortBy: "default", sortOrder: "" });

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Use refs to store current values to avoid dependency loops
  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);
  const sortRef = useRef(sort);
  
  // Update refs when values change
  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { paginationRef.current = pagination; }, [pagination]);
  useEffect(() => { sortRef.current = sort; }, [sort]);

  // Simplified API call function with stable reference
  const fetchOrders = useCallback((params = {}) => {
    const currentFilters = filtersRef.current;
    const currentPagination = paginationRef.current;
    const currentSort = sortRef.current;
    
    const query = {
      page: currentPagination.current,
      limit: currentPagination.pageSize,
      sortBy: currentSort.sortBy,
      sortOrder: currentSort.sortOrder,
      ...params
    };
    
    if (currentFilters.status !== "all") query.status = currentFilters.status;
    if (currentFilters.searchText.trim()) query.keyword = currentFilters.searchText.trim();
    if (currentFilters.paymentMethod !== "all") query.paymentMethod = currentFilters.paymentMethod;
    
    dispatch(orderListRequest(query));
  }, [dispatch]);

  // Load initial data
  useEffect(() => {
    fetchOrders({ page: 1 });
    dispatch(orderStatsRequest());
    dispatch(orderStatusesRequest());
  }, [dispatch, fetchOrders]);

  // Handle filter changes with debounce for search
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchOrders({ page: 1 });
    }, filters.searchText.trim() ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchOrders, isInitialLoad]);

  // Handle sort changes
  useEffect(() => {
    if (isInitialLoad) return;
    fetchOrders();
  }, [sort, fetchOrders, isInitialLoad]);

  // Function to get status info from statuses array
  const getStatusInfo = useCallback((orderStatusId) => {
    if (!orderStatusId || !statuses || statuses.length === 0) {
      return { name: "pending", color: "#faad14", description: "Chờ xác nhận" };
    }
    
    // If orderStatusId is populated object (from backend populate)
    if (typeof orderStatusId === 'object' && orderStatusId.name) {
      return {
        name: orderStatusId.name,
        color: orderStatusId.color || "#faad14",
        description: orderStatusId.description || orderStatusId.name,
        id: orderStatusId._id
      };
    }
    
    // If orderStatusId is just an ID string, find in statuses array
    const statusInfo = statuses.find(status => status._id === orderStatusId);
    if (statusInfo) {
      return {
        name: statusInfo.name,
        color: statusInfo.color || "#faad14",
        description: statusInfo.description || statusInfo.name,
        id: statusInfo._id
      };
    }
    
    // Default fallback
    return { name: "pending", color: "#faad14", description: "Chờ xác nhận" };
  }, [statuses]);

  // Simplified data mapping
  const orders = useMemo(() => {
    return (orderItems || []).map((order) => {
      const statusInfo = getStatusInfo(order.orderStatusId);
      
      return {
        ...order,
        customerName: order.userId?.user_name || "N/A",
        customerEmail: order.userId?.email || "N/A",
        customerPhone: order.userId?.phone || "N/A",
        customer: {
          _id: order.userId?._id,
          name: order.userId?.user_name,
          email: order.userId?.email,
          phone: order.userId?.phone
        },
        // Add receiver information (người nhận hàng) - với fallback logic như ViewOrderDetail
        receiverName: order.receiverName || order.userId?.user_name || "N/A",
        receiverPhone: order.receiverPhone || order.customer?.phone || order.userId?.phone || order.customerPhone || "N/A",
        receiverAddress: order.receiverAddress || "Địa chỉ chưa được cung cấp",
        status: statusInfo.name,
        statusColor: statusInfo.color,
        statusId: statusInfo.id,
        statusDescription: statusInfo.description,
        totalAmount: order.totalPrice,
        itemsCount: order.orderDetails?.length || 0,
        items: order.orderDetails || [],
        shippingAddress: order.receiverAddress,
      };
    });
  }, [orderItems, getStatusInfo]);

  // Simplified filter checks
  const hasActiveFilters = filters.searchText.trim() || filters.status !== "all" || filters.paymentMethod !== "all";
  
  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== "all") {
      const statusMap = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        processing: "Đang xử lý",
        shipped: "Đang giao",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
        returned: "Trả hàng"
      };
      activeFilters.push(`Trạng thái: ${statusMap[filters.status] || filters.status}`);
    }
    if (filters.paymentMethod !== "all") {
      const paymentMap = {
        cod: "Tiền mặt",
        cash: "Tiền mặt",
        credit_card: "Thẻ tín dụng",
        bank_transfer: "Chuyển khoản",
        e_wallet: "Ví điện tử"
      };
      activeFilters.push(`Thanh toán: ${paymentMap[filters.paymentMethod] || filters.paymentMethod}`);
    }
    if (filters.searchText.trim()) {
      activeFilters.push(`Tìm kiếm: "${filters.searchText.trim()}"`);
    }
    return activeFilters.join(" • ");
  };

  const displayStats = {
    total: stats.total || 0,
    pending: stats.pending || 0,
    confirmed: stats.confirmed || 0,
    processing: stats.processing || 0,
    shipped: stats.shipped || 0,
    delivered: stats.delivered || 0,
    cancelled: stats.cancelled || 0,
    returned: stats.returned || 0,
  };

  // Simplified refresh function
  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchOrders();
    dispatch(orderStatsRequest());
    setTimeout(() => setLoading(false), 450);
  }, [dispatch, fetchOrders]);

  const handleOpenUpdateModal = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalVisible(true);
  };

  const handleOpenViewDetailModal = (order) => {
    console.log("🔍 Opening ViewDetail - Full order data:", order);
    console.log("🔍 Opening ViewDetail - orderDetails:", order.orderDetails);
    console.log("🔍 Opening ViewDetail - items:", order.items);
    
    // Fetch full order details with orderDetails populated from backend
    if (order._id) {
      console.log("🔄 Fetching full order details for ID:", order._id);
      dispatch(orderDetailRequest(order._id));
    }
    
    setSelectedOrder(order);
    setIsViewDetailModalVisible(true);
  };

  // Simplified update handler
  const handleUpdateSuccess = useCallback((updated) => {
    if (!updated?._id) return;
    
    console.log("🔍 handleUpdateSuccess - updated data:", updated);
    
    dispatch(orderUpdateStatusRequest(updated._id, {
      orderStatusId: updated.orderStatusId,
      note: updated.notes,
      cancelledReason: updated.cancelledReason
    }));
    setIsUpdateModalVisible(false);
    setSelectedOrder(null);
  }, [dispatch]);

  // Simplified table change handler
  const handleTableChange = (paginationData, tableFilters, sorter) => {
    // Handle sorting
    if (sorter?.field && sorter?.order) {
      const sortMap = {
        totalAmount: { field: 'totalAmount', order: sorter.order === 'ascend' ? 'asc' : 'desc' },
        createdAt: { field: 'createdat', order: sorter.order === 'ascend' ? 'asc' : 'desc' }
      };
      
      const sortConfig = sortMap[sorter.field];
      if (sortConfig) {
        setSort({ sortBy: sortConfig.field, sortOrder: sortConfig.order });
      }
    } else if (sorter?.field && !sorter?.order) {
      setSort({ sortBy: "default", sortOrder: "" });
    }
  };

  // Simplified sort dropdown handler
  const handleSortChange = (value) => {
    const sortMap = {
      default: { sortBy: "default", sortOrder: "" },
      newest: { sortBy: "createdat", sortOrder: "desc" },
      oldest: { sortBy: "createdat", sortOrder: "asc" },
      "amount-asc": { sortBy: "totalAmount", sortOrder: "asc" },
      "amount-desc": { sortBy: "totalAmount", sortOrder: "desc" }
    };
    
    setSort(sortMap[value] || sortMap.default);
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { color: "#faad14", icon: <ClockCircleOutlined />, text: "Chờ xác nhận" },
      confirmed: { color: "#1890ff", icon: <CheckCircleOutlined />, text: "Đã xác nhận" },
      processing: { color: "#722ed1", icon: <ShoppingCartOutlined />, text: "Đang xử lý" },
      shipped: { color: "#1890ff", icon: <ShoppingCartOutlined />, text: "Đang giao" },
      delivered: { color: "#52c41a", icon: <CheckCircleOutlined />, text: "Đã giao" },
      cancelled: { color: "#ff4d4f", icon: <CloseCircleOutlined />, text: "Đã hủy" },
      returned: { color: "#fa8c16", icon: <CloseCircleOutlined />, text: "Trả hàng" },
      // Handle case where status comes from backend with different names
      shipping: { color: "#1890ff", icon: <ShoppingCartOutlined />, text: "Đang giao" },
      completed: { color: "#52c41a", icon: <CheckCircleOutlined />, text: "Hoàn thành" }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    const methodMap = {
      cod: "Tiền mặt",
      cash: "Tiền mặt",
      credit_card: "Thẻ tín dụng",
      bank_transfer: "Chuyển khoản",
      e_wallet: "Ví điện tử"
    };
    return methodMap[method] || method;
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
          <Text strong style={{ color: "#0D364C", display: "block", fontSize: 14 }}>{record.receiverName || record.customerName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.customerEmail}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{record.receiverPhone}</Text>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: { multiple: false },
      sortOrder: sort.sortBy === 'default' ? null : (sort.sortBy === 'totalAmount' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null),
      render: (amount) => (
        <Tag color="#13C2C2" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}>
          {(amount || 0).toLocaleString("vi-VN")}đ
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color="#0D364C" style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
          {getPaymentMethodText(method)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: { multiple: false },
      sortOrder: sort.sortBy === 'default' ? null : (sort.sortBy === 'createdat' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null),
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

  // Simplified pagination
  const tablePagination = useMemo(() => ({
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
  }), [apiPagination, pagination, hasActiveFilters, fetchOrders]);

  // Backend handles pagination, so we use orders directly
  const dataForPage = orders;

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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

      <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<FileTextOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Đơn hàng</Title></Space>}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search 
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..." 
              value={filters.searchText} 
              onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))} 
              style={{ width: 320, maxWidth: "100%" }} 
              size="large" 
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />} 
              allowClear 
              onSearch={(value) => setFilters(prev => ({ ...prev, searchText: value }))} 
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
              value={filters.paymentMethod}
              onChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo thanh toán"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="cod">Tiền mặt</Select.Option>
              <Select.Option value="cash">Tiền mặt</Select.Option>
              <Select.Option value="credit_card">Thẻ tín dụng</Select.Option>
              <Select.Option value="bank_transfer">Chuyển khoản</Select.Option>
              <Select.Option value="e_wallet">Ví điện tử</Select.Option>
            </Select>
            <Select
              value={(() => {
                if (sort.sortBy === "default") return "default";
                if (sort.sortBy === "createdat" && sort.sortOrder === "desc") return "newest";
                if (sort.sortBy === "createdat" && sort.sortOrder === "asc") return "oldest";
                if (sort.sortBy === "totalAmount" && sort.sortOrder === "asc") return "amount-asc";
                if (sort.sortBy === "totalAmount" && sort.sortOrder === "desc") return "amount-desc";
                return "default";
              })()}
              onChange={handleSortChange}
              style={{ width: 200 }}
              size="large"
              placeholder="Sắp xếp"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="default">Mặc định</Select.Option>
              <Select.Option value="newest">Mới nhất</Select.Option>
              <Select.Option value="oldest">Cũ nhất</Select.Option>
              <Select.Option value="amount-asc">Giá thấp đến cao</Select.Option>
              <Select.Option value="amount-desc">Giá cao đến thấp</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
          </Space>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(orderClearMessages())}
            style={{ 
              marginBottom: 16, 
              borderColor: "#ff4d4f", 
              backgroundColor: "#fff2f0"
            }}
          />
        )}
        
        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            closable
            onClose={() => dispatch(orderClearMessages())}
            style={{ 
              marginBottom: 16, 
              borderColor: "#52c41a", 
              backgroundColor: "#f6ffed"
            }}
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
                onClick={() => setFilters({ searchText: "", status: "all", paymentMethod: "all" })}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={loading || loadingList || updating} tip={loadingList ? "Đang tải đơn hàng..." : updating ? "Đang cập nhật..." : undefined}>
          <Table 
            rowKey={(record) => record._id} 
            columns={columns} 
            dataSource={dataForPage} 
            pagination={tablePagination} 
            onChange={handleTableChange}
            style={{ borderRadius: 12, overflow: "hidden" }} 
            scroll={{ x: true }} 
            size="middle"
            locale={{
              emptyText: "Không có dữ liệu đơn hàng"
            }}
          />
        </Spin>
      </Card>

      {selectedOrder && (
        <UpdateOrder visible={isUpdateModalVisible} orderData={selectedOrder} onClose={() => { setIsUpdateModalVisible(false); setSelectedOrder(null); }} onSuccess={handleUpdateSuccess} />
      )}

      {(selectedOrder || currentOrder) && (
        <ViewOrderDetail 
          visible={isViewDetailModalVisible} 
          orderData={currentOrder || selectedOrder} 
          loading={loadingDetail}
          onClose={() => { 
            setIsViewDetailModalVisible(false); 
            setSelectedOrder(null); 
          }} 
        />
      )}
    </div>
  );
};

export default OrderManagement;
