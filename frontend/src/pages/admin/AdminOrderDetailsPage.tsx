import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  product: {
    images: { url: string }[];
  } | null;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
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

export function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/orders/${id}`)
      .then(res => setOrder(res.data.data.order))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await api.patch(`/admin/orders/${order.id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-surface-400">Loading order details...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (!order) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h1 className="text-xl font-bold text-white">Order not found</h1>
            <Link to="/admin/orders">
              <Button variant="outline">Back to Orders</Button>
            </Link>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-5xl mx-auto pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to="/admin/orders" className="p-2 rounded-xl bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  Order #{order.orderNumber}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                    {order.status}
                  </span>
                </h1>
                <p className="text-surface-400 mt-1 flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="bg-surface-900 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 disabled:opacity-50"
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items & Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items List */}
              <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-400" />
                  <h2 className="font-semibold text-white">Order Items ({order.items.length})</h2>
                </div>
                <div className="divide-y divide-white/5">
                  {order.items.map(item => (
                    <div key={item.id} className="p-5 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-surface-800 overflow-hidden shrink-0 border border-white/5">
                        <img 
                          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100?text=Item'} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white line-clamp-1">{item.productName}</p>
                        <p className="text-sm text-surface-400 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                        <p className="text-sm text-surface-400 mt-1">Total: ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Customer & Payment */}
            <div className="space-y-6">
              {/* Customer summary */}
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-brand-400" />
                  <h2 className="font-semibold text-white">Customer</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                      {order.user.firstName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{order.user.firstName} {order.user.lastName}</p>
                      <p className="text-sm text-surface-400">{order.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-brand-400" />
                  <h2 className="font-semibold text-white">Shipping Address</h2>
                </div>
                <div className="text-sm text-surface-300 space-y-1">
                  <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2 flex items-center gap-2 text-surface-400">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-brand-400" />
                  <h2 className="font-semibold text-white">Payment Details</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-surface-300">
                    <span>Method</span>
                    <span className="font-medium text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-surface-300">
                    <span>Status</span>
                    <span className="flex items-center gap-1.5 font-medium text-green-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex justify-between">
                    <span className="font-medium text-white">Total</span>
                    <span className="font-bold text-brand-400 text-lg">₹{parseFloat(order.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
