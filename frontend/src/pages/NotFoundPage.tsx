import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  return (
    <MainLayout>
      <div className="container-app flex flex-col items-center justify-center min-h-[70vh] py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[160px] font-black text-surface-800 leading-none mb-4 select-none">
            404
          </p>
          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-surface-400 max-w-sm mx-auto mb-10">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/">
              <Button size="lg" leftIcon={<Home className="w-4 h-4" />}>
                Go Home
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
