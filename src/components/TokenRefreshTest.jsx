import React, { useState } from 'react';
import { Button, Card, Typography, Space, Alert, Divider } from 'antd';
import { ReloadOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import apiClient from '../utils/axiosConfigNoCredentials';

const { Title, Text } = Typography;

const TokenRefreshTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { message, type, timestamp }]);
  };

  const testTokenRefresh = async () => {
    setIsLoading(true);
    addTestResult('🔄 Bắt đầu test token refresh...', 'info');
    
    try {
      // Test 1: Kiểm tra token hiện tại
      const currentToken = localStorage.getItem('token');
      addTestResult(`🔑 Token hiện tại: ${currentToken ? `${currentToken.substring(0, 20)}...` : 'Không có'}`, 'info');
      
      // Test 2: Gọi API để trigger token refresh
      addTestResult('📡 Gọi API catalog để test token refresh...', 'info');
      const response = await apiClient.get('/catalog/api/categories?page=1&limit=1');
      addTestResult(`✅ API call thành công: ${response.status}`, 'success');
      
      // Test 3: Kiểm tra token mới
      const newToken = localStorage.getItem('token');
      addTestResult(`🔑 Token sau API call: ${newToken ? `${newToken.substring(0, 20)}...` : 'Không có'}`, 'info');
      
      if (currentToken !== newToken) {
        addTestResult('🎉 Token đã được refresh thành công!', 'success');
      } else {
        addTestResult('ℹ️ Token không thay đổi (có thể chưa hết hạn)', 'info');
      }
      
    } catch (error) {
      addTestResult(`❌ Lỗi: ${error.message}`, 'error');
      console.error('Token refresh test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testMultipleCalls = async () => {
    setIsLoading(true);
    addTestResult('🔄 Bắt đầu test multiple API calls...', 'info');
    
    try {
      // Gọi nhiều API calls liên tiếp để test token refresh
      const promises = [
        apiClient.get('/catalog/api/categories?page=1&limit=1'),
        apiClient.get('/catalog/api/products?page=1&limit=1'),
        apiClient.get('/catalog/api/categories/stats'),
      ];
      
      const results = await Promise.all(promises);
      addTestResult(`✅ Tất cả ${results.length} API calls thành công!`, 'success');
      
      results.forEach((result, index) => {
        addTestResult(`📡 API call ${index + 1}: ${result.status}`, 'success');
      });
      
    } catch (error) {
      addTestResult(`❌ Lỗi trong multiple calls: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error': return <ClockCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  return (
    <Card 
      title={
        <Space>
          <ReloadOutlined />
          <Title level={4} style={{ margin: 0 }}>Token Refresh Test</Title>
        </Space>
      }
      style={{ margin: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Test Token Refresh Functionality"
          description="Component này giúp test tính năng tự động refresh token khi token hết hạn."
          type="info"
          showIcon
        />
        
        <Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={testTokenRefresh}
            loading={isLoading}
          >
            Test Single API Call
          </Button>
          
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={testMultipleCalls}
            loading={isLoading}
          >
            Test Multiple API Calls
          </Button>
          
          <Button onClick={clearResults}>
            Clear Results
          </Button>
        </Space>
        
        <Divider />
        
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <Title level={5}>Test Results:</Title>
          {testResults.length === 0 ? (
            <Text type="secondary">Chưa có kết quả test nào...</Text>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: 8, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <Space>
                  {getResultIcon(result.type)}
                  <Text strong>[{result.timestamp}]</Text>
                  <Text>{result.message}</Text>
                </Space>
              </div>
            ))
          )}
        </div>
      </Space>
    </Card>
  );
};

export default TokenRefreshTest;
