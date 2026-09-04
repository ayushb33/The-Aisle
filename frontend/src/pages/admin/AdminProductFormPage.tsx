import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface Category {
  id: string;
  name: string;
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    stock: '0',
    lowStockThreshold: '5',
    categoryId: '',
    brand: '',
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    // Load categories
    api.get('/admin/catalog/categories').then(res => setCategories(res.data.data.categories));
    
    // Load product if editing
    if (isEditing) {
      api.get(`/admin/catalog/products/${id}`).then(res => {
        const p = res.data.data.product;
        setFormData({
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          shortDesc: p.shortDesc || '',
          price: p.price,
          comparePrice: p.comparePrice || '',
          costPrice: p.costPrice || '',
          sku: p.sku || '',
          stock: p.stock.toString(),
          lowStockThreshold: p.lowStockThreshold.toString(),
          categoryId: p.categoryId || '',
          brand: p.brand || '',
          isFeatured: p.isFeatured,
          isNewArrival: p.isNewArrival,
          isActive: p.isActive,
        });
        setImages(p.images.map((img: any) => img.url));
      }).catch(_err => {
        setError('Failed to load product');
      }).finally(() => setIsLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from name if creating
      if (name === 'name' && !isEditing) {
        setFormData(prev => ({
          ...prev,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
      }
    }
  };

  const handleAddImage = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !newImageUrl.trim()) return;
    e.preventDefault();
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        images
      };
      
      if (isEditing) {
        await api.patch(`/admin/catalog/products/${id}`, payload);
      } else {
        await api.post('/admin/catalog/products', payload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </button>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Product Name *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Slug * (URL friendly)</label>
                    <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none font-mono text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Short Description</label>
                  <input name="shortDesc" value={formData.shortDesc} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Full Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none resize-none" />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Pricing & Inventory</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">₹</span>
                    <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 pl-8 text-white focus:border-brand-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Compare at Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">₹</span>
                    <input type="number" step="0.01" name="comparePrice" value={formData.comparePrice} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 pl-8 text-white focus:border-brand-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">₹</span>
                    <input type="number" step="0.01" name="costPrice" value={formData.costPrice} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 pl-8 text-white focus:border-brand-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">SKU</label>
                  <input name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Low Stock Alert</label>
                  <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Organization & Images */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Organization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none">
                      <option value="">Select category...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Brand</label>
                    <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 outline-none" />
                  </div>
                  
                  <div className="pt-2 space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-surface-950 border border-surface-700 rounded-xl cursor-pointer">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
                      <span className="text-white text-sm font-medium">Active (Visible on store)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-surface-950 border border-surface-700 rounded-xl cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
                      <span className="text-white text-sm font-medium">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-surface-950 border border-surface-700 rounded-xl cursor-pointer">
                      <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
                      <span className="text-white text-sm font-medium">New Arrival</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Images (URLs)</h2>
                
                <div className="flex gap-2 mb-4">
                  <input 
                    type="url" 
                    value={newImageUrl} 
                    onChange={e => setNewImageUrl(e.target.value)} 
                    onKeyDown={handleAddImage}
                    placeholder="https://example.com/image.jpg" 
                    className="flex-1 bg-surface-950 border border-surface-700 rounded-xl p-2.5 text-white focus:border-brand-500 outline-none text-sm" 
                  />
                  <Button type="button" onClick={handleAddImage} variant="outline" className="px-4">Add</Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-950 border border-surface-800">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-md text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-3 py-8 text-center border-2 border-dashed border-surface-700 rounded-xl text-surface-400">
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No images added</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSaving}>Cancel</Button>
              <Button type="submit" loading={isSaving}>
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
