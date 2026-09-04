import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Package, Calendar, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface UserOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: {
    productName: string;
    product: {
      images: { url: string }[];
    } | null;
  }[];
}

interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  orders: UserOrder[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-purple-500/20 text-purple-400',
  SHIPPED: 'bg-indigo-500/20 text-indigo-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/users/${id}`)
      .then(res => setUser(res.data.data.user))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-surface-400">Loading user details...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (!user) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h1 className="text-xl font-bold text-white">User not found</h1>
            <Link to="/admin/users">
              <Button variant="outline">Back to Users</Button>
            </Link>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  const totalSpent = user.orders.reduce((acc, order) => {
    // Only count non-cancelled orders for lifetime value
    if (order.status !== 'CANCELLED') {
      return acc + parseFloat(order.total);
    }
    return acc;
  }, 0);

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-5xl mx-auto pb-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/users" className="p-2 rounded-xl bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Customer Profile</h1>
              <p className="text-surface-400 mt-1">View history and statistics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile Card */}
            <div className="space-y-6">
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-3xl mb-4">
                  {user.firstName[0]}
                </div>
                <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                <p className="text-surface-400 text-sm mb-4">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'ADMIN' ? 'bg-brand-500/20 text-brand-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {user.role}
                </span>

                <div className="mt-6 pt-6 border-t border-white/5 text-left space-y-4">
                  <div>
                    <p className="text-sm text-surface-400 flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" /> Member Since
                    </p>
                    <p className="font-medium text-white pl-6">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-400 flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4" /> Total Orders
                    </p>
                    <p className="font-medium text-white pl-6">{user.orders.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-400 flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" /> Lifetime Value
                    </p>
                    <p className="font-medium text-brand-400 text-lg pl-6">₹{totalSpent.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order History */}
            <div className="lg:col-span-2">
              <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <h2 className="font-semibold text-white">Order History</h2>
                </div>
                
                {user.orders.length === 0 ? (
                  <div className="p-10 text-center text-surface-400">
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {user.orders.map(order => (
                      <Link 
                        key={order.id} 
                        to={`/admin/orders/${order.id}`}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors block"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-3">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-900 bg-surface-800 overflow-hidden">
                                <img 
                                  src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/40?text=Item'} 
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-10 h-10 rounded-full border-2 border-surface-900 bg-surface-800 flex items-center justify-center text-xs font-medium text-surface-300">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white mb-0.5">#{order.orderNumber}</p>
                            <p className="text-xs text-surface-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                            {order.status}
                          </span>
                          <span className="font-semibold text-white text-right">
                            ₹{parseFloat(order.total).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
