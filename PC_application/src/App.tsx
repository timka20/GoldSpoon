import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { AdminPanel } from './components/admin/AdminPanel';
import { WaiterPanel } from './components/waiter/WaiterPanel';
import { ChefPanel } from './components/chef/ChefPanel';
import { CleanerPanel } from './components/cleaner/CleanerPanel';
import { SupplierPanel } from './components/supplier/SupplierPanel';
import { ClientPanel } from './components/client/ClientPanel';
import { useAuth } from './contexts/AuthContext';
import { authApi, menuApi, tablesApi, adminApi } from './services/api';
import { toast } from 'sonner';
import { 
  Users, 
  ChefHat, 
  Sparkles, 
  Truck,
  Shield,
  LogOut,
  AlertTriangle,
  Menu,
  X,
  Loader2,
  Database,
  UserCircle
} from 'lucide-react';

export default function App() {
  const { user: authUser, isLoading: authLoading, login, logout, isAuthenticated, error: authError, clearError } = useAuth();
  
  // DEBUG
  console.log('App render:', { isAuthenticated, authLoading, user: authUser?.name });
  // isLoginMode больше не нужен, используем только isAuthenticated
  const isMounted = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Check if API is available
  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    
    const checkApi = async () => {
      const result = await authApi.healthCheck();
      setApiAvailable(result.ok);
      if (!result.ok && result.error) {
        setDbError(result.error);
      }
    };
    checkApi();
  }, []);

  const getRoleIcon = (panel: string) => {
    switch (panel) {
      case 'admin': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'waiter': return <Users className="w-5 h-5 text-green-600" />;
      case 'chef': return <ChefHat className="w-5 h-5 text-orange-600" />;
      case 'cleaner': return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'supplier': return <Truck className="w-5 h-5 text-teal-600" />;
      default: return <UserCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderDashboard = () => {
    if (!authUser) return null;

    // Используем panel из AuthContext (определяется по RoleId)
    switch (authUser.panel) {
      case 'admin':
        return <AdminPanel user={authUser} />;
      case 'waiter':
        return <WaiterPanel user={authUser} />;
      case 'chef':
        return <ChefPanel user={authUser} />;
      case 'cleaner':
        return <CleanerPanel user={authUser} />;
      case 'supplier':
        return <SupplierPanel user={authUser} />;
      case 'client':
      default:
        return <ClientPanel user={authUser} />;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleLogin called');
    if (!loginForm.username || !loginForm.password) {
      toast.error('Введите логин и пароль');
      return;
    }

    try {
      setIsLoggingIn(true);
      console.log('Calling login...');
      await login(loginForm.username, loginForm.password);
      console.log('Login successful');
      toast.success('Успешный вход!');

      setApiAvailable(true);
      setDbError(null);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg = err.message || '';
      
      if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('недоступен')) {
        toast.error('Сервер API временно недоступен. Попробуйте позже.');
        setApiAvailable(false);
      } else if (errorMsg.includes('Invalid credentials') || errorMsg.includes('credentials')) {
        toast.error('Неверный логин или пароль');
      } else if (errorMsg.includes('timeout') || errorMsg.includes('времени')) {
        toast.error('Превышено время ожидания. Сервер может быть перегружен.');
      } else {
        toast.error(err.message || 'Ошибка входа. Проверьте данные.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    toast.info('Вы вышли из системы');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-4xl">
          {/* <img className="mx-auto w-48 h-32 mb-4" src="https://upload.timka20.ru/files/a826f7fe05b9.png" alt="" /> */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Вход в систему</CardTitle>
              <CardDescription>Введите учетные данные для доступа к панели управления</CardDescription>
            </CardHeader>
            <CardContent>
              {authError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg text-sm font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {authError}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Логин</Label>
                  <Input
                    id="username"
                    placeholder="Введите логин"
                    value={loginForm.username}
                    onChange={(e) => { setLoginForm({ ...loginForm, username: e.target.value }); clearError(); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    value={loginForm.password}
                    onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); clearError(); }}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    'Войти'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя панель */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Левая часть */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Управление рестораном</h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold text-gray-900">Управление</h1>
              </div>
            </div>
          </div>
          
          {/* Правая часть - Аккаунт */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Десктопная версия */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {getRoleIcon(authUser.panel)}
                <div className="hidden md:block">
                  <p className="font-medium text-gray-900 text-sm">{authUser.name}</p>
                  <p className="text-xs text-gray-500">{authUser.role}</p>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>

            {/* Мобильное меню */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Мобильное выпадающее меню */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getRoleIcon(authUser.panel)}
                <div>
                  <p className="font-medium text-gray-900 text-sm">{authUser.name}</p>
                  <p className="text-xs text-gray-500">{authUser.role}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Основной контент */}
      <main className="p-3 sm:p-4 lg:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Аккаунт {authUser.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">{authUser.role}</p>
            </div>
            <div className="mt-3 sm:mt-0 flex sm:justify-end">
              <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
                {new Date().toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
}
