import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Menu as MenuIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  Eye, 
  EyeOff,
  Star,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MenuManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Entradas', order: 1, visible: true, itemCount: 4 },
    { id: 2, name: 'Platos Principales', order: 2, visible: true, itemCount: 8 },
    { id: 3, name: 'Postres', order: 3, visible: true, itemCount: 5 },
    { id: 4, name: 'Bebidas', order: 4, visible: true, itemCount: 6 }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Empanadas de Pino',
      description: 'Tradicionales empanadas chilenas rellenas de carne, cebolla, huevo y aceitunas',
      price: 2500,
      categoryId: 1,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      visible: true,
      featured: true,
      order: 1,
      views: 245,
      orders: 34
    },
    {
      id: 2,
      name: 'Cazuela de Cordero',
      description: 'Cazuela tradicional con cordero, papas, zapallo, choclo y verduras frescas',
      price: 8900,
      categoryId: 2,
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
      visible: true,
      featured: false,
      order: 1,
      views: 189,
      orders: 28
    },
    {
      id: 3,
      name: 'Sopaipillas con Pebre',
      description: 'Sopaipillas caseras acompañadas de pebre tradicional',
      price: 1800,
      categoryId: 1,
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
      visible: true,
      featured: false,
      order: 2,
      views: 156,
      orders: 22
    },
    {
      id: 4,
      name: 'Leche Asada',
      description: 'Postre tradicional chileno con leche, huevos y azúcar caramelizada',
      price: 2200,
      categoryId: 3,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
      visible: true,
      featured: false,
      order: 1,
      views: 134,
      orders: 19
    }
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: 'Nueva Categoría',
      order: categories.length + 1,
      visible: true,
      itemCount: 0
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleAddProduct = (categoryId: number) => {
    const newProduct = {
      id: Date.now(),
      name: 'Nuevo Producto',
      description: '',
      price: 0,
      categoryId,
      image: '',
      visible: true,
      featured: false,
      order: products.filter(p => p.categoryId === categoryId).length + 1,
      views: 0,
      orders: 0
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Producto eliminado correctamente');
  };

  const updateProduct = (id: number, field: string, value: any) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const updateCategory = (id: number, field: string, value: any) => {
    setCategories(prev => prev.map(category =>
      category.id === id ? { ...category, [field]: value } : category
    ));
  };

  const handleSave = () => {
    toast.success('Menú actualizado correctamente');
    setEditingProduct(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Menús y Productos</h1>
          <p className="text-gray-600">Administra tu catálogo de productos con precios y descripciones</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddCategory} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo producto
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Categories Management */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MenuIcon className="w-5 h-5 mr-2" />
          Categorías
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Input
                  value={category.name}
                  onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                  className="font-medium"
                />
                <Switch
                  checked={category.visible}
                  onCheckedChange={(checked) => updateCategory(category.id, 'visible', checked)}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{category.itemCount} productos</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddProduct(category.id)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos los productos
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex">
              <div className="w-32 h-32 flex-shrink-0">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 p-4">
                {editingProduct === product.id ? (
                  <div className="space-y-2">
                    <Input
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      placeholder="Nombre del producto"
                    />
                    <Textarea
                      value={product.description}
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                      placeholder="Descripción"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', parseInt(e.target.value))}
                        placeholder="Precio"
                        className="w-24"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.featured}
                          onCheckedChange={(checked) => updateProduct(product.id, 'featured', checked)}
                        />
                        <Label className="text-xs">Destacado</Label>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setEditingProduct(null)}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          {product.name}
                          {product.featured && (
                            <Star className="w-4 h-4 text-yellow-500 ml-2" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        <p className="text-lg font-semibold text-green-600 mt-2">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <Switch
                          checked={product.visible}
                          onCheckedChange={(checked) => updateProduct(product.id, 'visible', checked)}
                          size="sm"
                        />
                        {product.visible ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {product.views}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {product.orders}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="text-xs mt-2"
                    >
                      {categories.find(c => c.id === product.categoryId)?.name}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Product Card */}
      {selectedCategory && (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <div className="p-6 text-center">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Agregar Nuevo Producto</h3>
            <p className="text-sm text-gray-500 mb-4">
              Añade un producto a la categoría "{categories.find(c => c.id === selectedCategory)?.name}"
            </p>
            <Button onClick={() => handleAddProduct(selectedCategory)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Producto
            </Button>
          </div>
        </Card>
      )}

      {/* Menu Statistics */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h2 className="text-lg font-semibold mb-4 text-green-900">Estadísticas del Menú</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">{products.length}</div>
            <div className="text-sm text-green-600">Total productos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              {products.filter(p => p.visible).length}
            </div>
            <div className="text-sm text-green-600">Productos visibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              {products.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-green-600">Productos destacados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-700">
              {formatPrice(products.reduce((acc, p) => acc + (p.price * p.orders), 0))}
            </div>
            <div className="text-sm text-green-600">Ventas totales</div>
          </div>
        </div>
      </Card>
    </div>
  );
}