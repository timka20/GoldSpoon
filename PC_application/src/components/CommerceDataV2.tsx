import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
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
  Clock,
  Timer,
  ChevronDown,
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MasterDataLabels } from './MasterDataLabels';

// Estructura jerárquica de ubicaciones
const locationHierarchy = {
  'santiago': {
    name: 'Santiago',
    comunas: {
      'las-condes': {
        name: 'Las Condes',
        sucursales: [
          { id: 'lc-1', name: 'Miguel Claro', address: 'Miguel Claro 123' },
          { id: 'lc-2', name: 'Tobalaba', address: 'Av. Tobalaba 456' }
        ]
      },
      'providencia': {
        name: 'Providencia', 
        sucursales: [
          { id: 'prov-1', name: 'AGOSTO LEGUÍA NORTE 77', address: 'Agosto Leguía Norte 77' },
          { id: 'prov-2', name: 'Sucursal Providencia Centro', address: 'Av. Providencia 890' }
        ]
      }
    }
  },
  'valparaiso': {
    name: 'Valparaíso',
    comunas: {
      'vina-del-mar': {
        name: 'Viña del Mar',
        sucursales: [
          { id: 'vina-1', name: 'Av. San Martín', address: 'Av. San Martín 123' },
          { id: 'vina-2', name: 'Calle Valparaíso', address: 'Calle Valparaíso 456' }
        ]
      },
      'quilpue': {
        name: 'Quilpué',
        sucursales: [
          { id: 'quilpue-1', name: 'Centro Quilpué', address: 'Plaza Principal 789' },
          { id: 'quilpue-2', name: 'Mall Quilpué', address: 'Mall Centro 321' }
        ]
      }
    }
  }
};

// Tipo para un bloque de horario
interface TimeBlock {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
  is24Hours: boolean;
  selectedDays: string[];
  applyToAll: boolean;
  selectedBranches: string[];
}

const dayNames = {
  monday: 'Lunes',
  tuesday: 'Martes', 
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

const allDays = Object.keys(dayNames);

export function CommerceDataV2() {
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

  // Estados para los bloques de horario
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      name: 'Horario Principal',
      startTime: '09:00',
      endTime: '18:00',
      enabled: true,
      is24Hours: false,
      selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      applyToAll: true,
      selectedBranches: []
    },
    {
      id: '2', 
      name: 'Horario Extendido Fines de Semana',
      startTime: '10:00',
      endTime: '22:00',
      enabled: true,
      is24Hours: false,
      selectedDays: ['saturday', 'sunday'],
      applyToAll: false,
      selectedBranches: ['lc-1', 'prov-1']
    }
  ]);

  // Estados para filtros de sucursales
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedComuna, setSelectedComuna] = useState('all');
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

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

  // Funciones para manejar bloques de horario
  const addTimeBlock = () => {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      name: `Nuevo Bloque ${timeBlocks.length + 1}`,
      startTime: '09:00',
      endTime: '18:00',
      enabled: true,
      is24Hours: false,
      selectedDays: ['monday'],
      applyToAll: true,
      selectedBranches: []
    };
    setTimeBlocks(prev => [...prev, newBlock]);
  };

  const removeTimeBlock = (id: string) => {
    setTimeBlocks(prev => prev.filter(block => block.id !== id));
  };

  const updateTimeBlock = (id: string, field: string, value: any) => {
    setTimeBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const handleDaySelection = (blockId: string, day: string, checked: boolean) => {
    setTimeBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        const newSelectedDays = checked 
          ? [...block.selectedDays, day]
          : block.selectedDays.filter(d => d !== day);
        return { ...block, selectedDays: newSelectedDays };
      }
      return block;
    }));
  };

  const handleBranchSelection = (blockId: string, branchId: string, checked: boolean) => {
    setTimeBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        const newSelectedBranches = checked
          ? [...block.selectedBranches, branchId]
          : block.selectedBranches.filter(b => b !== branchId);
        return { ...block, selectedBranches: newSelectedBranches };
      }
      return block;
    }));
  };

  // Obtener todas las sucursales de manera plana
  const getAllBranches = () => {
    const branches = [];
    Object.entries(locationHierarchy).forEach(([regionKey, region]) => {
      Object.entries(region.comunas).forEach(([comunaKey, comuna]) => {
        comuna.sucursales.forEach(sucursal => {
          branches.push({
            ...sucursal,
            regionKey,
            regionName: region.name,
            comunaKey,
            comunaName: comuna.name,
            fullPath: `${region.name} > ${comuna.name} > ${sucursal.name}`
          });
        });
      });
    });
    return branches;
  };

  // Filtrar sucursales según región y comuna seleccionadas
  const getFilteredBranches = () => {
    const allBranches = getAllBranches();
    return allBranches.filter(branch => {
      if (selectedRegion !== 'all' && branch.regionKey !== selectedRegion) return false;
      if (selectedComuna !== 'all' && branch.comunaKey !== selectedComuna) return false;
      return true;
    });
  };

  // Obtener comunas de la región seleccionada
  const getComunasForRegion = (regionKey: string) => {
    if (!regionKey || regionKey === 'all' || !locationHierarchy[regionKey]) return [];
    return Object.entries(locationHierarchy[regionKey].comunas).map(([key, comuna]) => ({
      key,
      name: comuna.name
    }));
  };

  const getBranchesText = (applyToAll: boolean, selectedBranches: string[]) => {
    if (applyToAll) {
      return 'Todas las sucursales';
    }
    if (selectedBranches.length === 0) {
      return 'Ninguna sucursal seleccionada';
    }
    const allBranches = getAllBranches();
    if (selectedBranches.length === 1) {
      const branch = allBranches.find(b => b.id === selectedBranches[0]);
      return branch ? branch.name : 'Sucursal';
    }
    return `${selectedBranches.length} sucursales seleccionadas`;
  };

  // Componente para renderizar selector de días
  const DaySelector = ({ blockId, selectedDays }: { blockId: string, selectedDays: string[] }) => (
    <div className="space-y-2">
      <Label>Días de aplicación</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {allDays.map(day => (
          <div key={day} className="flex items-center space-x-2">
            <Checkbox
              id={`${blockId}-${day}`}
              checked={selectedDays.includes(day)}
              onCheckedChange={(checked) => handleDaySelection(blockId, day, checked as boolean)}
            />
            <Label htmlFor={`${blockId}-${day}`} className="text-sm cursor-pointer">
              {dayNames[day]}
            </Label>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedDays.map(day => (
          <Badge key={day} variant="secondary" className="text-xs">
            {dayNames[day]}
          </Badge>
        ))}
      </div>
    </div>
  );

  // Componente para selector de sucursales con filtros
  const BranchSelector = ({ block }: { block: TimeBlock }) => (
    <div className="space-y-4">
      <Label>Aplicar a sucursales</Label>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={block.applyToAll}
          onCheckedChange={(checked) => updateTimeBlock(block.id, 'applyToAll', checked)}
        />
        <span className="text-sm">Todas las sucursales</span>
      </div>

      {!block.applyToAll && (
        <>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm">Filtrar por Región</Label>
              <Select value={selectedRegion} onValueChange={(value) => {
                setSelectedRegion(value);
                setSelectedComuna('all'); // Reset comuna when region changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las regiones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {Object.entries(locationHierarchy).map(([key, region]) => (
                    <SelectItem key={key} value={key}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Filtrar por Comuna</Label>
              <Select value={selectedComuna} onValueChange={setSelectedComuna} disabled={selectedRegion === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las comunas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las comunas</SelectItem>
                  {selectedRegion && selectedRegion !== "all" && getComunasForRegion(selectedRegion).map(comuna => (
                    <SelectItem key={comuna.key} value={comuna.key}>{comuna.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de sucursales */}
          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
            <p className="text-sm font-medium mb-3">Seleccionar sucursales:</p>
            <div className="space-y-2">
              {getFilteredBranches().map(branch => (
                <div key={branch.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${block.id}-${branch.id}`}
                    checked={block.selectedBranches.includes(branch.id)}
                    onCheckedChange={(checked) => handleBranchSelection(block.id, branch.id, checked as boolean)}
                  />
                  <Label htmlFor={`${block.id}-${branch.id}`} className="text-sm cursor-pointer flex-1">
                    <div>
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-xs text-gray-500">{branch.fullPath}</div>
                      <div className="text-xs text-gray-400">{branch.address}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Badge variant={block.applyToAll ? "default" : "outline"} className="text-xs">
            <Building className="w-3 h-3 mr-1" />
            {getBranchesText(block.applyToAll, block.selectedBranches)}
          </Badge>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Datos del Comercio (opc2)</h1>
          <p className="text-gray-600">Configuración por bloques de horario con selección de días y filtros jerárquicos</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Tabs System */}
      <Tabs defaultValue="contactos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contactos" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Contactos</span>
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Horarios por Bloques</span>
          </TabsTrigger>
          <TabsTrigger value="direcciones" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Direcciones</span>
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

        {/* Horarios por Bloques Tab */}
        <TabsContent value="horarios" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Configuración por Bloques de Horario
                </h2>
                <p className="text-sm text-gray-600">
                  Crea bloques de horario y selecciona los días y sucursales donde aplican
                </p>
              </div>
              <Button onClick={addTimeBlock} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Bloque
              </Button>
            </div>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Nuevo Enfoque:</strong> Configura bloques de horario y selecciona los días de la semana donde aplican. Cada bloque puede tener diferentes sucursales asignadas.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              {timeBlocks.map((block, index) => (
                <Card key={block.id} className="p-6 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">Bloque {index + 1}</Badge>
                      <Input
                        value={block.name}
                        onChange={(e) => updateTimeBlock(block.id, 'name', e.target.value)}
                        className="max-w-xs"
                        placeholder="Nombre del bloque"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={block.enabled}
                        onCheckedChange={(checked) => updateTimeBlock(block.id, 'enabled', checked)}
                      />
                      <span className="text-sm">{block.enabled ? 'Activo' : 'Inactivo'}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimeBlock(block.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {block.enabled && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Configuración de horario */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={block.is24Hours}
                            onCheckedChange={(checked) => updateTimeBlock(block.id, 'is24Hours', checked)}
                          />
                          <span className="text-sm">24 Horas</span>
                          {block.is24Hours && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Timer className="w-3 h-3 mr-1" />
                              00:00 - 23:59
                            </Badge>
                          )}
                        </div>

                        {!block.is24Hours && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm">Hora de apertura</Label>
                              <Input
                                type="time"
                                value={block.startTime}
                                onChange={(e) => updateTimeBlock(block.id, 'startTime', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Hora de cierre</Label>
                              <Input
                                type="time"
                                value={block.endTime}
                                onChange={(e) => updateTimeBlock(block.id, 'endTime', e.target.value)}
                              />
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <span className="text-sm font-medium">
                                {block.startTime} - {block.endTime}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selección de días */}
                      <div>
                        <DaySelector blockId={block.id} selectedDays={block.selectedDays} />
                      </div>

                      {/* Selección de sucursales */}
                      <div>
                        <BranchSelector block={block} />
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {timeBlocks.length === 0 && (
                <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No hay bloques de horario configurados</p>
                  <Button
                    variant="outline"
                    onClick={addTimeBlock}
                    className="mt-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Bloque
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Direcciones Tab */}
        <TabsContent value="direcciones">
          <MasterDataLabels />
        </TabsContent>
      </Tabs>
    </div>
  );
}