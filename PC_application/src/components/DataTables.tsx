import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MapPin, Clock, Calendar, Settings, Sun, Moon, Database, Info, Menu, CreditCard, Tag, Phone, Mail, Globe, MessageCircle, User, Bell, HelpCircle } from 'lucide-react';

export function DataTables() {
  // Datos de sucursales
  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  // Datos de horarios regulares
  const regularSchedule = [
    { day: 'Lunes', enabled: true, openAM: '09:00', closeAM: '13:00', openPM: '14:00', closePM: '18:00' },
    { day: 'Martes', enabled: true, openAM: '09:00', closeAM: '13:00', openPM: '14:00', closePM: '18:00' },
    { day: 'Miércoles', enabled: true, openAM: '09:00', closeAM: '13:00', openPM: '14:00', closePM: '18:00' },
    { day: 'Jueves', enabled: true, openAM: '09:00', closeAM: '13:00', openPM: '14:00', closePM: '18:00' },
    { day: 'Viernes', enabled: true, openAM: '09:00', closeAM: '13:00', openPM: '14:00', closePM: '22:00' },
    { day: 'Sábado', enabled: true, openAM: '10:00', closeAM: '13:00', openPM: '14:00', closePM: '22:00' },
    { day: 'Domingo', enabled: false, openAM: '10:00', closeAM: '13:00', openPM: '14:00', closePM: '18:00' }
  ];

  // Datos de fechas especiales
  const specialDates = [
    { id: 1, date: '2025-01-01', name: 'Año Nuevo', type: 'Cerrado', openAM: '-', closeAM: '-', openPM: '-', closePM: '-' },
    { id: 2, date: '2025-12-25', name: 'Navidad', type: 'Cerrado', openAM: '-', closeAM: '-', openPM: '-', closePM: '-' },
    { id: 3, date: '2025-02-14', name: 'San Valentín - Horario Especial', type: 'Especial', openAM: '10:00', closeAM: '14:00', openPM: '16:00', closePM: '24:00' }
  ];

  // Datos de información básica del negocio
  const businessInfo = [
    { campo: 'Nombre de Fantasía', valor: 'Restaurante El Buen Sabor' },
    { campo: 'Razón Social', valor: 'Sociedad Gastronómica El Buen Sabor Ltda.' },
    { campo: 'RUT', valor: '76.543.210-K' },
    { campo: 'Dirección', valor: 'Av. Providencia 1234, Providencia' },
    { campo: 'Ciudad', valor: 'Santiago' },
    { campo: 'Comuna', valor: 'Providencia' },
    { campo: 'Código Postal', valor: '7501234' },
    { campo: 'Tipo de Comercio', valor: 'Restaurante' }
  ];

  // Tipos de negocio disponibles
  const businessTypes = [
    { value: 'restaurant', label: 'Restaurante' },
    { value: 'cafe', label: 'Café' },
    { value: 'retail', label: 'Retail' },
    { value: 'services', label: 'Servicios' },
    { value: 'pharmacy', label: 'Farmacia' },
    { value: 'supermarket', label: 'Supermercado' }
  ];

  // Categorías de comida
  const foodCategories = [
    { value: 'comida-saludable', label: 'Comida Saludable' },
    { value: 'comida-chatarra', label: 'Comida Chatarra' },
    { value: 'comida-casera', label: 'Comida Casera' },
    { value: 'comida-rapida', label: 'Comida Rápida' },
    { value: 'comida-gourmet', label: 'Comida Gourmet' },
    { value: 'comida-vegana', label: 'Comida Vegana' },
    { value: 'comida-vegetariana', label: 'Comida Vegetariana' },
    { value: 'comida-internacional', label: 'Comida Internacional' },
    { value: 'comida-tradicional', label: 'Comida Tradicional' },
    { value: 'comida-organica', label: 'Comida Orgánica' }
  ];

  // Categorías de menú
  const menuCategories = [
    { id: 1, name: 'Entradas', order: 1, visible: true, itemCount: 4 },
    { id: 2, name: 'Platos Principales', order: 2, visible: true, itemCount: 8 },
    { id: 3, name: 'Postres', order: 3, visible: true, itemCount: 5 },
    { id: 4, name: 'Bebidas', order: 4, visible: true, itemCount: 6 }
  ];

  // Productos del menú
  const menuProducts = [
    {
      id: 1,
      name: 'Empanadas de Pino',
      description: 'Tradicionales empanadas chilenas rellenas de carne, cebolla, huevo y aceitunas',
      price: 2500,
      category: 'Entradas',
      visible: true,
      featured: true,
      views: 245,
      orders: 34
    },
    {
      id: 2,
      name: 'Cazuela de Cordero',
      description: 'Cazuela tradicional con cordero, papas, zapallo, choclo y verduras frescas',
      price: 8900,
      category: 'Platos Principales',
      visible: true,
      featured: false,
      views: 189,
      orders: 28
    },
    {
      id: 3,
      name: 'Sopaipillas con Pebre',
      description: 'Sopaipillas caseras acompañadas de pebre tradicional',
      price: 1800,
      category: 'Entradas',
      visible: true,
      featured: false,
      views: 156,
      orders: 22
    },
    {
      id: 4,
      name: 'Leche Asada',
      description: 'Postre tradicional chileno con leche, huevos y azúcar caramelizada',
      price: 2200,
      category: 'Postres',
      visible: true,
      featured: false,
      views: 134,
      orders: 19
    }
  ];

  // Métodos de pago
  const paymentMethods = [
    { id: 1, name: 'Tarjeta de Crédito', type: 'card', enabled: true },
    { id: 2, name: 'Tarjeta de Débito', type: 'card', enabled: true },
    { id: 3, name: 'Transferencia Bancaria', type: 'transfer', enabled: true },
    { id: 4, name: 'Edenred', type: 'transfer', enabled: true },
    { id: 5, name: 'Efectivo', type: 'cash', enabled: true },
    { id: 6, name: 'Wallet Digital', type: 'digital', enabled: false }
  ];

  // Servicios contratados
  const services = [
    { id: 1, name: 'Delivery', enabled: true, cost: '$2.000/mes' },
    { id: 2, name: 'Reservas Online', enabled: true, cost: '$5.000/mes' },
    { id: 3, name: 'Marketing Digital', enabled: false, cost: '$10.000/mes' },
    { id: 4, name: 'Analytics Premium', enabled: false, cost: '$8.000/mes' }
  ];

  // Promociones y ofertas
  const promotions = [
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
  ];

  // Información de contacto - Teléfonos
  const phones = [
    { id: 1, number: '+56 9 8765 4321', area: 'General', type: 'Móvil', verified: true },
    { id: 2, number: '+56 2 2345 6789', area: 'Reservas', type: 'Fijo', verified: true },
    { id: 3, number: '+56 9 1234 5678', area: 'Delivery', type: 'Móvil', verified: false }
  ];

  // Información de contacto - Emails
  const emails = [
    { id: 1, email: 'info@elbuensabor.cl', area: 'General', verified: true },
    { id: 2, email: 'reservas@elbuensabor.cl', area: 'Reservas', verified: true },
    { id: 3, email: 'delivery@elbuensabor.cl', area: 'Delivery', verified: false }
  ];

  // Redes sociales
  const socialMedia = [
    { id: 1, platform: 'WhatsApp', handle: '+56987654321', url: 'https://wa.me/56987654321' },
    { id: 2, platform: 'Instagram', handle: '@elbuensabor', url: 'https://instagram.com/elbuensabor' },
    { id: 3, platform: 'Facebook', handle: 'El Buen Sabor', url: 'https://facebook.com/elbuensabor' }
  ];

  // Estado actual del negocio
  const currentStatus = [
    { campo: 'Estado', valor: 'ABIERTO' },
    { campo: 'Hora de Cierre', valor: '18:00' },
    { campo: 'Estado en Línea', valor: 'En línea' },
    { campo: 'Color de Estado', valor: 'Verde' }
  ];

  // Configuraciones del sistema
  const systemSettings = [
    { configuracion: 'Sucursal Predeterminada', valor: 'principal' },
    { configuracion: 'Actualización Automática', valor: 'Habilitada' },
    { configuracion: 'Reflejo en Tiempo Real', valor: 'Activado' },
    { configuracion: 'Zona Horaria', valor: 'Automática' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center space-x-3">
            <Database className="w-6 h-6" />
            <span>Datos Mock del Sistema Completo</span>
          </h1>
          <p className="text-gray-600">Visualización de todos los datos de ejemplo utilizados en el sistema de gestión empresarial</p>
        </div>
      </div>

      {/* Información Básica del Negocio */}
      <Card className="p-6">
        <h2 className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5" />
          <span>Información Básica del Negocio</span>
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessInfo.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>{info.campo}</TableCell>
                  <TableCell>
                    {info.campo === 'Tipo de Comercio' ? (
                      <Badge variant="outline">{info.valor}</Badge>
                    ) : (
                      info.valor
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Tipos de Negocio y Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5" />
            <span>Tipos de Negocio Disponibles</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Etiqueta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessTypes.map((type, index) => (
                  <TableRow key={index}>
                    <TableCell><Badge variant="outline">{type.value}</Badge></TableCell>
                    <TableCell>{type.label}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5" />
            <span>Categorías de Comida (Top 10)</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Etiqueta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodCategories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell><Badge variant="outline">{category.value}</Badge></TableCell>
                    <TableCell>{category.label}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Sucursales */}
      <Card className="p-6">
        <h2 className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5" />
          <span>Sucursales/Branches</span>
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Etiqueta</TableHead>
                <TableHead>Dirección</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.value}>
                  <TableCell><Badge variant="outline">{branch.value}</Badge></TableCell>
                  <TableCell>{branch.label}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Horarios Regulares */}
      <Card className="p-6">
        <h2 className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5" />
          <span>Horarios Regulares por Día</span>
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Habilitado</TableHead>
                <TableHead>Apertura AM</TableHead>
                <TableHead>Cierre AM</TableHead>
                <TableHead>Apertura PM</TableHead>
                <TableHead>Cierre PM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularSchedule.map((schedule) => (
                <TableRow key={schedule.day}>
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>
                    {schedule.enabled ? (
                      <Badge className="bg-green-100 text-green-800">✅ Sí</Badge>
                    ) : (
                      <Badge variant="secondary">❌ No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{schedule.openAM}</TableCell>
                  <TableCell>{schedule.closeAM}</TableCell>
                  <TableCell>{schedule.openPM}</TableCell>
                  <TableCell>{schedule.closePM}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Fechas Especiales */}
      <Card className="p-6">
        <h2 className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5" />
          <span>Fechas Especiales</span>
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Nombre/Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Apertura AM</TableHead>
                <TableHead>Cierre AM</TableHead>
                <TableHead>Apertura PM</TableHead>
                <TableHead>Cierre PM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialDates.map((date) => (
                <TableRow key={date.id}>
                  <TableCell>{date.id}</TableCell>
                  <TableCell>{date.date}</TableCell>
                  <TableCell>{date.name}</TableCell>
                  <TableCell>
                    <Badge variant={date.type === 'Cerrado' ? 'secondary' : 'default'}>
                      {date.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{date.openAM}</TableCell>
                  <TableCell>{date.closeAM}</TableCell>
                  <TableCell>{date.openPM}</TableCell>
                  <TableCell>{date.closePM}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Menú - Categorías y Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Menu className="w-5 h-5" />
            <span>Categorías de Menú</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Productos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.order}</TableCell>
                    <TableCell>
                      {category.visible ? (
                        <Badge className="bg-green-100 text-green-800">Sí</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{category.itemCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Menu className="w-5 h-5" />
            <span>Productos del Menú</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Destacado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                    <TableCell>
                      {product.visible ? (
                        <Badge className="bg-green-100 text-green-800">Sí</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge className="bg-yellow-100 text-yellow-800">⭐ Sí</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Métodos de Pago y Servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5" />
            <span>Métodos de Pago</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>{method.id}</TableCell>
                    <TableCell>{method.name}</TableCell>
                    <TableCell><Badge variant="outline">{method.type}</Badge></TableCell>
                    <TableCell>
                      {method.enabled ? (
                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5" />
            <span>Servicios Contratados</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.cost}</TableCell>
                    <TableCell>
                      {service.enabled ? (
                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Promociones y Ofertas */}
      <Card className="p-6">
        <h2 className="flex items-center space-x-2 mb-4">
          <Tag className="w-5 h-5" />
          <span>Promociones y Ofertas</span>
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>Conversiones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>{promo.id}</TableCell>
                  <TableCell>{promo.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{promo.description}</TableCell>
                  <TableCell><Badge variant="outline">{promo.discount}</Badge></TableCell>
                  <TableCell>{promo.startDate}</TableCell>
                  <TableCell>{promo.endDate}</TableCell>
                  <TableCell>
                    {promo.active ? (
                      <Badge className="bg-green-100 text-green-800">Activa</Badge>
                    ) : (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </TableCell>
                  <TableCell>{promo.clicks}</TableCell>
                  <TableCell>{promo.conversions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Información de Contacto */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Phone className="w-5 h-5" />
            <span>Teléfonos</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Verificado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phones.map((phone) => (
                  <TableRow key={phone.id}>
                    <TableCell className="text-sm">{phone.number}</TableCell>
                    <TableCell><Badge variant="outline">{phone.area}</Badge></TableCell>
                    <TableCell>{phone.type}</TableCell>
                    <TableCell>
                      {phone.verified ? (
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      ) : (
                        <Badge variant="secondary">✗</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5" />
            <span>Correos Electrónicos</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Verificado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="text-sm">{email.email}</TableCell>
                    <TableCell><Badge variant="outline">{email.area}</Badge></TableCell>
                    <TableCell>
                      {email.verified ? (
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      ) : (
                        <Badge variant="secondary">✗</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <MessageCircle className="w-5 h-5" />
            <span>Redes Sociales</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Handle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialMedia.map((social) => (
                  <TableRow key={social.id}>
                    <TableCell><Badge variant="outline">{social.platform}</Badge></TableCell>
                    <TableCell className="text-sm">{social.handle}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Estado Actual y Configuraciones del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5" />
            <span>Estado Actual del Negocio</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStatus.map((status, index) => (
                  <TableRow key={index}>
                    <TableCell>{status.campo}</TableCell>
                    <TableCell>
                      {status.campo === 'Estado' ? (
                        <Badge className="bg-green-100 text-green-800">{status.valor}</Badge>
                      ) : (
                        <span>{status.valor}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5" />
            <span>Configuraciones del Sistema</span>
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Configuración</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemSettings.map((setting, index) => (
                  <TableRow key={index}>
                    <TableCell>{setting.configuracion}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{setting.valor}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Resumen General */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="flex items-center space-x-2 mb-4">
          <Database className="w-5 h-5 text-blue-600" />
          <span className="text-blue-900">Resumen de Datos del Sistema</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{branches.length}</div>
            <div className="text-sm text-blue-600">Sucursales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{menuProducts.length}</div>
            <div className="text-sm text-blue-600">Productos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{paymentMethods.length}</div>
            <div className="text-sm text-blue-600">Métodos Pago</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{promotions.length}</div>
            <div className="text-sm text-blue-600">Promociones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{phones.length + emails.length}</div>
            <div className="text-sm text-blue-600">Contactos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{socialMedia.length}</div>
            <div className="text-sm text-blue-600">Redes Sociales</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Database className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-blue-900 mb-2">Información sobre los Datos</h3>
              <p className="text-blue-700 text-sm">
                Esta tabla contiene todos los datos mock (de ejemplo) extraídos de todos los componentes del sistema de gestión empresarial. 
                Incluye información básica del negocio, horarios, menús, métodos de pago, promociones, contactos y configuraciones. 
                Estos datos se pueden modificar desde sus respectivas secciones en la aplicación.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}