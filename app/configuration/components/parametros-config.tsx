'use client';

import { useEffect, useState } from 'react';
import { getConfiguration, updateConfiguration } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { showToast } from '@/components/ui/toast';
import { X, Save } from 'lucide-react';

interface Config {
  id?: string;
  company_name?: string;
  ruc?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency?: string;
  timezone?: string;
  [key: string]: any;
}

export default function ParametrosConfig({ onClose }: { onClose: () => void }) {
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const data = await getConfiguration();
      setConfig(data || {});
    } catch (error) {
      console.error('[v0] Error loading configuration:', error);
      showToast('Error al cargar configuración', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateConfiguration(config);
      showToast('Configuración guardada correctamente', 'success');
    } catch (error: any) {
      console.error('[v0] Error saving configuration:', error);
      showToast(error.message || 'Error al guardar configuración', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Parámetros Generales</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos Empresa */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Información de la Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre de la Empresa</label>
              <input
                type="text"
                value={config.company_name || ''}
                onChange={(e) => handleChange('company_name', e.target.value)}
                placeholder="Ej: Distribuidora S.A."
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">RUC</label>
              <input
                type="text"
                value={config.ruc || ''}
                onChange={(e) => handleChange('ruc', e.target.value)}
                placeholder="Ej: 09999999900001"
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={config.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@distribuidora.com"
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <input
                type="tel"
                value={config.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+505 0000-0000"
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Dirección</label>
              <textarea
                value={config.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Dirección de la empresa"
                rows={3}
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Configuración Sistema */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Configuración del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Moneda</label>
              <select
                value={config.currency || 'NIO'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="NIO">NIO - Córdoba Nicaragüense</option>
                <option value="USD">USD - Dólar Americano</option>
                <option value="MXN">MXN - Peso Mexicano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Zona Horaria</label>
              <select
                value={config.timezone || 'America/Managua'}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="America/Managua">América/Managua</option>
                <option value="America/New_York">América/New York</option>
                <option value="America/Chicago">América/Chicago</option>
                <option value="America/Denver">América/Denver</option>
                <option value="America/Los_Angeles">América/Los Angeles</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-6 mt-6 border-t border-border">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-input rounded-lg hover:bg-muted font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}
