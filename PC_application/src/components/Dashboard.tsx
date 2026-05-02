import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Eye, 
  MousePointer, 
  Star, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Clock,
  AlertCircle,
  MapPin
} from 'lucide-react';

export function Dashboard() {
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const stats = [
    { label: 'Visualizaciones', value: '1,247', icon: Eye, trend: '+12%' },
    { label: 'Interacciones', value: '89', icon: MousePointer, trend: '+8%' },
    { label: 'Calificación', value: '4.7', icon: Star, trend: '+0.2' },
    { label: 'Conversiones', value: '34', icon: TrendingUp, trend: '+15%' },
  ];

  const recentActivity = [
    { action: 'Nueva reseña recibida', time: 'Hace 2 horas', type: 'positive' },
    { action: 'Producto agregado al menú', time: 'Hace 4 horas', type: 'neutral' },
    { action: 'Horario actualizado', time: 'Hace 1 día', type: 'neutral' },
    { action: 'Promoción activada', time: 'Hace 2 días', type: 'positive' },
  ];

  const pendingTasks = [
    { task: 'Actualizar fotos del local', priority: 'high' },
    { task: 'Revisar información de contacto', priority: 'medium' },
    { task: 'Configurar nuevos métodos de pago', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Panel Principal</h1>
          <p className="text-gray-600">Resumen del rendimiento de tu comercio</p>
          
          {/* Branch Selector */}
          <div className="mt-3 flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.value} value={branch.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{branch.label}</span>
                      <span className="text-xs text-gray-500">{branch.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button>
          <TrendingUp className="w-4 h-4 mr-2" />
          Ver Informe Completo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">{stat.trend}</span>
                <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
            <Button variant="outline" size="sm">Ver Todo</Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'positive' ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tareas Pendientes</h2>
            <Badge variant="secondary">3</Badge>
          </div>
          <div className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className={`w-4 h-4 ${
                    task.priority === 'high' ? 'text-red-500' :
                    task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <span className="text-sm">{task.task}</span>
                </div>
                <Badge variant={
                  task.priority === 'high' ? 'destructive' :
                  task.priority === 'medium' ? 'default' : 'secondary'
                }>
                  {task.priority === 'high' ? 'Alta' :
                   task.priority === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-start">
            <Users className="w-4 h-4 mr-2" />
            Actualizar Horarios
          </Button>
          <Button variant="outline" className="justify-start">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Añadir Producto
          </Button>
          <Button variant="outline" className="justify-start">
            <Clock className="w-4 h-4 mr-2" />
            Nueva Promoción
          </Button>
          <Button variant="outline" className="justify-start">
            <Star className="w-4 h-4 mr-2" />
            Ver Reseñas
          </Button>
        </div>
      </Card>
    </div>
  );
}