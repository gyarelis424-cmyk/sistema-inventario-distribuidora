'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/main-layout';
import { apiCall } from '@/lib/api';
import { Package, Boxes, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [totalProducts, totalStock, stockByCategory, monthlyEntries, monthlySales, entries, exits] = await Promise.all([
        apiCall('/api/products/stats/total'),
        apiCall('/api/products/stats/stock'),
        apiCall('/api/products/stats/by-category'),
        apiCall('/api/entries/stats/total-monthly'),
        apiCall('/api/exits/stats/total-monthly'),
        apiCall('/api/entries/stats/monthly'),
        apiCall('/api/exits/stats/monthly'),
      ]);

      const chartData = formatChartData(entries, exits);

      setStats({
        totalProducts: totalProducts.total,
        totalStock: totalStock.total,
        monthlyEntries: monthlyEntries.count,
        monthlySales: monthlySales.count,
        stockByCategory: stockByCategory || [],
        chartData: chartData,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (entries: any[], exits: any[]) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      Entradas: entries[idx]?.count || 0,
      Salidas: exits[idx]?.count || 0,
    }));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del inventario</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Productos</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalProducts || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Total productos</p>
              </div>
              <Package className="text-primary opacity-50" size={32} />
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stock Total</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalStock?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Unidades disponibles</p>
              </div>
              <Boxes className="text-primary opacity-50" size={32} />
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Entradas (Mes)</p>
                <p className="text-3xl font-bold text-foreground">{stats?.monthlyEntries || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Unidades ingresadas</p>
              </div>
              <TrendingUp className="text-green-500 opacity-50" size={32} />
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Salidas (Mes)</p>
                <p className="text-3xl font-bold text-foreground">{stats?.monthlySales || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Unidades despachadas</p>
              </div>
              <TrendingDown className="text-red-500 opacity-50" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Movimientos (Últimos 6 meses)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '8px' }}
                  labelStyle={{ color: '#1a2332' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Entradas" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Salidas" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Stock por categoría</h2>
            <div className="space-y-3">
              {stats?.stockByCategory?.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-foreground">{item.category}</p>
                    <p className="text-sm font-semibold text-foreground">{item.total} ({((item.total / stats.totalStock) * 100).toFixed(0)}%)</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(item.total / stats.totalStock) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <a href="#" className="text-primary text-sm hover:underline">
                  Ver detalle
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
