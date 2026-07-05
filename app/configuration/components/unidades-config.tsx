'use client';

import { useEffect, useState } from 'react';
import { getUnits, createUnit, updateUnit, deleteUnit } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { X, Trash2, Edit2, Plus } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  createdAt?: string;
}

export default function UnidadesConfig({ onClose }: { onClose: () => void }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', abbreviation: '' });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const response = await getUnits(1, 100);
      setUnits(response.data || []);
    } catch (error) {
      console.error('[v0] Error loading units:', error);
      showToast('Error al cargar unidades', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.abbreviation) {
        showToast('Completa todos los campos', 'error');
        return;
      }

      if (editingId) {
        await updateUnit(editingId, formData.name, formData.abbreviation);
        showToast('Unidad actualizada correctamente', 'success');
      } else {
        await createUnit(formData.name, formData.abbreviation);
        showToast('Unidad creada correctamente', 'success');
      }

      setFormData({ name: '', abbreviation: '' });
      setEditingId(null);
      setShowModal(false);
      loadUnits();
    } catch (error: any) {
      console.error('[v0] Error saving unit:', error);
      showToast(error.message || 'Error al guardar unidad', 'error');
    }
  };

  const handleEdit = (unit: Unit) => {
    setFormData({ name: unit.name, abbreviation: unit.abbreviation });
    setEditingId(unit.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta unidad?')) return;
    
    try {
      await deleteUnit(id);
      showToast('Unidad eliminada correctamente', 'success');
      loadUnits();
    } catch (error) {
      console.error('[v0] Error deleting unit:', error);
      showToast('Error al eliminar unidad', 'error');
    }
  };

  const filteredUnits = units.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Unidades de Medida</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar unidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={() => {
            setFormData({ name: '', abbreviation: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Nueva Unidad
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Unidad</th>
              <th className="px-4 py-2 text-left font-semibold">Abreviatura</th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No hay unidades
                </td>
              </tr>
            ) : (
              filteredUnits.map(unit => (
                <tr key={unit.id} className="border-b border-border hover:bg-muted">
                  <td className="px-4 py-2 font-medium">{unit.name}</td>
                  <td className="px-4 py-2 bg-muted px-3 py-1 rounded-md font-mono text-sm">{unit.abbreviation}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(unit)}
                      className="text-primary hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(unit.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Unidad' : 'Nueva Unidad'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Kilogramo"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Abreviatura</label>
            <input
              type="text"
              value={formData.abbreviation}
              onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
              placeholder="Ej: kg"
              maxLength={5}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
