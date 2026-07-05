'use client';

import MainLayout from '@/components/main-layout';
import { Download } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('Stock Actual');
  const [startDate, setStartDate] = useState('01/06/2024');
  const [endDate, setEndDate] = useState('20/06/2024');

  const reportTypes = [
    { name: 'Stock Actual', description: 'Estado actual del inventario' },
    { name: 'Movimientos', description: 'Entradas y salidas del período' },
    { name: 'Productos por Categoría', description: 'Stock agrupado por categoría' },
    { name: 'Kardex de Producto', description: 'Histórico de movimientos por producto' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
            <p className="text-muted-foreground">Generación de reportes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} />
            Exportar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Tipos de Reporte</h2>
            <div className="space-y-2">
              {reportTypes.map(report => (
                <button
                  key={report.name}
                  onClick={() => setSelectedReport(report.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedReport === report.name
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-opacity-75'
                  }`}
                >
                  <p className="font-semibold text-sm">{report.name}</p>
                  <p className={`text-xs ${selectedReport === report.name ? 'text-gray-100' : 'text-muted-foreground'}`}>
                    {report.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha inicio</label>
                  <input
                    type="date"
                    value={startDate.split('/').reverse().join('-')}
                    onChange={e => {
                      const [year, month, day] = e.target.value.split('-');
                      setStartDate(`${day}/${month}/${year}`);
                    }}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha fin</label>
                  <input
                    type="date"
                    value={endDate.split('/').reverse().join('-')}
                    onChange={e => {
                      const [year, month, day] = e.target.value.split('-');
                      setEndDate(`${day}/${month}/${year}`);
                    }}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Categoría</label>
                  <select className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Todas</option>
                    <option>Abarrottes</option>
                    <option>Bebidas</option>
                    <option>Lácteos</option>
                    <option>Limpieza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Proveedor</label>
                  <select className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Todos</option>
                    <option>Distribuidora La Fe</option>
                    <option>Comercial XYZ</option>
                    <option>Suministros del Norte</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Generar Reporte
            </button>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">{selectedReport}</h3>

              {selectedReport === 'Stock Actual' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-foreground">Producto</th>
                        <th className="px-4 py-2 text-left font-semibold text-foreground">Stock Actual</th>
                        <th className="px-4 py-2 text-left font-semibold text-foreground">Stock Mínimo</th>
                        <th className="px-4 py-2 text-left font-semibold text-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border hover:bg-muted">
                          <td className="px-4 py-2 text-foreground">Producto {i + 1}</td>
                          <td className="px-4 py-2 text-foreground">{100 + i * 20} unidades</td>
                          <td className="px-4 py-2 text-foreground">50 unidades</td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Disponible
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedReport === 'Movimientos' && (
                <div className="text-center py-8 text-muted-foreground">
                  Seleccione un rango de fechas y haga clic en "Generar Reporte" para ver los movimientos del período.
                </div>
              )}

              {selectedReport === 'Productos por Categoría' && (
                <div className="text-center py-8 text-muted-foreground">
                  Seleccione una categoría y haga clic en "Generar Reporte" para ver el stock agrupado.
                </div>
              )}

              {selectedReport === 'Kardex de Producto' && (
                <div className="text-center py-8 text-muted-foreground">
                  Seleccione un producto y haga clic en "Generar Reporte" para ver su histórico completo.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
