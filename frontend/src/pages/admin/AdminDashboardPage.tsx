import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  images: { url: string }[];
}

interface OrderStatusCount {
  status: string;
  _count: { status: number };
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  ordersByStatus: OrderStatusCount[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-purple-500/20 text-purple-400',
  SHIPPED: 'bg-indigo-500/20 text-indigo-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

function StatCard({ label, value, icon: Icon, prefix = '', suffix = '', color }: { label: string; value: string | number; icon: any; prefix?: string; suffix?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-900 border border-white/5 rounded-2xl p-6 flex items-start gap-5"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-surface-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white tabular-nums">
          {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
        </p>
      </div>
    </motion.div>
  );
}

export function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-surface-400 mt-1">Welcome back. Here's what's happening today.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface-900 border border-white/5 rounded-2xl p-6 h-24 animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard label="Total Revenue" value={data.stats.totalRevenue.toFixed(2)} icon={TrendingUp} prefix="₹" color="bg-emerald-500/15 text-emerald-400" />
                <StatCard label="Total Orders" value={data.stats.totalOrders} icon={ShoppingCart} color="bg-blue-500/15 text-blue-400" />
                <StatCard label="Customers" value={data.stats.totalUsers} icon={Users} color="bg-purple-500/15 text-purple-400" />
                <StatCard label="Products" value={data.stats.totalProducts} icon={Package} color="bg-orange-500/15 text-orange-400" />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="font-semibold text-white">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm text-brand-400 hover:underline flex items-center gap-1">
                      View all <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="divide-y divide-white/5">
                    {data.recentOrders.length === 0 ? (
                      <div className="px-6 py-10 text-center text-surface-400">No orders yet</div>
                    ) : (
                      data.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium text-white text-sm">{order.orderNumber}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-surface-400">
                              {order.user.firstName} {order.user.lastName} · {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-white text-sm">₹{parseFloat(order.total).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Orders by Status */}
                  <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
                    <h2 className="font-semibold text-white mb-5">Orders by Status</h2>
                    <div className="space-y-3">
                      {data.ordersByStatus.map((item) => (
                        <div key={item.status} className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${STATUS_COLORS[item.status] || 'bg-gray-500/20 text-gray-400'}`}>
                            {item.status}
                          </span>
                          <span className="text-sm font-semibold text-white tabular-nums">
                            {item._count.status}
                          </span>
                        </div>
                      ))}
                      {data.ordersByStatus.length === 0 && (
                        <p className="text-sm text-surface-400">No orders yet</p>
                      )}
                    </div>
                  </div>

                  {/* Low Stock */}
                  <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <h2 className="font-semibold text-white">Low Stock Alert</h2>
                    </div>
                    {data.lowStockProducts.length === 0 ? (
                      <p className="text-sm text-surface-400">All products are well-stocked!</p>
                    ) : (
                      <div className="space-y-3">
                        {data.lowStockProducts.map((product) => (
                          <div key={product.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-800 overflow-hidden border border-white/5">
                              {product.images?.[0]?.url && (
                                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{product.name}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              product.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {product.stock === 0 ? 'Out' : `${product.stock} left`}
                            </span>
                          </div>
                        ))}
                        <Link
                          to="/admin/products"
                          className="flex items-center gap-1 text-xs text-brand-400 hover:underline mt-2"
                        >
                          Manage inventory <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
