import { motion } from 'framer-motion';

// ─── Shared shimmer keyframe (defined in CSS, referenced here) ─────
// Add to index.css: @keyframes shimmer { ... }

// ─── Skeleton ─────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  if (lines <= 1) {
    return (
      <div
        className={['rounded-lg bg-surface-800 animate-pulse relative overflow-hidden', className].join(' ')}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
          className={['h-4 rounded-lg bg-surface-800 animate-pulse relative overflow-hidden', className].join(' ')}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      ))}
    </div>
  );
}

// ─── Product Card Skeleton ─────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-900 border border-surface-800 overflow-hidden">
      <div className="aspect-[4/5] relative overflow-hidden bg-surface-800">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between mt-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Page Loader ──────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative w-12 h-12">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-500/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-sm text-surface-400">Loading…</p>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeMap = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-[3px]' };
  return (
    <motion.div
      className={[
        'rounded-full border-surface-700 border-t-brand-400',
        sizeMap[size],
        className,
      ].join(' ')}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
    />
  );
}
