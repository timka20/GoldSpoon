import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) {
      return;
    }
    await register(username, password);
    const auth = useAuthStore.getState();
    if (auth.isAuthenticated) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-full flex flex-col px-6 py-8 animate-fade-in">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center">
            <UserPlus className="text-charcoal" size={36} />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">Регистрация</h1>
          <p className="text-muted text-sm">Создайте аккаунт в Золотой Ложке</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-platinum mb-1">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-gold transition-colors"
              placeholder="Придумайте логин"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-platinum mb-1">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-gold transition-colors pr-12"
                placeholder="Придумайте пароль"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-platinum mb-1">Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-gold transition-colors"
              placeholder="Повторите пароль"
              required
            />
            {password !== confirmPassword && confirmPassword && (
              <p className="text-red-400 text-xs mt-1">Пароли не совпадают</p>
            )}
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
            className="w-full bg-gold-gradient text-charcoal font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {isLoading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-gold font-medium">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

