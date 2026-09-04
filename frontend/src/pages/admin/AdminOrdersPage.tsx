import { useEffect, useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';

interface OrderUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  user: OrderUser & { id?: string };
  items: { id: string; productName: string; quantity: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-purple-500/20 text-purple-400',
  SHIPPED: 'bg-indigo-500/20 text-indigo-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/orders').then(res => {
      setOrders(res.data.data.orders);
    }).finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.user.email.toLowerCase().includes(search.toLowerCase()) ||
    `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Orders</h1>
              <p className="text-surface-400 mt-1">Manage and update order statuses</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-900 border border-white/5 rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="text-center py-16 text-surface-400">Loading orders...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                <p className="text-surface-400">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Order</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Items</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Total</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((order) => (
                      <tr key={order.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/admin/orders/${order.id}`} className="font-mono font-medium text-brand-400 hover:underline">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/admin/users/${order.user.id || ''}`} className="font-medium text-white hover:text-brand-400 transition-colors">
                            {order.user.firstName} {order.user.lastName}
                          </Link>
                          <p className="text-xs text-surface-400 mt-0.5">{order.user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-surface-300">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">₹{parseFloat(order.total).toLocaleString('en-IN')}</span>
                        </td>
                        <td className="px-6 py-4 text-surface-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-400'}`}
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s} className="bg-surface-900 text-white">{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
