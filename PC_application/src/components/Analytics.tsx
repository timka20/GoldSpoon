import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Star,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const viewsData = [
    { day: 'Lun', views: 45, clicks: 12 },
    { day: 'Mar', views: 52, clicks: 18 },
    { day: 'Mié', views: 38, clicks: 9 },
    { day: 'Jue', views: 67, clicks: 23 },
    { day: 'Vie', views: 89, clicks: 34 },
    { day: 'Sáb', views: 126, clicks: 56 },
    { day: 'Dom', views: 98, clicks: 41 }
  ];

  const sourceData = [
    { name: 'Búsqueda directa', value: 45, color: '#3B82F6' },
    { name: 'Redes sociales', value: 25, color: '#10B981' },
    { name: 'Referencias', value: 20, color: '#F59E0B' },
    { name: 'Publicidad', value: 10, color: '#EF4444' }
  ];

  const interactionData = [
    { hour: '08:00', interactions: 5 },
    { hour: '10:00', interactions: 12 },
    { hour: '12:00', interactions: 28 },
    { hour: '14:00', interactions: 35 },
    { hour: '16:00', interactions: 22 },
    { hour: '18:00', interactions: 31 },
    { hour: '20:00', interactions: 45 },
    { hour: '22:00', interactions: 18 }
  ];

  const topSearchTerms = [
    { term: 'restaurante providencia', searches: 89 },
    { term: 'comida chilena', searches: 67 },
    { term: 'cazuela cordero', searches: 45 },
    { term: 'empanadas', searches: 34 },
    { term: 'delivery providencia', searches: 23 }
  ];

  const performanceMetrics = [
    { label: 'Visualizaciones totales', value: '2,847', change: '+18%', trend: 'up', icon: Eye },
    { label: 'Interacciones', value: '234', change: '+12%', trend: 'up', icon: MousePointer },
    { label: 'Llamadas generadas', value: '45', change: '+8%', trend: 'up', icon: Phone },
    { label: 'Solicitudes de dirección', value: '67', change: '+15%', trend: 'up', icon: MapPin },
    { label: 'Tiempo promedio en perfil', value: '2:34', change: '+5%', trend: 'up', icon: Clock },
    { label: 'Calificación promedio', value: '4.7', change: '+0.2', trend: 'up', icon: Star }
  ];

  const timeRanges = [
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Estadísticas de Rendimiento</h1>
          <p className="text-gray-600">Analiza el rendimiento de tu comercio en el buscador</p>
          
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
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-semibold mt-1">{metric.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{metric.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views and Clicks Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Visualizaciones y Clics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3B82F6" name="Visualizaciones" />
              <Bar dataKey="clicks" fill="#10B981" name="Clics" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Fuentes de Tráfico</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {sourceData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm">{source.name}</span>
                </div>
                <span className="text-sm font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Hourly Interactions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Interacciones por Hora</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={interactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="interactions" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">
          Los picos de interacción coinciden con las horas de almuerzo y cena
        </p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Search Terms */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Términos de Búsqueda Populares</h2>
          <div className="space-y-3">
            {topSearchTerms.map((term, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-3 w-8 text-center">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{term.term}</span>
                </div>
                <span className="text-sm text-gray-600">{term.searches} búsquedas</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Insights */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Insights de Clientes
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Horario de Mayor Actividad</h3>
              <p className="text-sm text-blue-700 mt-1">
                Entre 19:00 - 21:00 horas (45% de las interacciones)
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Dispositivo Más Usado</h3>
              <p className="text-sm text-green-700 mt-1">
                Móvil (78% de las visualizaciones)
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900">Acción Más Frecuente</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Ver menú completo (34% de los clics)
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <h2 className="text-lg font-semibold mb-4 text-purple-900">Recomendaciones para Mejorar</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-purple-800">Optimizaciones Sugeridas:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Actualiza fotos durante las horas pico (19:00-21:00)</li>
              <li>• Añade más platos de la categoría "comida chilena"</li>
              <li>• Optimiza la descripción para búsquedas móviles</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-purple-800">Próximas Mejoras:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Promociona especialidades los viernes</li>
              <li>• Configura respuestas automáticas para consultas</li>
              <li>• Considera promociones para horarios de menor actividad</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}