import { useEffect, useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, ShoppingCart, Users, BarChart2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { api } from '@/lib/api';

interface DailyRevenue { date: string; revenue: number; orders: number; }
interface CategoryBreakdown { name: string; revenue: number; }
interface CustomerGrowth { date: string; newUsers: number; }
interface TopProduct { name: string; qty: number; }

interface AnalyticsData {
  dailyRevenue: DailyRevenue[];
  categoryBreakdown: CategoryBreakdown[];
  customerGrowth: CustomerGrowth[];
  topProducts: TopProduct[];
}

const PIE_COLORS = ['#f59e0b', '#6366f1', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

const formatDate = (d: string) => {
  const [, m, day] = d.split('-');
  return `${day}/${m}`;
};

const formatINR = (v: number) =>
  v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`;

function ChartCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="w-5 h-5 text-brand-400" />
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Shared tooltip style
const tooltipStyle = {
  backgroundColor: '#16161d',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  color: '#f0f0f2',
};

export function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-900 border border-white/5 rounded-2xl p-6 h-80 animate-pulse" />
            ))}
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (!data) return null;

  const totalRevenue30d = data.dailyRevenue.reduce((s, d) => s + d.revenue, 0);
  const totalOrders30d = data.dailyRevenue.reduce((s, d) => s + d.orders, 0);
  const totalUsers30d = data.customerGrowth.reduce((s, d) => s + d.newUsers, 0);
  const avgOrderValue = totalOrders30d > 0 ? totalRevenue30d / totalOrders30d : 0;

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto pb-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-surface-400 mt-1">Last 30 days of business performance</p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Revenue (30d)', value: formatINR(totalRevenue30d), icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
              { label: 'Orders (30d)', value: totalOrders30d.toString(), icon: ShoppingCart, color: 'text-blue-400 bg-blue-500/10' },
              { label: 'New Customers', value: totalUsers30d.toString(), icon: Users, color: 'text-purple-400 bg-purple-500/10' },
              { label: 'Avg. Order Value', value: formatINR(avgOrderValue), icon: BarChart2, color: 'text-brand-400 bg-brand-500/10' },
            ].map(({ label, value, icon: Ic, color }) => (
              <div key={label} className="bg-surface-900 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Ic className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-surface-400 mb-1">{label}</p>
                  <p className="text-xl font-bold text-white tabular-nums">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Revenue Trend */}
            <div className="lg:col-span-2">
              <ChartCard title="Revenue Trend (30 days)" icon={TrendingUp}>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.dailyRevenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                    <YAxis tickFormatter={formatINR} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} width={55} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                      labelFormatter={formatDate}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Order Volume */}
            <ChartCard title="Daily Order Volume" icon={ShoppingCart}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.dailyRevenue} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis allowDecimals={false} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [v, 'Orders']}
                    labelFormatter={formatDate}
                  />
                  <Area type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} fill="url(#ordGrad)" dot={false} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Customer Growth */}
            <ChartCard title="New Customer Signups" icon={Users}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.customerGrowth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis allowDecimals={false} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [v, 'New Users']}
                    labelFormatter={formatDate}
                  />
                  <Area type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} fill="url(#custGrad)" dot={false} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Top Products */}
            <ChartCard title="Top Products by Units Sold" icon={BarChart2}>
              {data.topProducts.length === 0 ? (
                <div className="h-60 flex items-center justify-center text-surface-500 text-sm">No order data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.topProducts} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b6b78', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fill: '#c9c9cf', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 13) + '…' : v}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => [v, 'Units sold']}
                    />
                    <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
                      {data.topProducts.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Category Breakdown (Pie) */}
            <ChartCard title="Revenue by Category" icon={TrendingUp}>
              {data.categoryBreakdown.length === 0 ? (
                <div className="h-60 flex items-center justify-center text-surface-500 text-sm">No order data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="revenue"
                    >
                      {data.categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Legend
                      formatter={(value) => <span style={{ color: '#9595a0', fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
