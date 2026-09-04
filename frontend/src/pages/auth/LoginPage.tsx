import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/layout/Layouts';
import { PageTransition } from '@/components/animation/Transitions';
import { Input, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.data.user, res.data.data.token);
      navigate('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <PageTransition className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-surface-950 font-black text-2xl mx-auto mb-6 shadow-lg shadow-[--color-brand-500]/25 hover:scale-105 transition-transform duration-200">
            A
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-surface-400 text-sm">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-900 border border-surface-800 p-6 sm:p-8 rounded-2xl shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-5 mb-8">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-surface-700 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 transition-colors cursor-pointer" />
                <span className="text-sm text-surface-400 group-hover:text-surface-300 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Sign In
          </Button>

          <div className="mt-8 text-center text-sm text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-white hover:text-brand-400 transition-colors">
              Create one now
            </Link>
          </div>
        </form>
      </PageTransition>
    </AuthLayout>
  );
}
