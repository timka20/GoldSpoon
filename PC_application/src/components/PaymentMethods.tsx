import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CreditCard, Smartphone, Banknote, Save, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function PaymentMethods() {
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Tarjeta de Crédito', type: 'card', enabled: true, },
    { id: 2, name: 'Tarjeta de Débito', type: 'card', enabled: true, },
    { id: 3, name: 'Transferencia Bancaria', type: 'transfer', enabled: true, },
    { id: 4, name: 'Edenred', type: 'transfer', enabled: true,  },
    { id: 5, name: 'Efectivo', type: 'cash', enabled: true, },
    { id: 6, name: 'Wallet Digital', type: 'digital', enabled: false, fee: '2.5%' },
  ]);

  const [services, setServices] = useState([
    { id: 1, name: 'Delivery', enabled: true, cost: '$2.000/mes' },
    { id: 2, name: 'Reservas Online', enabled: true, cost: '$5.000/mes' },
    { id: 3, name: 'Marketing Digital', enabled: false, cost: '$10.000/mes' },
    { id: 4, name: 'Analytics Premium', enabled: false, cost: '$8.000/mes' },
  ]);

  const togglePaymentMethod = (id: number) => {
    setPaymentMethods(prev => prev.map(method =>
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
  };

  const toggleService = (id: number) => {
    setServices(prev => prev.map(service =>
      service.id === id ? { ...service, enabled: !service.enabled } : service
    ));
  };

  const handleSave = () => {
    toast.success('Configuración actualizada correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Métodos de Pago y Servicios</h1>
          <p className="text-gray-600">Configura los métodos de pago y servicios adicionales</p>
          
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
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Métodos de Pago</h2>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  {method.type === 'card' && <CreditCard className="w-4 h-4 text-blue-600" />}
                  {method.type === 'digital' && <Smartphone className="w-4 h-4 text-blue-600" />}
                  {method.type === 'cash' && <Banknote className="w-4 h-4 text-blue-600" />}
                  {method.type === 'transfer' && <CreditCard className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium">{method.name}</p>
                  
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={method.enabled}
                  onCheckedChange={() => togglePaymentMethod(method.id)}
                />
                {method.enabled ? (
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                ) : (
                  <Badge variant="secondary">Inactivo</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Servicios Contratados</h2>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-500">{service.cost}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={service.enabled}
                  onCheckedChange={() => toggleService(service.id)}
                />
                {service.enabled ? (
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                ) : (
                  <Badge variant="secondary">Inactivo</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}