import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import {
  Truck,
  Package,
  AlertTriangle,
  Check,
  Clock,
  DollarSign,
  Plus,
  RefreshCw,
  Send,
  MessageCircle,
  ShoppingCart,
  User,
  X,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  supplierApi,
  kitchenApi,
  type Supplier,
  type SupplierOrder,
  type SupplierChatMessage,
  type InventoryItem,
  type User
} from '../../services/api';

interface SupplierPanelProps {
  user: User;
}

export function SupplierPanel({ user }: SupplierPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [chatMessages, setChatMessages] = useState<SupplierChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('Отправка...');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Order creation state
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [orderItems, setOrderItems] = useState<{ productName: string; quantity: number; unit: string; price: number }[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('кг');
  const [newItemPrice, setNewItemPrice] = useState(0);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [invData, supData, ordData] = await Promise.all([
        kitchenApi.getInventory().catch(() => []),
        supplierApi.getSuppliers().catch(() => []),
        supplierApi.getOrders().catch(() => []),
      ]);
      setInventory(invData || []);
      setSuppliers(supData || []);
      setOrders(ordData || []);
    } catch (error: any) {
      toast.error('Ошибка загрузки: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const openChat = async (supplier: Supplier) => {
    setActiveSupplier(supplier);
    setChatOpen(true);
    try {
      const messages = await supplierApi.getChat(supplier.SupplierID);
      setChatMessages(messages || []);
      scrollToBottom();
    } catch (error: any) {
      toast.error('Ошибка загрузки чата: ' + error.message);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !activeSupplier) return;
    const message = chatInput.trim();
    setChatInput('');
    setIsTyping(true);
    setTypingText('Отправка...');

    try {
      const tempUserMsg: SupplierChatMessage = {
        MessageID: Date.now(),
        SupplierID: activeSupplier.SupplierID,
        UserID: 0,
        Role: 'user',
        Content: message,
        CreatedAt: new Date().toISOString(),
        IsRead: 1,
      };
      setChatMessages((prev) => [...prev, tempUserMsg]);
      scrollToBottom();

      // Simulate delivery/read/typing stages
      setTimeout(() => setTypingText('Доставлено'), 800);
      setTimeout(() => setTypingText('Прочитано'), 1800);
      setTimeout(() => setTypingText('Печатает...'), 2800);

      // Call API after a delay
      setTimeout(async () => {
        try {
          await supplierApi.sendMessage({
            supplierId: activeSupplier.SupplierID,
            message,
            supplierName: activeSupplier.Name,
          });
          const messages = await supplierApi.getChat(activeSupplier.SupplierID);
          setChatMessages(messages || []);
          setIsTyping(false);
          scrollToBottom();
        } catch (error: any) {
          setIsTyping(false);
          toast.error('Ошибка отправки: ' + error.message);
        }
      }, 3500);
    } catch (error: any) {
      setIsTyping(false);
      toast.error('Ошибка: ' + error.message);
    }
  };

  const openOrderDialog = (supplier?: Supplier) => {
    setSelectedSupplier(supplier || null);
    setOrderItems([]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemUnit('кг');
    setNewItemPrice(0);
    setOrderDialogOpen(true);
  };

  const addOrderItem = () => {
    if (!newItemName.trim() || newItemQty <= 0 || newItemPrice <= 0) {
      toast.error('Заполните все поля товара');
      return;
    }
    setOrderItems([...orderItems, {
      productName: newItemName.trim(),
      quantity: newItemQty,
      unit: newItemUnit,
      price: newItemPrice,
    }]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice(0);
  };

  const removeOrderItem = (idx: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  };

  const createOrder = async () => {
    if (!selectedSupplier || orderItems.length === 0) {
      toast.error('Выберите поставщика и добавьте товары');
      return;
    }
    try {
      await supplierApi.createOrder({
        supplierId: selectedSupplier.SupplierID,
        items: orderItems,
      });
      toast.success('Заказ создан');
      setOrderDialogOpen(false);
      setOrderItems([]);
      setSelectedSupplier(null);
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка создания заказа: ' + error.message);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await supplierApi.updateOrderStatus(orderId, status);
      toast.success('Статус обновлен');
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const getInvStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'В наличии';
      case 'low':
        return 'Мало';
      case 'critical':
        return 'Критично';
      default:
        return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'confirmed':
        return 'Подтвержден';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const lowStockItems = inventory.filter((i) => i.Status === 'low' || i.Status === 'critical');
  const pendingOrders = orders.filter((o) => o.Status === 'pending');
  const totalOrdersSum = orders.reduce((sum, o) => sum + (Number(o.Total) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Панель поставщика</h1>
          <p className="text-gray-600">Управление складом и поставками</p>
        </div>
        <Button variant="outline" onClick={loadAll} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Низкие запасы</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказов в работе</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Поставщиков</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{suppliers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сумма заказов</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrdersSum.toLocaleString()} ₽</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Склад</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="suppliers">Поставщики</TabsTrigger>
        </TabsList>

        {/* Склад */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Складские запасы</CardTitle>
              <CardDescription>Текущее состояние продуктов на складе</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-red-600">Требует внимания</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {lowStockItems.map((item) => (
                        <Card key={item.InventoryID} className="border-red-200 bg-red-50">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{item.Name}</CardTitle>
                              <Badge className={getInvStatusColor(item.Status)}>
                                {getInvStatusText(item.Status)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>В наличии:</span>
                              <span className="font-medium">{item.Quantity}</span>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedSupplier(null);
                                setOrderItems([{ productName: item.Name, quantity: 10, unit: item.Quantity.includes('кг') ? 'кг' : 'шт', price: 100 }]);
                                setOrderDialogOpen(true);
                              }}
                              className="w-full"
                              size="sm"
                            >
                              Заказать
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3">Все продукты</h4>
                  <div className="space-y-3">
                    {inventory.map((item) => (
                      <div key={item.InventoryID} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Package className="w-5 h-5 text-gray-500" />
                          <div>
                            <h5 className="font-medium">{item.Name}</h5>
                            <p className="text-sm text-muted-foreground">{item.Quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getInvStatusColor(item.Status)}>
                            {getInvStatusText(item.Status)}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => {
                            const supplier = suppliers[0];
                            setSelectedSupplier(supplier);
                            setOrderItems([{ productName: item.Name, quantity: 10, unit: 'кг', price: 100 }]);
                            setOrderDialogOpen(true);
                          }}>
                            Заказать
                          </Button>
                        </div>
                      </div>
                    ))}
                    {inventory.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Нет данных о запасах</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Заказы */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Заказы поставщикам</CardTitle>
                <CardDescription>Управление заказами продуктов</CardDescription>
              </div>
              {/* <Button onClick={() => openOrderDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Новый заказ
              </Button> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.OrderID} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Заказ #{order.OrderID}</CardTitle>
                          <CardDescription>
                            {suppliers.find((s) => s.SupplierID === order.SupplierID)?.Name || 'Поставщик'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getOrderStatusColor(order.Status)}>
                            {getOrderStatusText(order.Status)}
                          </Badge>
                          <span className="font-medium">{Number(order.Total).toLocaleString()} ₽</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.ProductName}</span>
                            <span>
                              {item.Quantity} {item.Unit} × {item.Price} ₽ = {' '}
                              {(item.Quantity * item.Price).toLocaleString()} ₽
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          Заказ: {new Date(order.OrderDate).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="flex space-x-2">
                          {order.Status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => updateOrderStatus(order.OrderID, 'confirmed')}>
                                Подтвердить
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => updateOrderStatus(order.OrderID, 'cancelled')}>
                                Отменить
                              </Button>
                            </>
                          )}
                          {order.Status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.OrderID, 'delivered')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Получен
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Нет заказов</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Поставщики */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Поставщики</CardTitle>
              <CardDescription>Информация о поставщиках и контакты</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <Card key={supplier.SupplierID}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{supplier.Name}</CardTitle>
                      <CardDescription>{supplier.Category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Рейтинг:</span>
                        <span className="font-medium">⭐ {supplier.Rating}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Контакт:</span>
                        <span className="font-medium">{supplier.ContactPerson || '—'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Телефон:</span>
                        <span className="font-medium">{supplier.Phone || '—'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Статус:</span>
                        <Badge variant={supplier.Status === 'active' ? 'default' : 'secondary'}>
                          {supplier.Status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openChat(supplier)}>
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Связаться
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => openOrderDialog(supplier)}>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Заказать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {suppliers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 col-span-full">Нет поставщиков</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent style={{ maxWidth: '420px', height: '650px', display: 'flex', flexDirection: 'column', padding: 0, backgroundColor: '#f0f2f5', border: 'none' }} className="overflow-hidden">

          <DialogHeader className="px-4 py-3 border-b shrink-0" style={{ backgroundColor: 'white', zIndex: 10 }}>
            <DialogTitle className="flex items-center gap-3 pr-8">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#dbeafe' }}>
                <MessageCircle className="w-5 h-5" style={{ color: '#2563eb' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold" style={{ color: '#111827' }}>
                  {activeSupplier?.Name || 'Поставщик'}
                </span>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#16a34a' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }}></span>
                  В сети
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden relative">
            <div style={{ height: '100%', overflowY: 'auto', padding: '0.75rem 1rem' }}>
              <div className="space-y-2 pb-2 flex flex-col">
                {chatMessages.map((msg) => {
                  const isUser = msg.Role === 'user';
                  return (
                    <div
                      key={msg.MessageID}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className="relative max-w-[80%] px-3 py-2"
                        style={{
                          fontSize: '15px',
                          borderRadius: '16px',
                          backgroundColor: isUser ? '#d9fdd3' : 'white',
                          color: '#111827',
                          borderBottomRightRadius: isUser ? '4px' : '16px',
                          borderBottomLeftRadius: isUser ? '16px' : '4px',
                          boxShadow: isUser ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        }}
                      >
                        <div style={{ lineHeight: '1.625', overflowWrap: 'break-word' }} className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.Content}</ReactMarkdown>
                        </div>

                        <div className="flex items-center justify-end gap-1 mt-1" style={{ color: isUser ? '#53bdeb' : '#9ca3af' }}>
                          <span className="font-normal" style={{ fontSize: '11px' }}>
                            {new Date(msg.CreatedAt).toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>

                          {isUser && (
                            <span className="flex items-center">
                              {msg.IsRead ? (
                                <CheckCheck className="w-4 h-4" strokeWidth={2} />
                              ) : (
                                <Check className="w-4 h-4" strokeWidth={2} />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start mt-1">
                    <div className="px-4 py-2.5 flex items-center" style={{ backgroundColor: 'white', borderRadius: '16px', borderBottomLeftRadius: '4px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
                      <span style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '14px' }}>{typingText}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          </div>

          <div className="px-3 py-3 border-t shrink-0" style={{ backgroundColor: 'white', zIndex: 10 }}>
            <div className="flex items-end gap-2">
              <Input
                className="flex-1 rounded-full border-0 px-4 py-2.5"
                style={{ backgroundColor: '#f0f2f5', minHeight: '44px', color: '#111827' }}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Написать сообщение..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isTyping}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={isTyping || !chatInput.trim()}
                className="rounded-full w-11 h-11 shrink-0 transition-colors"
                style={{ backgroundColor: '#3b82f6' }}
              >
                <Send className="w-5 h-5" style={{ color: 'black' }} />
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>


      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 gap-0 bg-white border border-gray-200 shadow-2xl">
          

          <DialogHeader className="px-6 py-5 border-b bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
            <DialogTitle className="text-xl font-semibold text-gray-900">Новый заказ поставщику</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Выберите поставщика и добавьте товары для заказа
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6 space-y-8">
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Поставщик</Label>
              <Select
                value={selectedSupplier ? String(selectedSupplier.SupplierID) : ''}
                onValueChange={(v) => {
                  const sup = suppliers.find((s) => s.SupplierID === Number(v));
                  setSelectedSupplier(sup || null);
                }}
              >
                <SelectTrigger className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Выберите поставщика из списка" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.SupplierID} value={String(s.SupplierID)}>
                      {s.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Товары</Label>
                {orderItems.length > 0 && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {orderItems.length} поз.
                  </span>
                )}
              </div>

              {orderItems.length > 0 && (
                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} {item.unit} × {item.price.toLocaleString()} ₽
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          {(item.quantity * item.price).toLocaleString()} ₽
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeOrderItem(idx)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-gray-50/50 border border-dashed border-gray-300 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Добавить позицию</p>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <Input 
                      placeholder="Название товара" 
                      value={newItemName} 
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="h-10 border-gray-300 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="Кол-во" 
                      value={newItemQty} 
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      className="h-10 border-gray-300 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      placeholder="Ед." 
                      value={newItemUnit} 
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="h-10 border-gray-300 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="Цена" 
                      value={newItemPrice} 
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      className="h-10 border-gray-300 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={addOrderItem}
                      className="h-10 w-10 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {orderItems.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Итого к оплате</span>
                <span className="text-2xl font-bold text-gray-900">
                  {orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0).toLocaleString()} ₽
                </span>
              </div>
            )}
          </div>

          <div className="px-6 py-5 border-t bg-gray-50/50 sticky bottom-0">
            <Button 
              onClick={createOrder} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-semibold rounded-xl transition-colors"
              disabled={orderItems.length === 0 || !selectedSupplier}
            >
              Создать заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
