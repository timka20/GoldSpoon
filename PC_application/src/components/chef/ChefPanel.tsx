import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChefHat,
  BookOpen,
  Timer,
  Utensils,
  Star,
  Users,
  RefreshCw,
  Loader2,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ordersApi, 
  menuApi,
  recipesApi,
  kitchenApi,
  type Order,
  type MenuItem,
  type Recipe,
  type KitchenEquipmentItem,
  type InventoryItem,
  type User
} from '../../services/api';

interface ChefPanelProps {
  user: User;
}

interface RecipeFormState {
  name: string;
  category: string;
  cookingTime: number;
  difficulty: string;
  rating: number;
  menuItemId: string;
  ingredients: { name: string; quantity: string }[];
  steps: { description: string; tip: string }[];
}

const emptyRecipeForm: RecipeFormState = {
  name: '',
  category: 'Основное',
  cookingTime: 30,
  difficulty: 'medium',
  rating: 4.5,
  menuItemId: '',
  ingredients: [{ name: '', quantity: '' }],
  steps: [{ description: '', tip: '' }],
};

export function ChefPanel({ user }: ChefPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [recipeForm, setRecipeForm] = useState<RecipeFormState>(emptyRecipeForm);
  const [kitchenTeam, setKitchenTeam] = useState<User[]>([]);
  const [equipment, setEquipment] = useState<KitchenEquipmentItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, menuData, recipesData, teamData, equipData, invData] = await Promise.all([
        ordersApi.getAll().catch(() => []),
        menuApi.getAll().catch(() => []),
        recipesApi.getAll().catch(() => []),
        kitchenApi.getTeam().catch(() => []),
        kitchenApi.getEquipment().catch(() => []),
        kitchenApi.getInventory().catch(() => []),
      ]);
      setOrders(ordersData || []);
      setMenuItems(menuData || []);
      setRecipes(recipesData || []);
      setKitchenTeam(teamData || []);
      setEquipment(equipData || []);
      setInventory(invData || []);
    } catch (error: any) {
      console.error('ChefPanel: Error loading data:', error);
      toast.error('Ошибка загрузки: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      toast.success('Статус заказа обновлен');
      loadData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Ошибка обновления: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleSelectRecipe = async (recipe: Recipe) => {
    try {
      const detail = await recipesApi.getById(recipe.RecipeID);
      setSelectedRecipe(detail);
      setIsEditingRecipe(false);
    } catch (error: any) {
      toast.error('Ошибка загрузки рецепта: ' + error.message);
    }
  };

  const handleNewRecipe = () => {
    setSelectedRecipe(null);
    setRecipeForm(emptyRecipeForm);
    setIsEditingRecipe(true);
  };

  const handleEditRecipe = () => {
    if (!selectedRecipe) return;
    setRecipeForm({
      name: selectedRecipe.Name,
      category: selectedRecipe.Category || 'Основное',
      cookingTime: selectedRecipe.CookingTime || 30,
      difficulty: selectedRecipe.Difficulty || 'medium',
      rating: selectedRecipe.Rating || 4.5,
      menuItemId: selectedRecipe.MenuItemID ? String(selectedRecipe.MenuItemID) : '',
      ingredients: selectedRecipe.ingredients?.length
        ? selectedRecipe.ingredients.map(i => ({ name: i.Name, quantity: i.Quantity || '' }))
        : [{ name: '', quantity: '' }],
      steps: selectedRecipe.steps?.length
        ? selectedRecipe.steps.map(s => ({ description: s.Description, tip: s.Tip || '' }))
        : [{ description: '', tip: '' }],
    });
    setIsEditingRecipe(true);
  };

  const handleSaveRecipe = async () => {
    if (!recipeForm.name.trim()) {
      toast.error('Введите название рецепта');
      return;
    }
    const data = {
      name: recipeForm.name,
      category: recipeForm.category,
      cookingTime: Number(recipeForm.cookingTime),
      difficulty: recipeForm.difficulty,
      rating: Number(recipeForm.rating),
      menuItemId: recipeForm.menuItemId && recipeForm.menuItemId !== '0' ? Number(recipeForm.menuItemId) : undefined,
      ingredients: recipeForm.ingredients.filter(i => i.name.trim()),
      steps: recipeForm.steps.filter(s => s.description.trim()),
    };
    try {
      if (selectedRecipe && isEditingRecipe) {
        await recipesApi.update(selectedRecipe.RecipeID, data);
        toast.success('Рецепт обновлен');
      } else {
        await recipesApi.create(data);
        toast.success('Рецепт создан');
      }
      setIsEditingRecipe(false);
      setSelectedRecipe(null);
      loadData();
    } catch (error: any) {
      toast.error('Ошибка сохранения: ' + error.message);
    }
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    if (!confirm('Удалить рецепт "' + recipe.Name + '"?')) return;
    try {
      await recipesApi.delete(recipe.RecipeID);
      toast.success('Рецепт удален');
      if (selectedRecipe?.RecipeID === recipe.RecipeID) {
        setSelectedRecipe(null);
        setIsEditingRecipe(false);
      }
      loadData();
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const handleUpdateEquipmentStatus = async (item: KitchenEquipmentItem) => {
    const statuses = ['working', 'warming', 'cleaning', 'maintenance'];
    const idx = statuses.indexOf(item.Status);
    const nextStatus = statuses[(idx + 1) % statuses.length];
    try {
      await kitchenApi.updateEquipment(item.EquipmentID, nextStatus);
      toast.success(`Статус "${item.Name}" обновлен`);
      loadData();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const handleUpdateInventory = async (item: InventoryItem, field: 'quantity' | 'status', value: string) => {
    try {
      await kitchenApi.updateInventory(item.InventoryID, { [field]: value });
      toast.success(`Запас "${item.Name}" обновлен`);
      loadData();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'preparing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'Ожидает';
      case 'preparing':
        return 'Готовится';
      case 'ready':
        return 'Готов';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-orange-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Легко';
      case 'medium':
        return 'Средне';
      case 'hard':
        return 'Сложно';
      default:
        return difficulty;
    }
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return '#16a34a';
      case 'warming':
        return '#eab308';
      case 'cleaning':
        return '#ef4444';
      case 'maintenance':
        return '#6b7280';
      default:
        return '#2563eb';
    }
  };

  const getEquipmentStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return 'Работает';
      case 'warming':
        return 'Разогревается';
      case 'cleaning':
        return 'Чистка';
      case 'maintenance':
        return 'Обслуживание';
      default:
        return status;
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#16a34a';
      case 'low':
        return '#eab308';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getInventoryStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Норма';
      case 'low':
        return 'Мало';
      case 'critical':
        return 'Критично';
      default:
        return status;
    }
  };

  const pendingOrders = orders.filter(order => order.Status === 'new' || order.Status === 'pending');
  const preparingOrders = orders.filter(order => order.Status === 'preparing');
  const readyOrders = orders.filter(order => order.Status === 'ready');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Панель повара</h1>
          <p className="text-gray-600">Управление кухней и заказами</p>
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

      {/* Быстрая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В очереди</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Готовится</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{preparingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Готово</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рецептов</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="recipes">Рецепты</TabsTrigger>
          <TabsTrigger value="kitchen">Кухня</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ожидают приготовления */}
            <div>
              <h3 className="font-medium mb-3 text-orange-600">Ожидают приготовления</h3>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <Card key={order.OrderID} className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Стол {order.TableNumber}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{new Date(order.OrderDateTime).toLocaleTimeString('ru-RU')}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">#{order.OrderID}</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.MenuItemName}</span>
                              <span className="text-sm text-muted-foreground"> x{item.Quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => updateOrderStatus(order.OrderID, 'preparing')}
                        className="w-full"
                        size="sm"
                      >
                        Начать готовить
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {pendingOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет заказов в очереди</p>
                )}
              </div>
            </div>

            {/* Готовятся */}
            <div>
              <h3 className="font-medium mb-3 text-blue-600">Готовятся</h3>
              <div className="space-y-3">
                {preparingOrders.map((order) => (
                  <Card key={order.OrderID} className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Стол {order.TableNumber}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Timer className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">В работе</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.MenuItemName}</span>
                              <span className="text-sm text-muted-foreground"> x{item.Quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => updateOrderStatus(order.OrderID, 'ready')}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Готово к подаче
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {preparingOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Ничего не готовится</p>
                )}
              </div>
            </div>

            {/* Готовы к подаче */}
            <div>
              <h3 className="font-medium mb-3 text-green-600">Готовы к подаче</h3>
              <div className="space-y-3">
                {readyOrders.map((order) => (
                  <Card key={order.OrderID} className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Стол {order.TableNumber}</CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="font-medium">{item.MenuItemName}</span>
                            <span className="text-sm text-muted-foreground">x{item.Quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Badge variant="default" className="bg-green-600">
                          Ожидает официанта
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {readyOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет готовых блюд</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Рецепты</h3>
                <Button size="sm" onClick={handleNewRecipe}>
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {recipes.map((recipe) => (
                  <Card 
                    key={recipe.RecipeID}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedRecipe?.RecipeID === recipe.RecipeID ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectRecipe(recipe)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">{recipe.Name}</h4>
                        <p className="text-sm text-muted-foreground">{recipe.Category || 'Основное'}</p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{Number(recipe.Rating).toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(recipe.Difficulty)}>
                          {getDifficultyText(recipe.Difficulty)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>{recipe.CookingTime} мин</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Utensils className="w-4 h-4" />
                        <span>{recipe.ingredients?.length || 0} ингр.</span>
                      </div>
                    </div>
                    {selectedRecipe?.RecipeID === recipe.RecipeID && (
                      <div className="flex items-center space-x-2 mt-2 pt-2 border-t">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditRecipe(); }}>
                          <Edit className="w-3 h-3 mr-1" />
                          Редактировать
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe); }}>
                          <Trash2 className="w-3 h-3 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
                {recipes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет рецептов. Добавьте первый!</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {isEditingRecipe ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedRecipe ? 'Редактировать рецепт' : 'Новый рецепт'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Название</Label>
                        <Input value={recipeForm.name} onChange={e => setRecipeForm({...recipeForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Категория</Label>
                        <Input value={recipeForm.category} onChange={e => setRecipeForm({...recipeForm, category: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Время приготовления (мин)</Label>
                        <Input type="number" value={recipeForm.cookingTime} onChange={e => setRecipeForm({...recipeForm, cookingTime: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Сложность</Label>
                        <Select value={recipeForm.difficulty} onValueChange={v => setRecipeForm({...recipeForm, difficulty: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Легко</SelectItem>
                            <SelectItem value="medium">Средне</SelectItem>
                            <SelectItem value="hard">Сложно</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Рейтинг</Label>
                        <Input type="number" step="0.1" min="0" max="5" value={recipeForm.rating} onChange={e => setRecipeForm({...recipeForm, rating: Number(e.target.value)})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Связь с меню</Label>
                        <Select value={recipeForm.menuItemId} onValueChange={v => setRecipeForm({...recipeForm, menuItemId: v})}>
                          <SelectTrigger><SelectValue placeholder="Не выбрано" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Не выбрано</SelectItem>
                            {menuItems.map(item => (
                              <SelectItem key={item.MenuItemID} value={String(item.MenuItemID)}>{item.Name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Ингредиенты</Label>
                        <Button size="sm" variant="outline" onClick={() => setRecipeForm({...recipeForm, ingredients: [...recipeForm.ingredients, {name:'',quantity:''}]})}>
                          <Plus className="w-3 h-3 mr-1" /> Добавить
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {recipeForm.ingredients.map((ing, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Input placeholder="Название" value={ing.name} onChange={e => {
                              const arr = [...recipeForm.ingredients];
                              arr[idx].name = e.target.value;
                              setRecipeForm({...recipeForm, ingredients: arr});
                            }} />
                            <Input placeholder="Количество" value={ing.quantity} onChange={e => {
                              const arr = [...recipeForm.ingredients];
                              arr[idx].quantity = e.target.value;
                              setRecipeForm({...recipeForm, ingredients: arr});
                            }} />
                            <Button size="sm" variant="ghost" onClick={() => {
                              const arr = recipeForm.ingredients.filter((_, i) => i !== idx);
                              setRecipeForm({...recipeForm, ingredients: arr.length ? arr : [{name:'',quantity:''}]});
                            }}>
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Шаги приготовления</Label>
                        <Button size="sm" variant="outline" onClick={() => setRecipeForm({...recipeForm, steps: [...recipeForm.steps, {description:'',tip:''}]})}>
                          <Plus className="w-3 h-3 mr-1" /> Добавить шаг
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {recipeForm.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-2">
                              <Textarea placeholder="Описание шага" value={step.description} onChange={e => {
                                const arr = [...recipeForm.steps];
                                arr[idx].description = e.target.value;
                                setRecipeForm({...recipeForm, steps: arr});
                              }} />
                              <Input placeholder="Совет шеф-повара (необязательно)" value={step.tip} onChange={e => {
                                const arr = [...recipeForm.steps];
                                arr[idx].tip = e.target.value;
                                setRecipeForm({...recipeForm, steps: arr});
                              }} />
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => {
                              const arr = recipeForm.steps.filter((_, i) => i !== idx);
                              setRecipeForm({...recipeForm, steps: arr.length ? arr : [{description:'',tip:''}]});
                            }}>
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <Button onClick={handleSaveRecipe}>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => { setIsEditingRecipe(false); if (selectedRecipe) handleSelectRecipe(selectedRecipe); }}>
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : selectedRecipe ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedRecipe.Name}</CardTitle>
                        <CardDescription>{selectedRecipe.Category || 'Основное'}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="font-medium">{Number(selectedRecipe.Rating).toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className={`${getDifficultyColor(selectedRecipe.Difficulty)} font-medium`}>
                          {getDifficultyText(selectedRecipe.Difficulty)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Timer className="w-5 h-5" />
                          <span>{selectedRecipe.CookingTime} мин</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Ингредиенты</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedRecipe.ingredients?.map((ingredient, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>{ingredient.Name}{ingredient.Quantity ? ` — ${ingredient.Quantity}` : ''}</span>
                          </div>
                        ))}
                        {(!selectedRecipe.ingredients || selectedRecipe.ingredients.length === 0) && (
                          <p className="text-muted-foreground text-sm">Ингредиенты не указаны</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Пошаговый рецепт</h4>
                      <div className="space-y-3">
                        {selectedRecipe.steps?.map((step, index) => (
                          <div key={index} className="flex space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {step.StepNumber}
                            </div>
                            <div className="flex-1">
                              <p>{step.Description}</p>
                              {step.Tip && (
                                <div className="mt-1 flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                                  <ChefHat className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{step.Tip}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!selectedRecipe.steps || selectedRecipe.steps.length === 0) && (
                          <p className="text-muted-foreground text-sm">Шаги не указаны</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Выберите рецепт</h3>
                    <p className="text-muted-foreground">Выберите рецепт из списка или создайте новый</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Состояние оборудования</CardTitle>
                <CardDescription>Кликните по статусу для изменения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {equipment.map((item) => (
                  <div key={item.EquipmentID} className="flex justify-between items-center">
                    <span>{item.Name}</span>
                    <Button
                      size="sm"
                      className="px-3 h-8 rounded flex items-center justify-center text-white"
                      style={{ backgroundColor: getEquipmentStatusColor(item.Status) }}
                      onClick={() => handleUpdateEquipmentStatus(item)}
                    >
                      {getEquipmentStatusText(item.Status)}
                    </Button>
                  </div>
                ))}
                {equipment.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет данных об оборудовании</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Запасы</CardTitle>
                <CardDescription>Кликните по количеству или статусу для изменения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {inventory.map((item) => (
                  <div key={item.InventoryID} className="flex items-center justify-between gap-4">
                    <span className="font-medium">{item.Name}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        className="w-16 h-8 text-sm"
                        value={item.Quantity}
                        onChange={(e) => handleUpdateInventory(item, 'quantity', e.target.value)}
                        onBlur={() => loadData()}
                      />
                      <Badge
                        className="h-8 flex items-center px-3 rounded-full text-white"
                        style={{ backgroundColor: getInventoryStatusColor(item.Status) }}
                      >
                        {getInventoryStatusText(item.Status)}
                      </Badge>
                      <Select value={item.Status} onValueChange={(v) => handleUpdateInventory(item, 'status', v)}>
                        <SelectTrigger
                          className="h-8 p-0 flex items-center justify-center"
                          style={{ width: '2.5rem', background: 'transparent', border: 'none', boxShadow: 'none' }}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Норма</SelectItem>
                          <SelectItem value="low">Мало</SelectItem>
                          <SelectItem value="critical">Критично</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                {inventory.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет данных о запасах</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
