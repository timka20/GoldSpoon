import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { X } from 'lucide-react';
import {
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Utensils,
  RefreshCw,
  Loader2,
  CreditCard,
  DoorClosed,
  ChefHat,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ordersApi,
  menuApi,
  tablesApi,
  transactionsApi,
  type MenuItem,
  type Table,
  type Order
} from '../../services/api';

interface User {
  id: string;
  name: string;
  role: string;
}

interface WaiterPanelProps {
  user: User;
}

interface OrderItemLocal {
  MenuItemID: number;
  name: string;
  price: number;
  quantity: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'Новый', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <Clock className="w-4 h-4 text-orange-500" /> },
  pending: { label: 'Новый', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <Clock className="w-4 h-4 text-orange-500" /> },
  preparing: { label: 'Готовится', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <ChefHat className="w-4 h-4 text-blue-500" /> },
  ready: { label: 'Готов', color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  served: { label: 'Подан', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Utensils className="w-4 h-4 text-purple-500" /> },
  completed: { label: 'Завершен', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <CheckCircle className="w-4 h-4 text-gray-500" /> },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" /> };
}

function calculateOrderTotal(order: Order): number {
  return order.items?.reduce((sum, item) => sum + (item.Price || 0) * (item.Quantity || 0), 0) || 0;
}

export function WaiterPanel({ user }: WaiterPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  const [newOrder, setNewOrder] = useState<{
    tableId: number | null;
    items: OrderItemLocal[];
  }>({
    tableId: null,
    items: []
  });

  // Dialog for adding extra items to served order
  const [extraDialogOpen, setExtraDialogOpen] = useState(false);
  const [extraOrderId, setExtraOrderId] = useState<number | null>(null);
  const [extraTableNumber, setExtraTableNumber] = useState<string>('');
  const [extraItems, setExtraItems] = useState<OrderItemLocal[]>([]);
  const [extraCategory, setExtraCategory] = useState<string>('all');
  const [extraSubmitting, setExtraSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuData, tablesData, ordersData] = await Promise.all([
        menuApi.getAll().catch(() => []),
        tablesApi.getAll().catch(() => []),
        ordersApi.getAll().catch(() => [])
      ]);
      setMenuItems(menuData.filter((item: MenuItem) => item.IsActive));
      setTables(tablesData);
      setOrders(ordersData);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => {
    const name = item.Name.toLowerCase();
    if (name.includes('суп') || name.includes('борщ')) return 'Супы';
    if (name.includes('салат')) return 'Салаты';
    if (name.includes('кофе') || name.includes('чай') || name.includes('сок') || name.includes('компот') || name.includes('вода')) return 'Напитки';
    if (name.includes('торт') || name.includes('пирожное') || name.includes('мороженое') || name.includes('чизкейк')) return 'Десерты';
    return 'Горячие блюда';
  })))];

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => {
        const name = item.Name.toLowerCase();
        if (selectedCategory === 'Супы') return name.includes('суп') || name.includes('борщ');
        if (selectedCategory === 'Салаты') return name.includes('салат');
        if (selectedCategory === 'Напитки') return name.includes('кофе') || name.includes('чай') || name.includes('сок') || name.includes('компот') || name.includes('вода');
        if (selectedCategory === 'Десерты') return name.includes('торт') || name.includes('пирожное') || name.includes('мороженое') || name.includes('чизкейк');
        return true;
      });

  const extraFilteredMenuItems = extraCategory === 'all'
    ? menuItems
    : menuItems.filter(item => {
        const name = item.Name.toLowerCase();
        if (extraCategory === 'Супы') return name.includes('суп') || name.includes('борщ');
        if (extraCategory === 'Салаты') return name.includes('салат');
        if (extraCategory === 'Напитки') return name.includes('кофе') || name.includes('чай') || name.includes('сок') || name.includes('компот') || name.includes('вода');
        if (extraCategory === 'Десерты') return name.includes('торт') || name.includes('пирожное') || name.includes('мороженое') || name.includes('чизкейк');
        return true;
      });

  // Tables that are free (no active orders and not reserved)
  const activeTableIds = new Set(
    orders
      .filter(o => o.Status !== 'completed' && o.Status !== 'served')
      .map(o => o.TableID)
  );
  const freeTables = tables.filter(t => !activeTableIds.has(t.TableID) && !t.IsReserved);

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.Status === orderFilter);

  const addItemToOrder = (item: MenuItem) => {
    const existingItem = newOrder.items.find(orderItem => orderItem.MenuItemID === item.MenuItemID);
    if (existingItem) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map(orderItem =>
          orderItem.MenuItemID === item.MenuItemID
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, {
          MenuItemID: item.MenuItemID,
          name: item.Name,
          price: item.Price,
          quantity: 1
        }]
      });
    }
  };

  const removeItemFromOrder = (itemId: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter(item => item.MenuItemID !== itemId)
    });
  };

  const updateItemQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      removeItemFromOrder(itemId);
      return;
    }
    setNewOrder({
      ...newOrder,
      items: newOrder.items.map(item =>
        item.MenuItemID === itemId ? { ...item, quantity } : item
      )
    });
  };

  const calculateTotal = () => {
    return newOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (!newOrder.tableId || newOrder.items.length === 0) {
      toast.error('Выберите стол и добавьте блюда');
      return;
    }

    try {
      setIsLoading(true);
      const items = newOrder.items.map(item => ({
        menuItemId: item.MenuItemID,
        quantity: item.quantity
      }));

      await ordersApi.create(newOrder.tableId, items);
      toast.success('Заказ создан');
      setNewOrder({ tableId: null, items: [] });
      loadData();
    } catch (error) {
      toast.error('Ошибка создания заказа');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      setIsLoading(true);
      await ordersApi.updateStatus(orderId, status);
      toast.success('Статус обновлен');
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    } finally {
      setIsLoading(false);
    }
  };

  const closeOrder = async (orderId: number) => {
    try {
      setIsLoading(true);
      await ordersApi.updateStatus(orderId, 'completed');
      toast.success('Стол закрыт');
      loadData();
    } catch (error) {
      toast.error('Ошибка закрытия стола');
    } finally {
      setIsLoading(false);
    }
  };

  const payOrder = async (order: Order) => {
    const total = calculateOrderTotal(order);
    if (total <= 0) {
      toast.error('Сумма заказа 0');
      return;
    }
    try {
      setIsLoading(true);
      await transactionsApi.create(order.OrderID, total);
      await ordersApi.updateStatus(order.OrderID, 'completed');
      toast.success('Оплата проведена, стол закрыт');
      loadData();
    } catch (error) {
      toast.error('Ошибка при оплате');
    } finally {
      setIsLoading(false);
    }
  };

  // Extra order (дозаказ) logic
  const openExtraDialog = (order: Order) => {
    setExtraOrderId(order.OrderID);
    setExtraTableNumber(order.TableNumber || String(order.TableID));
    setExtraItems([]);
    setExtraCategory('all');
    setExtraDialogOpen(true);
  };

  const addExtraItem = (item: MenuItem) => {
    const existing = extraItems.find(i => i.MenuItemID === item.MenuItemID);
    if (existing) {
      setExtraItems(extraItems.map(i =>
        i.MenuItemID === item.MenuItemID ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setExtraItems([...extraItems, { MenuItemID: item.MenuItemID, name: item.Name, price: item.Price, quantity: 1 }]);
    }
  };

  const removeExtraItem = (itemId: number) => {
    setExtraItems(extraItems.filter(i => i.MenuItemID !== itemId));
  };

  const updateExtraQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeExtraItem(itemId);
      return;
    }
    setExtraItems(extraItems.map(i => i.MenuItemID === itemId ? { ...i, quantity } : i));
  };

  const calculateExtraTotal = () => {
    return extraItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const submitExtraItems = async () => {
    if (!extraOrderId || extraItems.length === 0) {
      toast.error('Выберите блюда для добавления');
      return;
    }
    try {
      setExtraSubmitting(true);
      const items = extraItems.map(item => ({
        menuItemId: item.MenuItemID,
        quantity: item.quantity
      }));
      await ordersApi.addItems(extraOrderId, items);
      toast.success('Блюда добавлены к заказу и переданы на кухню');
      setExtraDialogOpen(false);
      setExtraItems([]);
      setExtraOrderId(null);
      loadData();
    } catch (error) {
      toast.error('Ошибка при добавлении блюд');
    } finally {
      setExtraSubmitting(false);
    }
  };

  const getTableActiveOrder = (tableId: number): Order | undefined => {
    return orders.find(o => o.TableID === tableId && o.Status !== 'completed' && o.Status !== 'served');
  };

  const getTableServedOrder = (tableId: number): Order | undefined => {
    return orders.find(o => o.TableID === tableId && o.Status === 'served');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Панель официанта</h1>
          <p className="text-gray-600">Управление заказами и столами</p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="new-order">Новый заказ</TabsTrigger>
          <TabsTrigger value="tables">Столы</TabsTrigger>
        </TabsList>

        {/* ЗАКАЗЫ */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Активные заказы</CardTitle>
                  <CardDescription>Управление текущими заказами</CardDescription>
                </div>
                <Select value={orderFilter} onValueChange={setOrderFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Фильтр статуса" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="preparing">Готовится</SelectItem>
                    <SelectItem value="ready">Готов</SelectItem>
                    <SelectItem value="served">Подан</SelectItem>
                    <SelectItem value="completed">Завершен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const cfg = getStatusConfig(order.Status);
                  const total = calculateOrderTotal(order);
                  return (
                    <Card key={order.OrderID} className={`border-2 ${cfg.color}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Стол {order.TableNumber}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {cfg.icon}
                            <span className="text-sm font-medium">{cfg.label}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          #{order.OrderID} • {new Date(order.OrderDateTime).toLocaleTimeString('ru-RU')}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{item.MenuItemName} x{item.Quantity}</span>
                                <span className="font-medium">{((item.Price || 0) * item.Quantity).toLocaleString()} ₽</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Нет данных о блюдах</p>
                          )}
                        </div>

                        <Separator />

                        <div className="flex justify-between font-semibold text-sm">
                          <span>Сумма:</span>
                          <span>{total.toLocaleString()} ₽</span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {order.Status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.OrderID, 'served')}
                              className="flex-1"
                            >
                              <Utensils className="w-3 h-3 mr-1" />
                              Подано
                            </Button>
                          )}
                          {order.Status === 'served' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => payOrder(order)}
                                className="flex-1"
                                disabled={isLoading}
                              >
                                <CreditCard className="w-3 h-3 mr-1" />
                                Оплатить
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => closeOrder(order.OrderID)}
                                className="flex-1"
                                disabled={isLoading}
                              >
                                <DoorClosed className="w-3 h-3 mr-1" />
                                Закрыть
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openExtraDialog(order)}
                                className="flex-1"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                До заказать
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 col-span-full">Нет заказов</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* НОВЫЙ ЗАКАЗ */}
        <TabsContent value="new-order" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Меню</CardTitle>
                  <CardDescription>Выберите блюда для заказа</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все категории</SelectItem>
                        {categories.filter(c => c !== 'all').map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredMenuItems.map((item) => (
                        <Card key={item.MenuItemID} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{item.Name}</h4>
                              <span className="font-bold text-green-600">{item.Price} ₽</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.Description}</p>
                            <Button
                              size="sm"
                              onClick={() => addItemToOrder(item)}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Добавить
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Корзина</CardTitle>
                  <CardDescription>Текущий заказ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="table">Стол</Label>
                    <Select
                      value={newOrder.tableId?.toString() || ''}
                      onValueChange={(value) => setNewOrder({ ...newOrder, tableId: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите стол" />
                      </SelectTrigger>
                      <SelectContent>
                        {freeTables.length === 0 && (
                          <SelectItem value="none" disabled>Нет свободных столов</SelectItem>
                        )}
                        {freeTables.map((table) => (
                          <SelectItem key={table.TableID} value={table.TableID.toString()}>
                            Стол {table.TableNumber} (до {table.Capacity} чел.)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {freeTables.length === 0 && (
                      <p className="text-xs text-red-600">Все столы заняты или забронированы</p>
                    )}
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {newOrder.items.map((item) => (
                      <div key={item.MenuItemID} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm truncate">{item.name}</h5>
                          <p className="text-xs text-muted-foreground">{item.price} ₽</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.MenuItemID, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.MenuItemID, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItemFromOrder(item.MenuItemID)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {newOrder.items.length > 0 && (
                    <>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-medium">
                          <span>Итого:</span>
                          <span>{calculateTotal().toLocaleString()} ₽</span>
                        </div>
                      </div>

                      <Button
                        onClick={submitOrder}
                        className="w-full"
                        disabled={isLoading || !newOrder.tableId}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          'Отправить заказ'
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* СТОЛЫ */}
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Статус столов</CardTitle>
              <CardDescription>Обзор всех столов в ресторане</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => {
                  const activeOrder = getTableActiveOrder(table.TableID);
                  const servedOrder = getTableServedOrder(table.TableID);
                  const currentOrder = activeOrder || servedOrder;
                  const isOccupied = !!currentOrder;
                  const total = currentOrder ? calculateOrderTotal(currentOrder) : 0;

                  return (
                    <Card
                      key={table.TableID}
                      className={`${isOccupied ? 'border-orange-300' : 'border-green-300'}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Стол {table.TableNumber}</CardTitle>
                          <Badge variant={isOccupied ? 'secondary' : 'outline'} className={isOccupied ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                            {isOccupied ? 'Занят' : 'Свободен'}
                          </Badge>
                        </div>
                        <CardDescription>до {table.Capacity} чел.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {isOccupied && currentOrder && (
                          <>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {currentOrder.items && currentOrder.items.length > 0 ? (
                                currentOrder.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.MenuItemName} x{item.Quantity}</span>
                                    <span className="font-medium">{((item.Price || 0) * item.Quantity).toLocaleString()} ₽</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Нет данных о блюдах</p>
                              )}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-sm">
                              <span>Итого:</span>
                              <span className="text-green-700">{total.toLocaleString()} ₽</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Статус: {getStatusConfig(currentOrder.Status).label} • {new Date(currentOrder.OrderDateTime).toLocaleTimeString('ru-RU')}
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {currentOrder.Status === 'ready' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(currentOrder.OrderID, 'served')}
                                  className="flex-1"
                                  disabled={isLoading}
                                >
                                  <Utensils className="w-3 h-3 mr-1" />
                                  Подано
                                </Button>
                              )}
                              {currentOrder.Status === 'served' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => payOrder(currentOrder)}
                                    className="flex-1"
                                    disabled={isLoading}
                                  >
                                    <CreditCard className="w-3 h-3 mr-1" />
                                    Оплатить
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => closeOrder(currentOrder.OrderID)}
                                    className="flex-1"
                                    disabled={isLoading}
                                  >
                                    <DoorClosed className="w-3 h-3 mr-1" />
                                    Закрыть
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => openExtraDialog(currentOrder)}
                                    className="flex-1"
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    До заказать
                                  </Button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                        {!isOccupied && (
                          <div className="flex items-center justify-center py-4 text-green-700">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Стол свободен</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {tables.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 col-span-full">Нет столов</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal for adding extra items to served order */}
      {extraDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setExtraDialogOpen(false)}
          />
          <div className="relative z-50 w-full max-w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto sm:max-w-3xl bg-white rounded-lg border shadow-lg p-6 grid gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">До заказать — Стол {extraTableNumber}</h2>
                <p className="text-sm text-muted-foreground">Добавьте блюда к текущему заказу</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExtraDialogOpen(false)}
                className="rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Select value={extraCategory} onValueChange={setExtraCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.filter(c => c !== 'all').map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {extraFilteredMenuItems.map((item) => (
                    <Card key={item.MenuItemID} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{item.Name}</h4>
                          <span className="font-bold text-green-600 text-sm">{item.Price} ₽</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.Description}</p>
                        <Button
                          size="sm"
                          onClick={() => addExtraItem(item)}
                          className="w-full"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Добавить
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm">Добавляемые блюда</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {extraItems.length === 0 && (
                    <p className="text-sm text-muted-foreground">Ничего не выбрано</p>
                  )}
                  {extraItems.map((item) => (
                    <div key={item.MenuItemID} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{item.name}</h5>
                        <p className="text-xs text-muted-foreground">{item.price} ₽</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateExtraQuantity(item.MenuItemID, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateExtraQuantity(item.MenuItemID, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExtraItem(item.MenuItemID)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {extraItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Дополнительно:</span>
                      <span>{calculateExtraTotal().toLocaleString()} ₽</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => { setExtraItems([]); setExtraDialogOpen(false); }}>Отмена</Button>
              <Button
                onClick={submitExtraItems}
                disabled={extraSubmitting || extraItems.length === 0}
              >
                {extraSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                Добавить к заказу
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
