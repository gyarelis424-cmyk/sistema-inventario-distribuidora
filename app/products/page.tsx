'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/main-layout';
import { getProducts, createProduct, updateProduct, deleteProduct, getActiveCategories, getActiveUnits } from '@/lib/api';
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    categoryId: '',
    unitId: '',
    minimumStock: '',
    description: '',
  });

  useEffect(() => {
    loadCategoriesAndUnits();
    loadProducts();
  }, [page, search]);

  const loadCategoriesAndUnits = async () => {
    try {
      const [cats, uns] = await Promise.all([
        getActiveCategories(),
        getActiveUnits(),
      ]);
      setCategories(Array.isArray(cats) ? cats : cats?.data || []);
      setUnits(Array.isArray(uns) ? uns : uns?.data || []);
    } catch (error) {
      console.error('[v0] Error loading categories/units:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(page, 10, search);
      setProducts(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch (error: any) {
      console.error('[v0] Error loading products:', error);
      showToast('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      code: '',
      name: '',
      price: '',
      categoryId: '',
      unitId: '',
      minimumStock: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId,
      unitId: product.unitId,
      minimumStock: product.minimumStock.toString(),
      description: product.description || '',
    });
    setShowDetail(false);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.code || !formData.name || !formData.price || !formData.categoryId || !formData.unitId) {
        showToast('Por favor llena todos los campos requeridos', 'error');
        return;
      }

      setIsSubmitting(true);

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, {
          code: formData.code,
          name: formData.name,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
          unitId: formData.unitId,
          minimumStock: parseInt(formData.minimumStock),
          description: formData.description,
        });
        showToast('Producto actualizado correctamente', 'success');
      } else {
        await createProduct({
          code: formData.code,
          name: formData.name,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
          unitId: formData.unitId,
          minimumStock: parseInt(formData.minimumStock),
          description: formData.description,
        });
        showToast('Producto creado correctamente', 'success');
      }

      setShowModal(false);
      loadProducts();
    } catch (error: any) {
      console.error('[v0] Error saving product:', error);
      showToast(error.message || 'Error al guardar producto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      setIsSubmitting(true);
      await deleteProduct(productId);
      showToast('Producto eliminado correctamente', 'success');
      setShowDetail(false);
      loadProducts();
    } catch (error: any) {
      console.error('[v0] Error deleting product:', error);
      showToast(error.message || 'Error al eliminar producto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / 10);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Productos</h1>
            <p className="text-muted-foreground">Gestiona el catálogo de productos ({total} total)</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 flex gap-2">
          <Search size={20} className="text-muted-foreground mt-3" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none text-foreground placeholder-muted-foreground bg-transparent"
          />
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No hay productos"
            description="Comienza agregando un nuevo producto a tu catálogo"
            actionLabel="Crear Producto"
            onAction={handleOpenCreateModal}
            icon="📦"
          />
        ) : (
          <>
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Código</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Categoría</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{product.code}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-foreground">C$ {parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{Math.floor(product.currentStock || 0)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleProductClick(product)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Página {page} de {totalPages} ({total} productos)
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${page === pageNum ? 'bg-blue-600 text-white' : 'border border-border hover:bg-muted'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {showDetail && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-foreground">Detalle de Producto</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Código</p>
                    <p className="font-semibold text-foreground">{selectedProduct.code}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Producto</p>
                    <p className="font-semibold text-foreground">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Categoría</p>
                    <p className="font-semibold text-foreground">{selectedProduct.category?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Unidad</p>
                    <p className="font-semibold text-foreground">{selectedProduct.unit?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Precio</p>
                    <p className="font-semibold text-foreground">C$ {parseFloat(selectedProduct.price).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Stock Actual</p>
                    <p className="font-semibold text-foreground">{Math.floor(selectedProduct.currentStock || 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Stock Mínimo</p>
                    <p className="font-semibold text-foreground">{Math.floor(selectedProduct.minimumStock || 0)}</p>
                  </div>
                </div>
                {selectedProduct.description && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-muted-foreground text-sm mb-1">Descripción</p>
                    <p className="text-foreground">{selectedProduct.description}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-border flex gap-2 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleOpenEditModal(selectedProduct)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(selectedProduct.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showModal}
          title={selectedProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitLabel={selectedProduct ? 'Actualizar' : 'Crear'}
          isLoading={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Código</label>
              <input
                type="text"
                placeholder="Ej: PROD-001"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Ej: Producto X"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Categoría</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Unidad</label>
                <select
                  value={formData.unitId}
                  onChange={e => setFormData({ ...formData, unitId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona unidad</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Precio (C$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Stock Mínimo</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.minimumStock}
                  onChange={e => setFormData({ ...formData, minimumStock: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
              <textarea
                placeholder="Descripción del producto (opcional)"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
