'use client';

import { useState } from 'react';
import MainLayout from '@/components/main-layout';
import { Users, Package, Building2, Zap, Settings2, Users2, ChevronRight, ArrowLeft } from 'lucide-react';
import UsuariosConfig from './components/usuarios-config';
import CategoriasConfig from './components/categorias-config';
import ProveedoresConfig from './components/proveedores-config';
import UnidadesConfig from './components/unidades-config';
import ClientesConfig from './components/clientes-config';
import ParametrosConfig from './components/parametros-config';

export default function ConfigurationPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      icon: Users2,
      title: 'Usuarios',
      description: 'Administración de usuarios del sistema',
      id: 'usuarios',
    },
    {
      icon: Package,
      title: 'Categorías',
      description: 'Gestión de categorías de productos',
      id: 'categorias',
    },
    {
      icon: Building2,
      title: 'Proveedores',
      description: 'Gestión de proveedores',
      id: 'proveedores',
    },
    {
      icon: Zap,
      title: 'Unidades de Medida',
      description: 'Gestión de unidades de medida',
      id: 'unidades',
    },
    {
      icon: Users,
      title: 'Clientes',
      description: 'Gestión de clientes',
      id: 'clientes',
    },
    {
      icon: Settings2,
      title: 'Parámetros Generales',
      description: 'Configuración general del sistema',
      id: 'parametros',
    },
  ];

  const closeSection = () => setActiveSection(null);
  const activeMeta = sections.find(s => s.id === activeSection);

  return (
    <MainLayout>
      <div className="space-y-6">
        {activeSection ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={closeSection}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft size={18} />
                Volver
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{activeMeta?.title}</h1>
                <p className="text-muted-foreground">{activeMeta?.description}</p>
              </div>
            </div>

            {activeSection === 'usuarios' && <UsuariosConfig onClose={closeSection} />}
            {activeSection === 'categorias' && <CategoriasConfig onClose={closeSection} />}
            {activeSection === 'proveedores' && <ProveedoresConfig onClose={closeSection} />}
            {activeSection === 'unidades' && <UnidadesConfig onClose={closeSection} />}
            {activeSection === 'clientes' && <ClientesConfig onClose={closeSection} />}
            {activeSection === 'parametros' && <ParametrosConfig onClose={closeSection} />}
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
              <p className="text-muted-foreground">Administración del sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
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
          </>
        )}
      </div>
    </MainLayout>
  );
}
