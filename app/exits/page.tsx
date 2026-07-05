'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/main-layout';
import { getExits, getExitById, getActiveClients, createExit, deleteExit } from '@/lib/api';
import { Search, Plus, Download, MoreVertical, ChevronLeft, ChevronRight, Users, Filter, X, Eye, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    loadClients();
    loadExits();
  }, [page, search, clientId, startDate, endDate]);

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
            <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              <Download size={20} />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
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
      </div>
    </MainLayout>
  );
}
