import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  HelpCircle, 
  Plus, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Search,
  Filter,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Support() {
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Problema con la carga de fotos',
      description: 'No puedo subir nuevas fotos del local, aparece un error',
      category: 'technical',
      priority: 'high',
      status: 'open',
      createdAt: '2025-01-25',
      updatedAt: '2025-01-25',
      responses: 2
    },
    {
      id: 2,
      title: 'Consulta sobre horarios especiales',
      description: '¿Cómo configuro horarios diferentes para feriados?',
      category: 'general',
      priority: 'medium',
      status: 'in-progress',
      createdAt: '2025-01-24',
      updatedAt: '2025-01-25',
      responses: 1
    },
    {
      id: 3,
      title: 'Solicitud de verificación de cuenta',
      description: 'Necesito verificar mi cuenta para acceder a funciones premium',
      category: 'account',
      priority: 'low',
      status: 'resolved',
      createdAt: '2025-01-23',
      updatedAt: '2025-01-24',
      responses: 3
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'general', label: 'Consulta General' },
    { value: 'technical', label: 'Problema Técnico' },
    { value: 'account', label: 'Cuenta y Perfil' },
    { value: 'billing', label: 'Facturación' },
    { value: 'feature', label: 'Solicitud de Función' }
  ];

  const priorities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'open', label: 'Abiertos' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resueltos' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Abierto</Badge>;
      case 'in-progress':
        return <Badge variant="default">En Progreso</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resuelto</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'medium':
        return <Badge variant="default">Media</Badge>;
      case 'low':
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const ticket = {
      id: Date.now(),
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: 0
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
    setShowNewTicketForm(false);
    toast.success('Ticket creado correctamente. Te contactaremos pronto.');
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Soporte Técnico y Gestión de Tickets</h1>
          <p className="text-gray-600">Gestiona tus consultas y obtén ayuda del equipo de soporte</p>
          
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
        <Button onClick={() => setShowNewTicketForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Tickets</p>
              <p className="text-2xl font-semibold">{tickets.length}</p>
            </div>
            <HelpCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Abiertos</p>
              <p className="text-2xl font-semibold">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Progreso</p>
              <p className="text-2xl font-semibold">{tickets.filter(t => t.status === 'in-progress').length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resueltos</p>
              <p className="text-2xl font-semibold">{tickets.filter(t => t.status === 'resolved').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Crear Nuevo Ticket</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título del Ticket *</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Describe brevemente tu consulta o problema"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <Select value={newTicket.category} onValueChange={(value) => 
                  setNewTicket(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prioridad</Label>
                <Select value={newTicket.priority} onValueChange={(value) => 
                  setNewTicket(prev => ({ ...prev, priority: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción Detallada *</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Describe en detalle tu consulta, problema o solicitud. Incluye pasos para reproducir el problema si es técnico."
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateTicket}>
                <Send className="w-4 h-4 mr-2" />
                Crear Ticket
              </Button>
              <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en tickets..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(ticket.status)}
                  <h3 className="font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                  <div className="flex space-x-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{ticket.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Categoría: {categories.find(c => c.value === ticket.category)?.label}</span>
                  <span>Creado: {ticket.createdAt}</span>
                  <span>Actualizado: {ticket.updatedAt}</span>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{ticket.responses} respuestas</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tickets</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'No se encontraron tickets que coincidan con tu búsqueda.' 
              : 'No tienes tickets de soporte aún.'}
          </p>
        </Card>
      )}

      {/* Help Resources */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Recursos de Ayuda</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Preguntas Frecuentes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ¿Cómo subo fotos de mi local?</li>
              <li>• ¿Cómo configuro horarios especiales?</li>
              <li>• ¿Cómo actualizo mi información de contacto?</li>
              <li>• ¿Cómo creo promociones efectivas?</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Contacto Directo</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Email: soporte@edenred.cl</li>
              <li>• Teléfono: +56 2 2345 6789</li>
              <li>• WhatsApp: +56 9 8765 4321</li>
              <li>• Horario: Lun-Vie 9:00-18:00</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}