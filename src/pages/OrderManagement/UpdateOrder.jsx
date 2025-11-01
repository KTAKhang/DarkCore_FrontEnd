import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Modal, Select, Typography, Space, Divider, message } from "antd";
import { EditOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { orderStatusesRequest } from "../../redux/actions/orderActions";

const { Title, Text } = Typography;

/**
 * Component Modal Cập nhật Đơn hàng
 * Cho phép cập nhật trạng thái đơn hàng theo luồng nghiệp vụ
 * 
 * @param {boolean} visible - Trạng thái hiển thị modal
 * @param {function} onClose - Callback khi đóng modal
 * @param {function} onSuccess - Callback khi cập nhật thành công
 * @param {object} orderData - Dữ liệu đơn hàng cần cập nhật
 */
const UpdateOrder = ({ visible, onClose, onSuccess, orderData }) => {
  const dispatch = useDispatch();
  // Lấy danh sách trạng thái đơn hàng từ Redux store
  const { statuses } = useSelector((state) => state.order);
  const [form] = Form.useForm(); // Form instance để quản lý form
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang submit
  const [selectedStatus, setSelectedStatus] = useState(orderData?.status || "pending"); // Trạng thái đang được chọn

  /**
   * Effect: Khởi tạo form khi modal mở
   * - Tải danh sách trạng thái nếu chưa có
   * - Set giá trị mặc định cho form
   */
  useEffect(() => {
    if (visible) {
      // Tải danh sách trạng thái nếu chưa có
      if (!statuses || statuses.length === 0) {
        dispatch(orderStatusesRequest());
      }

      if (orderData) {
        console.log("🔍 UpdateOrder - orderData:", orderData);
        console.log("🔍 UpdateOrder - status info:", {
          status: orderData.status,
          statusId: orderData.statusId,
          orderStatusId: orderData.orderStatusId
        });

        // Set giá trị mặc định cho form
        form.setFieldsValue({
          status: orderData.status,
        });
        setSelectedStatus(orderData.status);
      }
    }
  }, [visible, orderData, form, statuses, dispatch]);

  /**
   * Helper: Lấy icon tương ứng với tên trạng thái
   * @param {string} statusName - Tên trạng thái (pending, confirmed, ...)
   * @returns {ReactElement} Icon component
   */
  const getStatusIcon = (statusName) => {
    const iconMap = {
      pending: <ClockCircleOutlined style={{ color: "#faad14" }} />,
      confirmed: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
      processing: <ShoppingCartOutlined style={{ color: "#722ed1" }} />,
      shipped: <ShoppingCartOutlined style={{ color: "#1890ff" }} />,
      delivered: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      cancelled: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      returned: <CloseCircleOutlined style={{ color: "#fa8c16" }} />
    };
    return iconMap[statusName] || <ClockCircleOutlined style={{ color: "#faad14" }} />;
  };

  /**
   * Helper: Lấy màu sắc tương ứng với tên trạng thái
   * @param {string} statusName - Tên trạng thái
   * @returns {string} Mã màu hex
   */
  const getStatusColor = (statusName) => {
    const colorMap = {
      pending: "#faad14",
      confirmed: "#1890ff",
      processing: "#722ed1",
      shipped: "#1890ff",
      delivered: "#52c41a",
      cancelled: "#ff4d4f",
      returned: "#fa8c16"
    };
    return colorMap[statusName] || "#faad14";
  };

  /**
   * Chuyển đổi danh sách trạng thái từ backend thành options cho Select
   * Bao gồm: value, label, icon, description, color, id
   */
  const statusOptions = (statuses || []).map(status => ({
    value: status.name,
    label: status.description || status.name,
    icon: getStatusIcon(status.name),
    description: status.description || `Trạng thái: ${status.name}`,
    color: status.color || getStatusColor(status.name),
    id: status._id
  }));

  /**
   * Handler: Xử lý khi submit form cập nhật đơn hàng
   * - Tìm statusId từ trạng thái đã chọn
   * - Tạo payload và gọi callback onSuccess
   */
  const handleFinish = async (values) => {
    if (isSubmitting) return; // Tránh submit nhiều lần

    try {
      setIsSubmitting(true);

      // Tìm ID của trạng thái đã chọn
      const selectedStatusOption = statusOptions.find(option => option.value === values.status);
      const statusId = selectedStatusOption?.id || orderData?.statusId || orderData?.orderStatusId?._id || orderData?.orderStatusId;

      // Nếu chưa tìm thấy statusId, tìm trong mảng statuses
      let finalStatusId = statusId;
      if (!finalStatusId && statuses && statuses.length > 0) {
        const matchingStatus = statuses.find(status => status.name === values.status);
        if (matchingStatus) {
          finalStatusId = matchingStatus._id;
        }
      }

      // Debug log để kiểm tra dữ liệu
      console.log("🔍 UpdateOrder - handleFinish:", {
        selectedStatus: values.status,
        selectedStatusOption,
        statusId,
        finalStatusId,
        orderData: orderData,
        allStatusOptions: statusOptions
      });

      // Tạo payload để gửi lên API
      const payload = {
        _id: orderData?._id,
        orderStatusId: finalStatusId, // ID của trạng thái mới
        status: values.status, // Tên trạng thái (để tham khảo)
      };

      // Gọi callback onSuccess để parent component xử lý
      onSuccess && onSuccess(payload);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Update order error:", error);
      message.error("Có lỗi xảy ra khi cập nhật đơn hàng");
      setIsSubmitting(false);
    }
  };

  // Custom styles cho các components trong modal
  const customStyles = {
    card: { borderRadius: 8, border: "none", boxShadow: "none" },
    primaryButton: { backgroundColor: "#13C2C2", borderColor: "#13C2C2", height: 44, borderRadius: 8, fontWeight: 600, fontSize: 16 },
    title: { color: "#0D364C", marginBottom: 24, fontWeight: 700 },
    label: { color: "#0D364C", fontWeight: 600, fontSize: 14 },
    input: { borderRadius: 8, height: 40, borderColor: "#d9d9d9" },
    divider: { borderColor: "#13C2C2", opacity: 0.3 },
  };

  // Lấy thông tin của trạng thái hiện đang được chọn trong form
  const currentStatus = statusOptions.find(option => option.value === selectedStatus);

  // Lấy danh sách các trạng thái tiếp theo hợp lệ
  // Sử dụng trạng thái thực tế của đơn hàng (orderData.status) thay vì selectedStatus
  // để đảm bảo logic đúng khi user thay đổi lựa chọn nhưng chưa submit
  const nextStatuses = getNextStatuses(orderData?.status || "pending");

  /**
   * Function: Xác định các trạng thái tiếp theo hợp lệ dựa trên trạng thái hiện tại
   * 
   * Luồng chính: pending → confirmed → processing → shipped → delivered
   * Luồng phụ: 
   * - pending → cancelled (hủy đơn khi chưa xác nhận)
   * - delivered → returned (trả hàng sau khi đã giao)
   * 
   * @param {string} currentStatus - Trạng thái hiện tại của đơn hàng
   * @returns {Array} Danh sách các trạng thái tiếp theo hợp lệ
   */
  function getNextStatuses(currentStatus) {
    // Định nghĩa luồng chuyển trạng thái theo quy định nghiệp vụ
    const statusFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing"],
      processing: ["shipped"],
      shipped: ["delivered"],
      delivered: ["returned"],
      cancelled: [], // Trạng thái kết thúc - không thể chuyển sang trạng thái khác
      returned: [] // Trạng thái kết thúc - không thể chuyển sang trạng thái khác
    };

    // Filter ra các trạng thái hợp lệ: 
    // - Các trạng thái trong luồng tiếp theo
    // - Trạng thái hiện tại (cho phép giữ nguyên)
    return statusOptions.filter(option =>
      statusFlow[currentStatus]?.includes(option.value) || option.value === currentStatus
    );
  }

  return (
    <Modal
      open={visible}
      title={null}
      onCancel={onClose}
      footer={null}
      destroyOnClose // Xóa form khi đóng modal
      width={600}
      styles={{ body: { padding: 0 }, header: { display: "none" } }}
    >
      <Card style={customStyles.card}>
        <div style={{ padding: "8px 0" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Header: Icon và tiêu đề modal */}
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, backgroundColor: "#0D364C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <EditOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <Title level={3} style={customStyles.title}>Cập nhật Đơn hàng</Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Cập nhật trạng thái và thông tin đơn hàng</Text>
            </div>

            <Divider style={customStyles.divider} />

            {/* Thông tin đơn hàng đang cập nhật */}
            <Card size="small" style={{ backgroundColor: "#f8fdfd", border: "1px solid #13C2C220" }}>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Text strong style={{ color: "#0D364C", fontSize: 14 }}>
                  <FileTextOutlined style={{ marginRight: 8, color: "#13C2C2" }} />
                  Mã đơn hàng: {orderData?.orderNumber}
                </Text>
                <Text style={{ color: "#666", fontSize: 13 }}>
                  Khách hàng: {orderData?.customer?.name || "N/A"}
                </Text>
                <Text style={{ color: "#666", fontSize: 13 }}>
                  Tổng tiền: {(orderData?.totalPrice || orderData?.totalAmount || 0).toLocaleString("vi-VN")}đ
                </Text>
              </Space>
            </Card>

            {/* Form cập nhật trạng thái */}
            <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
              {/* Select chọn trạng thái mới */}
              <Form.Item
                label={
                  <Space>
                    <CheckCircleOutlined style={{ color: "#13C2C2" }} />
                    <span style={customStyles.label}>Trạng thái đơn hàng</span>
                  </Space>
                }
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái đơn hàng!" }]}
              >
                <Select
                  placeholder="Chọn trạng thái đơn hàng"
                  style={customStyles.input}
                  onChange={(value) => setSelectedStatus(value)} // Cập nhật selectedStatus khi thay đổi
                  optionLabelProp="label"
                >
                  {/* Hiển thị các trạng thái hợp lệ với icon và description */}
                  {nextStatuses.map((option) => (
                    <Select.Option key={option.value} value={option.value} label={option.label}>
                      <Space>
                        {option.icon}
                        <div>
                          <div style={{ fontWeight: 500, color: "#0D364C" }}>{option.label}</div>
                          <div style={{ fontSize: 12, color: "#666" }}>{option.description}</div>
                        </div>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Thông báo thay đổi trạng thái (hiển thị khi user chọn trạng thái mới) */}
              {currentStatus && selectedStatus !== orderData?.status && (
                <Card size="small" style={{ backgroundColor: "#fff7e6", border: "1px solid #faad14" }}>
                  <Space>
                    <ClockCircleOutlined style={{ color: "#faad14" }} />
                    <Text style={{ fontSize: 13, color: "#d46b08" }}>
                      Đang thay đổi từ <strong>&ldquo;{statusOptions.find(opt => opt.value === orderData?.status)?.label}&rdquo;</strong>
                      {" "}sang <strong>&ldquo;{currentStatus.label}&rdquo;</strong>
                    </Text>
                  </Space>
                </Card>
              )}

              <Divider style={customStyles.divider} />

              {/* Buttons: Hủy bỏ và Cập nhật */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  {/* Button Hủy bỏ */}
                  <Button
                    onClick={onClose}
                    size="large"
                    disabled={isSubmitting}
                    style={{ height: 44, borderRadius: 8, fontWeight: 500, minWidth: 120, borderColor: "#d9d9d9", color: "#666" }}
                  >
                    Hủy bỏ
                  </Button>
                  {/* Button Cập nhật (submit form) */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    icon={<EditOutlined />}
                    size="large"
                    disabled={isSubmitting}
                    style={{ ...customStyles.primaryButton, minWidth: 140 }}
                  >
                    Cập nhật
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Space>
        </div>
      </Card>
    </Modal>
  );
};

// PropTypes validation
UpdateOrder.propTypes = {
  visible: PropTypes.bool.isRequired, // Trạng thái hiển thị modal
  onClose: PropTypes.func.isRequired, // Callback khi đóng modal
  onSuccess: PropTypes.func, // Callback khi cập nhật thành công
  orderData: PropTypes.object, // Dữ liệu đơn hàng
};

export default UpdateOrder;
