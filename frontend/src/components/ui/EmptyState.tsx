import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, AlertCircle, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={['flex flex-col items-center justify-center py-20 px-6 text-center', className].join(' ')}
    >
      {icon && (
        <div className="mb-6 p-5 rounded-2xl bg-surface-800 text-surface-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-surface-400 max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}

export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingBag className="w-10 h-10" />}
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Start exploring our collection."
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={<Search className="w-10 h-10" />}
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
    />
  );
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }: { message?: string }) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-10 h-10 text-red-400" />}
      title="An error occurred"
      description={message}
    />
  );
}
