import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { 
  Shield, 
  Clock, 
  Users,
  Utensils,
  DollarSign,
  Trash2,
  RefreshCw,
  Plus,
  Edit,
  Database,
  ShieldCheck,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  adminApi, 
  adminUsersApi, 
  tablesApi, 
  menuApi, 
  ordersApi,
  reservationsApi,
  rolesApi,
  cleanerApi,
  reviewsApi,
  type User,
  type Table,
  type MenuItem,
  type Order,
  type Reservation,
  type Transaction,
  type Role,
  type CleaningScheduleItem,
  type Review
} from '../../services/api';

interface AdminPanelProps {
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [cleaningSchedule, setCleaningSchedule] = useState<CleaningScheduleItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  // Form states
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '' });
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '', image: '' });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<CleaningScheduleItem | null>(null);
  const [newScheduleItem, setNewScheduleItem] = useState({
    taskName: '',
    description: '',
    area: 'Обеденный зал',
    priority: 'medium',
    estimatedTime: 15,
    intervalMinutes: 30,
  });



  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [
        usersData,
        tablesData,
        menuData,
        ordersData,
        reservationsData,
        transactionsData,
        rolesData,
        scheduleData,
        reviewsData
      ] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getTables(),
        menuApi.getAll(),
        adminApi.getOrders(),
        adminApi.getReservations(),
        adminApi.getTransactions(),
        rolesApi.getAll(),
        cleanerApi.getSchedule().catch(() => []),
        reviewsApi.adminGetAll().catch(() => [])
      ]);

      setUsers(usersData || []);
      setTables(tablesData || []);
      setMenuItems(menuData || []);
      setOrders(ordersData || []);
      setReservations(reservationsData || []);
      setTransactions(transactionsData || []);
      setRoles(rolesData || []);
      setCleaningSchedule(scheduleData || []);
      setReviews(reviewsData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      const errorMsg = error?.message || '';
      if (errorMsg.includes('БАЗА ДАННЫХ') || errorMsg.includes('ECONNREFUSED')) {
        setApiError('⚠️ БАЗА ДАННЫХ НЕДОСТУПНА: Сервер API не может подключиться к MySQL. Функционал ограничен.');
      } else {
        setApiError('⚠️ Ошибка загрузки данных: ' + errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScheduleItem = async () => {
    if (apiError) {
      toast.error('База данных недоступна. Добавление невозможно.');
      return;
    }
    if (!newScheduleItem.taskName.trim()) {
      toast.error('Введите название задачи');
      return;
    }
    try {
      await cleanerApi.createSchedule(newScheduleItem);
      toast.success('Задача добавлена в расписание');
      setNewScheduleItem({
        taskName: '',
        description: '',
        area: 'Обеденный зал',
        priority: 'medium',
        estimatedTime: 15,
        intervalMinutes: 30,
      });
      setScheduleDialogOpen(false);
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка добавления: ' + error.message);
    }
  };

  const handleUpdateScheduleItem = async () => {
    if (!editingSchedule) return;
    try {
      await cleanerApi.updateSchedule(editingSchedule.ScheduleID, {
        taskName: editingSchedule.TaskName,
        description: editingSchedule.Description,
        area: editingSchedule.Area,
        priority: editingSchedule.Priority,
        estimatedTime: editingSchedule.EstimatedTime,
        intervalMinutes: editingSchedule.IntervalMinutes,
      });
      toast.success('Задача обновлена');
      setEditingSchedule(null);
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка обновления: ' + error.message);
    }
  };

  const handleDeleteScheduleItem = async (id: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Удалить задачу из расписания?')) return;
    try {
      await cleanerApi.deleteSchedule(id);
      setCleaningSchedule(cleaningSchedule.filter(s => s.ScheduleID !== id));
      toast.success('Задача удалена');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleToggleSchedule = async (item: CleaningScheduleItem) => {
    try {
      await cleanerApi.updateSchedule(item.ScheduleID, { isActive: item.IsActive ? 0 : 1 });
      toast.success('Статус обновлен');
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await adminUsersApi.delete(userId);
      setUsers(users.filter(u => u.UserID !== userId));
      toast.success('Пользователь удален');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleDeleteTable = async (tableId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить этот стол?')) return;
    try {
      await tablesApi.delete(tableId);
      setTables(tables.filter(t => t.TableID !== tableId));
      toast.success('Стол удален');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleAddTable = async () => {
    if (apiError) {
      toast.error('База данных недоступна. Добавление невозможно.');
      return;
    }
    if (!newTable.tableNumber || !newTable.capacity) {
      toast.error('Заполните все поля');
      return;
    }
    try {
      await tablesApi.create(parseInt(newTable.tableNumber), parseInt(newTable.capacity));
      toast.success('Стол добавлен');
      setNewTable({ tableNumber: '', capacity: '' });
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка добавления: ' + error.message);
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Деактивация невозможна.');
      return;
    }
    if (!confirm('Снять это блюдо с продажи?')) return;
    try {
      await menuApi.update(id, { isActive: false });
      setMenuItems(menuItems.filter(m => m.MenuItemID !== id));
      toast.success('Блюдо снято с продажи');
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const handleAddMenuItem = async () => {
    if (apiError) {
      toast.error('База данных недоступна. Добавление невозможно.');
      return;
    }
    if (!newMenuItem.name || !newMenuItem.price) {
      toast.error('Заполните название и цену');
      return;
    }
    try {
      await menuApi.create(
        newMenuItem.name,
        newMenuItem.description,
        parseFloat(newMenuItem.price),
        true,
        newMenuItem.image || undefined
      );
      toast.success('Блюдо добавлено');
      setNewMenuItem({ name: '', description: '', price: '', image: '' });
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка добавления: ' + error.message);
    }
  };

  const handleUpdateMenuItem = async () => {
    if (apiError) {
      toast.error('База данных недоступна. Обновление невозможно.');
      return;
    }
    if (!editingMenuItem) return;
    try {
      await menuApi.update(editingMenuItem.MenuItemID, {
        name: editingMenuItem.Name,
        description: editingMenuItem.Description,
        price: editingMenuItem.Price,
        isActive: editingMenuItem.IsActive,
        image: editingMenuItem.Image
      });
      toast.success('Блюдо обновлено');
      setEditingMenuItem(null);
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка обновления: ' + error.message);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;
    try {
      await ordersApi.delete(orderId);
      setOrders(orders.filter(o => o.OrderID !== orderId));
      toast.success('Заказ удален');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleDeleteReservation = async (reservationId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить эту бронь?')) return;
    try {
      await reservationsApi.adminDelete(reservationId);
      setReservations(reservations.filter(r => r.ReservationID !== reservationId));
      toast.success('Бронь удалена');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleAddRole = async () => {
    if (apiError) {
      toast.error('База данных недоступна. Добавление невозможно.');
      return;
    }
    if (!newRoleName.trim()) {
      toast.error('Введите название роли');
      return;
    }
    try {
      await rolesApi.create(newRoleName.trim());
      toast.success('Роль добавлена');
      setNewRoleName('');
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка добавления роли: ' + error.message);
    }
  };

  const handleUpdateUserRole = async (userId: number, newRoleId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Изменение роли невозможно.');
      return;
    }
    try {
      await adminUsersApi.updateRole(userId, newRoleId);
      setUsers(users.map(u => u.UserID === userId ? { ...u, RoleId: newRoleId } : u));
      toast.success('Роль пользователя обновлена');
    } catch (error: any) {
      toast.error('Ошибка изменения роли: ' + error.message);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить эту роль?')) return;
    try {
      await rolesApi.delete(roleId);
      setRoles(roles.filter(r => r.Id !== roleId));
      toast.success('Роль удалена');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadMenuImage = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('https://up-api.timka20.ru/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
      }
      const data = await response.json();
      if (data.success && data.link) {
        toast.success('Фото загружено');
        return data.link;
      }
      throw new Error('Некорректный ответ от сервера загрузки');
    } catch (error: any) {
      toast.error('Ошибка загрузки фото: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (apiError) {
      toast.error('База данных недоступна. Удаление невозможно.');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    try {
      await reviewsApi.adminDelete(reviewId);
      setReviews(reviews.filter(r => r.ReviewID !== reviewId));
      toast.success('Отзыв удален');
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleUpdateReview = async () => {
    if (apiError) {
      toast.error('База данных недоступна. Обновление невозможно.');
      return;
    }
    if (!editingReview) return;
    try {
      await reviewsApi.adminUpdate(editingReview.ReviewID, {
        rating: editingReview.Rating,
        comment: editingReview.Comment,
      });
      toast.success('Отзыв обновлен');
      setEditingReview(null);
      loadAllData();
    } catch (error: any) {
      toast.error('Ошибка обновления: ' + error.message);
    }
  };

  const getRoleName = (roleId: number) => {
    // Ищем роль в загруженных данных из API
    const role = roles.find(r => r.Id === roleId);
    if (role) return role.Name;
    
    // Fallback на случай если роли еще не загружены
    const defaultRoles: Record<number, string> = {
      1: 'Клиент',
      2: 'Официант',
      3: 'Повар',
      4: 'Уборщик',
      5: 'Поставщик',
      6: 'Администратор'
    };
    return defaultRoles[roleId] || `Роль ${roleId}`;
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + (parseFloat(t.Amount as any) || 0), 0);
  const activeOrders = orders.filter(o => o.Status !== 'completed' && o.Status !== 'cancelled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center space-x-3 text-2xl font-bold">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Панель администратора</span>
          </h1>
          <p className="text-gray-600">
            Управление всеми аспектами ресторана
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={loadAllData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
            <Shield className="w-4 h-4 mr-2" />
            Администратор
          </Badge>
        </div>
      </div>

      {/* Critical Error Alert */}
      {apiError && (
        <Alert className="border-red-200 bg-red-50">
          <Database className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            {apiError}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={apiError ? 'opacity-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiError ? '—' : users.length}</div>
          </CardContent>
        </Card>

        <Card className={apiError ? 'opacity-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Столы</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiError ? '—' : tables.length}</div>
          </CardContent>
        </Card>

        <Card className={apiError ? 'opacity-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные заказы</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiError ? '—' : activeOrders}</div>
          </CardContent>
        </Card>

        <Card className={apiError ? 'opacity-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiError ? '—' : totalRevenue.toLocaleString() + ' ₽'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="roles">Роли</TabsTrigger>
          <TabsTrigger value="tables">Столы</TabsTrigger>
          <TabsTrigger value="menu">Меню</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="reservations">Бронирования</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          <TabsTrigger value="cleaning-schedule">Расписание уборки</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи системы</CardTitle>
              <CardDescription>Управление пользователями и их ролями</CardDescription>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Список пользователей не может быть загружен.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.UserID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.Username}</p>
                      <p className="text-sm text-muted-foreground">ID: {user.UserID}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={String(user.RoleId)}
                        onValueChange={(value) => handleUpdateUserRole(user.UserID, parseInt(value))}
                        disabled={apiError}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.Id} value={String(role.Id)}>
                              {role.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.UserID)}
                        disabled={apiError}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8">Нет пользователей</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Добавить роль</CardTitle>
              <CardDescription>Создание новой роли для пользователей</CardDescription>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Управление ролями невозможно.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Название роли (например: Администратор)"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  disabled={apiError}
                  className="flex-1"
                />
                <Button onClick={handleAddRole} disabled={apiError}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список ролей</CardTitle>
              <CardDescription>Доступные роли в системе</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const isSystem = [1,2,3,4,5,6].includes(role.Id);
                  return (
                    <Card key={role.Id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{role.Name}</p>
                              {isSystem && (
                                <Badge variant="outline" style={{ fontSize: '11px', padding: '0 6px', height: '18px', color: '#0369a1', borderColor: '#7dd3fc', backgroundColor: '#e0f2fe' }}>
                                  Системная
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {role.Id}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRole(role.Id)}
                          disabled={apiError || isSystem}
                          className="text-red-600 disabled:opacity-50"
                          title={isSystem ? "Нельзя удалить системную роль" : "Удалить роль"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
                {roles.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8 col-span-3">Нет ролей</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Добавить стол</CardTitle>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Добавление столов невозможно.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Номер стола"
                  type="number"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                  disabled={apiError}
                />
                <Input
                  placeholder="Вместимость"
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                  disabled={apiError}
                />
                <Button onClick={handleAddTable} disabled={apiError}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список столов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <Card key={table.TableID} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Стол {table.TableNumber}</p>
                        <p className="text-sm text-muted-foreground">Вместимость: {table.Capacity}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTable(table.TableID)}
                        disabled={apiError}
                        className="text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {tables.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8 col-span-3">Нет столов</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingMenuItem ? 'Редактировать блюдо' : 'Добавить блюдо'}</CardTitle>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Управление меню невозможно.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Название"
                  disabled={apiError}
                  value={editingMenuItem ? editingMenuItem.Name : newMenuItem.name}
                  onChange={(e) => editingMenuItem 
                    ? setEditingMenuItem({ ...editingMenuItem, Name: e.target.value })
                    : setNewMenuItem({ ...newMenuItem, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Описание"
                  disabled={apiError}
                  value={editingMenuItem ? editingMenuItem.Description : newMenuItem.description}
                  onChange={(e) => editingMenuItem
                    ? setEditingMenuItem({ ...editingMenuItem, Description: e.target.value })
                    : setNewMenuItem({ ...newMenuItem, description: e.target.value })
                  }
                />
                <Input
                  placeholder="Цена"
                  type="number"
                  disabled={apiError}
                  value={editingMenuItem ? editingMenuItem.Price : newMenuItem.price}
                  onChange={(e) => editingMenuItem
                    ? setEditingMenuItem({ ...editingMenuItem, Price: parseFloat(e.target.value) })
                    : setNewMenuItem({ ...newMenuItem, price: e.target.value })
                  }
                />
                {(editingMenuItem?.Image || newMenuItem.image) && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={editingMenuItem ? editingMenuItem.Image : newMenuItem.image}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <span className="text-sm text-muted-foreground">Текущее фото</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Вставьте ссылку на фото вручную"
                    disabled={apiError}
                    value={editingMenuItem ? editingMenuItem.Image || '' : newMenuItem.image || ''}
                    onChange={(e) => {
                      if (editingMenuItem) {
                        setEditingMenuItem({ ...editingMenuItem, Image: e.target.value });
                      } else {
                        setNewMenuItem({ ...newMenuItem, image: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={apiError || uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const link = await uploadMenuImage(file);
                      if (link) {
                        if (editingMenuItem) {
                          setEditingMenuItem({ ...editingMenuItem, Image: link });
                        } else {
                          setNewMenuItem({ ...newMenuItem, image: link });
                        }
                      }
                    }}
                  />
                  {uploadingImage && <span className="text-sm text-muted-foreground">Загрузка...</span>}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={editingMenuItem ? handleUpdateMenuItem : handleAddMenuItem}
                    disabled={apiError}
                    className="flex-1"
                  >
                    {editingMenuItem ? (
                      <><Edit className="w-4 h-4 mr-2" /> Обновить</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" /> Добавить</>
                    )}
                  </Button>
                  {editingMenuItem && (
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingMenuItem(null)}
                    >
                      Отмена
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Меню</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.MenuItemID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {item.Image && (
                        <img
                          src={item.Image}
                          alt={item.Name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.Name}</p>
                        <p className="text-sm text-muted-foreground">{item.Description}</p>
                        <p className="text-sm font-medium text-green-600">{item.Price} ₽</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.IsActive ? 'default' : 'secondary'}>
                        {item.IsActive ? 'Активно' : 'Неактивно'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMenuItem(item)}
                        disabled={apiError}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMenuItem(item.MenuItemID)}
                        disabled={apiError}
                        className="text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {menuItems.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8">Меню пусто</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Все заказы</CardTitle>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Список заказов не может быть загружен.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.OrderID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Заказ #{order.OrderID}</p>
                      <p className="text-sm text-muted-foreground">
                        Стол {order.TableNumber} • {order.UserUsername}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.OrderDateTime).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={order.Status === 'new' ? 'default' : 'secondary'}>
                        {order.Status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.OrderID)}
                        disabled={apiError}
                        className="text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8">Нет заказов</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Бронирования</CardTitle>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Список бронирований не может быть загружен.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.ReservationID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Бронь #{reservation.ReservationID}</p>
                      <p className="text-sm text-muted-foreground">
                        Стол {reservation.TableNumber} • {reservation.UserUsername}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.ReservationDateTime).toLocaleString('ru-RU')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Гостей: {reservation.NumberOfPeople}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReservation(reservation.ReservationID)}
                      disabled={apiError}
                      className="text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {reservations.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8">Нет бронирований</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Отзывы клиентов</CardTitle>
              <CardDescription>Просмотр, редактирование и удаление отзывов</CardDescription>
              {apiError && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ База данных недоступна. Список отзывов не может быть загружен.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editingReview && (
                  <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <h3 className="font-medium">Редактирование отзыва #{editingReview.ReviewID}</h3>
                    <div className="space-y-2">
                      <Label>Оценка (1-5)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={editingReview.Rating}
                        onChange={(e) => setEditingReview({ ...editingReview, Rating: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Комментарий</Label>
                      <Input
                        value={editingReview.Comment || ''}
                        onChange={(e) => setEditingReview({ ...editingReview, Comment: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleUpdateReview}>
                        <Save className="w-4 h-4 mr-2" /> Сохранить
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingReview(null)}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
                {reviews.map((review) => (
                  <div key={review.ReviewID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Отзыв к заказу #{review.OrderID}</p>
                      <p className="text-sm text-muted-foreground">
                        Оценка: {'⭐'.repeat(review.Rating)} ({review.Rating}/5)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.Comment || 'Без комментария'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.UserUsername || 'Пользователь'} • {new Date(review.CreatedAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingReview(review)}
                        disabled={apiError}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReview(review.ReviewID)}
                        disabled={apiError}
                        className="text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && !apiError && (
                  <p className="text-center text-muted-foreground py-8">Нет отзывов</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cleaning Schedule Tab */}
        <TabsContent value="cleaning-schedule" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Расписание уборки</CardTitle>
                <CardDescription>Управление регулярными задачами уборщика</CardDescription>
              </div>
              <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Добавить
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая задача в расписание</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Название</Label>
                      <Input value={newScheduleItem.taskName} onChange={e => setNewScheduleItem({...newScheduleItem, taskName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Input value={newScheduleItem.description} onChange={e => setNewScheduleItem({...newScheduleItem, description: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Зона</Label>
                      <Select value={newScheduleItem.area} onValueChange={v => setNewScheduleItem({...newScheduleItem, area: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Обеденный зал">Обеденный зал</SelectItem>
                          <SelectItem value="Кухня">Кухня</SelectItem>
                          <SelectItem value="Туалеты">Туалеты</SelectItem>
                          <SelectItem value="Вход/Ресепшен">Вход/Ресепшен</SelectItem>
                          <SelectItem value="Кладовая">Кладовая</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Приоритет</Label>
                        <Select value={newScheduleItem.priority} onValueChange={v => setNewScheduleItem({...newScheduleItem, priority: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Низкий</SelectItem>
                            <SelectItem value="medium">Средний</SelectItem>
                            <SelectItem value="high">Высокий</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Интервал (мин)</Label>
                        <Input type="number" value={newScheduleItem.intervalMinutes} onChange={e => setNewScheduleItem({...newScheduleItem, intervalMinutes: Number(e.target.value)})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Время выполнения (мин)</Label>
                      <Input type="number" value={newScheduleItem.estimatedTime} onChange={e => setNewScheduleItem({...newScheduleItem, estimatedTime: Number(e.target.value)})} />
                    </div>
                    <Button onClick={handleAddScheduleItem} className="w-full">Сохранить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {cleaningSchedule.map((item) => (
                <div key={item.ScheduleID} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                    <span className="font-medium text-sm">{item.TaskName}</span>
                    <span className="text-sm text-muted-foreground">{item.Area}</span>
                    <Badge variant="outline">{item.IntervalMinutes} мин</Badge>
                    <div className={`w-2 h-2 rounded-full ${item.Priority === 'high' ? 'bg-red-600' : item.Priority === 'medium' ? 'bg-orange-600' : 'bg-green-600'}`} />
                    <Badge variant={item.IsActive ? 'default' : 'secondary'}>
                      {item.IsActive ? 'Активно' : 'Выключено'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button size="sm" variant={item.IsActive ? 'default' : 'outline'} onClick={() => handleToggleSchedule(item)}>
                      {item.IsActive ? 'Вкл' : 'Выкл'}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => setEditingSchedule(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактировать задачу</DialogTitle>
                        </DialogHeader>
                        {editingSchedule && editingSchedule.ScheduleID === item.ScheduleID && (
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Название</Label>
                              <Input value={editingSchedule.TaskName} onChange={e => setEditingSchedule({...editingSchedule, TaskName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <Label>Описание</Label>
                              <Input value={editingSchedule.Description || ''} onChange={e => setEditingSchedule({...editingSchedule, Description: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <Label>Зона</Label>
                              <Select value={editingSchedule.Area || ''} onValueChange={v => setEditingSchedule({...editingSchedule, Area: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Обеденный зал">Обеденный зал</SelectItem>
                                  <SelectItem value="Кухня">Кухня</SelectItem>
                                  <SelectItem value="Туалеты">Туалеты</SelectItem>
                                  <SelectItem value="Вход/Ресепшен">Вход/Ресепшен</SelectItem>
                                  <SelectItem value="Кладовая">Кладовая</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Приоритет</Label>
                                <Select value={editingSchedule.Priority} onValueChange={v => setEditingSchedule({...editingSchedule, Priority: v as any})}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Низкий</SelectItem>
                                    <SelectItem value="medium">Средний</SelectItem>
                                    <SelectItem value="high">Высокий</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Интервал (мин)</Label>
                                <Input type="number" value={editingSchedule.IntervalMinutes} onChange={e => setEditingSchedule({...editingSchedule, IntervalMinutes: Number(e.target.value)})} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Время выполнения (мин)</Label>
                              <Input type="number" value={editingSchedule.EstimatedTime} onChange={e => setEditingSchedule({...editingSchedule, EstimatedTime: Number(e.target.value)})} />
                            </div>
                            <Button onClick={handleUpdateScheduleItem} className="w-full">Сохранить изменения</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteScheduleItem(item.ScheduleID)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {cleaningSchedule.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Нет задач в расписании</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
