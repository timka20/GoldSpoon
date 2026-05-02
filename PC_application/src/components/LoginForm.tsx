import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Users, ChefHat, Sparkles, Truck, Utensils } from 'lucide-react';

type UserRole = 'admin' | 'waiter' | 'chef' | 'cleaner' | 'supplier';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

// Предустановленные пользователи для демонстрации
const demoUsers: Record<UserRole, User[]> = {
  admin: [
    { id: 'admin1', name: 'Алексей Смирнов', role: 'admin' },
    { id: 'admin2', name: 'Елена Волкова', role: 'admin' }
  ],
  waiter: [
    { id: 'waiter1', name: 'Мария Петрова', role: 'waiter' },
    { id: 'waiter2', name: 'Дмитрий Козлов', role: 'waiter' },
    { id: 'waiter3', name: 'Анна Сидорова', role: 'waiter' }
  ],
  chef: [
    { id: 'chef1', name: 'Игорь Белов', role: 'chef' },
    { id: 'chef2', name: 'Сергей Морозов', role: 'chef' }
  ],
  cleaner: [
    { id: 'cleaner1', name: 'Татьяна Лебедева', role: 'cleaner' },
    { id: 'cleaner2', name: 'Николай Орлов', role: 'cleaner' }
  ],
  supplier: [
    { id: 'supplier1', name: 'Владимир Новиков', role: 'supplier' },
    { id: 'supplier2', name: 'Ольга Федорова', role: 'supplier' }
  ]
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('waiter');
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleQuickLogin = (user: User) => {
    onLogin(user);
  };

  const handleRoleLogin = () => {
    if (!selectedUser) return;
    
    const user = demoUsers[selectedRole].find(u => u.id === selectedUser);
    if (user) {
      onLogin(user);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-red-600" />;
      case 'waiter':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'chef':
        return <ChefHat className="w-5 h-5 text-green-600" />;
      case 'cleaner':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'supplier':
        return <Truck className="w-5 h-5 text-orange-600" />;
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'waiter':
        return 'Официант';
      case 'chef':
        return 'Повар';
      case 'cleaner':
        return 'Уборщик';
      case 'supplier':
        return 'Поставщик';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Utensils className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Система управления рестораном</h1>
          <p className="text-gray-600">Выберите свою роль для входа в систему</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(demoUsers).map(([role, users]) => (
            <Card key={role} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getRoleIcon(role as UserRole)}
                </div>
                <CardTitle className="text-lg">{getRoleName(role as UserRole)}</CardTitle>
                <CardDescription>
                  {role === 'admin' && 'Полное управление системой'}
                  {role === 'waiter' && 'Управление заказами'}
                  {role === 'chef' && 'Кухня и рецепты'}
                  {role === 'cleaner' && 'Уборка и санитария'}
                  {role === 'supplier' && 'Поставки и склад'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleQuickLogin(user)}
                    >
                      {user.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Ручной вход</CardTitle>
            <CardDescription>Выберите роль и пользователя</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Администратор</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="waiter">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Официант</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="chef">
                    <div className="flex items-center space-x-2">
                      <ChefHat className="w-4 h-4" />
                      <span>Повар</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cleaner">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Уборщик</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="supplier">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Поставщик</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">Пользователь</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пользователя" />
                </SelectTrigger>
                <SelectContent>
                  {demoUsers[selectedRole].map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleRoleLogin} disabled={!selectedUser}>
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}