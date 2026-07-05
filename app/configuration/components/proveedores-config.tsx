'use client';

import { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { X, Trash2, Edit2, Plus } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export default function ProveedoresConfig({ onClose }: { onClose: () => void }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await getSuppliers(1, 100);
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('[v0] Error loading suppliers:', error);
      showToast('Error al cargar proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        showToast('Completa todos los campos', 'error');
        return;
      }

      if (editingId) {
        await updateSupplier(editingId, formData.name, formData.email, formData.phone);
        showToast('Proveedor actualizado correctamente', 'success');
      } else {
        await createSupplier(formData.name, formData.email, formData.phone);
        showToast('Proveedor creado correctamente', 'success');
      }

      setFormData({ name: '', email: '', phone: '' });
      setEditingId(null);
      setShowModal(false);
      loadSuppliers();
    } catch (error: any) {
      console.error('[v0] Error saving supplier:', error);
      showToast(error.message || 'Error al guardar proveedor', 'error');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({ name: supplier.name, email: supplier.email, phone: supplier.phone });
    setEditingId(supplier.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
    
    try {
      await deleteSupplier(id);
      showToast('Proveedor eliminado correctamente', 'success');
      loadSuppliers();
    } catch (error) {
      console.error('[v0] Error deleting supplier:', error);
      showToast('Error al eliminar proveedor', 'error');
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Proveedores</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={() => {
            setFormData({ name: '', email: '', phone: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Nuevo Proveedor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Nombre</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay proveedores
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="border-b border-border hover:bg-muted">
                  <td className="px-4 py-2 font-medium">{supplier.name}</td>
                  <td className="px-4 py-2">{supplier.email}</td>
                  <td className="px-4 py-2">{supplier.phone}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-primary hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
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
        title={editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del proveedor"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@proveedor.com"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+505 0000-0000"
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
