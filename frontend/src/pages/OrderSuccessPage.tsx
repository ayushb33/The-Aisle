import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn } from '@/components/animation/Transitions';
import { Button } from '@/components/ui';

export function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-20 lg:py-32 flex justify-center">
          <FadeIn>
            <div className="bg-surface-900 border border-surface-800 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
              <p className="text-surface-300 mb-8">
                Thank you for your purchase. We've received your order and will start processing it right away.
              </p>

              <div className="bg-surface-950 border border-surface-800 rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm text-surface-400 mb-1">Order Number</p>
                <p className="text-xl font-mono font-semibold text-white mb-4">{orderNumber}</p>
                
                <p className="text-sm text-surface-400 mb-1">Estimated Delivery</p>
                <p className="text-base font-medium text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-400" /> 
                  Within 3-5 business days
                </p>
              </div>

              <div className="space-y-4">
                <Link to="/shop">
                  <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continue Shopping
                  </Button>
                </Link>
                {/* Once we build Phase 8, we can link to the order history */}
                {/* <Link to="/account/orders" className="block text-sm text-brand-400 hover:underline">
                  View Order Details
                </Link> */}
              </div>
            </div>
          </FadeIn>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
