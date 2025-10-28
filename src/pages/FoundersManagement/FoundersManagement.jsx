import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Popconfirm,
  InputNumber,
  Avatar,
  Tooltip,
  Spin,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  founderListRequest,
  founderDeleteRequest,
  founderUpdateSortOrderRequest,
  founderClearMessages,
} from "../../redux/actions/founderActions";
import CreateFounderModal from "./CreateFounderModal";
import UpdateFounderModal from "./UpdateFounderModal";

const { Title, Text } = Typography;

const FoundersManagement = () => {
  const dispatch = useDispatch();
  const { items: founders, loadingList, deleting, message: successMessage, error } = useSelector((state) => state.founder);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState(null);

  // Load data once on mount
  useEffect(() => {
    dispatch(founderListRequest({}));
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      dispatch(founderClearMessages());
      dispatch(founderListRequest({}));
    }
    if (error) {
      message.error(error);
      dispatch(founderClearMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleEdit = (founder) => {
    setSelectedFounder(founder);
    setIsUpdateModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(founderDeleteRequest(id));
  };

  const handleSortOrderChange = (id, newSortOrder) => {
    dispatch(founderUpdateSortOrderRequest(id, newSortOrder));
  };

  const handleRefresh = () => {
    dispatch(founderListRequest({}));
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
    dispatch(founderListRequest({}));
  }, [dispatch]);

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar) => (
        <Avatar
          size={50}
          src={avatar}
          icon={<TeamOutlined />}
          style={{ backgroundColor: "#13C2C2" }}
        />
      ),
    },
    {
      title: "Thông tin Founder",
      key: "founder",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#0D364C", display: "block", fontSize: 16 }}>{record.fullName}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{record.position}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 120,
      render: (sortOrder, record) => (
        <Space>
          <Button
            size="small"
            icon={<ArrowUpOutlined />}
            onClick={() => handleSortOrderChange(record._id, sortOrder - 1)}
          />
          <InputNumber
            min={0}
            value={sortOrder}
            onChange={(value) => handleSortOrderChange(record._id, value)}
            style={{ width: 80 }}
          />
          <Button
            size="small"
            icon={<ArrowDownOutlined />}
            onClick={() => handleSortOrderChange(record._id, sortOrder + 1)}
          />
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Tag color={record.status ? "#52c41a" : "#ff4d4f"} style={{ borderRadius: 16, fontWeight: 500, padding: "4px 12px" }}>
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
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#0D364C" }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa Founder này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deleting}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)", minHeight: "100vh" }}>
      <Card style={{ borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #13C2C220" }} title={<Space><Avatar style={{ backgroundColor: "#13C2C2" }} icon={<TeamOutlined />} /><Title level={3} style={{ margin: 0, color: "#0D364C" }}>Quản lý Founders</Title></Space>}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Toolbar */}
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div></div>
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

          {/* Table */}
          <Spin spinning={loadingList} tip="Đang tải founders...">
            <Table
              columns={columns}
              dataSource={founders}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showTotal: (total, range) => (
                  <Text style={{ color: "#0D364C" }}>
                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} founders
                  </Text>
                ),
              }}
              scroll={{ x: 1200 }}
              style={{ borderRadius: 12, overflow: "hidden" }}
              size="middle"
            />
          </Spin>
        </Space>
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
    </div>
  );
};

export default FoundersManagement;

