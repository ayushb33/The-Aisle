import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';

export function CartDrawer() {
  const { cart, isLoading, isDrawerOpen, closeDrawer, fetchCart, updateItem, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch cart when drawer opens and user is logged in
  useEffect(() => {
    if (isDrawerOpen && isAuthenticated) {
      fetchCart();
    }
  }, [isDrawerOpen, isAuthenticated, fetchCart]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-surface-950 border-l border-surface-800 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-surface-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                {cart.itemCount > 0 && (
                  <motion.span
                    key={cart.itemCount}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="px-2.5 py-0.5 rounded-full bg-brand-500 text-black text-xs font-bold"
                  >
                    {cart.itemCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="w-14 h-14 text-surface-600" />
                  <p className="text-surface-300 font-medium">Sign in to view your cart</p>
                  <Link to="/login" onClick={closeDrawer}>
                    <Button>Sign In</Button>
                  </Link>
                </div>
              ) : cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ShoppingBag className="w-16 h-16 text-surface-700 mx-auto" />
                  </motion.div>
                  <p className="text-lg font-medium text-white">Your cart is empty</p>
                  <p className="text-sm text-surface-400">Add some products to get started</p>
                  <Link to="/shop" onClick={closeDrawer}>
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {cart.items.map((item) => {
                      const price = parseFloat(item.product.price);
                      const imageUrl = item.product.images?.[0]?.url;
                      return (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4 p-4 bg-surface-900 rounded-2xl border border-surface-800"
                        >
                          {/* Image */}
                          <Link to={`/product/${item.product.slug}`} onClick={closeDrawer} className="shrink-0">
                            <div className="w-20 h-24 rounded-xl overflow-hidden bg-surface-800">
                              {imageUrl ? (
                                <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-surface-600">
                                  <ShoppingBag className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.product.slug}`} onClick={closeDrawer}>
                              <p className="text-sm font-medium text-white line-clamp-2 hover:text-brand-400 transition-colors">
                                {item.product.name}
                              </p>
                            </Link>
                            <p className="text-sm font-semibold text-white mt-1">
                              ₹{(price * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-surface-400">₹{price.toLocaleString('en-IN')} each</p>

                            {/* Quantity + Remove */}
                            <div className="flex items-center gap-3 mt-3">
                              <div className="flex items-center gap-1 bg-surface-800 rounded-lg p-1">
                                <button
                                  onClick={() => updateItem(item.id, item.quantity - 1)}
                                  disabled={isLoading || item.quantity <= 1}
                                  className="p-1.5 rounded text-surface-300 hover:text-white hover:bg-surface-700 transition-colors disabled:opacity-40"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateItem(item.id, item.quantity + 1)}
                                  disabled={isLoading || item.quantity >= item.product.stock}
                                  className="p-1.5 rounded text-surface-300 hover:text-white hover:bg-surface-700 transition-colors disabled:opacity-40"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                disabled={isLoading}
                                className="p-1.5 text-surface-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {isAuthenticated && cart.items.length > 0 && (
              <div className="border-t border-surface-800 p-6 space-y-4">
                <div className="flex justify-between text-sm text-surface-400">
                  <span>{cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}</span>
                  <span>Free shipping on orders over ₹999</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-surface-300">Subtotal</span>
                  <span className="text-2xl font-bold text-white">
                    ₹{cart.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="space-y-3">
                  <Link to="/cart" onClick={closeDrawer}>
                    <Button variant="outline" fullWidth>
                      View Full Cart
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={closeDrawer}>
                    <Button fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
