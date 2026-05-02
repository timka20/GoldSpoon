import React from 'react';
import { Card } from './ui/card';
import { 
  BarChart3, 
  Calendar, 
  Camera, 
  CreditCard, 
  Home, 
  Info, 
  Menu, 
  MessageSquare, 
  Phone, 
  Tag, 
  Users, 
  Bell,
  HelpCircle,
  Database,
  Shield,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode?: boolean;
}

export function Sidebar({ activeTab, setActiveTab, isAdminMode = false }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'basic-info', label: 'Información Básica', icon: Info },
    { id: 'commerce-data', label: 'Datos del Comercio', icon: Building2 },
    { id: 'commerce-data-v2', label: 'Datos del Comercio (opc2)', icon: Calendar },
    { id: 'photos', label: 'Fotos del Local', icon: Camera },
    { id: 'menu', label: 'Menús y Productos', icon: Menu },
    { id: 'payments', label: 'Métodos de Pago', icon: CreditCard },
    { id: 'promotions', label: 'Promociones y Ofertas', icon: Tag },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'users', label: 'Perfiles de Usuario', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'support', label: 'Soporte Técnico', icon: HelpCircle },
    { id: 'data-tables', label: 'Datos del Sistema', icon: Database },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        {isAdminMode ? (
          <>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-900">Admin Edenred</h1>
            </div>
            <p className="text-sm text-blue-600">Panel de Configuración Global</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900">Gestión Empresarial</h1>
            <p className="text-sm text-gray-600">Panel de Administración</p>
          </>
        )}
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? (isAdminMode ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-50 text-blue-700 border border-blue-200')
                  : (isAdminMode ? 'text-blue-700 hover:bg-blue-50' : 'text-gray-700 hover:bg-gray-50')
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">
                {item.label}
                {isAdminMode && (
                  <span className="block text-xs text-blue-500 font-normal">Vista Admin</span>
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {isAdminMode && (
        <div className="space-y-4 mt-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Modo Administrador</h3>
            <p className="text-xs text-blue-700">
              Puedes ver y editar toda la información del comercio. Navega por las secciones normalmente.
            </p>
          </Card>
          
          <button
            onClick={() => setActiveTab('admin-panel')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'admin-panel'
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-orange-700 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-sm">Panel de Admin Global</span>
          </button>
        </div>
      )}
      
      <Card className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-900 mb-1">¿Necesitas ayuda?</h3>
          <p className="text-xs text-blue-700 mb-3">
            Consulta nuestra documentación o contacta soporte.
          </p>
          <button className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
            Ver Documentación
          </button>
        </div>
      </Card>
    </div>
  );
}