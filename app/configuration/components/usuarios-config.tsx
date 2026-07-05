'use client';

import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { X, Trash2, Edit2, Plus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  names: string;
  phone: string;
  role?: string;
  createdAt?: string;
}

export default function UsuariosConfig({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ email: '', names: '', phone: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(1, 100);
      setUsers(response.data || []);
    } catch (error) {
      console.error('[v0] Error loading users:', error);
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.email || !formData.names || !formData.phone) {
        showToast('Completa todos los campos', 'error');
        return;
      }

      if (editingId) {
        await updateUser(editingId, { names: formData.names, phone: formData.phone });
        showToast('Usuario actualizado correctamente', 'success');
      } else {
        await createUser(formData.email, formData.names, formData.phone);
        showToast('Usuario creado correctamente', 'success');
      }

      setFormData({ email: '', names: '', phone: '' });
      setEditingId(null);
      setShowModal(false);
      loadUsers();
    } catch (error: any) {
      console.error('[v0] Error saving user:', error);
      showToast(error.message || 'Error al guardar usuario', 'error');
    }
  };

  const handleEdit = (user: User) => {
    setFormData({ email: user.email, names: user.names, phone: user.phone });
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await deleteUser(id);
      showToast('Usuario eliminado correctamente', 'success');
      loadUsers();
    } catch (error) {
      console.error('[v0] Error deleting user:', error);
      showToast('Error al eliminar usuario', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.names.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Usuarios</h2>
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
            setFormData({ email: '', names: '', phone: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Nombres</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-muted">
                  <td className="px-4 py-2">{user.names}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
        title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingId}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombres</label>
            <input
              type="text"
              value={formData.names}
              onChange={(e) => setFormData({ ...formData, names: e.target.value })}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
