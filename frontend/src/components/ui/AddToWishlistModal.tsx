import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, X, FolderPlus } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface AddToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: string;
    images?: { url: string }[];
  } | null;
}

export function AddToWishlistModal({ isOpen, onClose, product }: AddToWishlistModalProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { wishlists, fetchWishlists, createWishlist, addItem, removeItem } = useWishlistStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchWishlists();
    }
  }, [isOpen, isAuthenticated, fetchWishlists]);

  if (!isOpen || !product) return null;

  if (!isAuthenticated) {
    onClose();
    navigate('/login');
    return null;
  }

  const handleToggleItem = async (wishlistId: string, inList: boolean) => {
    setLoadingMap((prev) => ({ ...prev, [wishlistId]: true }));
    try {
      if (inList) {
        await removeItem(wishlistId, product.id);
      } else {
        await addItem(wishlistId, product.id);
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [wishlistId]: false }));
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const name = newListName.trim();
    setNewListName('');
    setIsCreating(false);

    // Create new list
    await createWishlist(name);
    // Find created list and add item to it
    const updatedLists = useWishlistStore.getState().wishlists;
    const created = updatedLists.find((w) => w.name === name);
    if (created) {
      await addItem(created.id, product.id);
    }
  };

  const imgUrl = product.images?.[0]?.url;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
          className="relative w-full max-w-md bg-surface-900 border border-surface-700/80 rounded-3xl p-6 shadow-2xl shadow-black/60 z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Header */}
          <div className="flex items-center gap-4 pb-5 border-b border-surface-800">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-950 border border-surface-800 shrink-0">
              {imgUrl ? (
                <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-surface-600" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm line-clamp-1">{product.name}</h3>
              <p className="text-xs text-brand-400 font-medium mt-0.5">
                ₹{parseFloat(product.price).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-surface-400 mt-1">Save to wishlists:</p>
            </div>
          </div>

          {/* Wishlists List */}
          <div className="py-4 space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
            {wishlists.map((w) => {
              const inThisList = w.items.some((item) => item.product.id === product.id);
              const isLoading = !!loadingMap[w.id];

              return (
                <button
                  key={w.id}
                  onClick={() => handleToggleItem(w.id, inThisList)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left group ${
                    inThisList
                      ? 'bg-brand-500/10 border-brand-500/40 text-white'
                      : 'bg-surface-950/60 border-surface-800 text-surface-300 hover:border-surface-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        inThisList
                          ? 'bg-brand-500 border-brand-500 text-black'
                          : 'border-surface-600 group-hover:border-surface-400'
                      }`}
                    >
                      {inThisList && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium">{w.name}</span>
                  </div>

                  <span className="text-xs text-surface-400 font-normal">
                    {w.items.length} {w.items.length === 1 ? 'item' : 'items'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Create New Wishlist Form / Toggle */}
          <div className="pt-3 border-t border-surface-800">
            {isCreating ? (
              <form onSubmit={handleCreateAndAdd} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Wishlist name (e.g. Summer Fit)"
                  className="flex-1 bg-surface-950 border border-surface-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 placeholder:text-surface-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="px-4 py-2.5 bg-brand-500 text-black font-semibold rounded-xl text-sm hover:bg-brand-400 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="p-2.5 text-surface-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-surface-700 rounded-2xl text-sm font-medium text-surface-300 hover:text-white hover:border-surface-500 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-brand-400" />
                Create New Wishlist
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
