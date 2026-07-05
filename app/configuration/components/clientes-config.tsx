'use client';

import { useEffect, useState } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { X, Trash2, Edit2, Plus } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export default function ClientesConfig({ onClose }: { onClose: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await getClients(1, 100);
      setClients(response.data || []);
    } catch (error) {
      console.error('[v0] Error loading clients:', error);
      showToast('Error al cargar clientes', 'error');
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
        await updateClient(editingId, formData.name, formData.email, formData.phone);
        showToast('Cliente actualizado correctamente', 'success');
      } else {
        await createClient(formData.name, formData.email, formData.phone);
        showToast('Cliente creado correctamente', 'success');
      }

      setFormData({ name: '', email: '', phone: '' });
      setEditingId(null);
      setShowModal(false);
      loadClients();
    } catch (error: any) {
      console.error('[v0] Error saving client:', error);
      showToast(error.message || 'Error al guardar cliente', 'error');
    }
  };

  const handleEdit = (client: Client) => {
    setFormData({ name: client.name, email: client.email, phone: client.phone });
    setEditingId(client.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    
    try {
      await deleteClient(id);
      showToast('Cliente eliminado correctamente', 'success');
      loadClients();
    } catch (error) {
      console.error('[v0] Error deleting client:', error);
      showToast('Error al eliminar cliente', 'error');
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Clientes</h2>
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
          <Plus size={16} /> Nuevo Cliente
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
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay clientes
                </td>
              </tr>
            ) : (
              filteredClients.map(client => (
                <tr key={client.id} className="border-b border-border hover:bg-muted">
                  <td className="px-4 py-2 font-medium">{client.name}</td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">{client.phone}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-primary hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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
        title={editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del cliente"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@cliente.com"
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
