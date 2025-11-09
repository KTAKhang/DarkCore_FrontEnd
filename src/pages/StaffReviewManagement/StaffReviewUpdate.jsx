import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Tooltip } from "antd";
import PropTypes from "prop-types";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { updateReviewStatusStaffRequest } from "../../redux/actions/reviewStaffActions";

const StaffReviewUpdate = ({ review, loading }) => {
  const dispatch = useDispatch();

  const handleToggleStatus = useCallback(() => {
    if (!review?._id) return;

    const newStatus = !review.status;
    Modal.confirm({
      title: newStatus
        ? "Bạn có chắc muốn hiển thị đánh giá này?"
        : "Bạn có chắc muốn ẩn đánh giá này?",
      okText: newStatus ? "Hiển thị" : "Ẩn",
      cancelText: "Hủy",
      onOk() {
        dispatch(updateReviewStatusStaffRequest(review._id, newStatus));
      },
    });
  }, [dispatch, review]);

  if (!review) return null;

  const isVisible = Boolean(review.status);

  return (
    <Tooltip title={isVisible ? "Ẩn đánh giá" : "Hiển thị đánh giá"}>
      <Button
        type="text"
        icon={isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={handleToggleStatus}
        loading={loading}
        style={{ color: isVisible ? "#ff4d4f" : "#52c41a" }}
      />
    </Tooltip>
  );
};

export default StaffReviewUpdate;

StaffReviewUpdate.propTypes = {
  review: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.bool,
  }),
  loading: PropTypes.bool,
};

StaffReviewUpdate.defaultProps = {
  review: null,
  loading: false,
};