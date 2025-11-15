import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
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
  const { items: orderItems, currentOrder, stats, statuses, pagination: apiPagination, loadingList, loadingDetail, loadingStats, updating, error, success } = useSelector((state) => state.order);
  
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [pageInfo, setPageInfo] = useState({ current: 1, size: 5 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Toast notifications for API feedback
  useEffect(() => {
    if (!error) return;
    toast.error(error, { toastId: "order-management-error" });
    dispatch(orderClearMessages());
  }, [error, dispatch]);

  useEffect(() => {
    if (!success) return;
    toast.success(success, { toastId: "order-management-success" });
    dispatch(orderClearMessages());
  }, [success, dispatch]);

  const getSortQuery = (value) => {
    const sortMap = {
      default: { sortBy: "default", sortOrder: "" },
      newest: { sortBy: "createdat", sortOrder: "desc" },
      oldest: { sortBy: "createdat", sortOrder: "asc" },
      "amount-asc": { sortBy: "totalprice", sortOrder: "asc" },
      "amount-desc": { sortBy: "totalprice", sortOrder: "desc" },
    };
    return sortMap[value] || sortMap.default;
  };

  // Load stats + statuses once
  useEffect(() => {
    dispatch(orderStatsRequest());
    dispatch(orderStatusesRequest());
  }, [dispatch]);

  // Fetch orders whenever filters, sort, or pagination change
  useEffect(() => {
    const selectedSort = getSortQuery(sortOption);

    const query = {
      page: pageInfo.current,
      limit: pageInfo.size,
      sortBy: selectedSort.sortBy,
      sortOrder: selectedSort.sortOrder,
      includeDetails: false,
    };

    if (statusFilter !== "all") query.status = statusFilter;
    if (paymentFilter !== "all") query.paymentMethod = paymentFilter;
    if (searchText.trim()) query.search = searchText.trim();

    dispatch(orderListRequest(query));
  }, [dispatch, searchText, statusFilter, paymentFilter, sortOption, pageInfo]);

  // Function to get status info from statuses array
  const getStatusInfo = (orderStatusId) => {
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
  };

  const orders = (orderItems || []).map((order) => {
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
        phone: order.userId?.phone,
      },
      receiverName: order.receiverName || order.userId?.user_name || "N/A",
      receiverPhone:
        order.receiverPhone ||
        order.customer?.phone ||
        order.userId?.phone ||
        order.customerPhone ||
        "N/A",
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

  const hasActiveFilters =
    searchText.trim() || statusFilter !== "all" || paymentFilter !== "all";
  
  const getFilterSummary = () => {
    const activeFilters = [];
    if (statusFilter !== "all") {
      const statusMap = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        processing: "Đang xử lý",
        shipped: "Đang giao",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
        returned: "Trả hàng"
      };
      activeFilters.push(`Trạng thái: ${statusMap[statusFilter] || statusFilter}`);
    }
    if (paymentFilter !== "all") {
      const paymentMap = {
        cod: "Thanh toán COD",
        vnpay: "VNPay",
      };
      activeFilters.push(`Thanh toán: ${paymentMap[paymentFilter] || paymentFilter}`);
    }
    if (searchText.trim()) {
      activeFilters.push(`Tìm kiếm: "${searchText.trim()}"`);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(orderStatsRequest());
    dispatch(orderStatusesRequest());
    const sortQuery = getSortQuery(sortOption);
    const filterQuery = {};
    if (statusFilter !== "all") filterQuery.status = statusFilter;
    if (paymentFilter !== "all") filterQuery.paymentMethod = paymentFilter;
    if (searchText.trim()) filterQuery.search = searchText.trim();

    dispatch(orderListRequest({
      page: pageInfo.current,
      limit: pageInfo.size,
      sortBy: sortQuery.sortBy,
      sortOrder: sortQuery.sortOrder,
      includeDetails: false,
      ...filterQuery,
    }));
    setTimeout(() => setIsRefreshing(false), 400);
  };

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
  const handleUpdateSuccess = (updated) => {
    if (!updated?._id) return;
    
    console.log("🔍 handleUpdateSuccess - updated data:", updated);
    
    dispatch(orderUpdateStatusRequest(updated._id, {
      orderStatusId: updated.orderStatusId,
      note: updated.notes,
      cancelledReason: updated.cancelledReason
    }));
    setIsUpdateModalVisible(false);
    setSelectedOrder(null);
  };

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    if (newPagination.current !== pageInfo.current || newPagination.pageSize !== pageInfo.size) {
      setPageInfo({ current: newPagination.current, size: newPagination.pageSize });
    }

    if (sorter?.order) {
      if (sorter.field === "totalAmount" && sorter.order === "ascend") setSortOption("amount-asc");
      if (sorter.field === "totalAmount" && sorter.order === "descend") setSortOption("amount-desc");
      if (sorter.field === "createdAt" && sorter.order === "ascend") setSortOption("oldest");
      if (sorter.field === "createdAt" && sorter.order === "descend") setSortOption("newest");
    } else if (!sorter?.order) {
      setSortOption("default");
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
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
      cod: "Thanh toán COD",
      vnpay: "VNPay",
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
              toast.success("Đã copy ID vào clipboard", { toastId: `order-copy-${record._id}` });
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
      sortOrder:
        sortOption === "amount-asc"
          ? "ascend"
          : sortOption === "amount-desc"
          ? "descend"
          : null,
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
      sortOrder:
        sortOption === "newest"
          ? "descend"
          : sortOption === "oldest"
          ? "ascend"
          : null,
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
  const tablePagination = {
    current: apiPagination?.page || pageInfo.current,
    pageSize: apiPagination?.limit || pageInfo.size,
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
  };

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
              value={searchText} 
              onChange={(e) => {
                setSearchText(e.target.value);
                setPageInfo({ current: 1, size: pageInfo.size });
              }} 
              style={{ width: 320, maxWidth: "100%" }} 
              size="large" 
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />} 
              allowClear 
              onSearch={(value) => {
                setSearchText(value);
                setPageInfo({ current: 1, size: pageInfo.size });
              }} 
            />
            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPageInfo({ current: 1, size: pageInfo.size });
              }}
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
              value={paymentFilter}
              onChange={(value) => {
                setPaymentFilter(value);
                setPageInfo({ current: 1, size: pageInfo.size });
              }}
              style={{ width: 180 }}
              size="large"
              placeholder="Lọc theo thanh toán"
              suffixIcon={<FilterOutlined style={{ color: "#13C2C2" }} />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="cod">Thanh toán COD</Select.Option>
              <Select.Option value="vnpay">VNPay</Select.Option>
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
              <Select.Option value="amount-asc">Giá thấp đến cao</Select.Option>
              <Select.Option value="amount-desc">Giá cao đến thấp</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={isRefreshing} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
          </Space>
        </div>

        {/* Error and Success Messages */}
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
                  setPaymentFilter("all");
                  setPageInfo({ current: 1, size: pageInfo.size });
                }}
                style={{ color: "#13C2C2" }}
              >
                Xóa bộ lọc
              </Button>
            }
          />
        )}

        <Spin spinning={isRefreshing || loadingList || updating} tip={loadingList ? "Đang tải đơn hàng..." : updating ? "Đang cập nhật..." : undefined}>
          <Table 
            rowKey={(record) => record._id} 
            columns={columns} 
            dataSource={orders} 
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
