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
};

const ContactManagement = () => {
  const dispatch = useDispatch();
  const { list, stats, pagination: apiPagination, loadingList, updatingStatus } =
    useSelector((state) => state.contact);

  const [filters, setFilters] = useState({
    searchText: "",
    status: "all",
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

  const fetchContacts = useCallback(
    (params = {}) => {
      const query = {
        page: paginationRef.current.current,
        limit: paginationRef.current.pageSize,
        ...params,
      };

      if (filtersRef.current.status !== "all") {
        query.status = filtersRef.current.status;
      }

      if (filtersRef.current.searchText.trim()) query.search = filtersRef.current.searchText.trim();
      dispatch(contactListRequest(query));
    },
    [dispatch]
  );

  const fetchStats = useCallback(() => {
    dispatch(contactStatsRequest());
  }, [dispatch]);

  useEffect(() => {
    fetchStats();
    fetchContacts({ page: 1 });
  }, []);

  useEffect(() => {
    fetchContacts({ page: pagination.current, limit: pagination.pageSize });
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchContacts({ page: 1 });
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters]);

  const handleRefresh = useCallback(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchStats();
    fetchContacts({ page: 1 });
  }, [fetchStats, fetchContacts]);

  const handleOpenDetailModal = useCallback((contact) => {
    setSelectedContact(contact);
    setIsViewModalVisible(true);
  }, []);

  const handleOpenUpdateModal = useCallback((contact) => {
    setSelectedContact(contact);
    setIsUpdateModalVisible(true);
  }, []);

  const handleUpdateContact = useCallback(
    (contactId, payload) => {
      if (!contactId || !payload) {
        return;
      }
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
    return list?.data || [];
  }, [list]);
  const displayStats = useMemo(
    () => stats || { total: 0, pending: 0, resolved: 0 },
    [stats]
  );

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
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
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

  const tablePagination = useMemo(() => {
    const effectiveTotal = apiPagination?.total || 0;
    return {
      current: apiPagination?.page || pagination.current,
      pageSize: pagination.pageSize,
      total: effectiveTotal,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20"],
      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} contact`,
      onChange: (page, pageSize) => {
        setPagination({ current: page, pageSize });
      },
      onShowSizeChange: (current, size) => {
        setPagination({ current: 1, pageSize: size });
      },
    };
  }, [apiPagination, pagination]);

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
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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

      <Card
        style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
        title={
          <Space>
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<AppstoreOutlined />} />
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Liên hệ (Contact)</Title>
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
            <Input
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
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
          </Space>
        </div>

        <Spin spinning={loadingList}>
          <Table
            rowKey={(record) => record._id || record.id}
            columns={columns}
            dataSource={contactItems}
            pagination={tablePagination}
            locale={{ emptyText: "Không có liên hệ nào" }}
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}
            size="middle"
          />
        </Spin>
      </Card>

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

      {selectedContact && (
        <ContactUpdateModal
          visible={isUpdateModalVisible}
          contactData={selectedContact}
          onClose={() => {
            setIsUpdateModalVisible(false);
            setSelectedContact(null);
          }}
          onSubmit={(payload) => {
            if (!selectedContact) return;
            const contactId = selectedContact._id || selectedContact.id;
            if (!contactId) return;
            handleUpdateContact(contactId, payload);
          }}
          loading={updatingStatus}
        />
      )}
    </div>
  );
};

export default ContactManagement;