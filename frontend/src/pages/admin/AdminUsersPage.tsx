import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-brand-500/20 text-brand-400',
  CUSTOMER: 'bg-blue-500/20 text-blue-400',
};

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(res => {
      setUsers(res.data.data.users);
    }).finally(() => setIsLoading(false));
  }, []);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Customers</h1>
            <p className="text-surface-400 mt-1">{users.length} registered users</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-900 border border-white/5 rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="text-center py-16 text-surface-400">Loading users...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                <p className="text-surface-400">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Role</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Orders</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Member Since</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((user) => (
                      <tr key={user.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                              {user.firstName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <Link to={`/admin/users/${user.id}`} className="font-medium text-white hover:text-brand-400 transition-colors">
                                {user.firstName} {user.lastName}
                              </Link>
                              <p className="text-xs text-surface-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${ROLE_COLORS[user.role] || 'bg-gray-500/20 text-gray-400'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">{user._count.orders}</span>
                        </td>
                        <td className="px-6 py-4 text-surface-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
