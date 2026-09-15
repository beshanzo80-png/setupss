import React, { useState, useEffect, useRef, Suspense } from 'react';
import { safeJsonResponse } from './lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { SetupPost, SetupComment, AppNotification } from './types';
import { curatedSetups } from './curatedSetups';
import { SetupList } from './components/SetupList';
import { SetupDetail } from './components/SetupDetail';
import { AuthModal } from './components/AuthModal';
import { Logo } from './components/Logo';
import { MobileWaveNavBar } from './components/MobileWaveNavBar';
import { Leaderboard } from './components/Leaderboard';
import { InviteModal } from './components/InviteModal';
import { MobileSpecialHub } from './components/MobileSpecialHub';
import { SafeImage } from './components/SafeImage';
import { SeoHead } from './components/SeoHead';
import { UserAvatar } from './components/UserAvatar';
import { ExpandableMenu } from './components/ExpandableMenu';
import { ROUTES } from './utils/routes';
import { navigateTo, getCurrentRoute, normalizeLegacyUrl, listenToNavigation } from './utils/navigation';
import { Sparkles, Compass, ListTodo, Plus, Menu, X, User, LogOut, Trophy, Gift, Heart, Mail, Dices, Bot, Flame, Zap, Sun, Moon, ShieldCheck, Smartphone, Search, Bell, Globe } from 'lucide-react';

// New high-performance extracted components
import { SkeletonLoader } from './components/SkeletonLoader';
import { AboutInfoSection } from './components/AboutInfoSection';
import { AppFooter } from './components/AppFooter';

// React.lazy for non-critical path and bundle-heavy code splitting
const SetupForm = React.lazy(() => import('./components/SetupForm').then(m => ({ default: m.SetupForm })));
const WishlistPlanner = React.lazy(() => import('./components/WishlistPlanner').then(m => ({ default: m.WishlistPlanner })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const ProfileModal = React.lazy(() => import('./components/ProfileModal').then(m => ({ default: m.ProfileModal })));
const ChatWidget = React.lazy(() => import('./components/ChatWidget').then(m => ({ default: m.ChatWidget })));
const GlobalChat = React.lazy(() => import('./components/GlobalChat').then(m => ({ default: m.GlobalChat })));
const SetupssChatss = React.lazy(() => import('./components/SetupssChatss').then(m => ({ default: m.SetupssChatss })));
const StreakCenter = React.lazy(() => import('./components/StreakCenter').then(m => ({ default: m.StreakCenter })));
const HardwareKnowledgeGraphExplorer = React.lazy(() => import('./components/HardwareKnowledgeGraphExplorer').then(m => ({ default: m.HardwareKnowledgeGraphExplorer })));
const BlogSection = React.lazy(() => import('./components/BlogSection').then(m => ({ default: m.BlogSection })));

import { GlobalLoadingScreen } from './components/GlobalLoadingScreen';

export default function App() {
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlobalLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const [setups, setSetups] = useState<SetupPost[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'wishlist' | 'leaderboard' | 'global-chat' | 'hardware-graph' | 'chatss' | 'blog'>('explore');
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);
  const [selectedSetup, setSelectedSetup] = useState<SetupPost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname.toLowerCase() === '/admin' || 
           new URLSearchParams(window.location.search).get('admin') === 'true';
  });

  useEffect(() => {
    const handleRouteCheck = () => {
      setIsAdminRoute(
        window.location.pathname.toLowerCase() === '/admin' || 
        new URLSearchParams(window.location.search).get('admin') === 'true'
      );
      const path = window.location.pathname.toLowerCase();
      if (path.includes('hardware-graph')) {
        setActiveTab('hardware-graph');
      } else if (path.includes('leaderboard')) {
        setActiveTab('leaderboard');
      } else if (path.includes('wishlist') || path.includes('planner')) {
        setActiveTab('wishlist');
      } else if (path.includes('global-chat')) {
        setActiveTab('global-chat');
      } else if (path.includes('chatss')) {
        setActiveTab('chatss');
      } else if (path.includes('blog') || path.includes('guide') || path.includes('article')) {
        setActiveTab('blog');
        const match = getCurrentRoute();
        if (match.blog || match.guide || match.article) {
          setCurrentBlogSlug(match.blog || match.guide || match.article || null);
        }
      } else {
        setActiveTab('explore');
      }
    };
    handleRouteCheck();
    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('saios:navigate', handleRouteCheck);
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('saios:navigate', handleRouteCheck);
    };
  }, []);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSaiosMenu, setShowSaiosMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Notifications fetch failed:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15 seconds
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const handleUpdateNotificationStatus = async (id: string, status: 'read' | 'archived' | 'deleted') => {
    try {
      setNotifications(prev => {
        if (status === 'deleted') {
          return prev.filter(n => n.id !== id);
        }
        return prev.map(n => n.id === id ? { ...n, status } : n);
      });

      await fetch(`/api/notifications/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error("Failed to update notification status:", err);
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    setShowProfileModal(false);
    try {
      await fetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem('setupss_guest_id');
      window.history.pushState({}, '', '/');
      window.location.reload();
    }
  };

  const handleSearchTrigger = () => {
    if (activeTab !== 'explore') {
      navigateTo(ROUTES.EXPLORE);
    }
    setTimeout(() => {
      const input = document.getElementById('setup-search-input');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // Global Ctrl+K / Cmd+K listener to trigger search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleSearchTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);
  const [startChatWithOwner, setStartChatWithOwner] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Permanently light theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('setupss_theme', 'light');
  }, []);

  // Prompt auth modal after 1 minute of browsing if not logged in
  useEffect(() => {
    if (!user && authChecked) {
      const timer = setTimeout(() => {
        if (!user) {
          setShowAuthModal(true);
        }
      }, 60000); // 1 minute
      return () => clearTimeout(timer);
    }
  }, [user, authChecked]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    instagram_link: '',
    twitter_link: '',
    youtube_link: '',
    github_link: '',
    discord_link: '',
    linkedin_link: '',
    contact_email: 'setupss.support@gmail.com'
  });

  useEffect(() => {
    fetch('/auth/user')
      .then(res => safeJsonResponse(res))
      .then(data => {
        setUser(data);
        setAuthChecked(true);
      })
      .catch(err => {
        console.error(err);
        setAuthChecked(true);
      });

    fetch('/api/settings')
      .then(res => safeJsonResponse(res))
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(console.error);
  }, []);

  // Handle referral tracking query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref');
    if (refId) {
      sessionStorage.setItem('pending_referral', refId);
      localStorage.setItem('pending_referral', refId);
    }

    // First visit invite modal with RGB border popup
    const hasVisited = localStorage.getItem('setupss_visited');
    if (!hasVisited) {
      localStorage.setItem('setupss_visited', 'true');
      setShowInviteModal(true);
    }
  }, []);

  const handleShareSetup = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowAddModal(true);
  };

  // Load setups on mount
  const loadSetups = async () => {
    try {
      const activeUserId = user?.id || localStorage.getItem('setupss_guest_id') || '';
      const response = await fetch(`/api/setups${activeUserId ? `?userId=${encodeURIComponent(activeUserId)}` : ''}`, {
        headers: activeUserId ? { 'x-user-id': activeUserId } : {}
      });
      if (!response.ok && response.status !== 429) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await safeJsonResponse(response);
      if (data.success && Array.isArray(data.setups)) {
        let setupsToShow = data.setups;

        const sorted = [...setupsToShow].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSetups(sorted);
        
        // Also keep selectedSetup synced if it's open
        if (selectedSetup) {
          const refreshedSelected = sorted.find((s: SetupPost) => s.id === selectedSetup.id);
          if (refreshedSelected) {
            setSelectedSetup(refreshedSelected);
          }
        }
      } else {
        throw new Error(data.error || 'Invalid setups format');
      }
    } catch (e) {
      // Smooth fallback to local storage
      const saved = localStorage.getItem('community_setup_posts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const sorted = (Array.isArray(parsed) && parsed.length > 0) 
            ? parsed.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
            : curatedSetups;
          setSetups(sorted);
          if (Array.isArray(parsed) && parsed.length === 0 && curatedSetups.length > 0) {
            localStorage.setItem('community_setup_posts', JSON.stringify(curatedSetups));
          }
        } catch {
          setSetups(curatedSetups);
        }
      } else {
        setSetups(curatedSetups);
        localStorage.setItem('community_setup_posts', JSON.stringify(curatedSetups));
      }
    }
  };

  useEffect(() => {
    loadSetups();
    const interval = setInterval(() => {
      loadSetups();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Centralized Clean URL Routing & Deep Linking
  useEffect(() => {
    // 1. Convert legacy URL if needed (?setup=123 -> /setup/123)
    normalizeLegacyUrl();

    // 2. Function to sync React state with current browser location
    const syncRouteWithState = () => {
      const match = getCurrentRoute();

      if (match.setupId && setups.length > 0) {
        const found = setups.find(s => s.id === match.setupId || match.setupId?.endsWith(`-${s.id}`) || match.setupId === s.id);
        if (found) {
          setSelectedSetup(found);
        }
      } else if (!match.setupId) {
        setSelectedSetup(null);
      }

      if (match.tab) {
        if (['explore', 'wishlist', 'leaderboard', 'global-chat', 'hardware-graph', 'chatss', 'blog'].includes(match.tab)) {
          setActiveTab(match.tab as any);
        }
      }
      if (match.blog || match.guide || match.article) {
        setCurrentBlogSlug(match.blog || match.guide || match.article || null);
      }
    };

    syncRouteWithState();

    // 3. Subscribe to history navigation events (popstate / saios:navigate)
    const unsubscribe = listenToNavigation(syncRouteWithState);
    return () => unsubscribe();
  }, [setups]);

  // Synchronize browser address bar with clean URLs when tab or modal changes
  useEffect(() => {
    let cleanUrl = ROUTES.EXPLORE;

    if (selectedSetup) {
      cleanUrl = ROUTES.setup(selectedSetup.id, selectedSetup.title);
    } else if (activeTab === 'blog') {
      cleanUrl = currentBlogSlug ? `/blog/${currentBlogSlug}` : '/blog';
    } else if (activeTab === 'wishlist') {
      cleanUrl = ROUTES.AI_PLANNER;
    } else if (activeTab === 'leaderboard') {
      cleanUrl = ROUTES.LEADERBOARD;
    } else if (activeTab === 'global-chat') {
      cleanUrl = '/global-chat';
    } else if (activeTab === 'chatss') {
      cleanUrl = '/chatss';
    } else if (activeTab === 'hardware-graph') {
      cleanUrl = '/hardware-graph';
    }

    const currentFull = window.location.pathname;
    
    // Check if current path is a special deep-linked page that we shouldn't overwrite
    const parts = currentFull.split('/').filter(Boolean);
    const isSpecialRoute = parts.length > 0 && [
      'hardware', 'u', 'user', 'profile', 'category', 'tag', 'brand',
      'room', 'desk', 'accessory', 'guide', 'article', 'collection',
      'compare', 'hardware-combo', 'blog'
    ].includes(parts[0].toLowerCase());

    if (!isSpecialRoute && currentFull !== cleanUrl) {
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [activeTab, selectedSetup, currentBlogSlug]);
  // Secret "admin" keyword listener
  useEffect(() => {
    let keysPressed = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if user is typing in form inputs/textarea
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }
      keysPressed += e.key.toLowerCase();
      if (keysPressed.endsWith('admin')) {
        window.open('/admin', '_blank', 'noopener,noreferrer');
        keysPressed = '';
      }
      if (keysPressed.length > 20) {
        keysPressed = keysPressed.substring(keysPressed.length - 10);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Heartbeat for real-time online status tracking
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const userId = user?.id || localStorage.getItem('setupss_guest_id') || `guest-${Math.random().toString(36).substring(2, 9)}`;
        if (!localStorage.getItem('setupss_guest_id')) {
          localStorage.setItem('setupss_guest_id', userId);
        }
        await fetch('/api/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            name: user?.name || user?.displayName || 'Misafir Ziyaretçi',
            email: user?.email || '',
            avatar: user?.avatar || '',
            status: isTabActive ? 'online' : 'away',
            typing: false
          })
        });
      } catch (e) {
        // silent
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 10000);
    return () => clearInterval(interval);
  }, [user, isTabActive]);

  const likeDebounceMapRef = useRef<{ [key: string]: number }>({});

  // Like Toggle Handler
  const handleLikeSetup = async (id: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Prevent rapid click spamming (300ms cooldown per setup)
    const now = Date.now();
    const lastClickTime = likeDebounceMapRef.current[id] || 0;
    if (now - lastClickTime < 300) return;
    likeDebounceMapRef.current[id] = now;

    const setup = setups.find(s => s.id === id);
    if (!setup) return;

    const activeUserId = user.id;

    const isCurrentlyLiked = !!setup.likedByUser;
    const nextLikedState = !isCurrentlyLiked;

    // Optimistically update the UI state
    const updated = setups.map(s => {
      if (s.id === id) {
        return {
          ...s,
          likes: nextLikedState ? s.likes + 1 : Math.max(0, s.likes - 1),
          likedByUser: nextLikedState
        };
      }
      return s;
    });
    setSetups(updated);

    // Keep selectedSetup synced
    if (selectedSetup && selectedSetup.id === id) {
      setSelectedSetup(prev => prev ? {
        ...prev,
        likes: nextLikedState ? prev.likes + 1 : Math.max(0, prev.likes - 1),
        likedByUser: nextLikedState
      } : null);
    }

    try {
      const res = await fetch(`/api/setups/${id}/like`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': activeUserId 
        },
        body: JSON.stringify({ liked: nextLikedState, userId: activeUserId })
      });
      const data = await safeJsonResponse(res);
      if (data.success && typeof data.likes === 'number') {
        setSetups(prev => prev.map(s => s.id === id ? { ...s, likes: data.likes, likedByUser: nextLikedState } : s));
        if (selectedSetup && selectedSetup.id === id) {
          setSelectedSetup(prev => prev ? { ...prev, likes: data.likes, likedByUser: nextLikedState } : null);
        }
      }
    } catch (e) {
      console.error('Failed to toggle like on backend', e);
    }
  };

  const handleDeleteSetup = async (id: string) => {
    if (!user) return;
    if (!confirm("Bu kurulumu silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`/api/setups/${id}`, {
        method: 'DELETE'
      });
      const result = await safeJsonResponse(response);
      if (result.success) {
        setSetups(prev => prev.filter(s => s.id !== id));
        if (selectedSetup?.id === id) setSelectedSetup(null);
      } else {
        alert("Silme hatası: " + (result.message || result.error));
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  // Save New Custom Setup
  const handleSaveNewSetup = async (newSetupData: Omit<SetupPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSetupData)
      });
      const result = await safeJsonResponse(response);
      if (result.success) {
        await loadSetups();
        setShowAddModal(false);
      } else {
        alert("Setup kaydedilirken hata oluştu: " + (result.error || result.message));
      }
    } catch (e: any) {
      console.error('Failed to save new setup on backend', e);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  // Add Comment Handler
  const handleAddComment = async (setupId: string, commentFields: Omit<SetupComment, 'id' | 'createdAt'>) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      const response = await fetch(`/api/setups/${setupId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentFields)
      });
      const result = await safeJsonResponse(response);
      if (result.success) {
        await loadSetups();
      }
    } catch (e) {
      console.error('Failed to add comment on backend', e);
    }
  };

  // Admin Bulk Update Handler
  const handleAdminUpdateSetups = async (updatedSetups: SetupPost[]) => {
    // Optimistically update local state
    setSetups(updatedSetups);
    
    // Also keep selectedSetup synced if it's open
    if (selectedSetup) {
      const refreshedSelected = updatedSetups.find(s => s.id === selectedSetup.id);
      setSelectedSetup(refreshedSelected || null);
    }

    try {
      await fetch('/api/admin/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setups: updatedSetups })
      });
    } catch (e) {
      console.error('Failed to sync admin updates with backend', e);
    }
  };

  // Batch Save / Reset Helper for Admin Panel
  const saveSetupsToStorage = async (updatedSetups: SetupPost[]) => {
    setSetups(updatedSetups);
    localStorage.setItem('community_setup_posts', JSON.stringify(updatedSetups));
    
    try {
      await fetch('/api/setups/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSetups)
      });
    } catch (e) {
      console.error('Failed to sync setups batch to backend', e);
    }

    if (selectedSetup) {
      const refreshedSelected = updatedSetups.find(s => s.id === selectedSetup.id);
      if (refreshedSelected) {
        setSelectedSetup(refreshedSelected);
      } else {
        setSelectedSetup(null);
      }
    }
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#faf8f5]  flex items-center justify-center p-0 md:p-6 overflow-y-auto">
        <Suspense fallback={<SkeletonLoader type="panel" />}>
          <AdminPanel 
            setups={setups}
            onClose={() => {
              try {
                window.close();
              } catch {}
              window.location.href = '/';
            }}
            onUpdateSetups={handleAdminUpdateSetups}
            isStandalone={true}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1]  text-vibrant-dark  font-sans antialiased pb-16 selection:bg-vibrant-yellow/30 transition-colors duration-200">
      <GlobalLoadingScreen isLoading={isGlobalLoading} />
      <SeoHead activeTab={activeTab} selectedSetup={selectedSetup} />
      
      {/* Top Navigation Accent Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-vibrant-dark px-3 py-2 md:px-8 flex items-center justify-between shadow-sm h-14 md:h-20 transition-all duration-300">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0 h-full py-0.5">
          <div className="flex items-center cursor-pointer h-full" onClick={() => { setSelectedSetup(null); navigateTo(ROUTES.EXPLORE); }}>
            <Logo size="lg" className="shrink-0 h-10 sm:h-14 md:h-16 w-auto max-h-full object-contain transition-transform hover:scale-105" />
          </div>
        </div>

        {/* Right Side: Notifications, Profile, and ☰ SAIOS Trigger Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationsMenu(!showNotificationsMenu);
                setShowUserMenu(false);
              }}
              className="p-1.5 bg-white  hover:bg-slate-50  text-vibrant-dark  border-2 border-vibrant-dark  rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]  active:shadow-none relative"
              title="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => n.status === 'notification').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-vibrant-coral text-white border-2 border-vibrant-dark  text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                  {notifications.filter(n => n.status === 'notification').length}
                </span>
              )}
            </button>

            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white  border-3 border-vibrant-dark  rounded-2xl shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]  z-50 p-3 space-y-2 animate-fade-in max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 ">
                  <span className="text-xs font-black uppercase tracking-wider text-vibrant-dark  flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-vibrant-yellow" /> Bildirimler
                  </span>
                  {notifications.filter(n => n.status === 'notification').length > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach(n => {
                          if (n.status === 'notification') {
                            handleUpdateNotificationStatus(n.id, 'read');
                          }
                        });
                      }}
                      className="text-[9px] font-black text-vibrant-coral hover:underline uppercase"
                    >
                      Tümünü Oku
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 ">
                    Henüz bildiriminiz bulunmuyor.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border-2 transition-all flex gap-2 relative ${
                          n.status === 'notification'
                            ? 'bg-amber-500/5 border-vibrant-yellow/40'
                            : 'bg-slate-50  border-transparent'
                        }`}
                      >
                        {n.senderAvatar ? (
                          <SafeImage src={n.senderAvatar} alt={n.senderName} className="w-7 h-7 rounded-full object-cover border border-vibrant-dark shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-vibrant-bg border border-vibrant-dark flex items-center justify-center shrink-0 text-[10px] font-black">
                            {n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : '🔔'}
                          </div>
                        )}

                        <div className="flex-1 min-w-0 pr-12">
                          <p className="text-[10px] font-black truncate text-vibrant-dark ">{n.title}</p>
                          <p className="text-[9px] text-slate-500  mt-0.5 line-clamp-2 leading-relaxed">{n.content}</p>
                          <p className="text-[7px] text-slate-400  mt-1 uppercase font-bold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        {/* Inline controls */}
                        <div className="absolute right-1.5 top-1.5 flex flex-col gap-1">
                          {n.status === 'notification' && (
                            <button
                              onClick={() => handleUpdateNotificationStatus(n.id, 'read')}
                              className="p-1 hover:bg-slate-200  rounded-md text-[8px] font-black text-vibrant-coral uppercase"
                              title="Okundu İşaretle"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateNotificationStatus(n.id, 'archived')}
                            className="p-1 hover:bg-slate-200  rounded-md text-[8px] font-black text-slate-400  uppercase"
                            title="Arşivle"
                          >
                            📁
                          </button>
                          <button
                            onClick={() => handleUpdateNotificationStatus(n.id, 'deleted')}
                            className="p-1 hover:bg-slate-200  rounded-md text-[8px] font-black text-red-500 hover:text-red-600 uppercase"
                            title="Sil"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Controls */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 px-2 py-1 bg-vibrant-bg hover:bg-vibrant-bg/70 text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none"
              >
                <UserAvatar
                  src={user.avatar}
                  name={user.displayName || 'Me'}
                  frame={user.avatarFrame || user.avatar_frame}
                  isCrown={user.isCrown}
                  hasRgb={user.hasRgb}
                  size="xs"
                />
                <span className="max-w-[70px] truncate hidden sm:inline">{user.displayName || "Hesabım"}</span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white  border-3 border-vibrant-dark  rounded-2xl shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]  z-50 p-3 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 ">
                    <UserAvatar
                      src={user.avatar}
                      name={user.displayName || 'Me'}
                      frame={user.avatarFrame || user.avatar_frame}
                      isCrown={user.isCrown}
                      hasRgb={user.hasRgb}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-vibrant-dark  truncate">{user.displayName || 'Kullanıcı'}</p>
                      <p className="text-[10px] text-slate-500  truncate">{user.email || 'Oturum Açık'}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full text-left px-3 py-2 bg-slate-50  hover:bg-slate-100  text-vibrant-dark  border border-slate-200  rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <User className="w-4 h-4 text-vibrant-blue" />
                      <span>Profilini Düzenle</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 bg-rose-50  hover:bg-rose-100  text-rose-600  border border-rose-200  rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="px-3 py-1.5 bg-[#0984e3] hover:bg-blue-600 text-white border-2 border-vibrant-dark  rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] "
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Giriş Yap</span>
            </button>
          )}

          {/* ☰ MENU TRIGGER BUTTON */}
          <button
            onClick={() => setShowSaiosMenu(!showSaiosMenu)}
            className={`px-3 py-1.5 bg-vibrant-yellow text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] hover:bg-amber-400 ${
              showSaiosMenu ? 'bg-amber-400 scale-105 shadow-none' : ''
            }`}
          >
            {showSaiosMenu ? <X className="w-3.5 h-3.5 stroke-[3]" /> : <Menu className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Menü</span>
          </button>

          {/* Elegant Staggered Dropdown Menu */}
          <ExpandableMenu
            isOpen={showSaiosMenu}
            onClose={() => setShowSaiosMenu(false)}
            activeTab={activeTab}
          />

        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6 md:mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'explore' && (
              /* Premium & Minimalist Stage */
              <div className="relative mb-8 md:mb-16">
                <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] md:shadow-[12px_12px_0px_0px_rgba(45,52,54,1)]">
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(#2d3436 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
                  
                  {/* Floating Tech Elements (Background Decoration) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
                    <motion.div 
                      animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-12 left-[6%] opacity-20"
                    >
                      <Plus className="w-12 h-12 text-vibrant-coral" />
                    </motion.div>
                    <motion.div 
                      animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-12 right-[8%] opacity-20"
                    >
                      <Sparkles className="w-16 h-16 text-vibrant-yellow" />
                    </motion.div>
                  </div>

                  {/* Asymmetrical Grid: 2-Column on large screens for true premium look */}
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
                    
                    {/* Left Column: Core Hero Copy & Member Showcase */}
                    <div className="lg:col-span-7 flex flex-col justify-between text-left space-y-6 md:space-y-8">
                      <div className="space-y-6">
                        
                        <div className="space-y-4 w-full">
                          <div className="relative">
                            <motion.span
                              initial={{ rotate: -5, opacity: 0 }}
                              animate={{ rotate: -5, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="font-handwriting text-3xl md:text-5xl text-vibrant-coral absolute -top-8 left-0 md:-left-4 -rotate-6 z-20"
                            >
                              Kendi tarzını yarat
                            </motion.span>
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-vibrant-dark uppercase leading-[1.0] tracking-tight max-w-2xl font-elegant-sans pt-3">
                              Masanı <br />
                              <motion.span 
                                animate={{ 
                                  color: ['#2d3436', '#ff5252', '#2d3436'],
                                  scale: [1, 1.01, 1]
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative inline-block cursor-default group mr-3 font-serif italic text-vibrant-coral normal-case"
                              >
                                <span className="relative z-10">Sanata</span>
                                <motion.div 
                                  className="absolute bottom-1 left-0 w-full h-[20%] bg-vibrant-yellow -z-0 -skew-x-12 origin-left"
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ delay: 1, duration: 0.8 }}
                                />
                              </motion.span> 
                              Dönüştür
                            </h2>
                          </div>
                          
                          <p className="text-vibrant-dark/80 font-medium text-sm md:text-lg leading-relaxed max-w-xl">
                            Dünyanın en ilham verici çalışma alanlarını keşfet.
                            <span className="font-handwriting text-2xl md:text-3xl text-vibrant-coral block md:inline md:ml-2">
                              Sade, güçlü ve tamamen topluluk odaklı.
                            </span>
                          </p>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full pt-2">
                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleShareSetup()}
                            className="h-[48px] md:h-[54px] px-5 md:px-7 bg-vibrant-yellow text-vibrant-dark border-3 border-vibrant-dark  rounded-2xl font-black uppercase text-xs md:text-xs shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 active:shadow-none"
                          >
                            <Plus className="w-4 h-4 stroke-[3.5]" />
                            <span>Setup Paylaş</span>
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              if (setups.length > 0) {
                                const randomIndex = Math.floor(Math.random() * setups.length);
                                setSelectedSetup(setups[randomIndex]);
                              }
                            }}
                            className="h-[48px] md:h-[54px] px-5 md:px-7 bg-vibrant-coral text-white border-3 border-vibrant-dark  rounded-2xl font-black uppercase text-xs md:text-xs shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 active:shadow-none"
                          >
                            <Dices className="w-4 h-4 stroke-[3]" />
                            <span>Rastgele Seç</span>
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setStartChatWithOwner("ai-bot")}
                            className="h-[48px] md:h-[54px] px-5 md:px-7 bg-[#0984e3] text-white border-3 border-vibrant-dark  rounded-2xl font-black uppercase text-xs md:text-xs shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 active:shadow-none"
                          >
                            <Bot className="w-4 h-4 stroke-[3]" />
                            <span>AI Danışman</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Active Member Showcase (Inside Card, Compact & Beautiful) */}
                      <div className="pt-4 border-t border-vibrant-dark/10  w-full">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex -space-x-2.5">
                            {(() => {
                              const map = new Map<string, { name: string; role: string; avatar: string; setup?: SetupPost }>();
                              
                              if (user && (user.displayName || user.name)) {
                                const userName = user.displayName || user.name;
                                map.set(userName, {
                                  name: userName,
                                  role: user.bio || "Aktif Topluluk Üyesi 🚀",
                                  avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"
                                });
                              }

                              setups.forEach(s => {
                                if (s.owner && !map.has(s.owner)) {
                                  map.set(s.owner, {
                                    name: s.owner,
                                    role: s.bio || `${s.title} Sahibi`,
                                    avatar: s.ownerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
                                    setup: s
                                  });
                                }
                              });

                              const memberList = Array.from(map.values()).slice(0, 5);
                              return memberList.map((member, i) => (
                                <motion.div 
                                  key={member.name + i} 
                                  whileHover={{ y: -4, scale: 1.15, zIndex: 40 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                  onClick={() => member.setup ? setSelectedSetup(member.setup) : (user ? setShowProfileModal(true) : setShowAuthModal(true))}
                                  className="w-8 h-8 rounded-xl border-2 border-vibrant-dark  bg-vibrant-yellow overflow-hidden shadow-sm relative cursor-pointer shrink-0 group/avatar"
                                >
                                  <img 
                                    src={member.avatar} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).onerror = null; 
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80';
                                    }}
                                  />
                                </motion.div>
                              ));
                            })()}
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-black text-vibrant-dark  uppercase leading-none">{setups.length}+ Aktif Üye Masası</div>
                            <div className="text-[9px] font-bold text-slate-400  uppercase tracking-widest mt-1 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-vibrant-teal animate-pulse" />
                              Keşfedilmeyi Bekliyor
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Premium Interactive Bento (Spotlight + Community Stats) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      
                      {/* Spotlight Card */}
                      {setups.length > 0 && (() => {
                        const topSetup = [...setups].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
                        if (!topSetup) return null;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => setSelectedSetup(topSetup)}
                            className="bg-vibrant-bg  border-3 border-vibrant-dark  rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]  hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                          >
                            <div className="absolute top-2 right-2 bg-vibrant-coral text-white font-black uppercase text-[7px] tracking-[0.2em] px-2 py-0.5 rounded-md border border-vibrant-dark">
                              Haftanın Favorisi
                            </div>

                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-vibrant-dark  relative shrink-0">
                                <img src={topSetup.image} alt={topSetup.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <div className="min-w-0 text-left flex-1">
                                <span className="text-[9px] text-vibrant-coral font-black tracking-widest uppercase block mb-0.5">Topluluk Kürasyonu</span>
                                <h4 className="text-sm font-black text-vibrant-dark  truncate uppercase font-elegant-sans">{topSetup.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold truncate">@{topSetup.owner}</p>
                                <div className="flex items-center gap-2 mt-1.5 text-[9px] font-black text-vibrant-dark/60 ">
                                  <span>❤️ {topSetup.likes} Beğeni</span>
                                  <span>•</span>
                                  <span className="text-vibrant-coral group-hover:underline">Masayı İncele →</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}

                      {/* Community Stats Bento */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white  border-2 border-vibrant-dark  rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]  flex flex-col justify-center text-left group hover:bg-vibrant-yellow transition-all">
                          <span className="text-lg md:text-xl font-black text-vibrant-dark  font-serif">{setups.length}</span>
                          <span className="text-[8px] font-black uppercase text-slate-400  tracking-wider">Paylaşılan Masa</span>
                        </div>
                        <div className="bg-white  border-2 border-vibrant-dark  rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]  flex flex-col justify-center text-left group hover:bg-vibrant-yellow transition-all">
                          <span className="text-lg md:text-xl font-black text-vibrant-coral font-serif">{setups.reduce((acc, s) => acc + (s.likes || 0), 0)}</span>
                          <span className="text-[8px] font-black uppercase text-slate-400  tracking-wider">Toplam Beğeni</span>
                        </div>
                        <div className="bg-white  border-2 border-vibrant-dark  rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]  flex flex-col justify-center text-left group hover:bg-vibrant-yellow transition-all">
                          <span className="text-lg md:text-xl font-black text-vibrant-dark  font-serif">14</span>
                          <span className="text-[8px] font-black uppercase text-slate-400  tracking-wider">Şehir Katılımı</span>
                        </div>
                        <div className="bg-white  border-2 border-vibrant-dark  rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]  flex flex-col justify-center text-left group hover:bg-vibrant-yellow transition-all">
                          <span className="text-lg md:text-xl font-black text-vibrant-teal font-serif">99%</span>
                          <span className="text-[8px] font-black uppercase text-slate-400  tracking-wider">İlham Puanı</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Quick Category Badges Section */}
                  <div className="relative z-10 border-t-2 border-vibrant-dark/10  mt-8 pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Hızlı Filtre:</span>
                    {['Minimalist', 'RGB & Oyuncu', 'Yazılımcı Atölyesi', 'Cozy / Retro', 'Kreatif Stüdyo'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          const listElement = document.getElementById('setup-feed-section');
                          if (listElement) {
                            listElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="px-3.5 py-1.5 bg-white  hover:bg-vibrant-yellow  hover:text-vibrant-dark border-2 border-vibrant-dark  rounded-xl text-[9px] font-black uppercase tracking-wider text-vibrant-dark  transition-all shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none cursor-pointer"
                      >
                        #{cat}
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* Tab Switcher Content */}
            <div className="relative z-10">
              {activeTab === 'explore' ? (
                <SetupList 
                  setups={setups}
                  user={user}
                  onSelectSetup={setSelectedSetup}
                  onLikeSetup={handleLikeSetup}
                  onDeleteSetup={handleDeleteSetup}
                  onOpenAddModal={handleShareSetup}
                  onOpenAiChat={() => setStartChatWithOwner('ai-bot')}
                />
              ) : activeTab === 'leaderboard' ? (
                <Leaderboard 
                  onOpenInviteModal={() => setShowInviteModal(true)} 
                  currentUser={user}
                  allSetups={setups}
                  onSelectSetup={(setup) => setSelectedSetup(setup)}
                  onStartChat={(chatUser) => setStartChatWithOwner(chatUser.name)}
                />
              ) : activeTab === 'global-chat' ? (
                <Suspense fallback={<SkeletonLoader type="panel" />}>
                  <GlobalChat user={user} onAuthTrigger={() => setShowAuthModal(true)} />
                </Suspense>
              ) : activeTab === 'chatss' ? (
                <Suspense fallback={<SkeletonLoader type="panel" />}>
                  {user ? <SetupssChatss currentUser={user} /> : <div className="text-center mt-20"><button onClick={() => setShowAuthModal(true)} className="bg-[#ffd93d] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#f1cd33]">Giriş Yaparak Odalara Katıl</button></div>}
                </Suspense>
              ) : activeTab === 'hardware-graph' ? (
                <Suspense fallback={<SkeletonLoader type="panel" />}>
                  <HardwareKnowledgeGraphExplorer />
                </Suspense>
              ) : activeTab === 'blog' ? (
                <Suspense fallback={<SkeletonLoader type="panel" />}>
                  <BlogSection 
                    initialSlug={currentBlogSlug} 
                    onNavigateToHardware={(hwSlug) => {
                      window.history.pushState({}, '', `/hardware/${hwSlug}`);
                    }}
                    onSelectSetup={(sId) => {
                      const found = setups.find(s => s.id === sId);
                      if (found) setSelectedSetup(found);
                    }}
                    user={user}
                    onAuthTrigger={() => setShowAuthModal(true)}
                  />
                </Suspense>
              ) : (
                <Suspense fallback={<SkeletonLoader type="panel" />}>
                  <WishlistPlanner user={user} onOpenAuthModal={() => setShowAuthModal(true)} allSetups={setups} />
                </Suspense>
              )}
            </div>
          </motion.div>
        </AnimatePresence>


        <AboutInfoSection siteSettings={siteSettings} />

      </main>

      {/* Detail Overlay Modal */}
      {selectedSetup && (
        <SetupDetail 
          setup={selectedSetup}
          onClose={() => setSelectedSetup(null)}
          onLike={handleLikeSetup}
          onAddComment={handleAddComment}
          user={user}
          onAuthTrigger={() => setShowAuthModal(true)}
          onStartChat={(ownerName) => setStartChatWithOwner(ownerName)}
        />
      )}

      {/* Add Setup Wizard Modal */}
      {showAddModal && (
        <Suspense fallback={<SkeletonLoader type="modal" />}>
          <SetupForm 
            user={user}
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveNewSetup}
          />
        </Suspense>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(u) => {
            setUser(u);
            setShowAuthModal(false);
          }}
        />
      )}

      {/* Profile Editing Modal */}
      {showProfileModal && user && (
        <Suspense fallback={<SkeletonLoader type="modal" />}>
          <ProfileModal
            user={user}
            onClose={() => setShowProfileModal(false)}
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
              loadSetups();
            }}
            onLogout={handleLogout}
          />
        </Suspense>
      )}

      {/* Footer copyright with hidden admin panel trigger */}
      <AppFooter siteSettings={siteSettings} />

      {/* Invite Modal */}
      <InviteModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        currentUser={user}
        onAuthTrigger={() => setShowAuthModal(true)}
      />

      {/* Floating Chat Engine */}
      <Suspense fallback={null}>
        <ChatWidget 
          user={user}
          onAuthTrigger={() => setShowAuthModal(true)}
          startChatWithOwner={startChatWithOwner}
          onClearStartChat={() => setStartChatWithOwner(null)}
        />
      </Suspense>

      {/* Mobile Floating Bottom Navigation Bar */}
      <MobileWaveNavBar 
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setSelectedSetup(null);
          if (tabId === 'explore') navigateTo(ROUTES.EXPLORE);
          else if (tabId === 'hardware-graph') navigateTo('/hardware-graph');
          else if (tabId === 'chatss') navigateTo('/chatss');
          else if (tabId === 'leaderboard') navigateTo(ROUTES.LEADERBOARD);
          else if (tabId === 'wishlist') navigateTo(ROUTES.AI_PLANNER);
          else navigateTo(tabId.startsWith('/') ? tabId : `/${tabId}`);
        }}
        onToggleChat={() => {
          document.getElementById('setupss-chat-toggle-btn')?.click();
        }}
      />

    </div>
  );
}
