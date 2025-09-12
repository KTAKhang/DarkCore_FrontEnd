import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
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
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import ViewCategoryDetail from "./ViewCategoryDetail";

const { Title, Text } = Typography;

// Simple placeholder avatar background colors
const CATEGORY_COLORS = ["#13C2C2", "#52c41a", "#fa8c16", "#722ED1", "#0D364C"]; 

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const initialMockCategories = [
  {
    _id: generateId(),
    name: "CPU - Bộ vi xử lý",
    image: "",
    status: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: "Mainboard - Bo mạch chủ",
    image: "",
    status: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId(),
    name: "SSD - Ổ cứng thể rắn",
    image: "",
    status: false,
    createdAt: new Date().toISOString(),
  },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(initialMockCategories);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  // Modals state
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = useMemo(() => {
    if (!searchText) return categories;
    const lower = searchText.trim().toLowerCase();
    return categories.filter((c) =>
      [c.name, c._id].some((v) => (v || "").toString().toLowerCase().includes(lower))
    );
  }, [categories, searchText]);

  const stats = useMemo(() => {
    const total = filteredCategories.length;
    const active = filteredCategories.filter((c) => c.status).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [filteredCategories]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 450);
  }, []);

  const handleOpenUpdateModal = useCallback((category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  }, []);

  const handleOpenDetailModal = useCallback((category) => {
    setSelectedCategory(category);
    setIsViewDetailModalVisible(true);
  }, []);

  const handleCreateSuccess = useCallback((createdCategory) => {
    setCategories((prev) => [{ ...createdCategory, _id: createdCategory._id || generateId(), createdAt: createdCategory.createdAt || new Date().toISOString() }, ...prev]);
    message.success("Đã thêm category mới");
    setIsCreateModalVisible(false);
    setPagination((p) => ({ ...p, current: 1 }));
  }, []);

  const handleUpdateSuccess = useCallback((updatedCategory) => {
    setCategories((prev) => prev.map((c) => (c._id === updatedCategory._id ? { ...c, ...updatedCategory } : c)));
    message.success("Đã cập nhật category");
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Category",
        key: "category",
        render: (_, record, index) => (
          <Space>
            <Avatar
              src={record.image}
              icon={<AppstoreOutlined />}
              style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
            />
            <div>
              <div style={{ color: "#0D364C", fontWeight: "bold", fontSize: 16 }}>{record.name}</div>
              <div
                style={{ fontSize: 12, color: "#999", cursor: "pointer" }}
                onClick={() => {
                  navigator.clipboard.writeText(record._id);
                  message.success("Đã copy ID vào clipboard");
                }}
                title="Click để copy ID"
              >
                <AppstoreOutlined style={{ marginRight: 4 }} />ID: {record._id}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Badge
            status={status ? "success" : "error"}
            text={
              <Tag
                color={status ? "#52c41a" : "#ff4d4f"}
                icon={status ? <CheckCircleOutlined /> : <StopOutlined />}
                style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}
              >
                {status ? "Hiển thị" : "Ẩn"}
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
          <span style={{ color: "#999" }}>
            {date
              ? new Date(date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </span>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleOpenDetailModal(record)} style={{ color: "#13C2C2" }} title="Xem chi tiết" />
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} style={{ color: "#0D364C" }} title="Chỉnh sửa" />
          </Space>
        ),
      },
    ],
    [handleOpenDetailModal, handleOpenUpdateModal]
  );

  const tablePagination = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: filteredCategories.length,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => (
        <span style={{ color: "#0D364C" }}>Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories</span>
      ),
      onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
      onShowSizeChange: (current, size) => setPagination({ current, pageSize: size }),
    }),
    [filteredCategories.length, pagination]
  );

  const dataForPage = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, pagination]);

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
            <Statistic title={<span style={{ color: "#0D364C" }}>Tổng categories</span>} value={stats.total} prefix={<AppstoreOutlined style={{ color: "#13C2C2" }} />} valueStyle={{ color: "#13C2C2", fontWeight: "bold" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic title={<span style={{ color: "#0D364C" }}>Đang hiển thị</span>} value={stats.active} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} valueStyle={{ color: "#52c41a", fontWeight: "bold" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic title={<span style={{ color: "#0D364C" }}>Đang ẩn</span>} value={stats.inactive} prefix={<StopOutlined style={{ color: "#ff4d4f" }} />} valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }} />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }}
        title={
          <Space>
            <Avatar style={{ backgroundColor: "#13C2C2" }} icon={<AppstoreOutlined />} />
            <Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Categories</Title>
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
              placeholder="Tìm kiếm theo tên category hoặc ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320, maxWidth: "100%" }}
              size="large"
              prefix={<SearchOutlined style={{ color: "#13C2C2" }} />}
              allowClear
              onSearch={(value) => setSearchText(value)}
            />
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm Category</Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataForPage}
            pagination={tablePagination}
            style={{ borderRadius: 12, overflow: "hidden" }}
            scroll={{ x: true }}
            size="middle"
          />
        </Spin>
      </Card>

      <CreateCategory visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSuccess={handleCreateSuccess} />

      {selectedCategory && (
        <UpdateCategory visible={isUpdateModalVisible} categoryData={selectedCategory} onClose={() => { setIsUpdateModalVisible(false); setSelectedCategory(null); }} onSuccess={handleUpdateSuccess} />
      )}

      {selectedCategory && (
        <ViewCategoryDetail visible={isViewDetailModalVisible} categoryData={selectedCategory} onClose={() => { setIsViewDetailModalVisible(false); setSelectedCategory(null); }} />
      )}
    </div>
  );
};

CategoryManagement.propTypes = {
  // no props
};

export default CategoryManagement;


