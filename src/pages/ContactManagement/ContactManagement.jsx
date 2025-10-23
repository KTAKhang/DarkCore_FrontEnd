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

const { Title, Text } = Typography;

const STATUS_COLORS = {
  Pending: "warning",
  Resolved: "success",
  // Closed: "error",
};

// const PRIORITY_COLORS = {
//   High: "red",
//   Medium: "orange",
//   Low: "green",
// };

const ContactManagement = () => {
  const dispatch = useDispatch();
  const { list, stats, pagination: apiPagination, loadingList, updatingStatus } =
    useSelector((state) => state.contact);

  const [filters, setFilters] = useState({
    searchText: "",
    status: "all",
    priority: "all",
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  // ================= Fetch contacts =================
  const fetchContacts = useCallback(
    (params = {}) => {
      const query = {
        page: paginationRef.current.current,
        limit: paginationRef.current.pageSize,
        ...params,
      };
      
      // ✅ Apply filter status regardless of role
      if (filtersRef.current.status !== "all") {
        query.status = filtersRef.current.status;
      }
      if (filtersRef.current.priority !== "all") {
        query.priority = filtersRef.current.priority;
      }

      if (filtersRef.current.searchText.trim()) query.search = filtersRef.current.searchText.trim();
      console.log("🚀 Fetch Contacts Query:", query);
      dispatch(contactListRequest(query));
    },
    [dispatch]
  );

  // ================= Fetch stats =================
  const fetchStats = useCallback(() => {
    console.log("🚀 Fetch Stats");
    dispatch(contactStatsRequest());
  }, [dispatch]);

  // ================= Init =================
  useEffect(() => {
    fetchStats();
    fetchContacts({ page: 1 });
  }, []);

  // ================= Handle pagination change =================
  useEffect(() => {
    fetchContacts({ page: pagination.current, limit: pagination.pageSize });
  }, [pagination.current, pagination.pageSize]);

  // ================= Handle filters =================
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchContacts({ page: 1 });
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters]);

  // ================= Refresh =================
  const handleRefresh = useCallback(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchStats();
    fetchContacts({ page: 1 });
  }, [fetchStats, fetchContacts]);

  // ================= Open detail modal =================
  const handleOpenDetailModal = useCallback((contact) => {
    console.log("🚀 Open Detail Modal:", contact);
    setSelectedContact(contact);
    setIsViewModalVisible(true);
  }, []);

  // ================= Open update modal =================
  const handleOpenUpdateModal = useCallback((contact) => {
    console.log("🚀 Open Update Modal:", contact);
    setSelectedContact(contact);
    setIsUpdateModalVisible(true);
  }, []);

  // ================= Update contact (status + reply) =================
  const handleUpdateContact = useCallback(
    (contactId, payload) => {
      if (!contactId || !payload) {
        console.error("❌ Invalid contactId or payload in handleUpdateContact", { contactId, payload });
        return;
      }

      // ✅ Gọi action đúng
      dispatch(contactUpdateRequest(contactId, payload));

      setIsUpdateModalVisible(false);
      setSelectedContact(null);

      setTimeout(() => {
        fetchContacts({ page: pagination.current });
        fetchStats();
      }, 500);
    },
    [dispatch, fetchContacts, fetchStats, pagination.current]
  );




  const contactItems = useMemo(() => {
    console.log("🚀 contactItems length:", list?.data?.length || 0);
    return list?.data || [];
  }, [list]);
  const displayStats = useMemo(
    () => stats || { total: 0, pending: 0, resolved: 0, closed: 0 },
    [stats]
  );

  // ================= Table columns =================
  const columns = useMemo(
    () => [
      {
        title: "Người gửi",
        key: "user",
        render: (_, record) => (
          <Space>
            <Avatar src={record.userId?.avatar} icon={<UserOutlined />} />
            <div>
              <Text strong>{record.userId?.user_name}</Text>
              <div style={{ fontSize: 12, color: "#666" }}>{record.userId?.email}</div>
            </div>
          </Space>
        ),
      },
      {
        title: "Chủ đề",
        dataIndex: "subject",
        key: "subject",
        render: (text, record) => (
          <div>
            <Text strong style={{ color: "#0D364C" }}>{text}</Text>
            <div style={{ fontSize: 12, color: "#999" }}>#{record.ticketId}</div>
          </div>
        ),
      },
      {
        title: "Loại vấn đề",
        dataIndex: "reason",
        key: "reason",
        render: (reason) => <Tag color="#13C2C2">{reason}</Tag>,
      },
      // {
      //   title: "Độ ưu tiên",
      //   dataIndex: "priority",
      //   key: "priority",
      //   render: (priority) => (
      //     <Tag color={PRIORITY_COLORS[priority] || "default"}>{priority}</Tag>
      //   ),
      // },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        // ✅ Removed sorter to disable sorting
        render: (status) => (
          <Badge
            status={STATUS_COLORS[status] || "default"}
            text={
              <Tag
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
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => (
          <div>
            <Text>{new Date(date).toLocaleDateString("vi-VN")}</Text>
            <div style={{ fontSize: 12, color: "#999" }}>
              {new Date(date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleOpenDetailModal(record)}
              style={{ color: "#13C2C2" }}
              title="Xem chi tiết"
            />
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleOpenUpdateModal(record)}
              loading={updatingStatus}
              title="Cập nhật"
            >
              Cập nhật
            </Button>
          </Space>
        ),
      },
    ],
    [handleOpenDetailModal, handleOpenUpdateModal, updatingStatus]
  );

  // ================= Table pagination =================
  const tablePagination = useMemo(() => {
    const effectiveTotal = apiPagination?.total || 0;
    console.log("🚀 tablePagination:", {
      current: apiPagination?.page || pagination.current,
      pageSize: pagination.pageSize,
      total: effectiveTotal,
      apiPagination,
    });
    return {
      current: apiPagination?.page || pagination.current,
      pageSize: pagination.pageSize,
      total: effectiveTotal,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20"],
      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} contact`,
      onChange: (page, pageSize) => {
        console.log("🚀 Pagination changed:", { page, pageSize });
        // ✅ Chỉ update state, không gọi fetchContacts ở đây
        setPagination({ current: page, pageSize });
      },
      onShowSizeChange: (current, size) => {
        console.log("🚀 PageSize changed:", { current, size });
        setPagination({ current: 1, pageSize: size });
      },
    };
  }, [apiPagination, pagination]);

  // ================= Sync pagination with API =================
  useEffect(() => {
    if (apiPagination?.page && apiPagination.page !== pagination.current) {
      setPagination((prev) => ({ ...prev, current: apiPagination.page }));
    }
  }, [apiPagination?.page]);

  return (
    <div style={{ padding: 24, background: "#f7f9fb", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng Contact"
              value={displayStats.total}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang chờ xử lý"
              value={displayStats.pending}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã xử lý"
              value={displayStats.resolved}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={<Title level={3}>Quản lý Liên hệ (Contact)</Title>}
        extra={<Button icon={<ReloadOutlined />} onClick={handleRefresh}>Làm mới</Button>}
      >
        <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
            value={filters.searchText}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchText: e.target.value }))}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            style={{ width: 150 }}
            placeholder="Trạng thái"
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Resolved">Resolved</Select.Option>
            {/* <Select.Option value="Closed">Closed</Select.Option> */}
          </Select>
          {/* <Select
            value={filters.priority}
            onChange={(val) => setFilters((prev) => ({ ...prev, priority: val }))}
            style={{ width: 150 }}
            placeholder="Độ ưu tiên"
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="High">Cao</Select.Option>
            <Select.Option value="Medium">Trung bình</Select.Option>
            <Select.Option value="Low">Thấp</Select.Option>
          </Select> */}
        </Space>

        <Spin spinning={loadingList}>
          <Table
            rowKey={(record) => record._id || record.id}
            columns={columns}
            dataSource={contactItems}
            pagination={tablePagination}
            locale={{ emptyText: "Không có liên hệ nào" }}
            // ✅ Removed onChange handler to disable sorting
          />

        </Spin>
      </Card>

      {/* Modal xem chi tiết */}
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

      {/* Modal cập nhật */}
      {selectedContact && (
        <ContactUpdateModal
          visible={isUpdateModalVisible}
          contactData={selectedContact}
          onClose={() => { setIsUpdateModalVisible(false); setSelectedContact(null); }}
          onSubmit={(payload) => {
            if (!selectedContact) {
              console.error("❌ selectedContact is undefined");
              return;
            }
            const contactId = selectedContact._id || selectedContact.id;
            if (!contactId) {
              console.error("❌ selectedContact id is undefined", selectedContact);
              return;
            }
            handleUpdateContact(contactId, payload);
          }}
          loading={updatingStatus}
        />



      )}
    </div>
  );
};

export default ContactManagement;