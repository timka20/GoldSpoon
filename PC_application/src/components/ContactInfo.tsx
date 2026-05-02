import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Phone, Mail, Globe, MessageCircle, Save, Plus, Trash2, Eye, EyeOff, MapPin, Building, ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ContactInfo() {
  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const [phones, setPhones] = useState([
    { 
      id: 1, 
      number: '+56 9 8765 4321', 
      area: 'general', 
      type: 'mobile', 
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    },
    { 
      id: 2, 
      number: '+56 2 2345 6789', 
      area: 'reservas', 
      type: 'landline', 
      showInSearch: true,
      applyToAll: false,
      selectedBranches: ['principal', 'las-condes']
    },
    { 
      id: 3, 
      number: '+56 9 1234 5678', 
      area: 'delivery', 
      type: 'mobile', 
      showInSearch: false,
      applyToAll: false,
      selectedBranches: ['principal']
    }
  ]);

  const [emails, setEmails] = useState([
    { 
      id: 1, 
      email: 'info@elbuensabor.cl', 
      area: 'general', 
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    },
    { 
      id: 2, 
      email: 'reservas@elbuensabor.cl', 
      area: 'reservas', 
      showInSearch: true,
      applyToAll: false,
      selectedBranches: ['principal', 'las-condes', 'nunoa']
    },
    { 
      id: 3, 
      email: 'delivery@elbuensabor.cl', 
      area: 'delivery', 
      showInSearch: false,
      applyToAll: false,
      selectedBranches: ['principal', 'vitacura']
    }
  ]);

  const [socialMedia, setSocialMedia] = useState([
    { 
      id: 1, 
      platform: 'whatsapp', 
      handle: '+56987654321', 
      url: 'https://wa.me/56987654321', 
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    },
    { 
      id: 2, 
      platform: 'instagram', 
      handle: '@elbuensabor', 
      url: 'https://instagram.com/elbuensabor', 
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    },
    { 
      id: 3, 
      platform: 'facebook', 
      handle: 'El Buen Sabor', 
      url: 'https://facebook.com/elbuensabor', 
      showInSearch: false,
      applyToAll: false,
      selectedBranches: ['principal', 'las-condes']
    }
  ]);

  const [website, setWebsite] = useState('https://www.elbuensabor.cl');
  const [websiteVisible, setWebsiteVisible] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const areas = [
    { value: 'general', label: 'General' },
    { value: 'reservas', label: 'Reservas' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'facturacion', label: 'Facturación' },
    { value: 'soporte', label: 'Soporte' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const phoneTypes = [
    { value: 'mobile', label: 'Móvil' },
    { value: 'landline', label: 'Fijo' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const socialPlatforms = [
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { value: 'instagram', label: 'Instagram', icon: MessageCircle },
    { value: 'facebook', label: 'Facebook', icon: MessageCircle },
    { value: 'twitter', label: 'Twitter', icon: MessageCircle },
    { value: 'linkedin', label: 'LinkedIn', icon: MessageCircle }
  ];

  const addPhone = () => {
    const newPhone = {
      id: Date.now(),
      number: '',
      area: 'general',
      type: 'mobile',
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    };
    setPhones(prev => [...prev, newPhone]);
  };

  const addEmail = () => {
    const newEmail = {
      id: Date.now(),
      email: '',
      area: 'general',
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    };
    setEmails(prev => [...prev, newEmail]);
  };

  const addSocialMedia = () => {
    const newSocial = {
      id: Date.now(),
      platform: 'instagram',
      handle: '',
      url: '',
      showInSearch: true,
      applyToAll: true,
      selectedBranches: []
    };
    setSocialMedia(prev => [...prev, newSocial]);
  };

  const removePhone = (id: number) => {
    setPhones(prev => prev.filter(phone => phone.id !== id));
  };

  const removeEmail = (id: number) => {
    setEmails(prev => prev.filter(email => email.id !== id));
  };

  const removeSocialMedia = (id: number) => {
    setSocialMedia(prev => prev.filter(social => social.id !== id));
  };

  const updatePhone = (id: number, field: string, value: any) => {
    setPhones(prev => prev.map(phone =>
      phone.id === id ? { ...phone, [field]: value } : phone
    ));
  };

  const updateEmail = (id: number, field: string, value: any) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, [field]: value } : email
    ));
  };

  const updateSocialMedia = (id: number, field: string, value: any) => {
    setSocialMedia(prev => prev.map(social =>
      social.id === id ? { ...social, [field]: value } : social
    ));
  };

  const handleSave = () => {
    toast.success('Información de contacto actualizada correctamente');
  };

  const toggleVisibility = (type: string, id: number, currentState: boolean) => {
    const newState = !currentState;
    if (type === 'phone') {
      updatePhone(id, 'showInSearch', newState);
    } else if (type === 'email') {
      updateEmail(id, 'showInSearch', newState);
    } else if (type === 'social') {
      updateSocialMedia(id, 'showInSearch', newState);
    }
    
    if (newState) {
      toast.success('Ahora visible en el buscador');
    } else {
      toast.success('Ocultado del buscador');
    }
  };

  const handleApplyToAllToggle = (type: string, id: number, applyToAll: boolean) => {
    if (type === 'phone') {
      updatePhone(id, 'applyToAll', applyToAll);
      if (applyToAll) {
        updatePhone(id, 'selectedBranches', []);
      }
    } else if (type === 'email') {
      updateEmail(id, 'applyToAll', applyToAll);
      if (applyToAll) {
        updateEmail(id, 'selectedBranches', []);
      }
    } else if (type === 'social') {
      updateSocialMedia(id, 'applyToAll', applyToAll);
      if (applyToAll) {
        updateSocialMedia(id, 'selectedBranches', []);
      }
    }

    if (applyToAll) {
      toast.success('Aplicando a todas las sucursales');
    } else {
      toast.success('Configuración específica por sucursales activada');
    }
  };

  const handleBranchSelection = (type: string, id: number, branchValue: string, checked: boolean) => {
    if (type === 'phone') {
      const phone = phones.find(p => p.id === id);
      if (phone) {
        const newBranches = checked 
          ? [...phone.selectedBranches, branchValue]
          : phone.selectedBranches.filter(b => b !== branchValue);
        updatePhone(id, 'selectedBranches', newBranches);
      }
    } else if (type === 'email') {
      const email = emails.find(e => e.id === id);
      if (email) {
        const newBranches = checked 
          ? [...email.selectedBranches, branchValue]
          : email.selectedBranches.filter(b => b !== branchValue);
        updateEmail(id, 'selectedBranches', newBranches);
      }
    } else if (type === 'social') {
      const social = socialMedia.find(s => s.id === id);
      if (social) {
        const newBranches = checked 
          ? [...social.selectedBranches, branchValue]
          : social.selectedBranches.filter(b => b !== branchValue);
        updateSocialMedia(id, 'selectedBranches', newBranches);
      }
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

  const BranchSelector = ({ type, id, applyToAll, selectedBranches }: {
    type: string;
    id: number;
    applyToAll: boolean;
    selectedBranches: string[];
  }) => (
    <div>
      <Label>Aplicar a</Label>
      <div className="space-y-2 mt-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={applyToAll}
            onCheckedChange={(checked) => handleApplyToAllToggle(type, id, checked)}
          />
          <span className="text-sm">Todas las sucursales</span>
        </div>
        
        {!applyToAll && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {getBranchesText(applyToAll, selectedBranches)}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Seleccionar sucursales:</p>
                {branches.map((branch) => (
                  <div key={branch.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${type}-${id}-${branch.value}`}
                      checked={selectedBranches.includes(branch.value)}
                      onCheckedChange={(checked) => 
                        handleBranchSelection(type, id, branch.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`${type}-${id}-${branch.value}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <div>
                        <div className="font-medium">{branch.label.split(' - ')[0]}</div>
                        <div className="text-xs text-gray-500">{branch.address}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        <Badge variant={applyToAll ? "default" : "outline"} className="text-xs">
          <Building className="w-3 h-3 mr-1" />
          {getBranchesText(applyToAll, selectedBranches)}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Información de Contacto Detallada</h1>
          <p className="text-gray-600">Gestiona todos los canales de comunicación con tus clientes</p>
          
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

      {/* Visibility and Branch Information */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">Control de Visibilidad y Sucursales</h3>
            <p className="text-sm text-green-700">
              Controla qué información aparece en el buscador y en qué sucursales aplica cada contacto.
            </p>
          </div>
        </div>
      </Card>

      {/* Phones Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Teléfonos
          </h2>
          <Button onClick={addPhone} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Teléfono
          </Button>
        </div>

        <div className="space-y-4">
          {phones.map((phone) => (
            <div key={phone.id} className={`p-4 border rounded-lg ${phone.showInSearch ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 items-start">
                <div>
                  <Label>Número</Label>
                  <Input
                    value={phone.number}
                    onChange={(e) => updatePhone(phone.id, 'number', e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                
                <div>
                  <Label>Área</Label>
                  <Select value={phone.area} onValueChange={(value) => updatePhone(phone.id, 'area', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <Select value={phone.type} onValueChange={(value) => updatePhone(phone.id, 'type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phoneTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Mostrar en Buscador</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Switch
                      checked={phone.showInSearch}
                      onCheckedChange={() => toggleVisibility('phone', phone.id, phone.showInSearch)}
                    />
                    {phone.showInSearch ? (
                      <Badge className="bg-green-100 text-green-800 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Oculto
                      </Badge>
                    )}
                  </div>
                </div>

                <BranchSelector 
                  type="phone" 
                  id={phone.id} 
                  applyToAll={phone.applyToAll} 
                  selectedBranches={phone.selectedBranches} 
                />

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removePhone(phone.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emails Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Correos Electrónicos
          </h2>
          <Button onClick={addEmail} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Email
          </Button>
        </div>

        <div className="space-y-4">
          {emails.map((email) => (
            <div key={email.id} className={`p-4 border rounded-lg ${email.showInSearch ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start">
                <div>
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    value={email.email}
                    onChange={(e) => updateEmail(email.id, 'email', e.target.value)}
                    placeholder="info@ejemplo.cl"
                  />
                </div>
                
                <div>
                  <Label>Área</Label>
                  <Select value={email.area} onValueChange={(value) => updateEmail(email.id, 'area', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Mostrar en Buscador</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Switch
                      checked={email.showInSearch}
                      onCheckedChange={() => toggleVisibility('email', email.id, email.showInSearch)}
                    />
                    {email.showInSearch ? (
                      <Badge className="bg-green-100 text-green-800 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Oculto
                      </Badge>
                    )}
                  </div>
                </div>

                <BranchSelector 
                  type="email" 
                  id={email.id} 
                  applyToAll={email.applyToAll} 
                  selectedBranches={email.selectedBranches} 
                />

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeEmail(email.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Website Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Sitio Web
        </h2>
        <div className="space-y-4">
          <div>
            <Label>URL del Sitio Web</Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.ejemplo.cl"
            />
            <p className="text-xs text-gray-500 mt-1">
              Incluye el protocolo (https://) en la URL
            </p>
          </div>
          
          <div>
            <Label>Mostrar en Buscador</Label>
            <div className="flex items-center space-x-3 mt-2">
              <Switch
                checked={websiteVisible}
                onCheckedChange={(checked) => {
                  setWebsiteVisible(checked);
                  toast.success(checked ? 'Sitio web ahora visible en el buscador' : 'Sitio web ocultado del buscador');
                }}
              />
              {websiteVisible ? (
                <Badge className="bg-green-100 text-green-800 flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Visible
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Oculto
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> El sitio web se aplica a todas las sucursales por defecto.
            </p>
          </div>
        </div>
      </Card>

      {/* Social Media Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Redes Sociales
          </h2>
          <Button onClick={addSocialMedia} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Red Social
          </Button>
        </div>

        <div className="space-y-4">
          {socialMedia.map((social) => (
            <div key={social.id} className={`p-4 border rounded-lg ${social.showInSearch ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 items-start">
                <div>
                  <Label>Plataforma</Label>
                  <Select value={social.platform} onValueChange={(value) => updateSocialMedia(social.id, 'platform', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Usuario/Handle</Label>
                  <Input
                    value={social.handle}
                    onChange={(e) => updateSocialMedia(social.id, 'handle', e.target.value)}
                    placeholder="@usuario o +56123456789"
                  />
                </div>

                <div>
                  <Label>URL Completa</Label>
                  <Input
                    value={social.url}
                    onChange={(e) => updateSocialMedia(social.id, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label>Mostrar en Buscador</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Switch
                      checked={social.showInSearch}
                      onCheckedChange={() => toggleVisibility('social', social.id, social.showInSearch)}
                    />
                    {social.showInSearch ? (
                      <Badge className="bg-green-100 text-green-800 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Oculto
                      </Badge>
                    )}
                  </div>
                </div>

                <BranchSelector 
                  type="social" 
                  id={social.id} 
                  applyToAll={social.applyToAll} 
                  selectedBranches={social.selectedBranches} 
                />

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeSocialMedia(social.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Summary */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Resumen de Contacto</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{phones.length}</div>
            <div className="text-sm text-blue-600">Teléfonos Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{emails.length}</div>
            <div className="text-sm text-blue-600">Emails Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-700">{socialMedia.length}</div>
            <div className="text-sm text-blue-600">Redes Sociales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              {[...phones, ...emails, ...socialMedia].filter(contact => contact.showInSearch).length + (websiteVisible ? 1 : 0)}
            </div>
            <div className="text-sm text-green-600">Visibles en Buscador</div>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-4">
          Controla la visibilidad y aplicación por sucursales de tu información de contacto para gestionar qué datos ven los clientes en cada ubicación.
        </p>
      </Card>
    </div>
  );
}