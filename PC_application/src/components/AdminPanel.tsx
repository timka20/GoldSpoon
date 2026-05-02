import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  Clock, 
  Save, 
  AlertTriangle,
  Globe
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AdminPanel() {
  const [closesSoonMinutes, setClosesSoonMinutes] = useState('30');
  const [isLoading, setIsLoading] = useState(false);

  // Opciones de tiempo para "Cierra Pronto"
  const closesSoonOptions = [
    { value: '15', label: '15 minutos antes', description: 'Advertencia más cercana al cierre' },
    { value: '30', label: '30 minutos antes', description: 'Tiempo estándar recomendado' },
    { value: '60', label: '60 minutos antes', description: 'Advertencia temprana' },
    { value: '90', label: '90 minutos antes', description: 'Máxima anticipación' }
  ];



  const handleSaveConfiguration = async () => {
    setIsLoading(true);
    
    try {
      // Simular guardado de configuración global
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        `Configuración global actualizada: "Cierra Pronto" se activará ${closesSoonMinutes} minutos antes del cierre para todos los comercios.`
      );
    } catch (error) {
      toast.error('Error al guardar la configuración global');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOption = closesSoonOptions.find(option => option.value === closesSoonMinutes);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Panel de Administración Edenred</span>
          </h1>
          <p className="text-gray-600">
            Configuración global de la plataforma que afecta a todos los comercios
          </p>
        </div>
        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
          <Shield className="w-4 h-4 mr-2" />
          Administrador Edenred
        </Badge>
      </div>



      {/* Configuración de "Cierra Pronto" */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-6 h-6 text-orange-600" />
          <div>
            <h2>Configuración Global: "Cierra Pronto"</h2>
            <p className="text-sm text-gray-600">
              Define cuándo se debe mostrar la etiqueta "Cierra Pronto" a los usuarios antes del horario de cierre
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Configuración Transversal:</strong> Esta configuración se aplicará automáticamente a todos los comercios de la plataforma en tiempo real.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label htmlFor="closesSoon">Tiempo antes del cierre para mostrar "Cierra Pronto"</Label>
            
            <Select value={closesSoonMinutes} onValueChange={setClosesSoonMinutes}>
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder="Seleccionar tiempo" />
              </SelectTrigger>
              <SelectContent>
                {closesSoonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedOption && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Configuración Seleccionada</p>
                    <p className="text-sm text-blue-700">
                      Los usuarios verán "Cierra Pronto" cuando un comercio esté a <strong>{selectedOption.label}</strong> de su horario de cierre
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Ejemplo de Aplicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-medium text-gray-700">Comercio cierra a las 20:00</p>
                <p className="text-gray-600">
                  "Cierra Pronto" se mostrará desde las {
                    (() => {
                      const minutes = parseInt(closesSoonMinutes);
                      const closeTime = new Date();
                      closeTime.setHours(20, 0, 0, 0);
                      const showTime = new Date(closeTime.getTime() - minutes * 60000);
                      return showTime.toLocaleTimeString('es-CL', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      });
                    })()
                  }
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-medium text-gray-700">Comercio cierra a las 22:30</p>
                <p className="text-gray-600">
                  "Cierra Pronto" se mostrará desde las {
                    (() => {
                      const minutes = parseInt(closesSoonMinutes);
                      const closeTime = new Date();
                      closeTime.setHours(22, 30, 0, 0);
                      const showTime = new Date(closeTime.getTime() - minutes * 60000);
                      return showTime.toLocaleTimeString('es-CL', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      });
                    })()
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Aplicando Configuración...' : 'Aplicar Configuración Global'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Información Adicional */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-5 h-5 text-gray-600" />
          <h3>Impacto de la Configuración</h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-700">
          <p>• La configuración se aplica inmediatamente a todos los comercios activos</p>
          <p>• Los comercios no pueden modificar individualmente esta configuración</p>
          <p>• La etiqueta "Cierra Pronto" se muestra automáticamente según los horarios configurados de cada comercio</p>
          <p>• Los horarios excepcionales (feriados, eventos especiales) también respetan esta configuración</p>
        </div>
      </Card>
    </div>
  );
}