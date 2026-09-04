import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ShoppingBag, MapPin, Heart } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition } from '@/components/animation/Transitions';
import { Button, Card, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

export function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <MainLayout>
        <div className="container-app py-12">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="md:col-span-3">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition className="container-app py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-brand-400 mb-2">My Account</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome, {user.firstName}
            </h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="md:col-span-1">
            <nav className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-800 text-white font-medium transition-colors">
                <User className="w-5 h-5 text-brand-400" />
                Profile Overview
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
                Order History
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
                Saved Addresses
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-400 hover:bg-surface-800 hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
                Wishlists
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Profile Details</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-surface-400 mb-1">Full Name</p>
                  <p className="text-base text-white font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-400 mb-1">Email Address</p>
                  <p className="text-base text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-400 mb-1">Account Role</p>
                  <p className="text-base text-white font-medium">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-400 mb-1">Member Since</p>
                  <p className="text-base text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-surface-800">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </Card>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
