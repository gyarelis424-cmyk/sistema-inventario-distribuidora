'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import MainLayout from '@/components/main-layout';
import { getExits, getExitById, getActiveClients, createExit, deleteExit, getProducts } from '@/lib/api';
import { Search, Plus, Download, ChevronLeft, ChevronRight, Filter, X, Eye, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';

export default function ExitsPage() {
  const [exits, setExits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [clientId, setClientId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExit, setSelectedExit] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    documentNumber: '',
    exitDate: new Date().toISOString().split('T')[0],
    items: [{ productId: '', quantity: '', unitPrice: '' }],
  });

  useEffect(() => {
    loadClients();
    loadProducts();
    loadExits();
  }, [page, search, clientId, startDate, endDate]);

  const loadProducts = async () => {
    try {
      const res = await getProducts(1, 100);
      setProducts(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('[v0] Error loading products:', error);
    }
  };

  const loadClients = async () => {
    try {
      const res = await getActiveClients();
      setClients(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('[v0] Error loading clients:', error);
    }
  };

  const loadExits = async () => {
    try {
      setLoading(true);
      const data = await getExits(page, 10, search, clientId);
      setExits(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch (error) {
      console.error('[v0] Error loading exits:', error);
      showToast('Error al cargar salidas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exitId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta salida?')) return;
    try {
      setIsSubmitting(true);
      await deleteExit(exitId);
      showToast('Salida eliminada correctamente', 'success');
      setShowDetail(false);
      loadExits();
    } catch (error: any) {
      console.error('[v0] Error deleting exit:', error);
      showToast(error.message || 'Error al eliminar salida', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExitClick = async (id: string) => {
    try {
      const exit = await getExitById(id);
      setSelectedExit(exit.data || exit);
      setShowDetail(true);
    } catch (error) {
      console.error('[v0] Error loading exit:', error);
      showToast('Error al cargar salida', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      clientId: '',
      documentNumber: '',
      exitDate: new Date().toISOString().split('T')[0],
      items: [{ productId: '', quantity: '', unitPrice: '' }],
    });
    setShowCreateModal(true);
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: '', unitPrice: '' }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity' | 'unitPrice', value: string) => {
    setFormData(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const handleCreate = async () => {
    try {
      if (!formData.clientId || !formData.documentNumber) {
        showToast('Completa el cliente y el número de documento', 'error');
        return;
      }

      const items = formData.items.filter(
        item => item.productId && item.quantity && item.unitPrice
      );

      if (items.length === 0) {
        showToast('Agrega al menos un producto válido', 'error');
        return;
      }

      setIsSubmitting(true);
      await createExit({
        clientId: formData.clientId,
        documentNumber: formData.documentNumber,
        exitDate: formData.exitDate,
        items: items.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      });

      showToast('Salida creada correctamente', 'success');
      setShowCreateModal(false);
      loadExits();
    } catch (error: any) {
      console.error('[v0] Error creating exit:', error);
      showToast(error.message || 'Error al crear salida', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await getExits(1, 1000, search, clientId);
      const rows = (data.data || []).map((exit: any) => ({
        'N° Salida': exit.exitNumber,
        Fecha: new Date(exit.exitDate).toLocaleDateString('es-NI'),
        Cliente: exit.client?.name || '',
        Documento: exit.documentNumber,
        'Total ítems': exit.items?.length || 0,
        Total: parseFloat(exit.totalAmount || 0).toFixed(2),
      }));

      if (rows.length === 0) {
        showToast('No hay salidas para exportar', 'error');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Salidas');
      XLSX.writeFile(workbook, `salidas-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Salidas exportadas correctamente', 'success');
    } catch (error: any) {
      console.error('[v0] Error exporting exits:', error);
      showToast(error.message || 'Error al exportar salidas', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const formTotal = formData.items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const totalPages = Math.ceil(total / 10);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Salidas</h1>
            <p className="text-muted-foreground">Registro de salidas de inventario</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              {isExporting ? 'Exportando...' : 'Exportar'}
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Nueva Salida
            </button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 flex gap-2 flex-wrap">
          <div className="flex gap-2 flex-1 min-w-64">
            <Search size={20} className="text-muted-foreground mt-3" />
            <input
              type="text"
              placeholder="Buscar por número de salida..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 outline-none text-foreground placeholder-muted-foreground bg-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Filter size={16} /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className="bg-white border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Filtros Avanzados</h3>
              <button
                onClick={() => {
                  setShowFilters(false);
                  setClientId('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cliente</label>
                <select
                  value={clientId}
                  onChange={(e) => {
                    setClientId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos los clientes</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fecha inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fecha fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner fullPage />
        ) : exits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay salidas registradas
          </div>
        ) : (
          <>
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">N° Salida</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Documento</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total ítems</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {exits.map(exit => (
                    <tr key={exit.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm text-primary font-semibold">{exit.exitNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{new Date(exit.exitDate).toLocaleDateString('es-NI')}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{exit.client?.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{exit.documentNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{exit.items?.length || 0}</td>
                      <td className="px-6 py-4 text-sm text-foreground">C$ {parseFloat(exit.totalAmount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleExitClick(exit.id)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exit.id)}
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

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mostrando 1 a 5 de {total} salidas</p>
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
                      className={`px-3 py-2 rounded-lg ${page === pageNum ? 'bg-primary text-white' : 'border border-border hover:bg-muted'}`}
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
          </>
        )}

        {showDetail && selectedExit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-foreground">Detalle de Salida</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <span className="text-muted-foreground">N° Salida:</span> <span className="font-semibold text-foreground">{selectedExit.exitNumber}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Fecha:</span> <span className="font-semibold text-foreground">{new Date(selectedExit.exitDate).toLocaleDateString('es-NI')}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Cliente:</span> <span className="font-semibold text-foreground">{selectedExit.client?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Documento:</span> <span className="font-semibold text-foreground">{selectedExit.documentNumber}</span>
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3">Ítems</h3>
                  <div className="space-y-2">
                    {selectedExit.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">{item.product?.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} x C$ {parseFloat(item.unitPrice).toFixed(2)}</p>
                        </div>
                        <p className="font-semibold text-foreground">C$ {parseFloat(item.subtotal).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 text-right">
                  <p className="text-lg font-bold text-foreground">Total: C$ {parseFloat(selectedExit.totalAmount).toFixed(2)}</p>
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
                  onClick={() => handleDelete(selectedExit.id)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          title="Nueva Salida de Inventario"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          submitLabel="Crear Salida"
          isLoading={isSubmitting}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Cliente</label>
                <select
                  value={formData.clientId}
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
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
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Fecha de Salida</label>
              <input
                type="date"
                value={formData.exitDate}
                onChange={e => setFormData({ ...formData, exitDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-foreground">Productos</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm text-primary hover:underline"
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
                        onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                      onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-20 px-2 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Precio"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-24 px-2 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="px-2 py-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3 text-right">
              <p className="text-lg font-bold text-foreground">Total: C$ {formTotal.toFixed(2)}</p>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
