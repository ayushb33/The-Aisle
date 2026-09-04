import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { CartDrawer } from '@/components/cart/CartDrawer';

import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { SearchPage } from '@/pages/SearchPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { AccountPage } from '@/pages/AccountPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminOrderDetailsPage } from '@/pages/admin/AdminOrderDetailsPage';
import { AdminUserDetailsPage } from '@/pages/admin/AdminUserDetailsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { isAuthenticated } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlists = useWishlistStore((state) => state.fetchWishlists);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlists();
    }
  }, [isAuthenticated, fetchCart, fetchWishlists]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartDrawer />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/new-arrivals" element={<ShopPage />} />
            <Route path="/sale" element={<ShopPage />} />
            <Route path="/category/:slug" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            
            {/* Cart & Wishlist */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            
            {/* Checkout, Orders — Phase 7-8 */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
            <Route path="/account/orders/:id" element={<OrderDetailPage />} />

            {/* Admin — Phase 9+ */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<AdminProductFormPage />} />
            <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
