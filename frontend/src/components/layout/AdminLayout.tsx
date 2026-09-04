import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Customers', icon: Users, href: '/admin/users' },
  { label: 'Categories', icon: Tag, href: '/admin/categories' },
  { label: 'Analytics', icon: BarChart2, href: '/admin/analytics' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link to="/admin" className="flex items-center gap-3">
          <img src="/the-aisle.png" alt="The Aisle" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-bold text-white text-base">The Aisle</span>
            <span className="text-[10px] font-medium text-surface-400 block tracking-widest uppercase">Admin</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-surface-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-brand-400' : 'text-surface-500 group-hover:text-white'}`} />
              {item.label}
              {active && <ChevronRight className="w-4 h-4 ml-auto text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-surface-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" />
          Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign Out
        </button>

        {/* User info */}
        {user && (
          <div className="mt-4 px-3 py-3 rounded-xl bg-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 text-black flex items-center justify-center font-bold text-xs shrink-0">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-surface-900 border-r border-white/5">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-surface-900 border-r border-white/5 z-50 flex flex-col lg:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 flex items-center gap-4 px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-surface-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-500/20 text-brand-400 uppercase tracking-wider">
            Admin Panel
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
