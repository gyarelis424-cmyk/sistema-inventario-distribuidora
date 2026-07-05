'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/main-layout';
import { getEntries, createEntry, deleteEntry, getActiveSuppliers, getProducts } from '@/lib/api';
import { Search, Plus, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    supplierId: '',
    documentNumber: '',
    entryDate: new Date().toISOString().split('T')[0],
    items: [{ productId: '', quantity: '', unitPrice: '' }],
  });

  useEffect(() => {
    loadSuppliersAndProducts();
    loadEntries();
  }, [page, search]);

  const loadSuppliersAndProducts = async () => {
    try {
      const [sups, prods] = await Promise.all([
        getActiveSuppliers(),
        getProducts(1, 100),
      ]);
      setSuppliers(Array.isArray(sups) ? sups : sups?.data || []);
      setProducts(Array.isArray(prods) ? prods.data || [] : prods?.data || []);
    } catch (error) {
      console.error('[v0] Error loading suppliers/products:', error);
    }
  };

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getEntries(page, 10, search);
      setEntries(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch (error: any) {
      console.error('[v0] Error loading entries:', error);
      showToast('Error al cargar entradas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedEntry(null);
    setFormData({
      supplierId: '',
      documentNumber: '',
      entryDate: new Date().toISOString().split('T')[0],
      items: [{ productId: '', quantity: '', unitPrice: '' }],
    });
    setShowModal(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '', unitPrice: '' }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.supplierId || !formData.documentNumber || formData.items.length === 0) {
        showToast('Por favor llena todos los campos requeridos', 'error');
        return;
      }

      const items = formData.items.filter(
        item => item.productId && item.quantity && item.unitPrice
      );

      if (items.length === 0) {
        showToast('Por favor agrega al menos un producto', 'error');
        return;
      }

      setIsSubmitting(true);

      await createEntry({
        supplierId: formData.supplierId,
        documentNumber: formData.documentNumber,
        entryDate: formData.entryDate,
        items: items.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      });

      showToast('Entrada creada correctamente', 'success');
      setShowModal(false);
      loadEntries();
    } catch (error: any) {
      console.error('[v0] Error saving entry:', error);
      showToast(error.message || 'Error al guardar entrada', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta entrada?')) return;

    try {
      setIsSubmitting(true);
      await deleteEntry(entryId);
      showToast('Entrada eliminada correctamente', 'success');
      setShowDetail(false);
      loadEntries();
    } catch (error: any) {
      console.error('[v0] Error deleting entry:', error);
      showToast(error.message || 'Error al eliminar entrada', 'error');
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
            <h1 className="text-3xl font-bold text-foreground">Entradas de Inventario</h1>
            <p className="text-muted-foreground">Registro de entradas ({total} total)</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Nueva Entrada
          </button>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 flex gap-2">
          <Search size={20} className="text-muted-foreground mt-3" />
          <input
            type="text"
            placeholder="Buscar por número de documento..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none text-foreground placeholder-muted-foreground bg-transparent"
          />
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="No hay entradas"
            description="Comienza registrando una nueva entrada de inventario"
            actionLabel="Crear Entrada"
            onAction={handleOpenCreateModal}
            icon="📥"
          />
        ) : (
          <>
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Documento</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Proveedor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ítems</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{entry.documentNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{entry.supplier?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {new Date(entry.entryDate).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {entry.items?.length || 0} producto(s)
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedEntry(entry);
                              setShowDetail(true);
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
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
                  Página {page} de {totalPages}
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
                        className={`px-3 py-2 rounded-lg ${page === pageNum ? 'bg-green-600 text-white' : 'border border-border hover:bg-muted'}`}
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
        {showDetail && selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-foreground">Detalle de Entrada</h2>
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
                    <p className="text-muted-foreground text-sm">Documento</p>
                    <p className="font-semibold text-foreground">{selectedEntry.documentNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Proveedor</p>
                    <p className="font-semibold text-foreground">{selectedEntry.supplier?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Fecha</p>
                    <p className="font-semibold text-foreground">
                      {new Date(selectedEntry.entryDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Ítems</p>
                    <p className="font-semibold text-foreground">{selectedEntry.items?.length || 0}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-muted-foreground text-sm mb-3">Productos</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedEntry.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm p-2 bg-muted rounded">
                        <span>{item.product?.name || 'Producto desconocido'}</span>
                        <span className="text-foreground font-semibold">
                          {item.quantity} x C$ {parseFloat(item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-border flex gap-2 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleDelete(selectedEntry.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={showModal}
          title="Nueva Entrada de Inventario"
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitLabel="Crear Entrada"
          isLoading={isSubmitting}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Proveedor</label>
                <select
                  value={formData.supplierId}
                  onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona proveedor</option>
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Número de Documento</label>
                <input
                  type="text"
                  placeholder="Ej: FAC-2024-001"
                  value={formData.documentNumber}
                  onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Fecha de Entrada</label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={e => setFormData({ ...formData, entryDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-foreground">Productos</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Agregar
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        onChange={e => {
                          const newItems = [...formData.items];
                          newItems[idx].productId = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        <option value="">Selecciona producto</option>
                        {products.map(prod => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Cant."
                      value={item.quantity}
                      onChange={e => {
                        const newItems = [...formData.items];
                        newItems[idx].quantity = e.target.value;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-20 px-2 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Precio"
                      value={item.unitPrice}
                      onChange={e => {
                        const newItems = [...formData.items];
                        newItems[idx].unitPrice = e.target.value;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-24 px-2 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="px-2 py-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
