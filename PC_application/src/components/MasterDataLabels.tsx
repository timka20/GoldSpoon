import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { 
  Database, 
  Save, 
  Lock,
  MapPin,
  Building,
  Phone,
  Mail,
  Globe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Eye,
  Plus,
  Map,
  Navigation,
  Search,
  Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Simple Map Component (simulating interactive map)
const InteractiveMap = ({ onLocationSelect, selectedLocation }: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  selectedLocation: { lat: number; lng: number; address: string } | null;
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simulate coordinates (Santiago, Chile area)
    const lat = -33.4569 + (y / rect.height - 0.5) * 0.1;
    const lng = -70.6483 + (x / rect.width - 0.5) * 0.1;
    
    // Simulate reverse geocoding
    const addresses = [
      'Av. Providencia 1234, Providencia, Santiago',
      'Av. Las Condes 567, Las Condes, Santiago', 
      'Av. Irarrázaval 890, Ñuñoa, Santiago',
      'Av. Vitacura 2345, Vitacura, Santiago',
      'Av. Apoquindo 1567, Las Condes, Santiago'
    ];
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    
    onLocationSelect(lat, lng, randomAddress);
    toast.success('Ubicación seleccionada en el mapa');
  };

  if (!isMapLoaded) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Map className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Cargando mapa interactivo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-dashed border-gray-300 cursor-crosshair relative overflow-hidden"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
          `
        }}
      >
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>
        
        {/* Streets simulation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-400"></div>
          <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-gray-400"></div>
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-400"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-400"></div>
          <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-gray-400"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-400"></div>
        </div>

        {/* Selected location marker */}
        {selectedLocation && (
          <div 
            className="absolute w-6 h-6 -ml-3 -mt-6 z-10"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Nueva ubicación
            </div>
          </div>
        )}
        
        {/* Instructions overlay */}
        <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm">
          <Map className="w-4 h-4 inline mr-1" />
          Haz clic para marcar la ubicación
        </div>
      </div>
    </div>
  );
};

export function MasterDataLabels() {
  // Datos Maestros (Solo Lectura)
  const [masterData] = useState({
    razonSocial: 'Sociedad Gastronómica El Buen Sabor Ltda.',
    rut: '76.543.210-K',
    tipoComercioMaestro: 'Restaurante',
    direccionMaestra: 'Av. Providencia 1234, Providencia, Santiago'
  });



  // Dirección Temporal
  const [temporalAddress, setTemporalAddress] = useState({
    direccion: '',
    vigente: false,
    fechaInicio: '',
    fechaVencimiento: '',
    diasRestantes: 0,
    documentoAdjunto: null,
    ticketZendesk: '',
    usadoAnteriormente: false,
    coordinates: null as { lat: number; lng: number } | null
  });

  // Estados del formulario
  const [showTemporalAddressForm, setShowTemporalAddressForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados del modal de dirección
  const [modalAddress, setModalAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');



  // Log de auditoría
  const [auditLog] = useState([
    {
      id: 1,
      fecha: '2025-01-10 14:30:00',
      accion: 'Cambio de tipo de comercio',
      detalle: 'Cambió de "Restaurante" a "Fuente de Soda" para el buscador',
      usuario: 'Sistema'
    },
    {
      id: 2,
      fecha: '2025-01-08 09:15:00',
      accion: 'Actualización de teléfono',
      detalle: 'Actualizó teléfono de contacto',
      usuario: 'Comercio'
    }
  ]);



  const handleTemporalAddressChange = (field: string, value: any) => {
    setTemporalAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTemporalAddress(prev => ({
        ...prev,
        documentoAdjunto: file
      }));
      toast.success('Documento adjuntado correctamente');
    }
  };

  const calculateExpirationDate = (startDate: string) => {
    const start = new Date(startDate);
    const expiration = new Date(start);
    expiration.setDate(start.getDate() + 15); // 15 días hábiles aproximados
    return expiration.toISOString().split('T')[0];
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    setModalAddress(address);
  };

  const simulateAddressSearch = () => {
    if (!addressSearchQuery.trim()) return;
    
    // Simulate address search results
    const mockResults = [
      'Av. Providencia 1234, Providencia, Santiago',
      'Av. Las Condes 567, Las Condes, Santiago',
      'Av. Irarrázaval 890, Ñuñoa, Santiago'
    ];
    
    const foundAddress = mockResults.find(addr => 
      addr.toLowerCase().includes(addressSearchQuery.toLowerCase())
    ) || mockResults[0];
    
    // Simulate coordinates for the found address
    const lat = -33.4569 + Math.random() * 0.1 - 0.05;
    const lng = -70.6483 + Math.random() * 0.1 - 0.05;
    
    setSelectedLocation({ lat, lng, address: foundAddress });
    setModalAddress(foundAddress);
    toast.success('Dirección encontrada en el mapa');
  };

  const confirmAddressSelection = () => {
    if (!selectedLocation || !modalAddress.trim()) {
      toast.error('Debe seleccionar una ubicación en el mapa');
      return;
    }

    setTemporalAddress(prev => ({
      ...prev,
      direccion: modalAddress,
      coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng }
    }));

    setShowAddressModal(false);
    setShowTemporalAddressForm(true);
    setModalAddress('');
    setSelectedLocation(null);
    setAddressSearchQuery('');
    
    toast.success('Dirección seleccionada correctamente');
  };

  const openAddressModal = () => {
    setShowAddressModal(true);
    setShowTemporalAddressForm(false);
  };

  const activateTemporalAddress = async () => {
    if (!temporalAddress.direccion || !temporalAddress.documentoAdjunto || !acceptTerms) {
      toast.error('Debe completar todos los campos requeridos');
      return;
    }

    setIsLoading(true);

    try {
      // Simular proceso de activación
      const fechaInicio = new Date().toISOString().split('T')[0];
      const fechaVencimiento = calculateExpirationDate(fechaInicio);
      const ticketId = `ZD-${Date.now()}`;

      setTemporalAddress(prev => ({
        ...prev,
        vigente: true,
        fechaInicio,
        fechaVencimiento,
        diasRestantes: 15,
        ticketZendesk: ticketId
      }));

      setShowTemporalAddressForm(false);
      setAcceptTerms(false);

      toast.success(
        `Hemos actualizado temporalmente la dirección del comercio por 15 días hábiles a la espera de que el ticket ${ticketId} pueda confirmar los datos y documentos necesarios para actualizar a la dirección que has seleccionado`
      );

    } catch (error) {
      toast.error('Error al activar la dirección temporal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Cambios guardados correctamente. Los datos se han sincronizado con el buscador.');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center space-x-3">
            <Database className="w-6 h-6" />
            <span>Gestión de Direcciones</span>
          </h1>
          <p className="text-gray-600">
            Gestiona las direcciones y ubicaciones de tu comercio
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>



      {/* Address Selection Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Seleccionar Nueva Dirección</span>
            </DialogTitle>
            <DialogDescription>
              Escribe la dirección o búscala en el mapa, luego marca el punto exacto de tu comercio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Address Search */}
            <div className="space-y-3">
              <Label htmlFor="addressSearch">Buscar Dirección</Label>
              <div className="flex space-x-2">
                <Input
                  id="addressSearch"
                  value={addressSearchQuery}
                  onChange={(e) => setAddressSearchQuery(e.target.value)}
                  placeholder="Ej: Av. Providencia 1234, Santiago"
                  onKeyPress={(e) => e.key === 'Enter' && simulateAddressSearch()}
                />
                <Button onClick={simulateAddressSearch} variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Manual Address Input */}
            <div className="space-y-3">
              <Label htmlFor="manualAddress">O escribe la dirección manualmente</Label>
              <Textarea
                id="manualAddress"
                value={modalAddress}
                onChange={(e) => setModalAddress(e.target.value)}
                placeholder="Escribe la dirección completa..."
                rows={2}
              />
            </div>

            {/* Interactive Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Mapa Interactivo</Label>
                <Badge variant="outline" className="flex items-center">
                  <Navigation className="w-3 h-3 mr-1" />
                  Haz clic para marcar ubicación
                </Badge>
              </div>
              <InteractiveMap 
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
            </div>

            {/* Selected Location Info */}
            {selectedLocation && (
              <Alert className="border-blue-200 bg-blue-50">
                <MapPin className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-1">
                    <p><strong>Ubicación seleccionada:</strong></p>
                    <p>{selectedLocation.address}</p>
                    <p className="text-sm">
                      <strong>Coordenadas:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAddressModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={confirmAddressSelection}
                disabled={!selectedLocation || !modalAddress.trim()}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Dirección
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Datos Maestros - Solo Lectura */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-blue-900">Datos Maestros (Fuente de Verdad Edenred)</span>
        </h2>
        <p className="text-sm text-blue-700 mb-4">
          Esta información es oficial y no puede ser modificada desde este portal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>Razón Social</span>
            </Label>
            <Input 
              value={masterData.razonSocial} 
              disabled 
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>RUT</span>
            </Label>
            <Input 
              value={masterData.rut} 
              disabled 
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>Tipo de Comercio Maestro</span>
            </Label>
            <Input 
              value={masterData.tipoComercioMaestro} 
              disabled 
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>Dirección Maestra</span>
            </Label>
            <Input 
              value={masterData.direccionMaestra} 
              disabled 
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </Card>



      {/* Dirección Temporal */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Dirección Temporal para el Buscador</span>
          </h2>
          {!temporalAddress.vigente && !temporalAddress.usadoAnteriormente && (
            <Button 
              variant="outline" 
              onClick={openAddressModal}
            >
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Corrección de Dirección
            </Button>
          )}
        </div>

        {temporalAddress.vigente && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-1">
                <p><strong>Dirección temporal activa:</strong> {temporalAddress.direccion}</p>
                <p><strong>Vigencia:</strong> {temporalAddress.fechaInicio} hasta {temporalAddress.fechaVencimiento}</p>
                <p><strong>Días restantes:</strong> {temporalAddress.diasRestantes}</p>
                <p><strong>Ticket Zendesk:</strong> {temporalAddress.ticketZendesk}</p>
                {temporalAddress.coordinates && (
                  <p><strong>Coordenadas:</strong> {temporalAddress.coordinates.lat.toFixed(6)}, {temporalAddress.coordinates.lng.toFixed(6)}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {temporalAddress.usadoAnteriormente && !temporalAddress.vigente && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Ya has utilizado tu cambio de dirección permitido durante la vigencia del contrato.
            </AlertDescription>
          </Alert>
        )}

        {showTemporalAddressForm && !temporalAddress.vigente && (
          <div className="space-y-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
            <Alert className="border-orange-300">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Importante:</strong> Solo puedes solicitar un cambio de dirección durante la vigencia del contrato. 
                La dirección temporal tendrá una vigencia de 15 días hábiles.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="direccionTemporal">Nueva Dirección Temporal</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Textarea
                  id="direccionTemporal"
                  value={temporalAddress.direccion}
                  onChange={(e) => handleTemporalAddressChange('direccion', e.target.value)}
                  placeholder="Dirección seleccionada del mapa..."
                  rows={3}
                  disabled
                  className="bg-gray-100"
                />
                <Button variant="outline" onClick={openAddressModal}>
                  <Map className="w-4 h-4 mr-2" />
                  Cambiar
                </Button>
              </div>
              {temporalAddress.coordinates && (
                <p className="text-sm text-gray-600 mt-1">
                  Coordenadas: {temporalAddress.coordinates.lat.toFixed(6)}, {temporalAddress.coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="documento">Documentación de Respaldo</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="documento"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('documento')?.click()}
                  type="button"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {temporalAddress.documentoAdjunto ? 'Cambiar Documento' : 'Subir Documento'}
                </Button>
                {temporalAddress.documentoAdjunto && (
                  <p className="text-sm text-gray-600 mt-1">
                    Archivo adjunto: {temporalAddress.documentoAdjunto.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                Acepto que esta dirección temporal se activará por 15 días hábiles y se generará un ticket 
                en Zendesk para revisar y confirmar el cambio permanente.
              </Label>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={activateTemporalAddress}
                disabled={!acceptTerms || !temporalAddress.direccion || !temporalAddress.documentoAdjunto || isLoading}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isLoading ? 'Procesando...' : 'Activar Dirección Temporal'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowTemporalAddressForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Sincronización y Estado */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h2 className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-900">Estado de Sincronización</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              <Clock className="w-6 h-6 mx-auto mb-1" />
              Inmediata
            </div>
            <div className="text-sm text-green-600">Sincronización con Buscador</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              <CheckCircle className="w-6 h-6 mx-auto mb-1" />
              Activo
            </div>
            <div className="text-sm text-green-600">Estado del Portal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              <Shield className="w-6 h-6 mx-auto mb-1" />
              Protegido
            </div>
            <div className="text-sm text-green-600">Datos Maestros</div>
          </div>
        </div>
        <p className="text-xs text-green-600 mt-4">
          Todos los cambios se reflejan instantáneamente en el buscador manteniendo la integridad de los datos oficiales.
        </p>
      </Card>

      {/* Log de Auditoría */}
      <Card className="p-6">
        <h2 className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5" />
          <span>Log de Auditoría (Últimas Acciones)</span>
        </h2>
        <div className="space-y-3">
          {auditLog.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div>
                <p className="font-medium">{entry.accion}</p>
                <p className="text-sm text-gray-600">{entry.detalle}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{entry.fecha}</p>
                <Badge variant="outline">{entry.usuario}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}