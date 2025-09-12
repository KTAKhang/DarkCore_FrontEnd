import { useMemo, useState, useCallback } from "react";
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
  Tooltip,
  Spin,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import ViewProductDetail from "./ViewProductDetail";

const { Title, Text } = Typography;

const mockCategories = [
  { _id: "cat-1", name: "CPU - Bộ vi xử lý", status: true },
  { _id: "cat-2", name: "Mainboard - Bo mạch chủ", status: true },
  { _id: "cat-3", name: "SSD - Ổ cứng thể rắn", status: false },
];

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const initialProducts = [
  {
    _id: generateId(),
    name: "CPU Intel Core i5-13400F",
    category_id: "cat-1",
    categoryDetail: mockCategories[0],
    price: 4200000,
    quantity: 20,
    status: true,
    short_desc: "10 nhân 16 luồng, LGA1700",
    detail_desc: "Hiệu năng tốt cho gaming và làm việc",
    image: "",
  },
  {
    _id: generateId(),
    name: "Mainboard Gigabyte B760M DS3H",
    category_id: "cat-2",
    categoryDetail: mockCategories[1],
    price: 3200000,
    quantity: 15,
    status: true,
    short_desc: "Chipset B760, mATX, DDR5",
    detail_desc: "Kết nối đa dạng, ổn định",
    image: "",
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    if (!searchText) return products;
    const lower = searchText.trim().toLowerCase();
    return products.filter((p) => [p.name, p._id].some((v) => (v || "").toString().toLowerCase().includes(lower)));
  }, [products, searchText]);

  const stats = useMemo(() => {
    const total = filteredProducts.length;
    const active = filteredProducts.filter((p) => p.status).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [filteredProducts]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, []);

  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleOpenViewDetailModal = (product) => {
    setSelectedProduct(product);
    setIsViewDetailModalVisible(true);
  };

  const handleCreateSuccess = (created) => {
    const cat = mockCategories.find((c) => c._id === created.category_id) || null;
    setProducts((prev) => [{ ...created, _id: created._id || generateId(), categoryDetail: cat }, ...prev]);
    setIsCreateModalVisible(false);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleUpdateSuccess = (updated) => {
    const cat = mockCategories.find((c) => c._id === updated.category_id) || updated.categoryDetail || null;
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? { ...p, ...updated, categoryDetail: cat } : p)));
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} icon={<ShoppingCartOutlined />} style={{ backgroundColor: "#13C2C2" }} onError={() => false} />
          <div>
            <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12, cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(record._id)} title="Click để copy ID">
              <ShoppingCartOutlined style={{ marginRight: 4 }} />ID: {record._id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#0D364C", display: "block", fontSize: 14 }}>{record.categoryDetail?.name || "N/A"}</Text>
          {record.categoryDetail && (
            <Tag color={record.categoryDetail.status ? "#52c41a" : "#ff4d4f"} style={{ fontSize: 11, marginTop: 4 }}>
              {record.categoryDetail.status ? "Hoạt động" : "Ngừng hoạt động"}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Tag color="#13C2C2" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}>
          {(price || 0).toLocaleString("vi-VN")}đ
        </Tag>
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
            <Tag color={status ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
              {status ? "Hiển thị" : "Ẩn"}
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
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleOpenViewDetailModal(record)} style={{ color: "#13C2C2" }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} style={{ color: "#0D364C" }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tablePagination = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: filteredProducts.length,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => <Text style={{ color: "#0D364C" }}>Hiển thị {range[0]}-{range[1]} trong tổng số {total} sản phẩm</Text>,
      onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
      onShowSizeChange: (current, size) => setPagination({ current, pageSize: size }),
    }),
    [filteredProducts.length, pagination]
  );

  const dataForPage = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, pagination]);

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic title={<Text style={{ color: "#0D364C" }}>Tổng sản phẩm</Text>} value={stats.total} prefix={<ShoppingCartOutlined style={{ color: "#13C2C2" }} />} valueStyle={{ color: "#13C2C2", fontWeight: "bold" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic title={<Text style={{ color: "#0D364C" }}>Đang hiển thị</Text>} value={stats.active} prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />} valueStyle={{ color: "#52c41a", fontWeight: "bold" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, border: "1px solid #13C2C230" }}>
            <Statistic title={<Text style={{ color: "#0D364C" }}>Đang ẩn</Text>} value={stats.inactive} prefix={<StopOutlined style={{ color: "#ff4d4f" }} />} valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<ShoppingCartOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Sản phẩm</Title></Space>}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" style={{ flex: 1, flexWrap: "wrap" }}>
            <Input.Search placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 320, maxWidth: "100%" }} size="large" prefix={<SearchOutlined style={{ color: "#13C2C2" }} />} allowClear onSearch={(value) => setSearchText(value)} />
          </Space>
          <Space>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading} style={{ borderColor: "#13C2C2", color: "#13C2C2" }}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={{ backgroundColor: "#0D364C", borderColor: "#0D364C" }}>Thêm Sản phẩm</Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table rowKey={(record) => record._id} columns={columns} dataSource={dataForPage} pagination={tablePagination} style={{ borderRadius: 12, overflow: "hidden" }} scroll={{ x: true }} size="middle" />
        </Spin>
      </Card>

      <CreateProduct visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSuccess={handleCreateSuccess} categories={mockCategories.filter((c) => c.status)} />

      {selectedProduct && (
        <UpdateProduct visible={isUpdateModalVisible} productData={selectedProduct} onClose={() => { setIsUpdateModalVisible(false); setSelectedProduct(null); }} onSuccess={handleUpdateSuccess} categories={mockCategories} />
      )}

      {selectedProduct && (
        <ViewProductDetail visible={isViewDetailModalVisible} productData={selectedProduct} onClose={() => { setIsViewDetailModalVisible(false); setSelectedProduct(null); }} />
      )}
    </div>
  );
};

export default ProductManagement;


