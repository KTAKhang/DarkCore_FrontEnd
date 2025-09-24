import { useState } from "react";
import { Card, Input, Button, message, Form, Typography, Space, Divider } from "antd";
import { LockOutlined, KeyOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Motion component simulation (since framer-motion isn't available)
const Motion = ({ children, className, delay = 0, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`${className || ''} transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      {...props}
    >
      {children}
    </div>
  );
};

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại!';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới!';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự!';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới!';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success({
        content: "Đổi mật khẩu thành công!",
        icon: <CheckCircleOutlined style={{ color: '#13C2C2' }} />,
      });
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1200);
  };

  const customStyles = `
    .modern-container {
      min-height: 100vh;
      background: #fff;
      position: relative;
      overflow: hidden;
    }
    
    .modern-container::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 20% 80%, rgba(19, 194, 194, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(13, 54, 76, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(19, 194, 194, 0.08) 0%, transparent 50%);
      animation: float 20s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }
    
    .password-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border-radius: 24px;
      overflow: hidden;
      position: relative;
    }
    
    .password-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #13C2C2, #0D364C, #13C2C2);
    }
    
    .form-header {
      text-align: center;
      padding: 2rem 0;
      background: linear-gradient(135deg, rgba(19, 194, 194, 0.05), rgba(13, 54, 76, 0.08));
      margin: -1.5rem -1.5rem 2rem -1.5rem;
      position: relative;
    }
    
    .form-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #13C2C2, #0D364C);
      border-radius: 2px;
    }
    
    .icon-container {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
    }
    
    .icon-container::before {
      content: '';
      position: absolute;
      inset: -12px;
      background: linear-gradient(90deg, #13C2C2, #0D364C, #13C2C2);
      border-radius: 50%;
      opacity: 0.2;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .icon-container::after {
      content: '';
      position: absolute;
      inset: -8px;
      background: linear-gradient(90deg, #13C2C2, #0D364C, #13C2C2);
      border-radius: 50%;
      opacity: 0.1;
      animation: pulse 2s ease-in-out infinite 0.5s;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.2; }
      50% { transform: scale(1.1); opacity: 0.1; }
    }
    
    .security-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #13C2C2, #0D364C);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 36px;
      position: relative;
      z-index: 1;
      box-shadow: 0 10px 30px rgba(19, 194, 194, 0.4);
    }
    
    .form-item {
      margin-bottom: 24px;
    }
    
    .form-label {
      color: #0D364C;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      display: block;
    }
    
    .password-input {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      padding: 0 16px 0 52px;
      font-size: 16px;
      position: relative;
    }
    
    .password-input:hover {
      border-color: #13C2C2;
      background: rgba(255, 255, 255, 0.9);
    }
    
    .password-input:focus {
      outline: none;
      border-color: #13C2C2;
      box-shadow: 0 0 0 4px rgba(19, 194, 194, 0.1);
      background: rgba(255, 255, 255, 1);
    }
    
    .input-container {
      position: relative;
    }
    
    .input-prefix {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      z-index: 2;
      color: #13C2C2;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .modern-button {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #13C2C2 0%, #0D364C 50%, #13C2C2 100%);
      color: white;
      font-weight: 600;
      font-size: 16px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .modern-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(19, 194, 194, 0.4);
      background: linear-gradient(135deg, #0D364C 0%, #13C2C2 50%, #0D364C 100%);
    }
    
    .modern-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .modern-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    .modern-button:hover::before {
      left: 100%;
    }
    
    .security-tips {
      background: linear-gradient(135deg, rgba(19, 194, 194, 0.05) 0%, rgba(13, 54, 76, 0.08) 100%);
      border: 1px solid rgba(19, 194, 194, 0.2);
      border-radius: 16px;
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    
    .security-tips::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #13C2C2, #0D364C, #13C2C2);
    }
    
    .tips-grid {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }
    
    .tip-item {
      display: flex;
      align-items: flex-start;
      padding: 12px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      border: 1px solid rgba(19, 194, 194, 0.15);
      transition: all 0.3s ease;
    }
    
    .tip-item:hover {
      background: rgba(255, 255, 255, 0.8);
      border-color: rgba(19, 194, 194, 0.3);
      transform: translateX(4px);
    }
    
    .tip-icon {
      color: #13C2C2;
      margin-right: 12px;
      margin-top: 2px;
      font-size: 16px;
    }

    .custom-title {
      background: linear-gradient(90deg, #13C2C2, #0D364C, #13C2C2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-title {
      color: #0D364C;
      margin-bottom: 12px;
    }
  `;

  const securityTips = [
    "Không sử dụng thông tin cá nhân dễ đoán như tên, ngày sinh",
    "Thay đổi mật khẩu định kỳ để đảm bảo an toàn tài khoản",
    "Sử dụng ký tự đặc biệt để tăng độ bảo mật"
  ];

  const passwordRules = [
    "Mật khẩu phải có ít nhất 6 ký tự",
    "Chứa ít nhất một chữ cái viết hoa (A-Z)",
    "Chứa ít nhất một chữ cái viết thường (a-z)",
    "Chứa ít nhất một số (0-9)"
  ];

  return (
    <>
      <style>{customStyles}</style>
      <div className="modern-container flex justify-center items-center min-h-screen p-4">
        <Motion className="w-full max-w-4xl" delay={2}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Đổi mật khẩu */}
            <div className="flex-1">
              <Card className="password-card" style={{ padding: '24px' }}>
                <div className="form-header">
                  <div className="icon-container">
                    <div className="security-icon">
                      <SafetyOutlined style={{ fontSize: 40 }} />
                    </div>
                  </div>
                  <Title level={2} className="custom-title" style={{ marginBottom: 0 }}>
                    Đổi mật khẩu
                  </Title>
                  <Text type="secondary">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</Text>
                </div>
                <Divider />
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  autoComplete="off"
                >
                  <div className="form-item">
                    <label className="form-label" htmlFor="oldPassword">Mật khẩu hiện tại</label>
                    <div className="input-container">
                      <span className="input-prefix"><LockOutlined /></span>
                      <Input.Password
                        id="oldPassword"
                        className="password-input"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={formData.oldPassword}
                        onChange={e => handleInputChange('oldPassword', e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                    {errors.oldPassword && <div className="error-message">{errors.oldPassword}</div>}
                  </div>
                  <div className="form-item">
                    <label className="form-label" htmlFor="newPassword">Mật khẩu mới</label>
                    <div className="input-container">
                      <span className="input-prefix"><KeyOutlined /></span>
                      <Input.Password
                        id="newPassword"
                        className="password-input"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.newPassword}
                        onChange={e => handleInputChange('newPassword', e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                    {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                  </div>
                  <div className="form-item">
                    <label className="form-label" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <div className="input-container">
                      <span className="input-prefix"><LockOutlined /></span>
                      <Input.Password
                        id="confirmPassword"
                        className="password-input"
                        placeholder="Xác nhận mật khẩu mới"
                        value={formData.confirmPassword}
                        onChange={e => handleInputChange('confirmPassword', e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                  </div>
                  <Button
                    className="modern-button mt-2"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SafetyOutlined />}
                    disabled={loading}
                  >
                    Đổi mật khẩu
                  </Button>
                </form>
              </Card>
            </div>
            {/* Right: Mẹo bảo mật */}
            <div className="flex-1 flex items-stretch">
              <Card className="security-tips w-full flex flex-col justify-between" style={{ minHeight: '100%' }}>
                <Title level={4} className="section-title">Quy tắc bắt buộc</Title>
                <div className="tips-grid mb-6">
                  {passwordRules.map((rule, idx) => (
                    <div className="tip-item" key={idx}>
                      <span className="tip-icon"><SafetyOutlined /></span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
                <Divider />
                <Title level={4} className="section-title">Mẹo bảo mật</Title>
                <div className="tips-grid">
                  {securityTips.map((tip, idx) => (
                    <div className="tip-item" key={idx}>
                      <span className="tip-icon"><CheckCircleOutlined /></span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Motion>
      </div>
    </>
  );
}