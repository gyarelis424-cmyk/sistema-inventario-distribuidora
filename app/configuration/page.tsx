'use client';

import { useState } from 'react';
import MainLayout from '@/components/main-layout';
import { Users, Package, Building2, Zap, Settings2, Users2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ConfigurationPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      icon: Users2,
      title: 'Usuarios',
      description: 'Administración de usuarios del sistema',
      href: '#usuarios',
    },
    {
      icon: Package,
      title: 'Categorías',
      description: 'Gestión de categorías de productos',
      href: '#categorias',
    },
    {
      icon: Settings2,
      title: 'Proveedores',
      description: 'Gestión de proveedores',
      href: '#proveedores',
    },
    {
      icon: Zap,
      title: 'Unidades de Medida',
      description: 'Gestión de unidades de medida',
      href: '#unidades',
    },
    {
      icon: Users,
      title: 'Clientes',
      description: 'Gestión de clientes',
      href: '#clientes',
    },
    {
      icon: Building2,
      title: 'Parámetros Generales',
      description: 'Configuración general del sistema',
      href: '#parametros',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">Administración del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.title}
                onClick={() => setActiveSection(section.title.toLowerCase())}
                className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={24} className="text-primary" />
                      <h2 className="font-semibold text-foreground text-lg">{section.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <ChevronRight className="text-muted-foreground" size={20} />
                </div>
              </button>
            );
          })}
        </div>

        {activeSection === 'usuarios' && (
          <UsuariosConfig onClose={() => setActiveSection(null)} />
        )}
        {activeSection === 'categorias' && (
          <CategoriasConfig onClose={() => setActiveSection(null)} />
        )}
        {activeSection === 'proveedores' && (
          <ProveedoresConfig onClose={() => setActiveSection(null)} />
        )}
        {activeSection === 'unidades' && (
          <UnidadesConfig onClose={() => setActiveSection(null)} />
        )}
        {activeSection === 'clientes' && (
          <ClientesConfig onClose={() => setActiveSection(null)} />
        )}
        {activeSection === 'parametros' && (
          <ParametrosConfig onClose={() => setActiveSection(null)} />
        )}
      </div>
    </MainLayout>
  );
}

function UsuariosConfig({ onClose }: { onClose: () => void }) {
  const [users] = useState([
    { id: 1, name: 'Administrador', email: 'admin@distribuidora.com', role: 'Administrador', status: 'Activo' },
    { id: 2, name: 'Juan Pérez', email: 'juan@distribuidora.com', role: 'Vendedor', status: 'Activo' },
    { id: 3, name: 'María Gómez', email: 'maria@distribuidora.com', role: 'Almacenista', status: 'Activo' },
    { id: 4, name: 'Carlos López', email: 'carlos@distribuidora.com', role: 'Vendedor', status: 'Inactivo' },
  ]);

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Usuarios</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-foreground">ID</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Nombres</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Correo</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Rol</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Estado</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-border hover:bg-muted">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2 text-foreground">{user.name}</td>
                <td className="px-4 py-2 text-foreground">{user.email}</td>
                <td className="px-4 py-2 text-foreground">{user.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-primary hover:underline text-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
        Nuevo Usuario
      </button>
    </div>
  );
}

function CategoriasConfig({ onClose }: { onClose: () => void }) {
  const [categories] = useState([
    { id: 1, name: 'Abarrottes', description: 'Productos de consumo diario', status: 'Activo' },
    { id: 2, name: 'Bebidas', description: 'Bebidas alcohólicas y no alcohólicas', status: 'Activo' },
    { id: 3, name: 'Lácteos', description: 'Productos lácteos y derivados', status: 'Activo' },
    { id: 4, name: 'Limpieza', description: 'Productos de limpieza del hogar', status: 'Activo' },
  ]);

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Categorías</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-foreground">ID</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Nombre de Categoría</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Descripción</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Estado</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-border hover:bg-muted">
                <td className="px-4 py-2">{cat.id}</td>
                <td className="px-4 py-2 text-foreground">{cat.name}</td>
                <td className="px-4 py-2 text-foreground">{cat.description}</td>
                <td className="px-4 py-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {cat.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-primary hover:underline text-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
        Nueva Categoría
      </button>
    </div>
  );
}

function ProveedoresConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Proveedores</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <p className="text-muted-foreground">Gestión de proveedores aquí</p>
    </div>
  );
}

function UnidadesConfig({ onClose }: { onClose: () => void }) {
  const [units] = useState([
    { id: 1, name: 'Unidad', abbreviation: 'und', description: 'Unidad básica', status: 'Activo' },
    { id: 2, name: 'Kilogramo', abbreviation: 'kg', description: 'Medida de peso', status: 'Activo' },
    { id: 3, name: 'Litro', abbreviation: 'L', description: 'Medida de volumen', status: 'Activo' },
    { id: 4, name: 'Metro', abbreviation: 'm', description: 'Medida de longitud', status: 'Activo' },
  ]);

  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Unidades de Medida</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-foreground">ID</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Unidad de Medida</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Abreviatura</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Descripción</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Estado</th>
              <th className="px-4 py-2 text-left font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {units.map(unit => (
              <tr key={unit.id} className="border-b border-border hover:bg-muted">
                <td className="px-4 py-2">{unit.id}</td>
                <td className="px-4 py-2 text-foreground">{unit.name}</td>
                <td className="px-4 py-2 text-foreground">{unit.abbreviation}</td>
                <td className="px-4 py-2 text-foreground">{unit.description}</td>
                <td className="px-4 py-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {unit.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-primary hover:underline text-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
        Nueva Unidad
      </button>
    </div>
  );
}

function ClientesConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Clientes</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <p className="text-muted-foreground">Gestión de clientes aquí</p>
    </div>
  );
}

function ParametrosConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Parámetros Generales</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nombre de la Empresa</label>
          <input
            type="text"
            defaultValue="Distribuidora S.A."
            className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">RUC</label>
          <input
            type="text"
            defaultValue="09999999900001"
            className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
          <input
            type="email"
            defaultValue="info@distribuidora.com"
            className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Moneda</label>
          <select className="w-full px-4 py-2 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>NIO - Dólar Nicaragüense</option>
            <option>USD - Dólar Americano</option>
          </select>
        </div>
        <button className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
