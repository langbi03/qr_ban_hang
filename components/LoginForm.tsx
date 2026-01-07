
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { User as UserType, AppRoute } from '../types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic giả lập để minh họa
    if (username === 'admin' && password === 'admin') {
      onLogin({ username, role: 'admin' });
      navigate(AppRoute.ADMIN_DASHBOARD);
    } else {
      setError('Thông tin đăng nhập không chính xác. Gợi ý: admin / admin');
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-green-100">
        <LogIn className="w-10 h-10 text-green-600" />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Cổng Quản trị</h2>
        <p className="text-gray-500">Đăng nhập để quản lý kho hàng siêu thị của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              required
              type="text" 
              placeholder="Tên đăng nhập" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              required
              type="password" 
              placeholder="Mật khẩu" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 hover:bg-green-700 active:scale-[0.98] transition-all"
        >
          ĐĂNG NHẬP
        </button>
      </form>

      <div className="mt-12 p-4 bg-blue-50 border border-blue-100 rounded-xl w-full">
        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Tài khoản dùng thử</p>
        <p className="text-xs text-blue-700 font-medium">Username: admin / Password: admin</p>
      </div>
    </div>
  );
};

export default LoginForm;
