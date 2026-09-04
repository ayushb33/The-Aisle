import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition } from '@/components/animation/Transitions';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function CartPage() {
  const { cart, isLoading, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-10 lg:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10">Shopping Cart</h1>

          {!isAuthenticated ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-surface-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-white mb-2">Sign in to view your cart</p>
              <p className="text-surface-400 mb-8">Your cart is waiting for you</p>
              <Link to="/login"><Button size="lg">Sign In</Button></Link>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-surface-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-white mb-2">Your cart is empty</p>
              <p className="text-surface-400 mb-8">Start adding some items!</p>
              <Link to="/shop"><Button size="lg">Browse Shop</Button></Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Item List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-surface-800">
                  <span className="text-sm text-surface-400">{cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}</span>
                  <button
                    onClick={clearCart}
                    disabled={isLoading}
                    className="text-sm text-surface-500 hover:text-red-400 transition-colors"
                  >
                    Clear cart
                  </button>
                </div>

                <AnimatePresence>
                  {cart.items.map((item) => {
                    const price = parseFloat(item.product.price);
                    const imageUrl = item.product.images?.[0]?.url;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-5 p-5 bg-surface-900 rounded-2xl border border-surface-800"
                      >
                        <Link to={`/product/${item.product.slug}`} className="shrink-0">
                          <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-surface-800">
                            {imageUrl ? (
                              <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-surface-600" />
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex justify-between gap-4">
                            <Link to={`/product/${item.product.slug}`}>
                              <h3 className="text-base font-medium text-white hover:text-brand-400 transition-colors line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={isLoading}
                              className="shrink-0 p-1.5 text-surface-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-sm text-surface-400 mt-1">
                            ₹{price.toLocaleString('en-IN')} each
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4">
                            <div className="flex items-center gap-1 bg-surface-800 rounded-xl p-1">
                              <button
                                onClick={() => updateItem(item.id, item.quantity - 1)}
                                disabled={isLoading || item.quantity <= 1}
                                className="p-2 rounded-lg text-surface-300 hover:text-white hover:bg-surface-700 transition-colors disabled:opacity-40"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-semibold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                disabled={isLoading || item.quantity >= item.product.stock}
                                className="p-2 rounded-lg text-surface-300 hover:text-white hover:bg-surface-700 transition-colors disabled:opacity-40"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-lg font-semibold text-white">
                              ₹{(price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Subtotal ({cart.itemCount} items)</span>
                      <span className="text-white">₹{cart.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Shipping</span>
                      <span className={cart.subtotal >= 999 ? 'text-green-400' : 'text-white'}>
                        {cart.subtotal >= 999 ? 'FREE' : '₹99'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Taxes (GST)</span>
                      <span className="text-white">₹{Math.round(cart.subtotal * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t border-surface-800 pt-4 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-white">
                        ₹{(cart.subtotal + (cart.subtotal >= 999 ? 0 : 99) + Math.round(cart.subtotal * 0.18)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link to="/shop" className="block text-center text-sm text-surface-400 hover:text-white transition-colors mt-4">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </MainLayout>
  );
}
