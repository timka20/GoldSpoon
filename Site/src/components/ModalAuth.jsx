import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { LogIn, UserPlus, User } from 'lucide-react';

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  useEffect(() => {
    if (isOpen) {
      setError('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setMode('login');
    }
  }, [isOpen]);



  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!username.trim() || !password.trim()) {
          setError('Введите имя пользователя и пароль');
          setLoading(false);
          return;
        }
        await login(username, password);
        onClose();
      } else {
        if (!username.trim() || !password.trim()) {
          setError('Введите имя пользователя и пароль');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Пароли не совпадают');
          setLoading(false);
          return;
        }
        await register(username, password);
        await login(username, password);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <CloseIcon />
        </button>

        <div className="flex p-1 bg-[#2a2a3e] m-4 rounded-lg">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              mode === 'login'
                ? 'bg-[#D4AF37] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              mode === 'register'
                ? 'bg-[#D4AF37] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Регистрация
          </button>
        </div>

        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-3 text-[#D4AF37]">
            {mode === 'login' ? <LogIn size={28} /> : <UserPlus size={28} />}
          </div>
          <h2 className="text-white text-lg font-medium">
            {mode === 'login' ? 'Вход в личный кабинет' : 'Регистрация'}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {mode === 'login' ? 'Введите свои учетные данные для доступа к системе' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <div className="px-6 pb-6">
          <form className="space-y-4" onSubmit={handleSubmit}>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Имя пользователя *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#3a3a4e] text-white pl-10 pr-4 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Пароль *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#3a3a4e] text-white pl-10 pr-10 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-gray-300 text-sm mb-2">Подтвердите пароль *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <LockIcon />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#3a3a4e] text-white pl-10 pr-10 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-3 rounded-lg transition text-sm mt-2"
            >
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти в личный кабинет' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1a1a2e] text-gray-500">или</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-gray-400 text-sm">
                Еще нет аккаунта?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#D4AF37] hover:text-[#b5952f] transition"
                >
                  Создать аккаунт
                </button>
              </p>
            ) : (
              <button
                onClick={() => setMode('login')}
                className="text-[#D4AF37] hover:text-[#b5952f] transition text-sm"
              >
                Уже есть аккаунт? Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
