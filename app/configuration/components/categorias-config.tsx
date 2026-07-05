'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { X, Trash2, Edit2, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export default function CategoriasConfig({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories(1, 100);
      setCategories(response.data || []);
    } catch (error) {
      console.error('[v0] Error loading categories:', error);
      showToast('Error al cargar categorías', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name) {
        showToast('El nombre es obligatorio', 'error');
        return;
      }

      if (editingId) {
        await updateCategory(editingId, formData.name, formData.description);
        showToast('Categoría actualizada correctamente', 'success');
      } else {
        await createCategory(formData.name, formData.description);
        showToast('Categoría creada correctamente', 'success');
      }

      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowModal(false);
      loadCategories();
    } catch (error: any) {
      console.error('[v0] Error saving category:', error);
      showToast(error.message || 'Error al guardar categoría', 'error');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await deleteCategory(id);
      showToast('Categoría eliminada correctamente', 'success');
      loadCategories();
    } catch (error) {
      console.error('[v0] Error deleting category:', error);
      showToast('Error al eliminar categoría', 'error');
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Categorías</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={() => {
            setFormData({ name: '', description: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Nueva Categoría
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Nombre</th>
              <th className="px-4 py-2 text-left font-semibold">Descripción</th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No hay categorías
                </td>
              </tr>
            ) : (
              filteredCategories.map(category => (
                <tr key={category.id} className="border-b border-border hover:bg-muted">
                  <td className="px-4 py-2 font-medium">{category.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{category.description || '-'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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
        title={editingId ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Abarrottes"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción opcional"
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
