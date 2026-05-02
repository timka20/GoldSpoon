import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Save, 
  Building, 
  ChevronDown, 
  AlertTriangle,
  CheckCircle,
  Calendar1,
  Timer,
  Zap
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

const branches = [
  { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
  { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
  { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
  { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
];

// Tipo para un bloque de horario
interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
}

// Tipo para un día de la semana
interface DaySchedule {
  enabled: boolean;
  is24Hours: boolean;
  timeBlocks: TimeBlock[];
  applyToAll: boolean;
  selectedBranches: string[];
}

// Tipo para fecha excepcional
interface ExceptionalDate {
  id: string;
  dateFrom: string;
  dateTo: string;
  name: string;
  enabled: boolean;
  is24Hours: boolean;
  timeBlocks: TimeBlock[];
  applyToAll: boolean;
  selectedBranches: string[];
}

export function Schedule() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    monday: { 
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '09:00', endTime: '14:00' },
        { id: '2', startTime: '16:00', endTime: '20:00' }
      ],
      applyToAll: true,
      selectedBranches: []
    },
    tuesday: { 
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '09:00', endTime: '14:00' },
        { id: '2', startTime: '16:00', endTime: '20:00' }
      ],
      applyToAll: true,
      selectedBranches: []
    },
    wednesday: { 
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '09:00', endTime: '14:00' },
        { id: '2', startTime: '16:00', endTime: '20:00' }
      ],
      applyToAll: false,
      selectedBranches: ['principal', 'las-condes']
    },
    thursday: { 
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '09:00', endTime: '14:00' },
        { id: '2', startTime: '16:00', endTime: '20:00' }
      ],
      applyToAll: true,
      selectedBranches: []
    },
    friday: { 
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '09:00', endTime: '14:00' },
        { id: '2', startTime: '16:00', endTime: '22:00' }
      ],
      applyToAll: false,
      selectedBranches: ['principal', 'las-condes', 'nunoa']
    },
    saturday: { 
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '10:00', endTime: '22:00' }
      ],
      applyToAll: true,
      selectedBranches: []
    },
    sunday: { 
      enabled: false,
      is24Hours: false,
      timeBlocks: [],
      applyToAll: false,
      selectedBranches: ['principal']
    },
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  
  const [exceptionalDates, setExceptionalDates] = useState<ExceptionalDate[]>([
    {
      id: '1',
      dateFrom: '2025-01-01',
      dateTo: '2025-01-01',
      name: 'Año Nuevo',
      enabled: false, // Cerrado
      is24Hours: false,
      timeBlocks: [],
      applyToAll: true,
      selectedBranches: []
    },
    {
      id: '2',
      dateFrom: '2025-12-25',
      dateTo: '2025-12-25',
      name: 'Navidad',
      enabled: false, // Cerrado
      is24Hours: false,
      timeBlocks: [],
      applyToAll: true,
      selectedBranches: []
    },
    {
      id: '3',
      dateFrom: '2025-02-14',
      dateTo: '2025-02-14',
      name: 'San Valentín - Horario Especial',
      enabled: true,
      is24Hours: false,
      timeBlocks: [
        { id: '1', startTime: '10:00', endTime: '14:00' },
        { id: '2', startTime: '16:00', endTime: '24:00' }
      ],
      applyToAll: false,
      selectedBranches: ['principal', 'las-condes']
    },
    {
      id: '4',
      dateFrom: '2025-03-15',
      dateTo: '2025-03-16',
      name: 'Evento 24 Horas',
      enabled: true,
      is24Hours: true,
      timeBlocks: [],
      applyToAll: false,
      selectedBranches: ['principal']
    }
  ]);

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  // Función para validar que no se superpongan los horarios
  const validateTimeBlocks = (timeBlocks: TimeBlock[]): string[] => {
    const errors: string[] = [];
    
    for (let i = 0; i < timeBlocks.length; i++) {
      const current = timeBlocks[i];
      
      // Validar que hora de cierre sea posterior a hora de apertura
      if (current.startTime && current.endTime && current.startTime >= current.endTime) {
        errors.push(`Bloque ${i + 1}: La hora de cierre debe ser posterior a la hora de apertura`);
      }
      
      // Validar superposiciones con otros bloques
      for (let j = i + 1; j < timeBlocks.length; j++) {
        const next = timeBlocks[j];
        
        if (current.startTime && current.endTime && next.startTime && next.endTime) {
          // Verificar si hay superposición
          if (
            (current.startTime < next.endTime && current.endTime > next.startTime) ||
            (next.startTime < current.endTime && next.endTime > current.startTime)
          ) {
            errors.push(`Los bloques ${i + 1} y ${j + 1} se superponen`);
          }
        }
      }
    }
    
    return errors;
  };

  const handleScheduleChange = (day: string, field: string, value: any) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          [field]: value
        }
      };
      
      // Validar cuando se modifican los timeBlocks
      if (field === 'timeBlocks') {
        const errors = validateTimeBlocks(value);
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          [day]: errors
        }));
      }
      
      return newSchedule;
    });
  };

  // Agregar un nuevo bloque de horario a un día
  const addTimeBlock = (day: string) => {
    const daySchedule = schedule[day];
    if (daySchedule.timeBlocks.length >= 3) {
      toast.error('Máximo 3 bloques de horario por día');
      return;
    }
    
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      startTime: '09:00',
      endTime: '18:00'
    };
    
    const newTimeBlocks = [...daySchedule.timeBlocks, newBlock];
    handleScheduleChange(day, 'timeBlocks', newTimeBlocks);
  };

  // Remover un bloque de horario
  const removeTimeBlock = (day: string, blockId: string) => {
    const daySchedule = schedule[day];
    const newTimeBlocks = daySchedule.timeBlocks.filter(block => block.id !== blockId);
    handleScheduleChange(day, 'timeBlocks', newTimeBlocks);
  };

  // Actualizar un bloque de horario específico
  const updateTimeBlock = (day: string, blockId: string, field: 'startTime' | 'endTime', value: string) => {
    const daySchedule = schedule[day];
    const newTimeBlocks = daySchedule.timeBlocks.map(block =>
      block.id === blockId ? { ...block, [field]: value } : block
    );
    handleScheduleChange(day, 'timeBlocks', newTimeBlocks);
  };

  // Manejar el toggle de 24 horas para un día específico
  const handle24HoursToggle = (day: string, is24Hours: boolean) => {
    if (is24Hours) {
      // Si se activa 24 horas, limpiar los bloques de horario
      handleScheduleChange(day, 'timeBlocks', []);
    }
    handleScheduleChange(day, 'is24Hours', is24Hours);
    
    if (is24Hours) {
      toast.success(`${dayNames[day]} configurado como 24 horas`);
    } else {
      toast.success(`Modo 24 horas desactivado para ${dayNames[day]}`);
    }
  };

  // Funciones para fechas excepcionales
  const addExceptionalDate = () => {
    const newDate: ExceptionalDate = {
      id: Date.now().toString(),
      dateFrom: '',
      dateTo: '',
      name: '',
      enabled: true,
      is24Hours: false,
      timeBlocks: [{ id: '1', startTime: '09:00', endTime: '18:00' }],
      applyToAll: true,
      selectedBranches: []
    };
    setExceptionalDates(prev => [...prev, newDate]);
  };

  const removeExceptionalDate = (id: string) => {
    setExceptionalDates(prev => prev.filter(date => date.id !== id));
  };

  const updateExceptionalDate = (id: string, field: string, value: any) => {
    setExceptionalDates(prev => prev.map(date => {
      if (date.id === id) {
        const updated = { ...date, [field]: value };
        
        // Validar cuando se modifican los timeBlocks
        if (field === 'timeBlocks') {
          const errors = validateTimeBlocks(value);
          setValidationErrors(prevErrors => ({
            ...prevErrors,
            [`exceptional-${id}`]: errors
          }));
        }
        
        return updated;
      }
      return date;
    }));
  };

  // Agregar bloque a fecha excepcional
  const addTimeBlockToExceptional = (dateId: string) => {
    const exceptionalDate = exceptionalDates.find(d => d.id === dateId);
    if (!exceptionalDate) return;
    
    if (exceptionalDate.timeBlocks.length >= 3) {
      toast.error('Máximo 3 bloques de horario por día');
      return;
    }
    
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      startTime: '09:00',
      endTime: '18:00'
    };
    
    const newTimeBlocks = [...exceptionalDate.timeBlocks, newBlock];
    updateExceptionalDate(dateId, 'timeBlocks', newTimeBlocks);
  };

  // Remover bloque de fecha excepcional
  const removeTimeBlockFromExceptional = (dateId: string, blockId: string) => {
    const exceptionalDate = exceptionalDates.find(d => d.id === dateId);
    if (!exceptionalDate) return;
    
    const newTimeBlocks = exceptionalDate.timeBlocks.filter(block => block.id !== blockId);
    updateExceptionalDate(dateId, 'timeBlocks', newTimeBlocks);
  };

  // Actualizar bloque de fecha excepcional
  const updateExceptionalTimeBlock = (dateId: string, blockId: string, field: 'startTime' | 'endTime', value: string) => {
    const exceptionalDate = exceptionalDates.find(d => d.id === dateId);
    if (!exceptionalDate) return;
    
    const newTimeBlocks = exceptionalDate.timeBlocks.map(block =>
      block.id === blockId ? { ...block, [field]: value } : block
    );
    updateExceptionalDate(dateId, 'timeBlocks', newTimeBlocks);
  };

  const handleSave = () => {
    // Validar todos los horarios antes de guardar
    let hasErrors = false;
    const allErrors: Record<string, string[]> = {};
    
    // Validar horarios regulares
    Object.entries(schedule).forEach(([day, daySchedule]) => {
      if (daySchedule.enabled && !daySchedule.is24Hours) {
        const errors = validateTimeBlocks(daySchedule.timeBlocks);
        if (errors.length > 0) {
          allErrors[day] = errors;
          hasErrors = true;
        }
      }
    });
    
    // Validar fechas excepcionales
    exceptionalDates.forEach(date => {
      if (date.enabled && !date.is24Hours) {
        const errors = validateTimeBlocks(date.timeBlocks);
        if (errors.length > 0) {
          allErrors[`exceptional-${date.id}`] = errors;
          hasErrors = true;
        }
      }
    });
    
    setValidationErrors(allErrors);
    
    if (hasErrors) {
      toast.error('Corrige los errores en los horarios antes de guardar');
      return;
    }
    
    // Simular guardado exitoso
    toast.success('Horarios guardados correctamente. Sincronización con buscador completada.');
  };

  const handleScheduleApplyToAllToggle = (day: string, applyToAll: boolean) => {
    handleScheduleChange(day, 'applyToAll', applyToAll);
    if (applyToAll) {
      handleScheduleChange(day, 'selectedBranches', []);
      toast.success(`Horario de ${dayNames[day]} aplicado a todas las sucursales`);
    } else {
      toast.success(`Configuración específica por sucursales para ${dayNames[day]}`);
    }
  };

  const handleScheduleBranchSelection = (day: string, branchValue: string, checked: boolean) => {
    const daySchedule = schedule[day];
    const newBranches = checked 
      ? [...daySchedule.selectedBranches, branchValue]
      : daySchedule.selectedBranches.filter(b => b !== branchValue);
    handleScheduleChange(day, 'selectedBranches', newBranches);
  };

  const handleExceptionalDateApplyToAllToggle = (id: string, applyToAll: boolean) => {
    updateExceptionalDate(id, 'applyToAll', applyToAll);
    if (applyToAll) {
      updateExceptionalDate(id, 'selectedBranches', []);
      toast.success('Fecha excepcional aplicada a todas las sucursales');
    } else {
      toast.success('Configuración específica por sucursales para fecha excepcional');
    }
  };

  const handleExceptionalDateBranchSelection = (id: string, branchValue: string, checked: boolean) => {
    const exceptionalDate = exceptionalDates.find(d => d.id === id);
    if (exceptionalDate) {
      const newBranches = checked 
        ? [...exceptionalDate.selectedBranches, branchValue]
        : exceptionalDate.selectedBranches.filter(b => b !== branchValue);
      updateExceptionalDate(id, 'selectedBranches', newBranches);
    }
  };

  const getBranchesText = (applyToAll: boolean, selectedBranches: string[]) => {
    if (applyToAll) {
      return 'Todas las sucursales';
    }
    if (selectedBranches.length === 0) {
      return 'Ninguna sucursal';
    }
    if (selectedBranches.length === 1) {
      const branch = branches.find(b => b.value === selectedBranches[0]);
      return branch ? branch.label.split(' - ')[0] : 'Sucursal';
    }
    return `${selectedBranches.length} sucursales`;
  };

  // Función para obtener el horario que se debe mostrar para una fecha específica
  const getScheduleForDate = (date: string) => {
    // Primero verificar si hay horario excepcional para esa fecha
    const exceptionalDate = exceptionalDates.find(ed => {
      const targetDate = new Date(date);
      const fromDate = new Date(ed.dateFrom);
      const toDate = new Date(ed.dateTo);
      return targetDate >= fromDate && targetDate <= toDate;
    });
    if (exceptionalDate) {
      return { type: 'exceptional', schedule: exceptionalDate };
    }
    
    // Si no hay horario excepcional, devolver el horario regular del día
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date(date).getDay()];
    return { type: 'regular', schedule: schedule[dayName] };
  };

  // Componente para renderizar un bloque de horario
  const TimeBlockComponent = ({ 
    block, 
    onUpdate, 
    onRemove, 
    canRemove, 
    dayKey 
  }: {
    block: TimeBlock;
    onUpdate: (field: 'startTime' | 'endTime', value: string) => void;
    onRemove: () => void;
    canRemove: boolean;
    dayKey: string;
  }) => (
    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
      <div className="flex items-center space-x-2 flex-1">
        <div>
          <Label className="text-xs">Apertura</Label>
          <Input
            type="time"
            value={block.startTime}
            onChange={(e) => onUpdate('startTime', e.target.value)}
            className="w-20"
          />
        </div>
        <span className="text-gray-500">-</span>
        <div>
          <Label className="text-xs">Cierre</Label>
          <Input
            type="time"
            value={block.endTime}
            onChange={(e) => onUpdate('endTime', e.target.value)}
            className="w-20"
          />
        </div>
      </div>
      {canRemove && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const BranchSelector = ({ 
    type, 
    id, 
    applyToAll, 
    selectedBranches, 
    onApplyToAllChange, 
    onBranchSelectionChange 
  }: {
    type: string;
    id: string | number;
    applyToAll: boolean;
    selectedBranches: string[];
    onApplyToAllChange: (applyToAll: boolean) => void;
    onBranchSelectionChange: (branchValue: string, checked: boolean) => void;
  }) => (
    <div>
      <Label>Aplicar a</Label>
      <div className="space-y-2 mt-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={applyToAll}
            onCheckedChange={onApplyToAllChange}
          />
          <span className="text-sm">Todas las sucursales</span>
        </div>
        
        <Badge variant={applyToAll ? "default" : "outline"} className="text-xs">
          <Building className="w-3 h-3 mr-1" />
          {getBranchesText(applyToAll, selectedBranches)}
        </Badge>
        
        {!applyToAll && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">
              Para seleccionar sucursales específicas, activa "Todas las sucursales" primero.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestión de Horarios de Atención
          </h1>
          <p className="text-gray-600">
            Sistema de horarios con validación de integridad y prioridad excepcional
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Horarios
        </Button>
      </div>
      


      {/* Branch Selector */}
      <div className="mb-4">
        <Label>Sucursal</Label>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-full max-w-md mt-1">
            <SelectValue placeholder="Seleccionar sucursal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las sucursales</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.value} value={branch.value}>
                {branch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current Date Schedule Preview */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar1 className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Horario para Hoy ({new Date().toLocaleDateString()})</h3>
              <p className="text-sm text-green-700">
                {(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const todaySchedule = getScheduleForDate(today);
                  
                  if (todaySchedule.type === 'exceptional') {
                    const schedule = todaySchedule.schedule as ExceptionalDate;
                    if (!schedule.enabled) return 'CERRADO (Fecha Excepcional)';
                    if (schedule.is24Hours) return '24 HORAS (Fecha Excepcional)';
                    return `${schedule.timeBlocks.map(b => `${b.startTime}-${b.endTime}`).join(', ')} (Excepcional)`;
                  } else {
                    const schedule = todaySchedule.schedule as DaySchedule;
                    if (!schedule.enabled) return 'CERRADO';
                    if (schedule.is24Hours) return '24 HORAS';
                    return schedule.timeBlocks.map(b => `${b.startTime}-${b.endTime}`).join(', ');
                  }
                })()}
              </p>
            </div>
          </div>
          <Badge variant={
            (() => {
              const today = new Date().toISOString().split('T')[0];
              const todaySchedule = getScheduleForDate(today);
              return todaySchedule.type === 'exceptional' ? 'destructive' : 'default';
            })()
          }>
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const todaySchedule = getScheduleForDate(today);
              return todaySchedule.type === 'exceptional' ? 'EXCEPCIONAL' : 'REGULAR';
            })()}
          </Badge>
        </div>
      </Card>

      {/* Regular Schedule */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Horarios Regulares (Máximo 3 bloques por día)
        </h2>
        <div className="space-y-4">
          {Object.entries(schedule).map(([day, dayInfo]) => (
            <div key={day} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={dayInfo.enabled}
                    onCheckedChange={(checked) => handleScheduleChange(day, 'enabled', checked)}
                  />
                  <span className="font-medium w-20">{dayNames[day]}</span>
                  
                  {dayInfo.enabled && (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={dayInfo.is24Hours}
                        onCheckedChange={(checked) => handle24HoursToggle(day, checked)}
                      />
                      <span className="text-sm">24 Horas</span>
                      {dayInfo.is24Hours && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Timer className="w-3 h-3 mr-1" />
                          00:00 - 23:59
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {!dayInfo.enabled && (
                    <Badge variant="secondary">Cerrado</Badge>
                  )}
                </div>
              </div>
              
              {dayInfo.enabled && !dayInfo.is24Hours && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Bloques de Horario ({dayInfo.timeBlocks.length}/3)</Label>
                      {dayInfo.timeBlocks.length < 3 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTimeBlock(day)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar Bloque
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {dayInfo.timeBlocks.map((block, index) => (
                        <TimeBlockComponent
                          key={block.id}
                          block={block}
                          onUpdate={(field, value) => updateTimeBlock(day, block.id, field, value)}
                          onRemove={() => removeTimeBlock(day, block.id)}
                          canRemove={dayInfo.timeBlocks.length > 0}
                          dayKey={day}
                        />
                      ))}
                      
                      {dayInfo.timeBlocks.length === 0 && (
                        <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Sin bloques de horario configurados</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addTimeBlock(day)}
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar Primer Bloque
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Mostrar errores de validación */}
                    {validationErrors[day] && validationErrors[day].length > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <AlertDescription>
                          <div className="text-red-800">
                            <p className="font-medium mb-1">Errores en horarios:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {validationErrors[day].map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <BranchSelector
                    type="schedule"
                    id={day}
                    applyToAll={dayInfo.applyToAll}
                    selectedBranches={dayInfo.selectedBranches}
                    onApplyToAllChange={(applyToAll) => handleScheduleApplyToAllToggle(day, applyToAll)}
                    onBranchSelectionChange={(branchValue, checked) => 
                      handleScheduleBranchSelection(day, branchValue, checked)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Exceptional Dates */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar1 className="w-5 h-5 mr-2" />
            Fechas Excepcionales (Prioridad sobre horario regular)
          </h2>
          <Button onClick={addExceptionalDate}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Fecha Excepcional
          </Button>
        </div>

        <div className="space-y-4">
          {exceptionalDates.map((date) => (
            <div key={date.id} className="border rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={date.enabled}
                    onCheckedChange={(checked) => updateExceptionalDate(date.id, 'enabled', checked)}
                  />
                  <div className="flex-1">
                    <Input
                      value={date.name}
                      onChange={(e) => updateExceptionalDate(date.id, 'name', e.target.value)}
                      placeholder="Nombre del evento especial"
                      className="font-medium"
                    />
                  </div>
                  
                  {date.enabled && (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={date.is24Hours}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateExceptionalDate(date.id, 'timeBlocks', []);
                          }
                          updateExceptionalDate(date.id, 'is24Hours', checked);
                        }}
                      />
                      <span className="text-sm">24 Horas</span>
                      {date.is24Hours && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Timer className="w-3 h-3 mr-1" />
                          00:00 - 23:59
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {!date.enabled && (
                    <Badge variant="destructive">Cerrado</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeExceptionalDate(date.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Date Range Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Fecha desde</Label>
                  <Input
                    type="date"
                    value={date.dateFrom}
                    onChange={(e) => updateExceptionalDate(date.id, 'dateFrom', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Fecha hasta</Label>
                  <Input
                    type="date"
                    value={date.dateTo}
                    onChange={(e) => updateExceptionalDate(date.id, 'dateTo', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {date.enabled && !date.is24Hours && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Bloques de Horario ({date.timeBlocks.length}/3)</Label>
                      {date.timeBlocks.length < 3 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTimeBlockToExceptional(date.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar Bloque
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {date.timeBlocks.map((block, index) => (
                        <TimeBlockComponent
                          key={block.id}
                          block={block}
                          onUpdate={(field, value) => updateExceptionalTimeBlock(date.id, block.id, field, value)}
                          onRemove={() => removeTimeBlockFromExceptional(date.id, block.id)}
                          canRemove={date.timeBlocks.length > 0}
                          dayKey={`exceptional-${date.id}`}
                        />
                      ))}
                      
                      {date.timeBlocks.length === 0 && (
                        <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Sin bloques de horario configurados</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addTimeBlockToExceptional(date.id)}
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar Primer Bloque
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Mostrar errores de validación */}
                    {validationErrors[`exceptional-${date.id}`] && validationErrors[`exceptional-${date.id}`].length > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <AlertDescription>
                          <div className="text-red-800">
                            <p className="font-medium mb-1">Errores en horarios:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {validationErrors[`exceptional-${date.id}`].map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <BranchSelector
                    type="exceptional"
                    id={date.id}
                    applyToAll={date.applyToAll}
                    selectedBranches={date.selectedBranches}
                    onApplyToAllChange={(applyToAll) => handleExceptionalDateApplyToAllToggle(date.id, applyToAll)}
                    onBranchSelectionChange={(branchValue, checked) => 
                      handleExceptionalDateBranchSelection(date.id, branchValue, checked)
                    }
                  />
                </div>
              )}

              {/* Date range preview */}
              {date.dateFrom && date.dateTo && (
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">
                      {date.dateFrom === date.dateTo 
                        ? `Aplica el: ${new Date(date.dateFrom).toLocaleDateString()}`
                        : `Aplica desde: ${new Date(date.dateFrom).toLocaleDateString()} hasta ${new Date(date.dateTo).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {exceptionalDates.length === 0 && (
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <Calendar1 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg mb-2">Sin fechas excepcionales configuradas</p>
              <p className="text-sm mb-4">Agrega fechas especiales como feriados, eventos o horarios especiales</p>
              <Button onClick={addExceptionalDate} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Fecha Excepcional
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}