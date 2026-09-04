import { useEffect, useState } from 'react';
import { Tag, Plus, Edit2, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    isActive: true,
    sortOrder: 0
  });

  const fetchCategories = () => {
    setIsLoading(true);
    api.get('/admin/catalog/categories')
      .then(res => setCategories(res.data.data.categories))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenForm = (cat?: AdminCategory) => {
    if (cat) {
      setFormData({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        isActive: cat.isActive,
        sortOrder: cat.sortOrder
      });
    } else {
      setFormData({
        id: '',
        name: '',
        slug: '',
        description: '',
        isActive: true,
        sortOrder: categories.length * 10
      });
    }
    setIsFormOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'name' && !formData.id) {
        setFormData(prev => ({
          ...prev,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder.toString()) || 0
      };
      
      if (formData.id) {
        await api.patch(`/admin/catalog/categories/${formData.id}`, payload);
      } else {
        await api.post('/admin/catalog/categories', payload);
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/catalog/categories/${deletingId}`);
      setDeletingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category (ensure it has no products)');
    }
  };

  return (
    <AdminRoute>
      <AdminLayout>
        
        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-6">{formData.id ? 'Edit Category' : 'New Category'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Name *</label>
                  <input required name="name" value={formData.name} onChange={handleFormChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Slug * (URL friendly)</label>
                  <input required name="slug" value={formData.slug} onChange={handleFormChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Sort Order</label>
                    <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleFormChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="w-4 h-4 accent-brand-500" />
                    <span className="text-white text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                  <Button type="submit">{formData.id ? 'Save' : 'Create'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Category?</h3>
              <p className="text-surface-400 text-sm text-center mb-6">
                Are you sure you want to delete this category? (Products within this category will be uncategorized).
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
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-surface-400 mt-1">Organize your products into categories</p>
            </div>
            <Button onClick={() => handleOpenForm()} leftIcon={<Plus className="w-4 h-4" />}>Add Category</Button>
          </div>

          <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="text-center py-16 text-surface-400">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16">
                <Tag className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                <p className="text-surface-400">No categories found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider w-16">Order</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Products</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-white/2 transition-colors group">
                        <td className="px-6 py-4 text-surface-400">
                          {category.sortOrder}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{category.name}</p>
                          <p className="text-xs text-surface-400 font-mono">{category.slug}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-surface-300">{category._count.products} products</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            category.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-surface-700 text-surface-400'
                          }`}>
                            {category.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            {category.isActive ? 'Active' : 'Hidden'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenForm(category)} className="p-1.5 text-surface-400 hover:text-white bg-surface-800 hover:bg-brand-500/20 hover:text-brand-400 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeletingId(category.id)} className="p-1.5 text-surface-400 hover:text-white bg-surface-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
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
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
