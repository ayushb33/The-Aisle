import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, ArrowUpRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, SlideIn } from '@/components/animation/Transitions';
import { Button } from '@/components/ui';

const features = [
  { icon: Truck,       title: 'Free Shipping',   desc: 'On orders over ₹999' },
  { icon: RotateCcw,   title: 'Easy Returns',    desc: '30-day return policy' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
];

const categories = [
  { name: 'Clothing',    emoji: '👕', href: '/category/clothing',    color: 'from-purple-500/20 to-purple-500/5' },
  { name: 'Accessories', emoji: '👜', href: '/category/accessories', color: 'from-amber-500/20 to-amber-500/5' },
  { name: 'Footwear',   emoji: '👟', href: '/category/footwear',    color: 'from-blue-500/20 to-blue-500/5' },
  { name: 'Electronics', emoji: '📱', href: '/category/electronics', color: 'from-green-500/20 to-green-500/5' },
  { name: 'Home',        emoji: '🏠', href: '/category/home-living', color: 'from-rose-500/20 to-rose-500/5' },
];

export function HomePage() {
  return (
    <MainLayout>
      <PageTransition>

        {/* ─── Hero ──────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Multi-layer gradient orbs for depth */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-purple-600/8 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
            <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
          </div>

          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
            aria-hidden="true"
          />

          <div className="container-app relative z-10 py-24">
            <div className="max-w-3xl">
              {/* Pre-headline badge */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900 border border-brand-500/20 text-surface-300 text-sm mb-8 shadow-lg shadow-brand-500/5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>New Collection — Summer 2026</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse ml-1" />
              </motion.div>

              {/* Headline — staggered word reveal */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06] mb-6"
              >
                Style That
                <br />
                <span className="text-gradient-brand">Speaks Volumes</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg text-surface-400 max-w-xl leading-relaxed mb-10"
              >
                Curated collections for the discerning shopper. Premium quality, modern design, and timeless style — all in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link to="/shop">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/new-arrivals">
                  <Button variant="outline" size="lg">
                    New Arrivals
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof micro-stat */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-4 mt-10"
              >
                <div className="flex -space-x-2.5">
                  {['#f59e0b', '#6366f1', '#10b981', '#ef4444'].map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-surface-950"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <p className="text-sm text-surface-400">
                  <span className="text-white font-semibold">10,000+</span> happy customers
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Feature Strip ─────────────────────────────────── */}
        <FadeIn>
          <section className="border-y border-surface-800 py-8 bg-surface-900/40 backdrop-blur-sm">
            <div className="container-app">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-surface-800/50">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-4 py-4 sm:py-0 sm:px-6 first:pt-0 last:pb-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="p-3 rounded-xl bg-surface-800 text-brand-400 shrink-0"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-white text-sm">{title}</p>
                      <p className="text-xs text-surface-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ─── Categories Preview ─────────────────────────────── */}
        <section className="container-app py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-400 font-medium mb-2">Browse</p>
                <h2 className="text-3xl font-bold text-white">Shop by Category</h2>
              </div>
              <Link
                to="/shop"
                className="group text-sm text-surface-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <StaggerItem key={cat.name}>
                <Link
                  to={cat.href}
                  className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-b ${cat.color} border border-surface-800 hover:border-surface-600 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-black/20`}
                >
                  <motion.span
                    className="text-4xl"
                    whileHover={{ scale: 1.2, rotate: [-3, 3, 0] }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    {cat.emoji}
                  </motion.span>
                  <span className="text-sm font-medium text-surface-200 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── Promotional Banner ──────────────────────────────── */}
        <SlideIn from="bottom" className="container-app pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900/30 via-surface-900 to-surface-950 border border-brand-500/20 p-10 md:p-16">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-56 bg-brand-500/12 blur-[100px]" />
            </div>

            {/* Decorative corner rings */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border border-brand-500/10 pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-brand-500/15 pointer-events-none" />

            <div className="relative z-10 text-center">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-xs uppercase tracking-widest text-brand-400 font-medium mb-3">Sale ends soon</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                    Up to <span className="text-gradient-brand">40% Off</span>
                    <br />
                    <span className="text-2xl md:text-3xl font-bold">on New Arrivals</span>
                  </h2>
                  <p className="text-surface-400 max-w-md mx-auto mb-8">
                    Shop the latest styles at the best prices. Limited time — don't miss out.
                  </p>
                  <Link to="/sale">
                    <Button
                      size="lg"
                      rightIcon={<ArrowUpRight className="w-4 h-4" />}
                    >
                      Shop the Sale
                    </Button>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </SlideIn>

      </PageTransition>
    </MainLayout>
  );
}
