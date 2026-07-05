'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/main-layout';
import { Download, FileJson, File } from 'lucide-react';
import { getInventoryReport, getEntriesReport, getExitsReport, getSalesReport, getActiveCategories, getActiveSuppliers, getActiveClients } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { showToast } from '@/components/ui/toast';
import * as XLSX from 'xlsx';

type ReportType = 'inventory' | 'entries' | 'exits' | 'sales';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('inventory');
  const [startDate, setStartDate] = useState('2024-06-01');
  const [endDate, setEndDate] = useState('2024-06-20');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [clientId, setClientId] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [catsRes, suppRes, clientsRes] = await Promise.all([
        getActiveCategories(),
        getActiveSuppliers(),
        getActiveClients(),
      ]);
      setCategories(Array.isArray(catsRes) ? catsRes : catsRes.data || []);
      setSuppliers(Array.isArray(suppRes) ? suppRes : suppRes.data || []);
      setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.data || []);
    } catch (error) {
      console.error('[v0] Error loading dropdowns:', error);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      let data;

      if (selectedReport === 'inventory') {
        data = await getInventoryReport({ categoryId, status: '' });
      } else if (selectedReport === 'entries') {
        data = await getEntriesReport({ supplierId, startDate, endDate });
      } else if (selectedReport === 'exits') {
        data = await getExitsReport({ clientId, startDate, endDate });
      } else if (selectedReport === 'sales') {
        data = await getSalesReport({ startDate, endDate, groupBy: 'day' });
      }

      setReportData(data);
      showToast('Reporte generado correctamente', 'success');
    } catch (error) {
      console.error('[v0] Error generating report:', error);
      showToast('Error al generar reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      if (!reportData) {
        showToast('Genera un reporte primero', 'error');
        return;
      }

      let exportData: any[] = [];
      let fileName = `reporte_${selectedReport}_${new Date().getTime()}.xlsx`;

      if (selectedReport === 'inventory' && reportData.data) {
        exportData = reportData.data.map((item: any) => ({
          'Código': item.code,
          'Nombre': item.name,
          'Categoría': item.category?.name || '-',
          'Unidad': item.unit?.abbreviation || '-',
          'Stock Actual': item.currentStock,
          'Stock Mínimo': item.minimumStock,
          'Precio': item.price,
          'Estado': item.currentStock <= item.minimumStock ? 'Bajo Stock' : 'Disponible'
        }));
      } else if ((selectedReport === 'entries' || selectedReport === 'exits') && reportData.data) {
        exportData = reportData.data.map((item: any) => ({
          'Número': item.entryNumber || item.exitNumber,
          'Documento': item.documentNumber,
          'Fecha': new Date(item.entryDate || item.exitDate).toLocaleDateString('es-NI'),
          'Proveedor/Cliente': item.supplier?.name || item.client?.name || '-',
          'Cantidad de Items': item.items?.length || 0,
          'Monto Total': item.items?.reduce((sum: number, i: any) => sum + (i.quantity * i.unitPrice), 0) || 0
        }));
      } else if (selectedReport === 'sales' && Array.isArray(reportData)) {
        exportData = reportData.map((item: any) => ({
          'Fecha': item.date,
          'Transacciones': item.transactionCount,
          'Total Items': item.totalItems,
          'Valor Total': item.totalValue
        }));
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, fileName);
      showToast('Reporte exportado a Excel', 'success');
    } catch (error) {
      console.error('[v0] Error exporting to Excel:', error);
      showToast('Error al exportar', 'error');
    }
  };

  const reportTypes = [
    { id: 'inventory' as ReportType, name: 'Stock Actual', description: 'Estado actual del inventario' },
    { id: 'entries' as ReportType, name: 'Entradas', description: 'Entradas por período' },
    { id: 'exits' as ReportType, name: 'Salidas', description: 'Salidas por período' },
    { id: 'sales' as ReportType, name: 'Ventas', description: 'Análisis de ventas' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
            <p className="text-muted-foreground">Generación y exportación de reportes</p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={!reportData}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <Download size={20} /> Exportar Excel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar con tipos de reporte */}
          <div className="bg-white border border-border rounded-lg p-6 h-fit">
            <h2 className="font-semibold text-foreground mb-4">Tipos de Reporte</h2>
            <div className="space-y-2">
              {reportTypes.map(report => (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report.id);
                    setReportData(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedReport === report.id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-opacity-75'
                  }`}
                >
                  <p className="font-semibold text-sm">{report.name}</p>
                  <p className={`text-xs ${selectedReport === report.id ? 'text-gray-100' : 'text-muted-foreground'}`}>
                    {report.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Panel Principal */}
          <div className="lg:col-span-3 bg-white border border-border rounded-lg p-6 space-y-6">
            {/* Filtros */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedReport !== 'inventory' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Fecha inicio</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Fecha fin</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </>
                )}

                {selectedReport === 'inventory' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Categoría</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todas</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {selectedReport === 'entries' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Proveedor</label>
                      <select
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todos</option>
                        {suppliers.map(sup => (
                          <option key={sup.id} value={sup.id}>{sup.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {selectedReport === 'exits' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Cliente</label>
                      <select
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todos</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Botón Generar */}
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>

            {/* Resultados */}
            {reportData && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Resultados</h3>

                {selectedReport === 'inventory' && reportData.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted border-b border-border">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">Código</th>
                          <th className="px-4 py-2 text-left font-semibold">Producto</th>
                          <th className="px-4 py-2 text-left font-semibold">Categoría</th>
                          <th className="px-4 py-2 text-left font-semibold">Stock Actual</th>
                          <th className="px-4 py-2 text-left font-semibold">Stock Mínimo</th>
                          <th className="px-4 py-2 text-left font-semibold">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((product: any) => (
                          <tr key={product.id} className="border-b border-border hover:bg-muted">
                            <td className="px-4 py-2">{product.code}</td>
                            <td className="px-4 py-2 font-medium">{product.name}</td>
                            <td className="px-4 py-2">{product.category?.name || '-'}</td>
                            <td className="px-4 py-2">{product.currentStock}</td>
                            <td className="px-4 py-2">{product.minimumStock}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                  product.currentStock === 0
                                    ? 'bg-red-100 text-red-800'
                                    : product.currentStock <= product.minimumStock
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {product.currentStock === 0 ? 'Sin Stock' : product.currentStock <= product.minimumStock ? 'Bajo Stock' : 'Disponible'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {(selectedReport === 'entries' || selectedReport === 'exits') && reportData.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted border-b border-border">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">Número</th>
                          <th className="px-4 py-2 text-left font-semibold">Documento</th>
                          <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                          <th className="px-4 py-2 text-left font-semibold">{selectedReport === 'entries' ? 'Proveedor' : 'Cliente'}</th>
                          <th className="px-4 py-2 text-left font-semibold">Items</th>
                          <th className="px-4 py-2 text-left font-semibold">Monto Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((item: any) => {
                          const total = item.items?.reduce((sum: number, i: any) => sum + (i.quantity * i.unitPrice), 0) || 0;
                          return (
                            <tr key={item.id} className="border-b border-border hover:bg-muted">
                              <td className="px-4 py-2 font-medium">{item.entryNumber || item.exitNumber}</td>
                              <td className="px-4 py-2">{item.documentNumber}</td>
                              <td className="px-4 py-2">{new Date(item.entryDate || item.exitDate).toLocaleDateString('es-NI')}</td>
                              <td className="px-4 py-2">{item.supplier?.name || item.client?.name || '-'}</td>
                              <td className="px-4 py-2">{item.items?.length || 0}</td>
                              <td className="px-4 py-2 font-semibold">C$ {total.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport === 'sales' && Array.isArray(reportData) && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted border-b border-border">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                          <th className="px-4 py-2 text-left font-semibold">Transacciones</th>
                          <th className="px-4 py-2 text-left font-semibold">Total Items</th>
                          <th className="px-4 py-2 text-left font-semibold">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-border hover:bg-muted">
                            <td className="px-4 py-2">{item.date}</td>
                            <td className="px-4 py-2">{item.transactionCount}</td>
                            <td className="px-4 py-2">{item.totalItems}</td>
                            <td className="px-4 py-2 font-semibold">C$ {item.totalValue?.toFixed(2) || '0.00'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mt-4">
                  Total de registros: {reportData.data?.length || reportData.length || 0}
                </p>
              </div>
            )}

            {!reportData && !loading && (
              <div className="border-t border-border pt-6 text-center py-8 text-muted-foreground">
                Haz clic en "Generar Reporte" para ver los resultados
              </div>
            )}

            {loading && (
              <div className="border-t border-border pt-6">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
