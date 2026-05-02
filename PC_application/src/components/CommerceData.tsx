import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Building, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Save, 
  Edit, 
  Trash2,
  Plus,
  FileText,
  CreditCard,
  Users,
  Headphones,
  ShoppingCart,
  Globe,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import exampleImage from 'figma:asset/0fe8dd30182e57422c937865d5ffe7ad953fcdab.png';
import { Schedule } from './Schedule';
import { MasterDataLabels } from './MasterDataLabels';

const branches = [
  { value: 'principal', label: 'AGOSTO LEGUÍA NORTE 77', address: 'Providencia, Santiago' },
  { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
  { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
  { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
];

// Lista de plataformas e-commerce autorizadas
const authorizedEcommercePlatforms = [
  {
    id: 'rappi',
    name: 'Rappi',
    icon: '🛍️',
    baseUrl: 'rappi.com',
    fullBaseUrl: 'https://www.rappi.com.cl',
    active: true,
    description: 'Plataforma de delivery y e-commerce'
  },
  {
    id: 'ubereats',
    name: 'Uber Eats',
    icon: '🚗',
    baseUrl: 'ubereats.com',
    fullBaseUrl: 'https://www.ubereats.com',
    active: true,
    description: 'Plataforma de delivery de comida'
  },
  {
    id: 'pedidosya',
    name: 'PedidosYa',
    icon: '📱',
    baseUrl: 'pedidosya.cl',
    fullBaseUrl: 'https://www.pedidosya.cl',
    active: true,
    description: 'Plataforma de delivery'
  },
  {
    id: 'mercadolibre',
    name: 'MercadoLibre',
    icon: '💛',
    baseUrl: 'mercadolibre.cl',
    fullBaseUrl: 'https://www.mercadolibre.cl',
    active: true,
    description: 'Marketplace de productos'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '🛒',
    baseUrl: 'myshopify.com',
    fullBaseUrl: 'https://myshopify.com',
    active: true,
    description: 'Plataforma de e-commerce'
  },
  {
    id: 'cornershop',
    name: 'Cornershop',
    icon: '🏪',
    baseUrl: 'cornershopapp.com',
    fullBaseUrl: 'https://cornershopapp.com',
    active: false,
    description: 'Plataforma de delivery (Inactiva)'
  }
];

export function CommerceData() {
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const [paymentInfo, setPaymentInfo] = useState({
    email: 'certificacion11@demomod.com',
    documents: [
      'Factura de cotización',
      'Cartola de corte electrónico',
      'Cartola de recepción de Ticket',
      'Fecha de Pago'
    ]
  });

  const [commercialContact, setCommercialContact] = useState({
    nombres: 'FeriaTOYan',
    apellidos: '',
    cargo: 'Responsable de facturación',
    email: 'alejandra.nazel@consulting-forcedemai.com',
    contacto: '90303456'
  });

  const [customerService, setCustomerService] = useState({
    phone: '',
    email: '',
    schedule: '',
    description: ''
  });

  // Estado para e-commerce
  const [linkedEcommerces, setLinkedEcommerces] = useState([
    {
      id: '1',
      platformId: 'rappi',
      platformName: 'Rappi',
      url: 'https://www.rappi.com.cl/tienda/mi-restaurante-123',
      allBranches: true,
      verified: true,
      dateAdded: '2024-01-15'
    }
  ]);

  const [newEcommerce, setNewEcommerce] = useState({
    platformId: '',
    url: '',
    allBranches: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSave = () => {
    toast.success('Datos del comercio guardados correctamente');
  };



  const updateCommercialContact = (field: string, value: string) => {
    setCommercialContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCustomerService = (field: string, value: string) => {
    setCustomerService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones para e-commerce
  const validateEcommerceUrl = (url: string, platformId: string) => {
    const platform = authorizedEcommercePlatforms.find(p => p.id === platformId);
    if (!platform) return false;
    
    try {
      const urlObject = new URL(url);
      return urlObject.hostname.includes(platform.baseUrl.replace('www.', ''));
    } catch {
      return false;
    }
  };

  const handleAddEcommerce = () => {
    if (!newEcommerce.platformId || !newEcommerce.url) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (!validateEcommerceUrl(newEcommerce.url, newEcommerce.platformId)) {
      toast.error('La URL no corresponde a la plataforma seleccionada');
      return;
    }

    // Simular validación con TRI/Edenred (en la realidad sería una llamada a API)
    const platform = authorizedEcommercePlatforms.find(p => p.id === newEcommerce.platformId);
    
    const newLinkedEcommerce = {
      id: Date.now().toString(),
      platformId: newEcommerce.platformId,
      platformName: platform?.name || '',
      url: newEcommerce.url,
      allBranches: newEcommerce.allBranches,
      verified: true, // Simular verificación exitosa
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setLinkedEcommerces(prev => [...prev, newLinkedEcommerce]);
    setNewEcommerce({ platformId: '', url: '', allBranches: true });
    setShowAddForm(false);
    toast.success(`E-commerce ${platform?.name} agregado correctamente`);
  };

  const handleRemoveEcommerce = (id: string) => {
    setLinkedEcommerces(prev => prev.filter(e => e.id !== id));
    toast.success('E-commerce eliminado correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Datos del Comercio
          </h1>
          <p className="text-gray-600">
            Gestiona la información básica y contactos de tu comercio
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Tabs System */}
      <Tabs defaultValue="contactos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contactos" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Contactos</span>
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Horarios de Atención</span>
          </TabsTrigger>
          <TabsTrigger value="direcciones" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Direcciones</span>
          </TabsTrigger>
          <TabsTrigger value="ecommerce" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>E-commerce</span>
          </TabsTrigger>
        </TabsList>

        {/* Contactos Tab */}
        <TabsContent value="contactos" className="space-y-6">
          {/* Contactos Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              CONTACTOS
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Información de pagos */}
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Información de pagos
                  </h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Actualice aquí su correo para el envío de los siguientes documentos:
                    </p>
                    <ul className="space-y-1">
                      {paymentInfo.documents.map((doc, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <FileText className="w-3 h-3 mr-2 text-blue-600" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label>Email</Label>
                      <Input
                        value={paymentInfo.email}
                        onChange={(e) => setPaymentInfo(prev => ({...prev, email: e.target.value}))}
                        placeholder="certificacion11@demomod.com"
                      />
                    </div>
                    <Button className="mt-6">
                      Guardar
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Contacto comercial */}
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Contacto comercial
                  </h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Nombres</Label>
                      <Input
                        value={commercialContact.nombres}
                        onChange={(e) => updateCommercialContact('nombres', e.target.value)}
                        placeholder="FeriaTOYan"
                      />
                    </div>
                    <div>
                      <Label>Apellidos</Label>
                      <Input
                        value={commercialContact.apellidos}
                        onChange={(e) => updateCommercialContact('apellidos', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Cargo</Label>
                    <Input
                      value={commercialContact.cargo}
                      onChange={(e) => updateCommercialContact('cargo', e.target.value)}
                      placeholder="Responsable de facturación"
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      value={commercialContact.email}
                      onChange={(e) => updateCommercialContact('email', e.target.value)}
                      placeholder="alejandra.nazel@consulting-forcedemai.com"
                    />
                  </div>

                  <div>
                    <Label>N° contacto</Label>
                    <Input
                      value={commercialContact.contacto}
                      onChange={(e) => updateCommercialContact('contacto', e.target.value)}
                      placeholder="90303456"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          {/* Servicio al cliente */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Headphones className="w-5 h-5 mr-2" />
              Servicio al cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div>
                <Label>Teléfono de atención</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    value={customerService.phone}
                    onChange={(e) => updateCustomerService('phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Email de soporte</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    value={customerService.email}
                    onChange={(e) => updateCustomerService('email', e.target.value)}
                    placeholder="soporte@comercio.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Horario de atención</Label>
                <Input
                  value={customerService.schedule}
                  onChange={(e) => updateCustomerService('schedule', e.target.value)}
                  placeholder="Lunes a Viernes 9:00 - 18:00"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label>Información adicional</Label>
              <Textarea
                value={customerService.description}
                onChange={(e) => updateCustomerService('description', e.target.value)}
                placeholder="Describe aquí información adicional sobre tu servicio al cliente..."
                className="mt-2"
                rows={3}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Horarios de Atención Tab */}
        <TabsContent value="horarios">
          <Schedule />
        </TabsContent>

        {/* Direcciones Tab */}
        <TabsContent value="direcciones">
          <MasterDataLabels />
        </TabsContent>

        {/* E-commerce Tab */}
        <TabsContent value="ecommerce" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Gestión de E-commerce
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Administra las plataformas de e-commerce vinculadas a tu comercio
                </p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar E-commerce
              </Button>
            </div>

            {/* Formulario para agregar nuevo e-commerce */}
            {showAddForm && (
              <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Nueva Plataforma E-commerce
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Plataforma E-commerce</Label>
                    <Select 
                      value={newEcommerce.platformId} 
                      onValueChange={(value) => setNewEcommerce(prev => ({...prev, platformId: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        {authorizedEcommercePlatforms
                          .filter(platform => platform.active)
                          .map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center space-x-2">
                              <span>{platform.icon}</span>
                              <span>{platform.name}</span>
                              <span className="text-xs text-gray-500">({platform.baseUrl})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>URL de tu tienda/comercio</Label>
                    <Input
                      value={newEcommerce.url}
                      onChange={(e) => setNewEcommerce(prev => ({...prev, url: e.target.value}))}
                      placeholder="https://www.rappi.com.cl/tienda/mi-restaurante"
                    />
                    {newEcommerce.platformId && newEcommerce.url && (
                      <p className="text-xs mt-1 flex items-center">
                        {validateEcommerceUrl(newEcommerce.url, newEcommerce.platformId) ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                            <span className="text-green-600">URL válida</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1 text-red-600" />
                            <span className="text-red-600">URL no válida para esta plataforma</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allBranches"
                      checked={newEcommerce.allBranches}
                      onChange={(e) => setNewEcommerce(prev => ({...prev, allBranches: e.target.checked}))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="allBranches" className="text-sm">
                      Aplicar a todas las sucursales del comercio
                    </Label>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 ml-6">
                    Al activar esta opción, el e-commerce aparecerá en la ficha de todas tus sucursales
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleAddEcommerce} size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Agregar E-commerce
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}

            {/* Lista de e-commerces vinculados */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                E-commerces Vinculados ({linkedEcommerces.length})
              </h3>

              {linkedEcommerces.length === 0 ? (
                <Card className="p-8 text-center bg-gray-50">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="font-medium text-gray-600 mb-2">No hay e-commerces vinculados</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Agrega tus plataformas de e-commerce para que aparezcan en el buscador de comercios
                  </p>
                  <Button onClick={() => setShowAddForm(true)} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar primer e-commerce
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {linkedEcommerces.map((ecommerce) => {
                    const platform = authorizedEcommercePlatforms.find(p => p.id === ecommerce.platformId);
                    return (
                      <Card key={ecommerce.id} className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{platform?.icon}</span>
                              <h4 className="font-medium">{ecommerce.platformName}</h4>
                              {ecommerce.verified && (
                                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verificado
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                <a 
                                  href={ecommerce.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center"
                                >
                                  Ver tienda
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                              <div className="flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                <span>
                                  {ecommerce.allBranches ? 'Todas las sucursales' : 'Sucursales específicas'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Agregado: {new Date(ecommerce.dateAdded).toLocaleDateString('es-CL')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleRemoveEcommerce(ecommerce.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Información adicional */}
            <Card className="p-4 bg-yellow-50 border-yellow-200 mt-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Información importante</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Solo puedes vincular plataformas autorizadas por Edenred</li>
                    <li>• Tu comercio debe tener el botón de pago Edenred configurado en la plataforma</li>
                    <li>• Los cambios se reflejan inmediatamente en el buscador de comercios</li>
                    <li>• Al agregar un e-commerce para "todas las sucursales", aparecerá en cada una de ellas</li>
                  </ul>
                </div>
              </div>
            </Card>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}