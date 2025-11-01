import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Modal, Select, Typography, Space, Divider, message } from "antd";
import {
  EditOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { staffOrderStatusesRequest } from "../../redux/actions/orderStaffAction";

const { Title, Text } = Typography;

const UpdateOrder = ({ visible, onClose, onSuccess, orderData }) => {
  const dispatch = useDispatch();
  const { statuses } = useSelector((state) => state.orderStaffReducer);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(orderData?.status || "pending");

  useEffect(() => {
    if (visible) {
      if (!statuses || statuses.length === 0) {
        dispatch(staffOrderStatusesRequest());
      }
      if (orderData) {
        form.setFieldsValue({ status: orderData.status });
        setSelectedStatus(orderData.status);
      }
    }
  }, [visible, orderData, form, statuses, dispatch]);

  const getStatusIcon = (statusName) => {
    const icons = {
      pending: <ClockCircleOutlined style={{ color: "#faad14" }} />,
      confirmed: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
      processing: <ShoppingCartOutlined style={{ color: "#722ed1" }} />,
      shipped: <ShoppingCartOutlined style={{ color: "#1890ff" }} />,
      delivered: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      cancelled: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      returned: <CloseCircleOutlined style={{ color: "#fa8c16" }} />
    };
    return icons[statusName] || icons.pending;
  };

  const statusOptions = (statuses || []).map((status) => ({
    value: status.name,
    label: status.description || status.name,
    icon: getStatusIcon(status.name),
    id: status._id
  }));

  const handleFinish = async (values) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const selected = statusOptions.find((opt) => opt.value === values.status);
      const finalStatusId =
        selected?.id ||
        orderData?.statusId ||
        orderData?.orderStatusId?._id ||
        orderData?.orderStatusId;

      const payload = {
        _id: orderData?._id,
        orderStatusId: finalStatusId,
        status: values.status
      };

      await onSuccess?.(payload);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi cập nhật đơn hàng");
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    primaryButton: {
      backgroundColor: "#13C2C2",
      borderColor: "#13C2C2",
      height: 44,
      borderRadius: 8,
      fontWeight: 600
    }
  };

  const getNextStatuses = (currentStatus) => {
    const flow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing"],
      processing: ["shipped"],
      shipped: ["delivered"],
      delivered: ["returned"],
      cancelled: [],
      returned: []
    };
    return statusOptions.filter(
      (opt) => flow[currentStatus]?.includes(opt.value) || opt.value === currentStatus
    );
  };

  const nextStatuses = getNextStatuses(orderData?.status || "pending");

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
      styles={{ body: { padding: 0 }, header: { display: "none" } }}
    >
      <Card bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#0D364C",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              <EditOutlined style={{ fontSize: 24, color: "white" }} />
            </div>
            <Title level={3} style={{ color: "#0D364C" }}>
              Cập nhật Đơn hàng
            </Title>
          </div>

          <Card size="small" style={{ backgroundColor: "#f8fdfd", border: "1px solid #13C2C220" }}>
            <Text strong style={{ color: "#0D364C" }}>
              <FileTextOutlined style={{ marginRight: 8, color: "#13C2C2" }} />
              Mã đơn hàng: {orderData?.orderNumber}
            </Text>
            <br />
            <Text style={{ color: "#666" }}>Khách hàng: {orderData?.customer?.name || "N/A"}</Text>
            <br />
            <Text style={{ color: "#666" }}>
              Tổng tiền: {(orderData?.totalPrice || 0).toLocaleString("vi-VN")}đ
            </Text>
          </Card>

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Trạng thái đơn hàng"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái đơn hàng!" }]}
            >
              <Select
                placeholder="Chọn trạng thái đơn hàng"
                onChange={(value) => setSelectedStatus(value)}
              >
                {nextStatuses.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    <Space>
                      {option.icon}
                      {option.label}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  icon={<EditOutlined />}
                  style={customStyles.primaryButton}
                >
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </Modal>
  );
};

UpdateOrder.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  orderData: PropTypes.object
};

export default UpdateOrder;
