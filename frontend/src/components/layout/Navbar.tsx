import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import FoldText from '@/components/ui/FoldText';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Sale', href: '/sale' },
];

const categories = [
  { label: 'Clothing', href: '/category/clothing' },
  { label: 'Accessories', href: '/category/accessories' },
  { label: 'Footwear', href: '/category/footwear' },
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Home & Living', href: '/category/home-living' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const cartCount = cart.itemCount;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);

  // Scroll-based navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-surface-950/95 backdrop-blur-lg border-b border-surface-800 shadow-xl shadow-black/20'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0 group">
              <img src="/the-aisle.png" alt="The Aisle" className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105" />
              <div className="hidden sm:block">
                <FoldText
                  text="The Aisle"
                  splitBy="char"
                  hinge="top"
                  trigger="mount"
                  duration={2.5}
                  stagger={0.04}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.45}
                  fontSize={28}
                  fontWeight={600}
                  color="#ffffff"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800/60 transition-all duration-150">
                  Categories
                  <ChevronDown
                    className={['w-4 h-4 transition-transform duration-200', categoriesOpen ? 'rotate-180' : ''].join(' ')}
                  />
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-1 w-52 bg-surface-900 border border-surface-800 rounded-2xl shadow-2xl shadow-black/40 py-2 overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <NavLink
                          key={cat.href}
                          to={cat.href}
                          className={({ isActive }) =>
                            [
                              'flex items-center px-4 py-2.5 text-sm transition-colors duration-100',
                              isActive
                                ? 'text-brand-400 bg-brand-500/10'
                                : 'text-surface-300 hover:text-white hover:bg-surface-800',
                            ].join(' ')
                          }
                        >
                          {cat.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    [
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'text-white bg-surface-800'
                        : 'text-surface-300 hover:text-white hover:bg-surface-800/60',
                    ].join(' ')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Action Icons */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { to: '/search', icon: Search, label: 'Search' },
                { to: '/wishlist', icon: Heart, label: 'Wishlist' },
              ].map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={label}
                  className="p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </NavLink>
              ))}

              {/* Cart with live badge */}
              <NavLink
                to="/cart"
                className="relative p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {isAuthenticated && cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-black text-[9px] font-black rounded-full flex items-center justify-center leading-none"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>

              <NavLink
                to="/account"
                className="p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </NavLink>
            </div>

            {/* Mobile: icons + burger */}
            <div className="flex lg:hidden items-center gap-1">
              <NavLink to="/search" className="p-2.5 rounded-xl text-surface-400 hover:text-white transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </NavLink>
              <NavLink to="/cart" className="p-2.5 rounded-xl text-surface-400 hover:text-white transition-colors" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
              </NavLink>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 z-40 w-[min(320px,90vw)] bg-surface-950 border-l border-surface-800 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-surface-800 shrink-0">
                <span className="text-sm font-semibold text-white tracking-widest uppercase">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 pb-2">
                  <p className="text-[10px] uppercase tracking-widest text-surface-500 font-medium px-2 mb-2">Categories</p>
                  {categories.map((cat) => (
                    <NavLink
                      key={cat.href}
                      to={cat.href}
                      className={({ isActive }) =>
                        [
                          'flex items-center px-4 py-3 rounded-xl text-sm transition-colors',
                          isActive
                            ? 'text-brand-400 bg-brand-500/10 font-medium'
                            : 'text-surface-300 hover:text-white hover:bg-surface-900',
                        ].join(' ')
                      }
                    >
                      {cat.label}
                    </NavLink>
                  ))}
                </div>

                <div className="divider mx-4 my-3" />

                <div className="px-4">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={({ isActive }) =>
                        [
                          'flex items-center px-4 py-3 rounded-xl text-sm transition-colors',
                          isActive
                            ? 'text-white bg-surface-800 font-medium'
                            : 'text-surface-300 hover:text-white hover:bg-surface-900',
                        ].join(' ')
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                <div className="divider mx-4 my-3" />

                <div className="px-4">
                  <NavLink
                    to="/account"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-surface-300 hover:text-white hover:bg-surface-900 transition-colors"
                  >
                    <User className="w-4 h-4" /> Account
                  </NavLink>
                  <NavLink
                    to="/wishlist"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-surface-300 hover:text-white hover:bg-surface-900 transition-colors"
                  >
                    <Heart className="w-4 h-4" /> Wishlist
                  </NavLink>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
