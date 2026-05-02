import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Save, CheckCircle, AlertTriangle, X, Shield } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BasicInfoProps {
  isAdminMode?: boolean;
}

export function BasicInfo({ isAdminMode = false }: BasicInfoProps) {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Restaurante El Buen Sabor",
    rut: "76.543.210-K",
    address: "Av. Providencia 1234, Providencia",
    businessType: "restaurant",
    description:
      "Restaurante especializado en comida tradicional chilena con un ambiente acogedor y familiar.",
    legalName: "Sociedad Gastronómica El Buen Sabor Ltda.",
    city: "Santiago",
    commune: "Providencia",
    postalCode: "7501234",
    categories: ["comida-casera", "comida-tradicional"],
  });

  const [validationStatus, setValidationStatus] = useState({
    rut: "valid",
    address: "pending",
    businessType: "valid",
  });

  const businessTypes = [
    { value: "restaurant", label: "Restaurante" },
    { value: "cafe", label: "Café" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Servicios" },
    { value: "pharmacy", label: "Farmacia" },
    { value: "supermarket", label: "Supermercado" },
  ];

  const foodCategories = [
    { value: "comida-saludable", label: "Comida Saludable" },
    { value: "comida-chatarra", label: "Comida Chatarra" },
    { value: "comida-casera", label: "Comida Casera" },
    { value: "comida-rapida", label: "Comida Rápida" },
    { value: "comida-gourmet", label: "Comida Gourmet" },
    { value: "comida-vegana", label: "Comida Vegana" },
    { value: "comida-vegetariana", label: "Comida Vegetariana" },
    { value: "comida-internacional", label: "Comida Internacional" },
    { value: "comida-tradicional", label: "Comida Tradicional" },
    { value: "comida-organica", label: "Comida Orgánica" },
    { value: "comida-artesanal", label: "Comida Artesanal" },
    { value: "comida-familiar", label: "Comida Familiar" },
    { value: "comida-para-llevar", label: "Comida para Llevar" },
    { value: "comida-marina", label: "Comida Marina" },
    { value: "comida-parrilla", label: "Comida a la Parrilla" },
    { value: "comida-italiana", label: "Comida Italiana" },
    { value: "comida-asiatica", label: "Comida Asiática" },
    { value: "comida-mexicana", label: "Comida Mexicana" },
    { value: "comida-americana", label: "Comida Americana" },
    { value: "comida-mediterranea", label: "Comida Mediterránea" },
  ];

  const handleSave = () => {
    toast.success("Información actualizada correctamente");
  };

  const validateRut = (rut: string) => {
    if (rut.length > 8) {
      setValidationStatus((prev) => ({ ...prev, rut: "valid" }));
    } else {
      setValidationStatus((prev) => ({ ...prev, rut: "invalid" }));
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "invalid":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getValidationBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Válido
          </Badge>
        );
      case "invalid":
        return <Badge variant="destructive">Inválido</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    setBusinessInfo((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryValue]
        : prev.categories.filter((cat) => cat !== categoryValue),
    }));
  };

  const removeCategory = (categoryValue: string) => {
    setBusinessInfo((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryValue),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isAdminMode ? 'Información Básica del Comercio - Vista Administrador' : 'Información Básica del Comercio'}
          </h1>
          <p className="text-gray-600">
            {isAdminMode 
              ? 'Visualiza y edita la información básica del comercio como administrador'
              : 'Actualiza los datos principales de tu comercio'
            }
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {isAdminMode ? 'Guardar Cambios de Admin' : 'Guardar Cambios'}
        </Button>
      </div>

      {isAdminMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Modo Administrador Activo</h3>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Estás viendo y puedes editar la información básica del comercio. Los cambios se aplicarán inmediatamente.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información Principal</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Nombre de Fantasía</Label>
              <Input
                id="businessName"
                value={businessInfo.businessName}
                onChange={(e) =>
                  setBusinessInfo((prev) => ({
                    ...prev,
                    businessName: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Este es el nombre que verán los clientes
              </p>
            </div>

            <div>
              <Label htmlFor="legalName">Razón Social</Label>
              <Input
                id="legalName"
                value={businessInfo.legalName}
                onChange={(e) =>
                  setBusinessInfo((prev) => ({
                    ...prev,
                    legalName: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rut">RUT</Label>
                <div className="flex items-center space-x-2">
                  {getValidationIcon(validationStatus.rut)}
                  {getValidationBadge(validationStatus.rut)}
                </div>
              </div>
              <Input
                id="rut"
                value={businessInfo.rut}
                onChange={(e) => {
                  setBusinessInfo((prev) => ({
                    ...prev,
                    rut: e.target.value,
                  }));
                  validateRut(e.target.value);
                }}
                placeholder="12.345.678-9"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: XX.XXX.XXX-X
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="businessType">Tipo de Comercio</Label>
                {getValidationBadge(validationStatus.businessType)}
              </div>
              <Select
                value={businessInfo.businessType}
                onValueChange={(value) =>
                  setBusinessInfo((prev) => ({
                    ...prev,
                    businessType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de comercio" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nueva distribución de categorías */}
            <div>
              <Label>Categoría</Label>
              <p className="text-xs text-gray-500 mb-3">
                Selecciona las categorías que mejor describan tu negocio
              </p>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Categorías seleccionadas */}
                <div className="lg:w-1/2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Seleccionadas</h3>
                  {businessInfo.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {businessInfo.categories.map((categoryValue) => {
                        const category = foodCategories.find(
                          (cat) => cat.value === categoryValue
                        );
                        return (
                          <Badge
                            key={categoryValue}
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            {category?.label}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-200"
                              onClick={() => removeCategory(categoryValue)}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay categorías seleccionadas
                    </p>
                  )}
                </div>

                {/* Categorías disponibles */}
                <div className="lg:w-1/2 max-h-52 overflow-y-auto border rounded-md p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Disponibles</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {foodCategories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={businessInfo.categories.includes(category.value)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category.value, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={category.value}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Descripción del Negocio</h2>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={businessInfo.description}
            onChange={(e) =>
              setBusinessInfo((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            placeholder="Describe tu negocio, especialidades, ambiente..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {businessInfo.description.length}/500 caracteres
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">
          Estado de Validación
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Información básica completada</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">RUT verificado</span>
            {getValidationIcon(validationStatus.rut)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Dirección verificada</span>
            {getValidationIcon(validationStatus.address)}
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-4">
          Las validaciones automáticas ayudan a mejorar la confiabilidad de tu comercio en la
          plataforma.
        </p>
      </Card>
    </div>
  );
}