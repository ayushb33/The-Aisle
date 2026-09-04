import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export function Card({ children, className = '', hover = false, onClick, padding = 'md' }: CardProps) {
  const base = [
    'rounded-2xl border bg-surface-900/80 border-surface-800',
    'transition-all duration-200',
    hover ? 'hover:border-surface-700 hover:bg-surface-900 hover:shadow-xl hover:shadow-black/30 cursor-pointer' : '',
    paddingStyles[padding],
    className,
  ].join(' ');

  if (hover || onClick) {
    return (
      <motion.div
        className={base}
        whileHover={{ y: -2 }}
        whileTap={onClick ? { scale: 0.99 } : undefined}
        onClick={onClick}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}

// ─── Stat Card ────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label?: string };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-surface-400 font-medium">{label}</p>
        {icon && (
          <div className="p-2 rounded-xl bg-surface-800 text-surface-400">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {trend && (
        <p className={['text-xs font-medium', isPositive ? 'text-emerald-400' : 'text-red-400'].join(' ')}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          {trend.label && <span className="text-surface-500 font-normal ml-1">{trend.label}</span>}
        </p>
      )}
    </Card>
  );
}
