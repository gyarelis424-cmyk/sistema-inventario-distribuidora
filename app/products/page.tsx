'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/main-layout';
import { getProducts, getProductById } from '@/lib/api';
import { Search, Plus, Download, MoreVertical, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(page, 10, search);
      setProducts(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (id: string) => {
    try {
      const product = await getProductById(id);
      setSelectedProduct(product);
      setShowDetail(true);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Productos</h1>
            <p className="text-muted-foreground">Listado de productos</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
              <Download size={20} />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 flex gap-2">
          <Search size={20} className="text-muted-foreground mt-3" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none text-foreground placeholder-muted-foreground bg-transparent"
          />
          <button className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            Filtros
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Código</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Categoría</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Unidad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm text-primary font-semibold">{product.code}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.category?.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.unit?.abbreviation}</td>
                      <td className="px-6 py-4 text-sm text-foreground">C$ {parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{Math.floor(product.currentStock)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Lock size={16} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-primary"
                          >
                            →
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mostrando 1 a 4 de {total} entradas</p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg ${page === pageNum ? 'bg-primary text-white' : 'border border-border hover:bg-muted'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {showDetail && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-foreground">Detalle de Producto</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-6">
                  <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center">
                    {selectedProduct.imageUrl ? (
                      <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <p className="text-muted-foreground">Sin imagen</p>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p>
                      <span className="text-muted-foreground">Código:</span> <span className="font-semibold text-foreground">{selectedProduct.code}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Producto:</span> <span className="font-semibold text-foreground">{selectedProduct.name}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Categoría:</span> <span className="font-semibold text-foreground">{selectedProduct.category?.name}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Unidad:</span> <span className="font-semibold text-foreground">{selectedProduct.unit?.name}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Precio:</span> <span className="font-semibold text-foreground">C$ {parseFloat(selectedProduct.price).toFixed(2)}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Stock Actual:</span> <span className="font-semibold text-foreground">{Math.floor(selectedProduct.currentStock)} unidades</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Stock Mínimo:</span> <span className="font-semibold text-foreground">{Math.floor(selectedProduct.minimumStock)} unidades</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Estado:</span>{' '}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${selectedProduct.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedProduct.status}
                      </span>
                    </p>
                  </div>
                </div>
                {selectedProduct.description && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-muted-foreground text-sm mb-1">Descripción:</p>
                    <p className="text-foreground">{selectedProduct.description}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-border flex gap-2 sticky bottom-0 bg-white">
                <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                  ← Volver
                </button>
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                  ✎ Editar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
