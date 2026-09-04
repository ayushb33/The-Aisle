import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Package, LogOut, ChevronRight, Plus, Trash2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn } from '@/components/animation/Transitions';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useAddressStore } from '@/store/addressStore';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrderStore();
  const { addresses, fetchAddresses, addAddress, deleteAddress, isLoading: addressLoading } = useAddressStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  
  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false });

  // Profile form state
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchAddresses();
    } else if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, fetchOrders, fetchAddresses]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({ label: '', fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage('');
    try {
      await updateProfile(profileForm);
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err: any) {
      setProfileMessage(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-10 lg:py-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-brand-500 text-black flex items-center justify-center font-bold text-lg">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-white">{user.firstName} {user.lastName}</h2>
                    <p className="text-sm text-surface-400 truncate w-32">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-brand-500/10 text-brand-400' : 'text-surface-300 hover:bg-surface-800 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5" /> Profile
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-brand-500/10 text-brand-400' : 'text-surface-300 hover:bg-surface-800 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" /> Orders
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'addresses' ? 'bg-brand-500/10 text-brand-400' : 'text-surface-300 hover:bg-surface-800 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" /> Addresses
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-amber-400" /> Admin Dashboard
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                  <div className="pt-4 mt-4 border-t border-surface-800">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </div>
                </nav>
              </div>
            </div>

              {/* Main Content with animated tab switch */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <FadeIn>
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-white mb-6">Profile Details</h1>
                    
                    {profileMessage && (
                      <div className={`p-4 rounded-xl mb-6 text-sm ${profileMessage.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {profileMessage}
                      </div>
                    )}
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-400 mb-2">First Name</label>
                          <input 
                            type="text" 
                            required
                            value={profileForm.firstName} 
                            onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-400 mb-2">Last Name</label>
                          <input 
                            type="text" 
                            required
                            value={profileForm.lastName} 
                            onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-400 mb-2">Email Address</label>
                        <input type="email" value={user.email} disabled className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white opacity-70 cursor-not-allowed" />
                        <p className="text-xs text-surface-500 mt-2">Email address cannot be changed.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-400 mb-2">Phone Number</label>
                        <input 
                          type="text" 
                          value={profileForm.phone} 
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none" 
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button type="submit" loading={isUpdatingProfile}>Save Changes</Button>
                      </div>
                    </form>
                  </div>
                </FadeIn>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <FadeIn>
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-white mb-6">Order History</h1>
                    
                    {ordersLoading ? (
                      <div className="text-center py-10 text-surface-400">Loading orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-10">
                        <Package className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                        <p className="text-surface-300 mb-4">You haven't placed any orders yet.</p>
                        <Link to="/shop"><Button variant="outline">Start Shopping</Button></Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="bg-surface-950 border border-surface-800 rounded-xl p-5 hover:border-surface-600 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div>
                                <h3 className="font-bold text-white text-lg">{order.orderNumber}</h3>
                                <p className="text-sm text-surface-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                                  order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {order.status}
                                </span>
                                <span className="font-bold text-white">₹{parseFloat(order.total).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                              {order.items.map(item => (
                                <div key={item.id} className="w-14 h-14 shrink-0 rounded-lg bg-surface-800 overflow-hidden border border-surface-700" title={item.productName}>
                                  {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-surface-800 text-right">
                              <Link to={`/account/orders/${order.id}`} className="text-sm text-brand-400 hover:underline font-medium">
                                View Order Details &rarr;
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FadeIn>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <FadeIn>
                  <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold text-white">Saved Addresses</h1>
                      <Button onClick={() => setShowAddressForm(!showAddressForm)} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                        Add New
                      </Button>
                    </div>
                    
                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-surface-950 border border-surface-700 rounded-xl space-y-4">
                        <h3 className="font-bold text-white mb-4">Add a new address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">Full Name</label>
                            <input required type="text" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">Phone Number</label>
                            <input required type="tel" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm text-surface-300 mb-1">Address Line 1</label>
                            <input required type="text" value={newAddress.addressLine1} onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm text-surface-300 mb-1">Address Line 2 (Optional)</label>
                            <input type="text" value={newAddress.addressLine2} onChange={e => setNewAddress({...newAddress, addressLine2: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">City</label>
                            <input required type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">State</label>
                            <input required type="text" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">Postal Code</label>
                            <input required type="text" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">Country</label>
                            <input required type="text" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-surface-300 mb-1">Address Label (e.g., Home, Office)</label>
                            <input type="text" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} placeholder="Home" className="w-full bg-surface-900 border border-surface-700 rounded-lg p-2.5 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} className="accent-brand-500 w-4 h-4" />
                          <label htmlFor="isDefault" className="text-sm text-surface-300">Set as default address</label>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                          <Button type="submit" loading={addressLoading}>Save Address</Button>
                        </div>
                      </form>
                    )}
                    
                    {addressLoading && !showAddressForm ? (
                      <div className="text-center py-10 text-surface-400">Loading addresses...</div>
                    ) : addresses.length === 0 && !showAddressForm ? (
                      <div className="text-center py-10">
                        <MapPin className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                        <p className="text-surface-300">No addresses saved yet.</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <div key={addr.id} className="bg-surface-950 border border-surface-800 rounded-xl p-5 relative group">
                            {addr.isDefault && (
                              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-black px-2 py-0.5 rounded-sm">Default</span>
                            )}
                            <h3 className="font-bold text-white mb-2">{addr.fullName} <span className="text-surface-400 font-normal text-xs ml-2">({addr.label})</span></h3>
                            <p className="text-sm text-surface-300 leading-relaxed mb-4">
                              {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                              {addr.city}, {addr.state} {addr.postalCode}<br />
                              {addr.country}
                            </p>
                            {addr.phone && <p className="text-sm text-surface-400 mb-4 flex items-center gap-2">📞 {addr.phone}</p>}
                            
                            <div className="flex gap-2">
                              <button onClick={() => deleteAddress(addr.id)} className="p-2 bg-surface-800 hover:bg-red-500/10 text-surface-400 hover:text-red-400 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FadeIn>
              )}

                  </motion.div>
                </AnimatePresence>
              </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
