import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Film,
  ListVideo,
  Users,
  CreditCard,
  Receipt,
  MessageSquare,
  Bell,
  Settings as SettingsIcon,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  LogOut,
  FolderTree,
  DollarSign,
  Sparkles,
  Lock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  Drama,
  Episode,
  UserProfile,
  CategoryItem,
  SubscriptionItem,
  PaymentItem,
  CommentItem,
  AdminNotificationItem,
  PlatformSettings,
  AdminStats,
} from '../types';
import { api } from '../services/api';

type AdminTab =
  | 'overview'
  | 'dramas'
  | 'episodes'
  | 'media'
  | 'categories'
  | 'users'
  | 'subscriptions'
  | 'payments'
  | 'comments'
  | 'notifications'
  | 'settings';

interface AdminDashboardProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onRefreshPublicData: () => void;
}

export function AdminDashboard({ currentUser, onClose, onRefreshPublicData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Admin Auth state if not logged in as admin
  const [adminEmail, setAdminEmail] = useState('admin@shortflix.app');
  const [adminPassword, setAdminPassword] = useState('Admin@ShortFlix2026');
  const [authError, setAuthError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(currentUser?.role === 'admin');

  // Overview stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentItem[]>([]);
  const [topDramas, setTopDramas] = useState<any[]>([]);

  // Dramas & Episodes
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [selectedDramaForEpisodes, setSelectedDramaForEpisodes] = useState<string>('vagabond');
  const [dramaEpisodes, setDramaEpisodes] = useState<Episode[]>([]);
  const [dramaSearch, setDramaSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Categories
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Users
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Subscriptions & Payments
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  // Comments & Notifications
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);

  // Settings
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: 'ShortFlix',
    tagline: 'Vertical Drama & Mini-Series Streaming',
    maintenanceMode: false,
    defaultFreeEpisodes: 9,
    coinPricePerEpisode: 28,
    dailyPassPrice: 4.99,
    monthlyPassPrice: 29.99,
    currency: 'USD',
    announcementActive: false,
    announcementText: '',
  });

  // Modals state
  const [editingDrama, setEditingDrama] = useState<Partial<Drama> | null>(null);
  const [isDramaModalOpen, setIsDramaModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Partial<Episode> | null>(null);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'announcement', dramaId: '' });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [grantSubModalUser, setGrantSubModalUser] = useState<{ id: string; name: string } | null>(null);
  const [grantDays, setGrantDays] = useState(30);
  const [grantPlan, setGrantPlan] = useState<'daily' | 'monthly'>('monthly');

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Authenticate admin
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await api.auth.adminLogin(adminEmail, adminPassword);
      if (res.user.role === 'admin') {
        setIsAdminAuthenticated(true);
        showToast('Welcome back, Administrator!');
        loadDashboardData();
        onRefreshPublicData();
      } else {
        setAuthError('Unauthorized: User is not an administrator.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, dramasRes, catsRes, usersRes, subsRes, paysRes, comsRes, notifsRes, settRes] =
        await Promise.allSettled([
          api.admin.getStats(),
          api.dramas.getAll({ all: true }),
          api.admin.getCategories(),
          api.admin.getUsers(),
          api.admin.getSubscriptions(),
          api.admin.getPayments(),
          api.admin.getComments(),
          api.admin.getNotifications(),
          api.admin.getSettings(),
        ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.stats);
        setRecentPayments(statsRes.value.recentPayments);
        setTopDramas(statsRes.value.topDramas);
      }
      if (dramasRes.status === 'fulfilled') {
        setDramas(dramasRes.value.dramas);
        if (dramasRes.value.dramas.length > 0 && !selectedDramaForEpisodes) {
          setSelectedDramaForEpisodes(dramasRes.value.dramas[0].id);
        }
      }
      if (catsRes.status === 'fulfilled') setCategories(catsRes.value.categories);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.users);
      if (subsRes.status === 'fulfilled') setSubscriptions(subsRes.value.subscriptions);
      if (paysRes.status === 'fulfilled') setPayments(paysRes.value.payments);
      if (comsRes.status === 'fulfilled') setComments(comsRes.value.comments);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value.notifications);
      if (settRes.status === 'fulfilled') setSettings(settRes.value.settings);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load episodes when selectedDramaForEpisodes changes
  useEffect(() => {
    if (selectedDramaForEpisodes && isAdminAuthenticated) {
      api.dramas.getById(selectedDramaForEpisodes).then((res) => {
        setDramaEpisodes(res.drama.episodes || []);
      }).catch(console.error);
    }
  }, [selectedDramaForEpisodes, isAdminAuthenticated]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadDashboardData();
    }
  }, [isAdminAuthenticated]);

  // Drama Actions
  const handleSaveDrama = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDrama?.title) return;
    setLoading(true);
    try {
      if (editingDrama.id && dramas.some((d) => d.id === editingDrama.id)) {
        await api.admin.updateDrama(editingDrama.id, editingDrama);
        showToast(`Drama "${editingDrama.title}" updated.`);
      } else {
        await api.admin.createDrama(editingDrama);
        showToast(`Drama "${editingDrama.title}" published.`);
      }
      setIsDramaModalOpen(false);
      setEditingDrama(null);
      await loadDashboardData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Error saving drama', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrama = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Drama Series',
      message: `Are you sure you want to permanently delete "${title}" and all its episodes? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await api.admin.deleteDrama(id);
          showToast(`Deleted "${title}".`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          await loadDashboardData();
          onRefreshPublicData();
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      },
    });
  };

  const handleToggleDramaPublish = async (drama: Drama) => {
    try {
      await api.admin.updateDrama(drama.id, { isPublished: !drama.isPublished });
      showToast(`Drama is now ${!drama.isPublished ? 'Published' : 'Unpublished (Draft)'}.`);
      await loadDashboardData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Episode Actions
  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDramaForEpisodes) return;
    setLoading(true);
    try {
      if (editingEpisode?.id) {
        await api.admin.updateEpisode(String(editingEpisode.id), editingEpisode);
        showToast('Episode updated successfully.');
      } else {
        await api.admin.createEpisode(selectedDramaForEpisodes, editingEpisode || {});
        showToast('New episode created successfully.');
      }
      setIsEpisodeModalOpen(false);
      setEditingEpisode(null);
      const res = await api.dramas.getById(selectedDramaForEpisodes);
      setDramaEpisodes(res.drama.episodes || []);
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save episode', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEpisode = (epId: string | number, epNum: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Episode',
      message: `Are you sure you want to delete Episode ${epNum}?`,
      onConfirm: async () => {
        try {
          await api.admin.deleteEpisode(String(epId));
          showToast(`Episode ${epNum} deleted.`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          const res = await api.dramas.getById(selectedDramaForEpisodes);
          setDramaEpisodes(res.drama.episodes || []);
          onRefreshPublicData();
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      },
    });
  };

  const handleMoveEpisode = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dramaEpisodes.length) return;

    const reordered = [...dramaEpisodes];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setDramaEpisodes(reordered);
    try {
      await api.admin.reorderEpisodes(reordered.map((e) => String(e.id)));
      showToast('Episodes reordered.');
      onRefreshPublicData();
    } catch (err: any) {
      showToast('Reorder failed', 'error');
    }
  };

  // User Actions
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.id) return;
    try {
      await api.admin.updateUser(editingUser.id, editingUser);
      showToast('User profile updated.');
      setIsUserModalOpen(false);
      setEditingUser(null);
      await loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleUserDisabled = async (user: UserProfile) => {
    try {
      await api.admin.updateUser(user.id, { disabled: !user.disabled });
      showToast(`User ${user.name} has been ${!user.disabled ? 'suspended' : 'activated'}.`);
      await loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleGrantSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantSubModalUser) return;
    try {
      await api.admin.grantSubscription(grantSubModalUser.id, grantPlan, grantDays);
      showToast(`VIP granted to ${grantSubModalUser.name}.`);
      setGrantSubModalUser(null);
      await loadDashboardData();
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    try {
      if (editingCategory.id) {
        await api.admin.updateCategory(editingCategory.id, editingCategory);
        showToast('Category updated.');
      } else {
        await api.admin.createCategory({ name: editingCategory.name, description: editingCategory.description });
        showToast('Category created.');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Category',
      message: `Delete category "${name}"?`,
      onConfirm: async () => {
        try {
          await api.admin.deleteCategory(id);
          showToast(`Category "${name}" deleted.`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          await loadDashboardData();
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      },
    });
  };

  // Notification Broadcast
  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.message) return;
    try {
      await api.admin.createNotification(newNotification);
      showToast('Announcement broadcasted to all users!');
      setIsNotificationModalOpen(false);
      setNewNotification({ title: '', message: '', type: 'announcement', dramaId: '' });
      await loadDashboardData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.updateSettings(settings);
      showToast('Platform settings saved successfully.');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // If not logged in as Admin, show dedicated Admin Authentication Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0B10] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#14141C] border border-[#2A2A38] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF3B30] to-[#FF8C00] flex items-center justify-center shadow-lg shadow-orange-950/40">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">ShortFlix Admin Console</h1>
              <p className="text-xs text-zinc-400">Restricted Administrator Authentication</p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0B10] border border-[#2A2A38] text-white text-sm focus:outline-none focus:border-[#FF5E00] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0B10] border border-[#2A2A38] text-white text-sm focus:outline-none focus:border-[#FF5E00] transition"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#1C1C28] border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-300">Default Superadmin Credentials:</p>
              <p>Email: <code className="text-[#FF8C00]">admin@shortflix.app</code></p>
              <p>Password: <code className="text-[#FF8C00]">Admin@ShortFlix2026</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Authenticate Administrator</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered dramas list
  const filteredDramas = dramas.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(dramaSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(dramaSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#09090D] text-zinc-100 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/90 border-red-500/50 text-red-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#14141C] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">{confirmDialog.title}</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F0F16] border-b md:border-b-0 md:border-r border-[#1E1E2C] flex flex-col shrink-0">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#1E1E2C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF3B30] to-[#FF8C00] flex items-center justify-center shadow-md shadow-orange-950/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
                <span>SHORTFLIX</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF4500]/20 text-[#FF5E00] border border-[#FF4500]/40 font-bold uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate max-w-[140px]">{currentUser?.email || 'admin@shortflix.app'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Exit to Streaming Website"
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'dramas', label: 'Drama Catalog', icon: Film, badge: dramas.length },
            { id: 'episodes', label: 'Episodes Manager', icon: ListVideo },
            { id: 'media', label: 'Video & Assets', icon: Play },
            { id: 'categories', label: 'Categories & Genres', icon: FolderTree, badge: categories.length },
            { id: 'users', label: 'User Accounts', icon: Users, badge: users.length },
            { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: subscriptions.length },
            { id: 'payments', label: 'Transactions', icon: Receipt },
            { id: 'comments', label: 'Comments Moderation', icon: MessageSquare, badge: comments.filter(c => !c.isApproved || c.isFlagged).length },
            { id: 'notifications', label: 'Announcements', icon: Bell },
            { id: 'settings', label: 'Platform Settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7700] text-white shadow-lg shadow-orange-950/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#161622]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-[#222230] text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-3 border-t border-[#1E1E2C] space-y-2">
          <button
            onClick={() => {
              loadDashboardData();
              onRefreshPublicData();
              showToast('Data refreshed from backend.');
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-[#161622] text-zinc-300 hover:text-white hover:bg-[#1F1F30] transition border border-zinc-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF4500]' : ''}`} />
            <span>Sync Backend</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 transition"
          >
            <span>Return to ShortFlix App</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B0B10]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#1E1E2C] px-6 flex items-center justify-between shrink-0 bg-[#0F0F16]/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              {activeTab.replace('-', ' ')}
            </h2>
            <span className="text-xs text-zinc-500 hidden sm:inline">• Administrator Access Granted</span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'dramas' && (
              <button
                onClick={() => {
                  setEditingDrama({
                    title: '',
                    subtitle: '',
                    category: 'Action',
                    genres: ['Action', 'Thriller'],
                    tags: ['Drama', 'Trending'],
                    poster: '/src/assets/images/poster_vagabond_action_1792132925240.jpg',
                    backdrop: '/src/assets/images/player_actress_vagabond_1792133714675.jpg',
                    description: '',
                    director: '',
                    cast: ['Lead Actor'],
                    rating: 9.5,
                    isPublished: true,
                    isFeatured: false,
                    isRecentlyAdded: true,
                  });
                  setIsDramaModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition shadow-md shadow-orange-950/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Drama</span>
              </button>
            )}

            {activeTab === 'episodes' && (
              <button
                onClick={() => {
                  setEditingEpisode({
                    number: dramaEpisodes.length + 1,
                    title: `Episode ${dramaEpisodes.length + 1}`,
                    synopsis: '',
                    duration: '1:45',
                    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    thumbnail: '',
                    isFree: dramaEpisodes.length < 9,
                    coinPrice: dramaEpisodes.length < 9 ? 0 : 28,
                    isPublished: true,
                  });
                  setIsEpisodeModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition shadow-md shadow-orange-950/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Episode</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => {
                  setEditingCategory({ name: '', description: '' });
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === 'notifications' && (
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Announcement</span>
              </button>
            )}
          </div>
        </header>

        {/* Tab Content Views */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#14141E] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#FF8C00]" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-medium">Verified Payment Ledger</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#14141E] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Total Users</span>
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{stats?.totalUsers || 0}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                    {stats?.activeSubscriptions || 0} Active VIP Pass Holders
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#14141E] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Published Dramas</span>
                    <Film className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{stats?.publishedDramas || 0}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                    {stats?.totalDramas || 0} Total in Database
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#14141E] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Total Episodes</span>
                    <ListVideo className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{stats?.publishedEpisodes || 0}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                    {stats?.totalEpisodes || 0} Total Configured
                  </div>
                </div>
              </div>

              {/* Quick Actions & Top Catalog */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Dramas */}
                <div className="p-6 rounded-2xl bg-[#14141E] border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-sm">Top Performing Dramas</h3>
                    <button
                      onClick={() => setActiveTab('dramas')}
                      className="text-xs text-[#FF5E00] hover:underline font-semibold"
                    >
                      Manage All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {topDramas.map((drama) => (
                      <div
                        key={drama.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F16] border border-zinc-800/80"
                      >
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm">{drama.title}</div>
                          <div className="text-[11px] text-zinc-400">
                            Category: {drama.category} • {drama.episodesCount} Episodes
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#FF8C00]">{drama.views}</span>
                          <div className="text-[10px] text-zinc-500">★ {drama.rating}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Verified Payments */}
                <div className="p-6 rounded-2xl bg-[#14141E] border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="text-xs text-[#FF5E00] hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentPayments.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4 text-center">No payment transactions yet.</p>
                    ) : (
                      recentPayments.map((pay) => (
                        <div
                          key={pay.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F16] border border-zinc-800/80"
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{pay.description}</div>
                            <div className="text-[10px] text-zinc-400">
                              {pay.userEmail} • {new Date(pay.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-400">+${pay.amount}</span>
                            <div className="text-[10px] text-zinc-500">{pay.provider}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRAMAS MANAGEMENT */}
          {activeTab === 'dramas' && (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14141E] p-4 rounded-2xl border border-zinc-800">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search dramas by title or ID..."
                    value={dramaSearch}
                    onChange={(e) => setDramaSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Action">Action</option>
                    <option value="Love Story">Love Story</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Drama">Drama</option>
                  </select>
                </div>
              </div>

              {/* Dramas Table */}
              <div className="bg-[#14141E] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F0F16] text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Poster / Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Episodes</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Badges</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {filteredDramas.map((drama) => (
                        <tr key={drama.id} className="hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={drama.poster}
                                alt={drama.title}
                                className="w-10 h-14 object-cover rounded-lg bg-zinc-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white text-sm">{drama.title}</div>
                                <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">ID: {drama.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-zinc-300 font-medium">{drama.category}</td>
                          <td className="py-3 px-4 text-zinc-300">
                            <span className="font-semibold text-white">{drama.totalEpisodes}</span> eps
                            <div className="text-[10px] text-emerald-400">({drama.freeEpisodesCount} free)</div>
                          </td>
                          <td className="py-3 px-4 text-[#FF8C00] font-bold">★ {drama.rating}</td>
                          <td className="py-3 px-4 space-x-1">
                            {drama.isFeatured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                Featured
                              </span>
                            )}
                            {drama.isRecentlyAdded && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/40">
                                New
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleDramaPublish(drama)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                                drama.isPublished
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-zinc-700/40 text-zinc-400 border-zinc-600 hover:bg-zinc-700/60'
                              }`}
                            >
                              {drama.isPublished ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedDramaForEpisodes(drama.id);
                                setActiveTab('episodes');
                              }}
                              title="Manage Episodes"
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                            >
                              <ListVideo className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingDrama(drama);
                                setIsDramaModalOpen(true);
                              }}
                              title="Edit Drama"
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDrama(drama.id, drama.title)}
                              title="Delete Drama"
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-800 text-red-300 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EPISODES MANAGEMENT */}
          {activeTab === 'episodes' && (
            <div className="space-y-4">
              {/* Select Drama Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14141E] p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Select Drama:</label>
                  <select
                    value={selectedDramaForEpisodes}
                    onChange={(e) => setSelectedDramaForEpisodes(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs font-semibold text-white focus:outline-none"
                  >
                    {dramas.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} ({d.totalEpisodes} eps)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-zinc-400">
                  Total in list: <span className="font-bold text-white">{dramaEpisodes.length}</span> episodes
                </div>
              </div>

              {/* Episodes List & Drag/Reorder */}
              <div className="bg-[#14141E] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F0F16] text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order</th>
                        <th className="py-3 px-4">Episode #</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Access Tier</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Video Link</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {dramaEpisodes.map((ep, idx) => (
                        <tr key={ep.id} className="hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveEpisode(idx, 'up')}
                                className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === dramaEpisodes.length - 1}
                                onClick={() => handleMoveEpisode(idx, 'down')}
                                className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 hover:text-white"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">Ep. {ep.number}</td>
                          <td className="py-3 px-4 text-zinc-200 font-semibold">{ep.title}</td>
                          <td className="py-3 px-4 text-zinc-400">{ep.duration}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ep.isFree
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              }`}
                            >
                              {ep.isFree ? 'Free Preview' : 'Restricted (VIP/Coins)'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-300">
                            {ep.isFree ? 'Free' : `${ep.coinPrice} Coins`}
                          </td>
                          <td className="py-3 px-4 text-zinc-400 truncate max-w-[150px]">
                            {ep.videoUrl ? 'Configured (MP4)' : 'Default'}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingEpisode(ep);
                                setIsEpisodeModalOpen(true);
                              }}
                              title="Edit Episode"
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEpisode(ep.id, ep.number)}
                              title="Delete Episode"
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-800 text-red-300 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO & ASSET PREVIEW */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#14141E] border border-zinc-800 space-y-4">
                <h3 className="font-bold text-white text-base">Video Storage & Browser Playback Standards</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                  ShortFlix uses browser-compatible HTML5 video formats (H.264/MP4 and WebM) optimized for fast vertical video buffer and portrait ratio presentation. Restricted episode video URLs are guarded on the server and only served to users holding an active VIP pass or verified coin purchase.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#0F0F16] border border-zinc-800 space-y-2">
                    <div className="font-bold text-xs text-white">Default Video Sample Bucket:</div>
                    <code className="block p-2 rounded bg-black/50 text-[11px] text-[#FF8C00] break-all">
                      https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
                    </code>
                    <p className="text-[11px] text-zinc-500">
                      Standard public high-speed Google Cloud video stream used for responsive cross-device playback.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0F0F16] border border-zinc-800 space-y-2">
                    <div className="font-bold text-xs text-white">Poster Assets Resolution:</div>
                    <div className="text-xs text-zinc-300">Aspect Ratio: 3:4 portrait or 9:16 vertical cover</div>
                    <p className="text-[11px] text-zinc-500">
                      Generated cinematic K-Drama and modern romance vertical poster assets located in <code>/src/assets/images</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES & GENRES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-5 rounded-2xl bg-[#14141E] border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-base">{cat.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {cat.slug}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">{cat.description || 'No description provided.'}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsCategoryModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900 text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14141E] p-4 rounded-2xl border border-zinc-800">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Standard Users</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              <div className="bg-[#14141E] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F0F16] text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">VIP Status</th>
                        <th className="py-3 px-4">Coin Balance</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {users
                        .filter((u) => {
                          const matchesQ =
                            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearch.toLowerCase());
                          const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                          return matchesQ && matchesRole;
                        })
                        .map((usr) => (
                          <tr key={usr.id} className="hover:bg-zinc-800/30 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={usr.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                  alt={usr.name}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white text-sm">{usr.name}</div>
                                  <div className="text-[11px] text-zinc-400">{usr.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  usr.role === 'admin'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                    : 'bg-zinc-700 text-zinc-300'
                                }`}
                              >
                                {usr.role || 'user'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {usr.isVip ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                  VIP Member
                                </span>
                              ) : (
                                <span className="text-zinc-500">Free Tier</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#FF8C00]">{usr.coins} Coins</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  usr.disabled
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                }`}
                              >
                                {usr.disabled ? 'Suspended' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => setGrantSubModalUser({ id: usr.id, name: usr.name })}
                                title="Grant VIP Access"
                                className="px-2 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-800 text-amber-300 text-[11px] font-semibold transition"
                              >
                                Grant VIP
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(usr);
                                  setIsUserModalOpen(true);
                                }}
                                title="Edit User"
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleUserDisabled(usr)}
                                title={usr.disabled ? 'Unban User' : 'Suspend User'}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                              >
                                {usr.disabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SUBSCRIPTION MANAGEMENT */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="bg-[#14141E] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F0F16] text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Plan</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Start Date</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{sub.userName}</div>
                            <div className="text-[11px] text-zinc-400">{sub.userEmail}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-white capitalize">{sub.plan} Pass</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold">${sub.amount}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sub.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-zinc-700 text-zinc-400'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{new Date(sub.startDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-zinc-300 font-medium">
                            {new Date(sub.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {sub.status === 'active' && (
                              <button
                                onClick={async () => {
                                  await api.admin.cancelSubscription(sub.id);
                                  showToast('Subscription revoked.');
                                  loadDashboardData();
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs bg-red-950/60 hover:bg-red-800 text-red-300 transition"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PAYMENT TRANSACTION RECORDS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="bg-[#14141E] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F0F16] text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Reference ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Item Purchased</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">{p.referenceId}</td>
                          <td className="py-3 px-4 text-zinc-200 font-medium">{p.userEmail}</td>
                          <td className="py-3 px-4 text-white font-semibold">{p.description}</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold">${p.amount}</td>
                          <td className="py-3 px-4 text-zinc-400">{p.provider}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{new Date(p.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: COMMENTS MODERATION */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="bg-[#14141E] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F0F16] text-zinc-400 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Drama / Ep</th>
                        <th className="py-3 px-4">Comment Text</th>
                        <th className="py-3 px-4">Likes</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {comments.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{c.author}</div>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{c.dramaId} (Ep {c.episodeNumber || 1})</td>
                          <td className="py-3 px-4 text-zinc-200 max-w-sm">{c.content}</td>
                          <td className="py-3 px-4 text-[#FF8C00] font-bold">{c.likes}</td>
                          <td className="py-3 px-4">
                            {c.isFlagged ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                                Flagged
                              </span>
                            ) : c.isApproved ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                Approved
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={async () => {
                                await api.admin.moderateComment(c.id, !c.isApproved, false);
                                showToast('Comment status updated.');
                                loadDashboardData();
                              }}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px]"
                            >
                              {c.isApproved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                              onClick={async () => {
                                await api.admin.deleteComment(c.id);
                                showToast('Comment deleted.');
                                loadDashboardData();
                              }}
                              className="p-1.5 rounded bg-red-950/60 hover:bg-red-800 text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: NOTIFICATIONS & ANNOUNCEMENTS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-5 rounded-2xl bg-[#14141E] border border-zinc-800 flex justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF4500]/20 text-[#FF5E00] uppercase font-bold">
                          {notif.type}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{notif.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{notif.message}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await api.admin.deleteNotification(notif.id);
                        showToast('Notification removed.');
                        loadDashboardData();
                      }}
                      className="p-2 h-fit text-zinc-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: PLATFORM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-[#14141E] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="font-bold text-white text-base">Streaming Platform Configuration</h3>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Default Free Episodes</label>
                    <input
                      type="number"
                      value={settings.defaultFreeEpisodes}
                      onChange={(e) => setSettings({ ...settings, defaultFreeEpisodes: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Coin Price / Episode</label>
                    <input
                      type="number"
                      value={settings.coinPricePerEpisode}
                      onChange={(e) => setSettings({ ...settings, coinPricePerEpisode: parseInt(e.target.value, 10) || 28 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Daily Pass Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.dailyPassPrice}
                      onChange={(e) => setSettings({ ...settings, dailyPassPrice: parseFloat(e.target.value) || 4.99 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Monthly VIP Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.monthlyPassPrice}
                      onChange={(e) => setSettings({ ...settings, monthlyPassPrice: parseFloat(e.target.value) || 29.99 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={settings.announcementActive}
                      onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                      className="rounded accent-[#FF4500]"
                    />
                    <span className="text-xs font-semibold text-white">Enable Global Top Announcement Banner</span>
                  </label>
                  {settings.announcementActive && (
                    <input
                      type="text"
                      placeholder="e.g. 🎉 Flash Weekend: 50% extra coins on all top-ups!"
                      value={settings.announcementText}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-xs text-white focus:outline-none"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition shadow-lg shadow-orange-950/40"
                >
                  Save Platform Settings
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: DRAMA EDIT / CREATE */}
      {isDramaModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#14141E] border border-zinc-800 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-5 border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingDrama?.id && dramas.some((d) => d.id === editingDrama.id) ? 'Edit Drama' : 'Create New Drama'}
              </h3>
              <button onClick={() => setIsDramaModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDrama} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Drama Title *</label>
                <input
                  type="text"
                  required
                  value={editingDrama?.title || ''}
                  onChange={(e) => setEditingDrama({ ...editingDrama, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none focus:border-[#FF5E00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={editingDrama?.category || 'Action'}
                    onChange={(e) => setEditingDrama({ ...editingDrama, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                  >
                    <option value="Action">Action</option>
                    <option value="Love Story">Love Story</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Drama">Drama</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={editingDrama?.rating || 9.5}
                    onChange={(e) => setEditingDrama({ ...editingDrama, rating: parseFloat(e.target.value) || 9.5 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Poster Image URL</label>
                <input
                  type="text"
                  value={editingDrama?.poster || ''}
                  onChange={(e) => setEditingDrama({ ...editingDrama, poster: e.target.value })}
                  placeholder="/src/assets/images/... or https://"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Synopsis / Story Description</label>
                <textarea
                  rows={3}
                  value={editingDrama?.description || ''}
                  onChange={(e) => setEditingDrama({ ...editingDrama, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDrama?.isPublished ?? true}
                    onChange={(e) => setEditingDrama({ ...editingDrama, isPublished: e.target.checked })}
                    className="rounded accent-[#FF4500]"
                  />
                  <span className="font-semibold text-white">Publish on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDrama?.isRecentlyAdded ?? true}
                    onChange={(e) => setEditingDrama({ ...editingDrama, isRecentlyAdded: e.target.checked })}
                    className="rounded accent-[#FF4500]"
                  />
                  <span className="font-semibold text-white">Mark as Recently Added</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsDramaModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition"
                >
                  Save Drama
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EPISODE EDIT / CREATE */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#14141E] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingEpisode?.id ? 'Edit Episode' : 'Add New Episode'}
              </h3>
              <button onClick={() => setIsEpisodeModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Episode Number</label>
                  <input
                    type="number"
                    value={editingEpisode?.number || 1}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, number: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Duration (e.g. 1:45)</label>
                  <input
                    type="text"
                    value={editingEpisode?.duration || '1:45'}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Episode Title</label>
                <input
                  type="text"
                  value={editingEpisode?.title || ''}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Browser Playable Video URL (MP4 / WebM)</label>
                <input
                  type="text"
                  value={editingEpisode?.videoUrl || ''}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, videoUrl: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/... or https://"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEpisode?.isFree ?? false}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, isFree: e.target.checked })}
                    className="rounded accent-[#FF4500]"
                  />
                  <span className="font-semibold text-white">Free Episode (No VIP/Coins needed)</span>
                </label>
              </div>

              {!editingEpisode?.isFree && (
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Coin Price to Unlock</label>
                  <input
                    type="number"
                    value={editingEpisode?.coinPrice || 28}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, coinPrice: parseInt(e.target.value, 10) || 28 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:brightness-110 transition"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATEGORY EDIT / CREATE */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#14141E] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-4">
              {editingCategory?.id ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory?.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory?.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRANT VIP PASS */}
      {grantSubModalUser && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#14141E] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-2">Grant VIP Pass</h3>
            <p className="text-xs text-zinc-400 mb-4">Award VIP access directly to {grantSubModalUser.name}.</p>
            <form onSubmit={handleGrantSubscription} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Pass Plan</label>
                <select
                  value={grantPlan}
                  onChange={(e) => setGrantPlan(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                >
                  <option value="monthly">Monthly VIP Pass (30 Days)</option>
                  <option value="daily">Daily Pass (1 Day)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={grantDays}
                  onChange={(e) => setGrantDays(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setGrantSubModalUser(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST ANNOUNCEMENT */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14141E] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-4">Broadcast System Announcement</h3>
            <form onSubmit={handleBroadcastNotification} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Drama Series Released!"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Notification Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the release, discount, or announcement..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B10] border border-zinc-700 text-white focus:outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
