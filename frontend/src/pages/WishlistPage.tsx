import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Plus, Edit2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn } from '@/components/animation/Transitions';
import { Button } from '@/components/ui';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

export function WishlistPage() {
  const { wishlists, fetchWishlists, createWishlist, renameWishlist, deleteWishlist, removeItem, isLoading } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  
  const [activeWishlist, setActiveWishlist] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlists();
    }
  }, [isAuthenticated, fetchWishlists]);

  // Set default active wishlist once loaded
  useEffect(() => {
    if (wishlists.length > 0 && !activeWishlist) {
      setActiveWishlist(wishlists[0].id);
    }
  }, [wishlists, activeWishlist]);

  const handleCreate = async () => {
    if (newWishlistName.trim()) {
      await createWishlist(newWishlistName.trim());
      setNewWishlistName('');
      setIsCreating(false);
    }
  };

  const handleRename = async (id: string) => {
    if (editName.trim()) {
      await renameWishlist(id, editName.trim());
      setEditingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container-app py-20 text-center">
          <Heart className="w-16 h-16 text-surface-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to view your wishlists</h1>
          <p className="text-surface-400 mb-8">Save your favorite items and create multiple collections.</p>
          <Link to="/login"><Button>Sign In</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const currentList = wishlists.find(w => w.id === activeWishlist) || wishlists[0];

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-10 lg:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Wishlists</h1>
              <p className="text-surface-400">Manage your saved items and collections.</p>
            </div>
            
            {/* Wishlist Selector / Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {wishlists.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWishlist(w.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeWishlist === w.id
                      ? 'bg-brand-500 text-black'
                      : 'bg-surface-800 text-white hover:bg-surface-700'
                  }`}
                >
                  {w.name}
                </button>
              ))}
              
              {isCreating ? (
                <div className="flex items-center gap-2 bg-surface-900 rounded-full p-1 border border-surface-700">
                  <input
                    type="text"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                    placeholder="List name..."
                    className="bg-transparent border-none focus:outline-none text-white text-sm px-3 w-32"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                  <button onClick={handleCreate} className="p-1.5 rounded-full bg-brand-500 text-black">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsCreating(false)} className="p-1.5 rounded-full text-surface-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-surface-600 text-surface-300 hover:text-white hover:border-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> New List
                </button>
              )}
            </div>
          </div>

          {currentList ? (
            <FadeIn>
              <div className="bg-surface-900 rounded-3xl border border-surface-800 p-6 sm:p-8">
                
                {/* List Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-surface-800">
                  {editingId === currentList.id ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-surface-950 border border-surface-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-brand-500"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(currentList.id)}
                      />
                      <button onClick={() => handleRename(currentList.id)} className="text-green-400 p-1">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-surface-400 p-1">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold text-white">{currentList.name}</h2>
                      <button 
                        onClick={() => { setEditingId(currentList.id); setEditName(currentList.name); }}
                        className="text-surface-500 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {wishlists.length > 1 && (
                    <button
                      onClick={() => deleteWishlist(currentList.id)}
                      className="flex items-center gap-2 text-sm text-surface-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete List
                    </button>
                  )}
                </div>

                {/* Items Grid */}
                {currentList.items.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-12 h-12 text-surface-700 mx-auto mb-4" />
                    <p className="text-lg text-surface-300">This list is empty.</p>
                    <Link to="/shop" className="inline-block mt-4 text-brand-400 hover:underline">
                      Explore products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    <AnimatePresence>
                      {currentList.items.map((item) => {
                        const price = parseFloat(item.product.price);
                        const imgUrl = item.product.images?.[0]?.url;
                        return (
                          <motion.div
                            key={item.product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-surface-950 rounded-2xl overflow-hidden border border-surface-800 flex flex-col"
                          >
                            <button
                              onClick={() => removeItem(currentList.id, item.product.id)}
                              disabled={isLoading}
                              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <Link to={`/product/${item.product.slug}`} className="block relative aspect-square overflow-hidden bg-surface-900">
                              {imgUrl ? (
                                <img src={imgUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Heart className="w-8 h-8 text-surface-700" />
                                </div>
                              )}
                            </Link>

                            <div className="p-4 flex flex-col flex-1">
                              <Link to={`/product/${item.product.slug}`}>
                                <h3 className="font-medium text-white mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <div className="mt-auto">
                                <p className="text-lg font-semibold text-white">₹{price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
                
              </div>
            </FadeIn>
          ) : (
            <div className="text-center py-20 text-surface-400">
              Loading wishlists...
            </div>
          )}
        </div>
      </PageTransition>
    </MainLayout>
  );
}
