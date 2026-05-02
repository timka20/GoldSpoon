import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tag, Calendar, TrendingUp, Save, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Promotions() {
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: '2x1 en Empanadas',
      description: 'Lleva 2 empanadas y paga solo 1',
      discount: '50%',
      startDate: '2025-01-20',
      endDate: '2025-01-31',
      active: true,
      clicks: 45,
      conversions: 12
    },
    {
      id: 2,
      title: 'Happy Hour Bebidas',
      description: '30% de descuento en bebidas de 15:00 a 17:00',
      discount: '30%',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      active: true,
      clicks: 78,
      conversions: 23
    }
  ]);

  const togglePromotion = (id: number) => {
    setPromotions(prev => prev.map(promo =>
      promo.id === id ? { ...promo, active: !promo.active } : promo
    ));
  };

  const handleSave = () => {
    toast.success('Promociones actualizadas correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Promociones y Ofertas</h1>
          <p className="text-gray-600">Crea y gestiona campañas promocionales</p>
          
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

      <div className="grid gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Tag className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{promo.title}</h3>
                  <p className="text-gray-600">{promo.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {promo.startDate} - {promo.endDate}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {promo.clicks} clics, {promo.conversions} conversiones
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-lg">
                  {promo.discount}
                </Badge>
                <Switch
                  checked={promo.active}
                  onCheckedChange={() => togglePromotion(promo.id)}
                />
                {promo.active ? (
                  <Badge className="bg-green-100 text-green-800">Activa</Badge>
                ) : (
                  <Badge variant="secondary">Inactiva</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}