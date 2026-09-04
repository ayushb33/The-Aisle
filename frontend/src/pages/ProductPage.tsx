import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronRight, Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn } from '@/components/animation/Transitions';
import { Button, Skeleton, ErrorState } from '@/components/ui';
import { useProduct } from '@/lib/queries';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductReviews } from '@/components/product/ProductReviews';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { wishlists, addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();

  const isLiked = product ? isInWishlist(product.id) : false;

  const handleAddToCart = async () => {
    if (!isAuthenticated || !product) return;
    await addItem(product.id, quantity);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated || !product) return;
    const defaultWishlist = wishlists[0];
    if (!defaultWishlist) return;

    if (isLiked) {
      await removeWishlistItem(defaultWishlist.id, product.id);
    } else {
      await addWishlistItem(defaultWishlist.id, product.id);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-app py-12">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-[4/5] rounded-3xl" />
            <div className="space-y-6 pt-8">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-3/4 h-12" />
              <Skeleton className="w-1/3 h-8" />
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="py-20">
          <ErrorState message="Product not found or unavailable." />
          <div className="mt-8 text-center">
            <Link to="/shop">
              <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Shop</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const inStock = product.stock > 0;

  return (
    <MainLayout>
      <PageTransition>
        
        {/* Breadcrumbs */}
        <div className="bg-surface-900 border-b border-surface-800 py-4">
          <div className="container-app">
            <nav className="flex items-center gap-2 text-sm text-surface-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
              {product.category && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <Link to={`/shop?category=${product.category.slug}`} className="hover:text-white transition-colors">
                    {product.category.name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-surface-200 truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-app py-12 lg:py-16">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Left: Image Gallery */}
            <FadeIn direction="right">
              <div className="flex flex-col-reverse sm:flex-row gap-4">
                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 shrink-0 hide-scrollbar">
                    {product.images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-brand-400' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Main Image with animated cross-fade */}
                <div className="relative flex-1 aspect-[4/5] sm:aspect-auto sm:h-[600px] rounded-3xl overflow-hidden bg-surface-900">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={product.images[selectedImage]?.url || 'https://via.placeholder.com/800'}
                      alt={product.name}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full object-cover object-center"
                    />
                  </AnimatePresence>
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {comparePrice && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase bg-red-500 text-white rounded-lg shadow-lg"
                      >
                        Sale
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right: Product Info */}
            <FadeIn direction="left" delay={0.1}>
              <div className="flex flex-col h-full">
                {product.brand && (
                  <p className="text-sm font-semibold text-brand-400 uppercase tracking-widest mb-2">
                    {product.brand}
                  </p>
                )}
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price and Rating */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-semibold text-white">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {comparePrice && (
                      <span className="text-lg text-surface-400 line-through mb-1">
                        ₹{comparePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-surface-800 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-white">4.8</span>
                    <span className="text-xs text-surface-400 ml-1">(124 reviews)</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-surface-300 leading-relaxed mb-8">
                  {product.description || product.shortDesc}
                </p>

                <div className="divider mb-8" />

                {/* Actions */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-surface-900 border border-surface-700 rounded-xl overflow-hidden h-14">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        whileTap={{ scale: 0.85, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        className="px-4 h-full text-xl text-surface-300 hover:text-white transition-colors"
                        disabled={!inStock}
                        aria-label="Decrease quantity"
                      >
                        −
                      </motion.button>
                      <span className="w-12 text-center font-semibold text-white tabular-nums">{quantity}</span>
                      <motion.button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        whileTap={{ scale: 0.85, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        className="px-4 h-full text-xl text-surface-300 hover:text-white transition-colors"
                        disabled={!inStock}
                        aria-label="Increase quantity"
                      >
                        +
                      </motion.button>
                    </div>
                    
                    <Button 
                      size="xl" 
                      className="flex-1"
                      leftIcon={<ShoppingBag className="w-5 h-5" />}
                      disabled={!inStock || cartLoading || !isAuthenticated}
                      loading={cartLoading}
                      onClick={handleAddToCart}
                    >
                      {!isAuthenticated ? 'Sign in to add' : inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    
                    <button 
                      onClick={handleToggleWishlist}
                      title={!isAuthenticated ? "Sign in to add to wishlist" : (isLiked ? "Remove from wishlist" : "Add to wishlist")}
                      className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-xl border transition-all ${
                        isLiked 
                          ? 'border-red-400 bg-red-500/10 text-red-400' 
                          : 'border-surface-700 bg-surface-900 text-surface-300 hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  {inStock ? (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      In Stock — Ships within 24 hours
                    </p>
                  ) : (
                    <p className="text-sm text-red-400">Currently out of stock.</p>
                  )}
                </div>

                <div className="divider mb-8" />

                {/* Value Props */}
                <div className="grid sm:grid-cols-2 gap-4 mt-auto">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-900 border border-surface-800">
                    <Truck className="w-5 h-5 text-brand-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Free Shipping</p>
                      <p className="text-xs text-surface-400">On orders over ₹999</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-900 border border-surface-800">
                    <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">2 Year Warranty</p>
                      <p className="text-xs text-surface-400">Full coverage included</p>
                    </div>
                  </div>
                </div>

              </div>
            </FadeIn>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <ProductReviews productId={product.id} slug={product.slug} />
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
