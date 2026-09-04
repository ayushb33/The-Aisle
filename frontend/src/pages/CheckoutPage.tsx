import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, MapPin, CreditCard } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition } from '@/components/animation/Transitions';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useAddressStore } from '@/store/addressStore';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { createOrder, processPayment, isLoading } = useCheckoutStore();
  const { addresses, fetchAddresses } = useAddressStore();
  
  const [step, setStep] = useState(1);
  const [addressId, setAddressId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('DEMO_CARD');
  
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchAddresses();
    }
  }, [isAuthenticated, fetchCart, fetchAddresses]);

  useEffect(() => {
    if (addresses.length > 0 && !addressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setAddressId(defaultAddr.id);
    }
  }, [addresses, addressId]);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container-app py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
          <Link to="/login"><Button>Sign In</Button></Link>
        </div>
      </MainLayout>
    );
  }

  if (cart.items.length === 0 && step === 1) {
    return (
      <MainLayout>
        <div className="container-app py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-surface-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/shop"><Button>Browse Shop</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const handleCreateOrder = async () => {
    setError(null);
    if (!addressId) {
      setError('Please select a delivery address');
      return;
    }
    const order = await createOrder({ addressId, notes });
    if (order) {
      setOrderId(order.id);
      setStep(2);
    } else {
      setError('Failed to create order. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!orderId) return;
    setError(null);
    const order = await processPayment(orderId, paymentMethod);
    if (order && order.status === 'CONFIRMED') {
      // Clear cart locally since it's cleared on the server
      await fetchCart();
      navigate(`/order-success/${order.orderNumber}`);
    } else {
      setError('Payment failed. Please try a different method.');
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-10 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
            
            {/* Stepper */}
            <div className="flex items-center gap-4 mb-10">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-400' : 'text-surface-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-brand-500 text-black' : 'bg-surface-800'}`}>1</div>
                <span className="font-medium hidden sm:inline">Shipping</span>
              </div>
              <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-brand-500' : 'bg-surface-800'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-400' : 'text-surface-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-brand-500 text-black' : 'bg-surface-800'}`}>2</div>
                <span className="font-medium hidden sm:inline">Payment</span>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column (Forms) */}
              <div className="lg:col-span-2">
                {step === 1 ? (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-400" />
                      Shipping Details
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-2">Delivery Address</label>
                        {addresses.length === 0 ? (
                          <div className="bg-surface-950 border border-surface-700 rounded-xl p-4 text-center">
                            <p className="text-surface-400 mb-2">You don't have any saved addresses.</p>
                            <Link to="/account" className="text-brand-400 hover:underline text-sm font-medium">
                              Add an address in your account
                            </Link>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {addresses.map(addr => (
                              <label key={addr.id} className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                addressId === addr.id ? 'border-brand-500 bg-brand-500/5' : 'border-surface-700 bg-surface-950'
                              }`}>
                                <input type="radio" name="address" value={addr.id} checked={addressId === addr.id} onChange={() => setAddressId(addr.id)} className="w-4 h-4 mt-1 accent-brand-500" />
                                <div className="text-sm">
                                  <p className="font-bold text-white mb-1">{addr.fullName} <span className="text-surface-400 font-normal text-xs ml-2">({addr.label})</span></p>
                                  <p className="text-surface-300 leading-relaxed">
                                    {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br/>
                                    {addr.city}, {addr.state} {addr.postalCode}<br/>
                                    {addr.country}
                                  </p>
                                  <p className="text-surface-400 mt-1">📞 {addr.phone}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-2">Order Notes (Optional)</label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-surface-950 border border-surface-700 rounded-xl p-4 text-white focus:outline-none focus:border-brand-500"
                          placeholder="Any special instructions?"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button 
                        fullWidth 
                        size="lg" 
                        onClick={handleCreateOrder} 
                        loading={isLoading}
                        disabled={isLoading || addresses.length === 0 || !addressId}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-400" />
                      Payment Method
                    </h2>
                    
                    <div className="space-y-3">
                      {[
                        { id: 'DEMO_CARD', label: 'Credit / Debit Card' },
                        { id: 'DEMO_UPI', label: 'UPI (GPay, PhonePe)' },
                        { id: 'DEMO_NETBANKING', label: 'Net Banking' },
                      ].map((method) => (
                        <label 
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === method.id 
                              ? 'border-brand-500 bg-brand-500/5' 
                              : 'border-surface-700 bg-surface-950 hover:border-surface-500'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value={method.id} 
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="w-5 h-5 accent-brand-500"
                          />
                          <span className="font-medium text-white">{method.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(1)} 
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button 
                        className="flex-1" 
                        size="lg" 
                        onClick={handlePayment} 
                        loading={isLoading}
                        disabled={isLoading}
                        leftIcon={<CheckCircle2 className="w-5 h-5" />}
                      >
                        Pay ₹{(cart.subtotal + (cart.subtotal >= 999 ? 0 : 99) + Math.round(cart.subtotal * 0.18)).toLocaleString('en-IN')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Summary) */}
              <div className="lg:col-span-1">
                <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sticky top-24">
                  <h3 className="font-bold text-white mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-surface-800 overflow-hidden shrink-0 border border-surface-700">
                          {item.product.images?.[0]?.url && (
                            <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white line-clamp-2">{item.product.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-surface-400">Qty: {item.quantity}</span>
                            <span className="text-sm font-semibold text-white">
                              ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-surface-800 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Subtotal</span>
                      <span className="text-white">₹{cart.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Shipping</span>
                      <span className={cart.subtotal >= 999 ? 'text-green-400' : 'text-white'}>
                        {cart.subtotal >= 999 ? 'FREE' : '₹99'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Taxes (GST 18%)</span>
                      <span className="text-white">₹{Math.round(cart.subtotal * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t border-surface-800 pt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-brand-400">
                        ₹{(cart.subtotal + (cart.subtotal >= 999 ? 0 : 99) + Math.round(cart.subtotal * 0.18)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
