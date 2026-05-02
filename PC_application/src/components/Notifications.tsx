import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, Check, AlertCircle, Info, Star } from 'lucide-react';

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nueva reseña recibida',
      message: 'Un cliente dejó una reseña de 5 estrellas',
      type: 'positive',
      read: false,
      timestamp: '2 horas ago'
    },
    {
      id: 2,
      title: 'Actualización de plataforma',
      message: 'Nueva función de analytics disponible',
      type: 'info',
      read: false,
      timestamp: '1 día ago'
    },
    {
      id: 3,
      title: 'Solicitud de Edenred',
      message: 'Revisar información de contacto para validación',
      type: 'warning',
      read: true,
      timestamp: '3 días ago'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <Star className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notificaciones</h1>
        <p className="text-gray-600">Mantente informado sobre actualizaciones y solicitudes</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`p-4 ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}>
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
              </div>
              <div className="flex space-x-2">
                {!notification.read && (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                    <Check className="w-3 h-3" />
                  </Button>
                )}
                <Badge variant={notification.read ? "secondary" : "default"}>
                  {notification.read ? "Leída" : "Nueva"}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}