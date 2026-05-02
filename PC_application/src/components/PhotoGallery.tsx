import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Upload, 
  Camera, 
  Trash2, 
  Edit, 
  Star, 
  Eye, 
  ArrowUp, 
  ArrowDown,
  Save,
  Plus,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PhotoGalleryProps {
  isAdminMode?: boolean;
}

export function PhotoGallery({ isAdminMode = false }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      title: 'Interior del restaurante',
      description: 'Vista principal del comedor con ambiente acogedor',
      category: 'interior',
      isPrimary: true,
      order: 1,
      views: 1247,
      clicks: 89
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      title: 'Fachada del local',
      description: 'Entrada principal del restaurante',
      category: 'exterior',
      isPrimary: false,
      order: 2,
      views: 892,
      clicks: 45
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      title: 'Plato especialidad',
      description: 'Nuestro famoso cazuela de cordero',
      category: 'food',
      isPrimary: false,
      order: 3,
      views: 2156,
      clicks: 234
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop',
      title: 'Terraza',
      description: 'Área exterior para almorzar al aire libre',
      category: 'exterior',
      isPrimary: false,
      order: 4,
      views: 673,
      clicks: 28
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('principal');

  const branches = [
    { value: 'principal', label: 'Sucursal Principal - Providencia', address: 'Av. Providencia 1234' },
    { value: 'las-condes', label: 'Sucursal Las Condes', address: 'Av. Apoquindo 567' },
    { value: 'nunoa', label: 'Sucursal Ñuñoa', address: 'Av. Irarrázaval 890' },
    { value: 'vitacura', label: 'Sucursal Vitacura', address: 'Av. Vitacura 2345' }
  ];

  const categories = [
    { value: 'all', label: 'Todas las fotos' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'food', label: 'Comida' },
    { value: 'staff', label: 'Personal' },
    { value: 'events', label: 'Eventos' }
  ];

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const handleDeletePhoto = (id: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    toast.success('Foto eliminada correctamente');
  };

  const handleSetPrimary = (id: number) => {
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isPrimary: photo.id === id
    })));
    toast.success('Foto principal actualizada');
  };

  const handleMovePhoto = (id: number, direction: 'up' | 'down') => {
    const photoIndex = photos.findIndex(photo => photo.id === id);
    if (
      (direction === 'up' && photoIndex === 0) ||
      (direction === 'down' && photoIndex === photos.length - 1)
    ) {
      return;
    }

    const newPhotos = [...photos];
    const targetIndex = direction === 'up' ? photoIndex - 1 : photoIndex + 1;
    
    // Intercambiar órdenes
    const tempOrder = newPhotos[photoIndex].order;
    newPhotos[photoIndex].order = newPhotos[targetIndex].order;
    newPhotos[targetIndex].order = tempOrder;

    // Intercambiar posiciones
    [newPhotos[photoIndex], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[photoIndex]];
    
    setPhotos(newPhotos);
  };

  const handleUpdatePhoto = (id: number, field: string, value: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const handleSave = () => {
    toast.success('Galería actualizada correctamente');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      toast.success(`${files.length} foto(s) cargada(s) correctamente`);
    }
    // Reset input value to allow same file selection
    event.target.value = '';
  };

  const handleUploadClick = () => {
    const input = document.getElementById('file-upload-header') as HTMLInputElement;
    input?.click();
  };

  const handleAddPhotoClick = () => {
    const input = document.getElementById('file-upload-add') as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Fotos del Establecimiento</h1>
          <p className="text-gray-600">Administra las fotos que representan tu comercio</p>
          
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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="w-4 h-4 mr-2" />
            Subir Fotos
          </Button>
          <input
            id="file-upload-header"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Stats and Guidelines */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de fotos</p>
              <p className="text-2xl font-semibold">{photos.length}</p>
            </div>
            <Camera className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visualizaciones totales</p>
              <p className="text-2xl font-semibold">{photos.reduce((acc, photo) => acc + photo.views, 0)}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium">Recomendación</p>
            <p className="text-xs text-blue-600">Sube al menos 5 fotos para mejor rendimiento</p>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Photo Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.sort((a, b) => a.order - b.order).map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative">
              <ImageWithFallback
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />
              {photo.isPrimary && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  Principal
                </Badge>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMovePhoto(photo.id, 'up')}
                  disabled={photo.order === 1}
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMovePhoto(photo.id, 'down')}
                  disabled={photo.order === photos.length}
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              {isEditing === photo.id ? (
                <div className="space-y-2">
                  <Input
                    value={photo.title}
                    onChange={(e) => handleUpdatePhoto(photo.id, 'title', e.target.value)}
                    placeholder="Título de la foto"
                  />
                  <Input
                    value={photo.description}
                    onChange={(e) => handleUpdatePhoto(photo.id, 'description', e.target.value)}
                    placeholder="Descripción"
                  />
                  <select
                    value={photo.category}
                    onChange={(e) => handleUpdatePhoto(photo.id, 'category', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => setIsEditing(null)}>
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-gray-900">{photo.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{photo.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-3 h-3" />
                      <span>{photo.views}</span>
                    </div>
                    <Badge variant="outline">{categories.find(c => c.value === photo.category)?.label}</Badge>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(photo.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    {!photo.isPrimary && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetPrimary(photo.id)}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
        
        {/* Add Photo Card */}
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <div className="p-6 flex flex-col items-center justify-center text-center h-full">
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Agregar Nueva Foto</h3>
            <p className="text-sm text-gray-500 mb-4">
              Sube fotos de alta calidad que representen tu negocio
            </p>
            <Button variant="outline" onClick={handleAddPhotoClick}>
              <Upload className="w-4 h-4 mr-2" />
              Seleccionar Fotos
            </Button>
            <input
              id="file-upload-add"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      </div>

      {/* Guidelines */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <h2 className="text-lg font-semibold mb-4 text-yellow-900">Recomendaciones para las Fotos</h2>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• Usa fotos de alta resolución (mínimo 800x600 píxeles)</li>
          <li>• La primera foto será la imagen principal de tu comercio</li>
          <li>• Incluye fotos del interior, exterior y productos principales</li>
          <li>• Evita fotos borrosas o con poca iluminación</li>
          <li>• Actualiza las fotos regularmente para mantener la información actual</li>
          <li>• Las fotos con más visualizaciones mejoran tu posición en el buscador</li>
        </ul>
      </Card>
    </div>
  );
}