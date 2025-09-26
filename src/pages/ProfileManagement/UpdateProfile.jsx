import { Card, Avatar, Row, Col, Form, Input, Select, Button, Upload, message, Switch } from 'antd';
import { 
  UserOutlined, 
  MailOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  UploadOutlined,
  CameraOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState } from 'react';

const { Option } = Select;

const EditProfile = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Sample user data - UpdateProfile
  const [userData] = useState({
    user_name: 'Sample User',
    email: 'sample.user@example.com',
    avatar: '',
    role_id: 'A004',
    status: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  });

  // Initialize form with current user data
  useState(() => {
    setFormData({
      user_name: userData.user_name,
      email: userData.email,
      role_id: userData.role_id,
      status: userData.status
    });
    setAvatarUrl(userData.avatar);
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form values:', { ...values, avatar: avatarUrl });
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Simulate getting URL from server
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      setLoading(false);
      message.success('Tải ảnh đại diện thành công!');
    }
  };

  // Upload props
  const uploadProps = {
    name: 'avatar',
    listType: 'picture',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Chỉ có thể tải lên file JPG/PNG!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
        return false;
      }
      return true;
    },
    onChange: handleAvatarChange,
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 bg-white">
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#13C2C2]/10 via-[#0D364C]/10 to-[#13C2C2]/10 blur-3xl -z-10"></div>
              
              {/* Back button */}
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />}
                className="mb-4 flex items-center text-gray-600 hover:text-[#0D364C] transition-colors"
                onClick={() => window.history.back()}
              >
                Quay lại
              </Button>

              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0D364C] via-[#13C2C2] to-[#0D364C] bg-clip-text text-transparent">
                  Chỉnh sửa thông tin
                </h1>
                <p className="text-gray-500 mt-2">Cập nhật thông tin cá nhân của bạn</p>
              </div>
            </motion.div>

            <div className="space-y-6">
              <Row gutter={[24, 24]} className="items-start">
                {/* Left Column - Avatar & Basic Info */}
                <Col xs={24} md={8}>
                  <div className="sticky top-24 space-y-6">
                    <Card 
                      className="rounded-3xl border-0 shadow-2xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg overflow-visible"
                    >
                      <div className="text-center relative">
                        {/* Avatar Upload Container */}
                        <div className="relative inline-block group">
                          {/* Animated rings */}
                          <div className="absolute -inset-4 bg-gradient-to-r from-[#13C2C2] via-[#0D364C] to-[#13C2C2] rounded-full blur-lg opacity-20 group-hover:opacity-30 animate-pulse"></div>
                          <div className="absolute -inset-4 bg-gradient-to-r from-[#0D364C] via-[#13C2C2] to-[#0D364C] rounded-full blur opacity-20 group-hover:opacity-30 animate-spin-slow"></div>
                          
                          {/* Upload overlay */}
                          <Upload {...uploadProps}>
                            <div className="relative cursor-pointer">
                              <Avatar 
                                size={160} 
                                src={avatarUrl || userData?.avatar}
                                icon={!avatarUrl && !userData?.avatar && <UserOutlined />} 
                                className="ring-8 ring-white shadow-2xl border-4 border-gray-100 group-hover:scale-105 transition-all duration-500 relative z-10"
                              />
                              
                              {/* Camera overlay */}
                              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                <CameraOutlined className="text-white text-2xl" />
                              </div>
                            </div>
                          </Upload>
                          
                        </div>

                        {/* Upload hint */}
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-12 space-y-3"
                        >
                          <p className="text-sm text-gray-500">
                            Click vào ảnh để thay đổi avatar
                          </p>
                          <p className="text-xs text-gray-400">
                            Định dạng: JPG, PNG. Tối đa 2MB
                          </p>
                        </motion.div>
                      </div>
                    </Card>
                  </div>
                </Col>

                {/* Right Column - Edit Form */}
                <Col xs={24} md={16}>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card 
                      className="rounded-3xl border-0 shadow-2xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg"
                      title={
                        <div className="flex items-center space-x-3 py-2">
                          <div className="w-1 h-8 bg-gradient-to-b from-[#0D364C] via-[#13C2C2] to-[#0D364C] rounded-full"></div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#0D364C] to-[#13C2C2] bg-clip-text text-transparent">
                            Thông tin tài khoản
                          </h3>
                        </div>
                      }
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Name */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="md:col-span-2"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <UserOutlined className="text-[#0D364C]" />
                              <span className="font-medium">Tên người dùng</span>
                            </div>
                            <Input 
                              size="large" 
                              placeholder="Nhập tên người dùng"
                              defaultValue={userData.user_name}
                              className="rounded-xl border-2 hover:border-[#13C2C2] focus:border-[#13C2C2] transition-colors"
                            />
                          </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="md:col-span-2"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <MailOutlined className="text-[#13C2C2]" />
                              <span className="font-medium">Email</span>
                            </div>
                            <Input 
                              size="large" 
                              placeholder="Nhập địa chỉ email"
                              defaultValue={userData.email}
                              className="rounded-xl border-2 hover:border-[#13C2C2] focus:border-[#13C2C2] transition-colors"
                            />
                          </div>
                        </motion.div>

                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100"
                      >
                        <Button 
                          size="large"
                          className="px-8 py-2 h-auto rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          onClick={() => window.location.reload()}
                        >
                          Đặt lại
                        </Button>
                        
                        <Button 
                          type="primary" 
                          size="large"
                          loading={loading}
                          icon={<SaveOutlined />}
                          className="px-8 py-2 h-auto rounded-xl bg-gradient-to-r from-[#0D364C] via-[#13C2C2] to-[#0D364C] border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                          onClick={() => handleSubmit()}
                        >
                          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                      </motion.div>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;