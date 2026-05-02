import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Clock, Eye, MapPin } from 'lucide-react';

export function UserProfiles() {
  const userInsights = [
    {
      segment: 'Clientes Frecuentes',
      count: 234,
      percentage: 35,
      avgVisits: '3.2/mes',
      preferredTime: '19:00-21:00'
    },
    {
      segment: 'Nuevos Visitantes',
      count: 189,
      percentage: 28,
      avgVisits: '1.1/mes',
      preferredTime: '12:00-14:00'
    },
    {
      segment: 'Clientes de Delivery',
      count: 156,
      percentage: 23,
      avgVisits: '2.5/mes',
      preferredTime: '20:00-22:00'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Perfiles de Usuarios</h1>
        <p className="text-gray-600">Insights agregados y anonimizados de tus clientes</p>
      </div>

      <div className="grid gap-6">
        {userInsights.map((insight, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{insight.segment}</h3>
                  <p className="text-gray-600">{insight.count} usuarios ({insight.percentage}%)</p>
                </div>
              </div>
              <div className="flex space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {insight.avgVisits}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {insight.preferredTime}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}