import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/layout/Layouts';
import { PageTransition } from '@/components/animation/Transitions';
import { Input, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      setUser(res.data.data.user, res.data.data.token);
      navigate('/account');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Handle Zod validation errors
        const errors: Record<string, string> = {};
        err.response.data.errors.forEach((e: any) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
        setError('Please fix the errors below.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-surface-400 text-sm">Join The Aisle for exclusive benefits</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-900 border border-surface-800 p-6 sm:p-8 rounded-2xl shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-5 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                leftIcon={<User className="w-4 h-4" />}
                error={fieldErrors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                error={fieldErrors.lastName}
                required
              />
            </div>
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={fieldErrors.email}
              required
            />
            
            <Input
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
              error={fieldErrors.phone}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={fieldErrors.password}
              helperText="Must be at least 8 characters."
              required
            />
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Create Account
          </Button>

          <div className="mt-8 text-center text-sm text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-white hover:text-brand-400 transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </PageTransition>
    </AuthLayout>
  );
}
