import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle2, CreditCard, Truck } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn } from '@/components/animation/Transitions';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { currentOrder, fetchOrder, isLoading } = useOrderStore();

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrder(id);
    } else if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [id, isAuthenticated, fetchOrder, navigate]);

  if (isLoading || !currentOrder) {
    return (
      <MainLayout>
        <div className="container-app py-32 flex justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const order = currentOrder;

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-10 lg:py-12 max-w-4xl">
          <Link to="/account" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>

          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Order {order.orderNumber}</h1>
                <p className="text-surface-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2 ${
                order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {order.status === 'DELIVERED' ? <CheckCircle2 className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                {order.status}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Items List */}
              <div className="md:col-span-2 bg-surface-900 border border-surface-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6 border-b border-surface-800 pb-4">Items Ordered</h3>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-surface-800 overflow-hidden shrink-0 border border-surface-700">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-surface-600">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Link to={`/product/${item.productId}`} className="font-medium text-white hover:text-brand-400 transition-colors line-clamp-2 mb-1">
                          {item.productName}
                        </Link>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-surface-400">Qty: {item.quantity}</span>
                          <span className="font-semibold text-white">₹{parseFloat(item.totalPrice).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info Sidebar */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Summary */}
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Summary</h3>
                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-surface-400">Subtotal</span>
                      <span className="text-white">₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-400">Shipping</span>
                      <span className="text-white">₹{parseFloat(order.shippingCost).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-400">Discount</span>
                      <span className="text-green-400">-₹{parseFloat(order.discount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-surface-800 flex justify-between items-center font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-brand-400 text-xl">₹{parseFloat(order.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-surface-400" /> Payment
                  </h3>
                  {(order as any).payment ? (
                    <div>
                      <p className="text-sm text-surface-300 mb-2">
                        Method: <span className="text-white font-medium">{(order as any).payment.method}</span>
                      </p>
                      <p className="text-sm text-surface-300 mb-2">
                        Status: <span className={`font-bold ${(order as any).payment.status === 'COMPLETED' ? 'text-green-400' : 'text-red-400'}`}>
                          {(order as any).payment.status}
                        </span>
                      </p>
                      <p className="text-xs text-surface-500 font-mono break-all">
                        Ref: {(order as any).payment.transactionId}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-surface-400">Payment details unavailable.</p>
                  )}
                </div>

                {/* Shipping Info */}
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-surface-400" /> Shipping
                  </h3>
                  {(order as any).shippingAddress ? (
                    <div className="text-sm text-surface-300 leading-relaxed">
                      <span className="font-bold text-white block mb-1">{(order as any).shippingAddress.name}</span>
                      {(order as any).shippingAddress.street}<br/>
                      {(order as any).shippingAddress.city}, {(order as any).shippingAddress.state} {(order as any).shippingAddress.postalCode}<br/>
                      {(order as any).shippingAddress.country}<br/>
                      <span className="text-surface-400 mt-2 block">📞 {(order as any).shippingAddress.phone}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-surface-400">Shipping details unavailable.</p>
                  )}
                </div>

              </div>
            </div>

          </FadeIn>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
