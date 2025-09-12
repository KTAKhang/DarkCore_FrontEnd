import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { loginRequest } from '../redux/actions/authActions';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Clear localStorage on component mount để có thể test giao diện
  useEffect(() => {
    // Uncomment dòng này nếu muốn clear auth state để test giao diện
    // localStorage.removeItem("token");
    // localStorage.removeItem("role");
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated (tạm thời disable để test giao diện)
  useEffect(() => {
    // Chỉ redirect khi không phải development mode hoặc khi user thực sự login thành công
    if (isAuthenticated && !loading) {
      // Tạm thời comment để có thể test giao diện login
      // navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    dispatch(loginRequest({
      email: formData.email,
      password: formData.password
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function để clear auth state (để test giao diện)(sau khi test xong thì comment lại)
  const clearAuthState = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dispatch({ type: 'LOGOUT' });
    window.location.reload(); // Reload để cập nhật state
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D364C 0%, #13C2C2 100%)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ backgroundColor: '#13C2C2' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" style={{ backgroundColor: '#0D364C' }}></div>
        <div className="absolute top-40 left-40 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000" style={{ backgroundColor: '#13C2C2' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          ></div>
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500" style={{ background: 'linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)' }}>
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Chào Mừng Trở Lại</h1>
            <p className="text-gray-300">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                  style={{ '--tw-ring-color': '#13C2C2', '--tw-ring-opacity': '0.5' }}
                  placeholder="Nhập email của bạn"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                  style={{ '--tw-ring-color': '#13C2C2', '--tw-ring-opacity': '0.5' }}
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 transition-colors duration-200 hover:text-white"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm transition-colors duration-200" style={{ color: '#13C2C2' }}>
                Quên mật khẩu?
              </Link>
              <Link to="" className="text-sm transition-colors duration-200" style={{ color: '#13C2C2' }}>
                Đăng Ký Tài Khoản
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.email || !formData.password}
              className="w-full relative overflow-hidden text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: `linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)`,
                boxShadow: `0 0 20px rgba(19, 194, 194, 0.3)`,
                '--tw-ring-color': '#13C2C2',
                '--tw-ring-opacity': '0.5'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                <span className="relative z-10">Đăng nhập</span>
              )}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100" style={{ background: `linear-gradient(135deg, #0D364C 0%, #13C2C2 100%)` }}></div>
            </button>
            {/* Google Login */}
            {/* Development: Button để clear auth state */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={clearAuthState}
                className="w-full mb-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
              >
                🔧 Clear Auth State (Dev Only)
              </button>
            )}

            <div className="mt-6 flex flex-col items-center">
              <p className="text-gray-300 mb-3">Hoặc đăng nhập bằng</p>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    const idToken = credentialResponse.credential;
                    const userInfo = jwtDecode(idToken);;
                    console.log("Google User Info:", userInfo);

                    dispatch(loginRequest({ idToken }));
                  }
                }}
                onError={() => {
                  console.log("Google Login Failed");
                }}
                useOneTap
              />
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .group:focus-within .group-focus-within\\:text-purple-400 {
          color: #13C2C2;
        }
        input:focus + * svg,
        input:focus ~ * svg {
          color: #13C2C2;
        }

        button:hover svg {
          color: #13C2C2;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;