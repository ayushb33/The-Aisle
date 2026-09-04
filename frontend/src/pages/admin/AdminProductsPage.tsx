import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Plus, Edit2, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  isActive: boolean;
  category?: { name: string };
  images: { url: string }[];
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Confirmation modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = () => {
    setIsLoading(true);
    api.get('/admin/catalog/products', { params: { search, page, limit: 12 } })
      .then(res => {
        setProducts(res.data.data.products);
        setTotalPages(res.data.data.meta.totalPages);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/catalog/products/${deletingId}`);
      setDeletingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/catalog/products/${id}`, { isActive: !currentStatus });
      setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminRoute>
      <AdminLayout>
        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Product?</h3>
              <p className="text-surface-400 text-sm text-center mb-6">
                This action cannot be undone. Are you sure you want to permanently delete this product?
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeletingId(null)}>Cancel</Button>
                <Button className="flex-1 !bg-red-500 hover:!bg-red-600 !text-white" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
              <p className="text-surface-400 mt-1">Manage your catalog, pricing, and inventory</p>
            </div>
            <Link to="/admin/products/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
            </Link>
          </div>

          <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-11 pr-4 py-2.5 bg-surface-950 border border-surface-700 rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
                />
              </div>
            </div>

            {/* Table */}
            {isLoading && products.length === 0 ? (
              <div className="text-center py-16 text-surface-400">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                <p className="text-surface-400 mb-4">No products found</p>
                {search && <Button variant="outline" onClick={() => setSearch('')}>Clear Search</Button>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Product</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Price</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Stock</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-white/2 transition-colors group">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-surface-950 border border-surface-800 overflow-hidden shrink-0">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-surface-600 m-auto mt-2.5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white line-clamp-1">{product.name}</p>
                              <p className="text-xs text-surface-400 font-mono">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-surface-300">
                          {product.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-3">
                          <span className="font-medium text-white">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            product.stock === 0 ? 'bg-red-500/20 text-red-400' :
                            product.stock <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-surface-800 text-white'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button 
                            onClick={() => toggleStatus(product.id, product.isActive)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              product.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-surface-700 text-surface-400 hover:bg-surface-600'
                            }`}
                          >
                            {product.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            {product.isActive ? 'Active' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/products/edit/${product.id}`} className="p-1.5 text-surface-400 hover:text-white bg-surface-800 hover:bg-brand-500/20 hover:text-brand-400 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setDeletingId(product.id)} className="p-1.5 text-surface-400 hover:text-white bg-surface-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-surface-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
