'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/main-layout';
import { getEntries, getEntryById } from '@/lib/api';
import { Search, Plus, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [page, search]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getEntries(page, 10, search);
      setEntries(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryClick = async (id: string) => {
    try {
      const entry = await getEntryById(id);
      setSelectedEntry(entry);
      setShowDetail(true);
    } catch (error) {
      console.error('Error loading entry:', error);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Entradas</h1>
            <p className="text-muted-foreground">Registro de entradas de inventario</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              <Download size={20} />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Nueva Entrada
            </button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 flex gap-2">
          <Search size={20} className="text-muted-foreground mt-3" />
          <input
            type="text"
            placeholder="Buscar entradas..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none text-foreground placeholder-muted-foreground bg-transparent"
          />
          <button className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            Filtros
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando entradas...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">N° Entrada</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Proveedor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Documento</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total ítems</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm text-primary font-semibold">{entry.entryNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{new Date(entry.entryDate).toLocaleDateString('es-NI')}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{entry.supplier?.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{entry.documentNumber}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{entry.items?.length || 0}</td>
                      <td className="px-6 py-4 text-sm text-foreground">C$ {parseFloat(entry.totalAmount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEntryClick(entry.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleEntryClick(entry.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-primary"
                          >
                            →
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mostrando 1 a 5 de {total} entradas</p>
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
                  <p>
                    <span className="text-muted-foreground">N° Entrada:</span> <span className="font-semibold text-foreground">{selectedEntry.entryNumber}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Fecha:</span> <span className="font-semibold text-foreground">{new Date(selectedEntry.entryDate).toLocaleDateString('es-NI')}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Proveedor:</span> <span className="font-semibold text-foreground">{selectedEntry.supplier?.name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Documento:</span> <span className="font-semibold text-foreground">{selectedEntry.documentNumber}</span>
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3">Ítems</h3>
                  <div className="space-y-2">
                    {selectedEntry.items?.map((item: any) => (
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
                  <p className="text-lg font-bold text-foreground">Total: C$ {parseFloat(selectedEntry.totalAmount).toFixed(2)}</p>
                </div>
              </div>
              <div className="p-6 border-t border-border flex gap-2 sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
