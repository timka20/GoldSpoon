import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { UserCircle, Calendar, Utensils, Clock, Phone, Mail } from 'lucide-react';

interface ClientPanelProps {
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export function ClientPanel({ user }: ClientPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center space-x-3 text-2xl font-bold">
            <UserCircle className="w-6 h-6 text-gray-600" />
            <span>Личный кабинет</span>
          </h1>
          <p className="text-gray-600">
            Добро пожаловать, {user.name}!
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {user.role}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Мои бронирования</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">активных броней</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Мои заказы</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">заказов в работе</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Бонусы</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">бонусных баллов</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о профиле</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <UserCircle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-muted-foreground">Имя пользователя</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="w-5 h-5 flex items-center justify-center p-0">ID</Badge>
            <div>
              <p className="text-sm text-muted-foreground">ID пользователя</p>
              <p className="font-medium">{user.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Utensils className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-muted-foreground">Роль</p>
              <p className="font-medium">{user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Контакты ресторана</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-muted-foreground">Телефон</p>
              <p className="font-medium">+7 (XXX) XXX-XX-XX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">info@restaurant.ru</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
