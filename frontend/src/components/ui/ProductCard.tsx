import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/queries';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { AddToWishlistModal } from './AddToWishlistModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400?text=No+Image';
  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const { addItem, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist } = useWishlistStore();

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    await addItem(product.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    setShowWishlistModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden hover:border-surface-700 hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 15 }}
            className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-red-500 text-white rounded-lg shadow-lg"
          >
            {discount}% OFF
          </motion.span>
        )}
        {product.isNewArrival && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 15 }}
            className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-brand-500 text-black rounded-lg shadow-lg"
          >
            NEW
          </motion.span>
        )}
      </div>

      {/* Wishlist Button */}
      <AnimatePresence>
        <motion.button
          onClick={handleToggleWishlist}
          title={!isAuthenticated ? 'Sign in to add to wishlist' : (isLiked ? 'Remove from wishlist' : 'Add to wishlist')}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100 ${
            isLiked
              ? 'bg-red-500/90 text-white'
              : 'bg-black/40 text-white hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>
      </AnimatePresence>

      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-surface-950 block">
        <motion.img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Add to cart overlay on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <motion.button
            onClick={handleAddToCart}
            disabled={isLoading || !isAuthenticated}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-950/90 backdrop-blur-sm text-white text-sm font-medium border border-white/10 hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {!isAuthenticated ? 'Sign in to add' : 'Quick Add'}
          </motion.button>
        </motion.div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {product.category && (
          <p className="text-[10px] uppercase tracking-widest text-surface-400 mb-1">
            {product.category.name}
          </p>
        )}
        <Link to={`/product/${product.slug}`} className="mb-3 hover:text-brand-400 transition-colors">
          <h3 className="text-sm font-medium text-white line-clamp-1">{product.name}</h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-white">
              ₹{price.toLocaleString('en-IN')}
            </p>
            {comparePrice && (
              <p className="text-xs text-surface-500 line-through">
                ₹{comparePrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>
          {/* Small wishlist button for non-hover state */}
          <motion.button
            onClick={handleAddToCart}
            disabled={isLoading || !isAuthenticated}
            title={!isAuthenticated ? 'Sign in to add to cart' : 'Add to cart'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl bg-surface-800 text-white hover:bg-brand-500 hover:text-black transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <AddToWishlistModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        product={product}
      />
    </motion.div>
  );
}
