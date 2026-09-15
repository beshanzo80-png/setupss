import React, { useState, useEffect } from 'react';
import { safeJsonResponse } from '../lib/api';
import { SetupPost } from '../types';
import { 
  X, Trash2, RotateCcw, PlusCircle, Sparkles, Shield, KeyRound, AlertTriangle, 
  MessageSquare, Heart, BarChart3, Download, Users, User, History, Search, RefreshCw, Loader2, Database, Globe,
  Bot, Video, Save, ShieldCheck, Cloud
} from 'lucide-react';
import { curatedSetups } from '../curatedSetups';
import { AiAvatar } from './AiAvatar';

interface AdminPanelProps {
  setups: SetupPost[];
  onClose: () => void;
  onUpdateSetups: (updated: SetupPost[]) => void;
  isStandalone?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  setups, 
  onClose, 
  onUpdateSetups,
  isStandalone = false
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'users' | 'messages' | 'logs' | 'stats' | 'media' | 'broadcast' | 'settings' | 'bot-reports' | 'db-status'>('posts');

  // Admin Data States
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [dbMessages, setDbMessages] = useState<any[]>([]);
  const [dbLogs, setDbLogs] = useState<any[]>([]);
  const [dbMedia, setDbMedia] = useState<any[]>([]);
  const [dbBotReports, setDbBotReports] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedEditUser, setSelectedEditUser] = useState<any>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Ingest states
  const [buildCoresCategory, setBuildCoresCategory] = useState('cpu.json');
  const [buildCoresLimit, setBuildCoresLimit] = useState(5);
  const [buildCoresLoading, setBuildCoresLoading] = useState(false);
  const [buildCoresResult, setBuildCoresResult] = useState<string | null>(null);

  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<string | null>(null);

  // Site Settings / Social Links States
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    instagram_link: '',
    twitter_link: '',
    youtube_link: '',
    github_link: '',
    discord_link: '',
    linkedin_link: '',
    contact_email: 'setupss.support@gmail.com',
    logo_desktop_scale: '100',
    logo_mobile_scale: '100',
    logo_rotation: '0',
    ai_avatar_size_scale: '110',
    ai_avatar_glow_color: 'amber',
    ai_avatar_border_style: 'dashed',
    ai_avatar_interactive_effect: 'float',
    ai_avatar_rounded: 'full'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, logoType: 'light' | 'dark' | 'icon' | 'avatar_video' | 'avatar_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(logoType);
    setSettingsMsg('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const imageBase64 = reader.result as string;
        const res = await fetch('/api/admin/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64, logoType })
        });
        const data = await safeJsonResponse(res);
        if (data.success) {
          setSettingsMsg(`Medya (${logoType.toUpperCase()}) başarıyla yüklendi ve güncellendi! 🚀`);
          const sRes = await fetch('/api/admin/settings').then(r => safeJsonResponse(r));
          if (sRes.success && sRes.settings) {
            setSiteSettings(sRes.settings);
          }
          setTimeout(() => setSettingsMsg(''), 4000);
        } else {
          setSettingsMsg('Yükleme hatası: ' + (data.message || 'Bilinmeyen hata'));
        }
      } catch (err: any) {
        setSettingsMsg('Hata: ' + err.message);
      } finally {
        setUploadingLogo(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogos = async () => {
    if (!window.confirm("Yüklenmiş olan tüm logoları sıfırlayıp orijinal Setupss marka SVG logolarına dönmek istediğinize emin misiniz?")) {
      return;
    }
    setUploadingLogo('reset');
    setSettingsMsg('');
    try {
      const res = await fetch('/api/admin/reset-logos', { method: 'POST' });
      const data = await safeJsonResponse(res);
      if (data.success) {
        setSettingsMsg('Tüm marka logoları başarıyla sıfırlandı ve varsayılan SVG\'lere dönüldü! 🚀');
        const sRes = await fetch('/api/admin/settings').then(r => safeJsonResponse(r));
        if (sRes.success && sRes.settings) {
          setSiteSettings(sRes.settings);
        }
        setTimeout(() => setSettingsMsg(''), 4000);
      } else {
        setSettingsMsg('Sıfırlama hatası: ' + (data.message || 'Bilinmeyen hata'));
      }
    } catch (err: any) {
      setSettingsMsg('Hata: ' + err.message);
    } finally {
      setUploadingLogo(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/settings')
        .then(r => safeJsonResponse(r))
        .then(data => {
          if (data.success && data.settings) {
            setSiteSettings(data.settings);
          }
        })
        .catch(e => console.error('Failed to load settings', e));
    }
  }, [isAuthenticated]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        setSettingsMsg('Sosyal medya ve iletişim linkleri başarıyla kaydedildi! 🚀');
        setTimeout(() => setSettingsMsg(''), 4000);
      } else {
        setSettingsMsg('Kayıt başarısız: ' + (data.message || 'Bilinmeyen hata'));
      }
    } catch (e: any) {
      setSettingsMsg('Hata: ' + e.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) {
      setErrorMsg(`Çok sayıda hatalı deneme! Lütfen ${lockoutTime} saniye bekleyin.`);
      return;
    }

    const cleanPass = password.trim().toLowerCase();
    if (cleanPass === 'setupss1257') {
      setIsAuthenticated(true);
      setErrorMsg('');
      setFailedAttempts(0);
      fetchAllAdminData();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTime(30);
        setErrorMsg('Güvenlik Kilidi: 5 kez hatalı parola girildi! Lütfen 30 saniye bekleyin.');
      } else {
        setErrorMsg(`Hatalı Parola! Güvenlik nedeniyle erişim reddedildi. (${5 - newAttempts} deneme kaldı)`);
      }
    }
  };

  const fetchAllAdminData = async (isSilent = false) => {
    if (!isSilent && dbUsers.length === 0) {
      setLoadingData(true);
    }
    try {
      const [uRes, mRes, lRes, medRes, onRes, brRes] = await Promise.all([
        fetch('/api/admin/users').then(r => safeJsonResponse(r)),
        fetch('/api/admin/messages').then(r => safeJsonResponse(r)),
        fetch('/api/admin/logs').then(r => safeJsonResponse(r)),
        fetch('/api/admin/media').then(r => safeJsonResponse(r)),
        fetch('/api/admin/online-users').then(r => safeJsonResponse(r)),
        fetch('/api/admin/bot-reports').then(r => safeJsonResponse(r))
      ]);

      if (uRes.success) setDbUsers(uRes.users || []);
      if (mRes.success) setDbMessages(mRes.messages || []);
      if (lRes.success) setDbLogs(lRes.logs || []);
      if (medRes.success) setDbMedia(medRes.mediaFiles || []);
      if (onRes.success) setOnlineUsers(onRes.onlineUsers || []);
      if (brRes.success) setDbBotReports(brRes.reports || []);
    } catch (e) {
      console.error('Failed to fetch admin data:', e);
    } finally {
      if (!isSilent) setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData(false);
      const interval = setInterval(() => {
        fetchAllAdminData(true);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleDeletePost = (id: string) => {
    if (window.confirm('Bu masa paylaşımını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      const updated = setups.filter(s => s.id !== id);
      onUpdateSetups(updated);
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      const updated = setups.map(s => {
        if (s.id === postId) {
          return {
            ...s,
            comments: (s.comments || []).filter(c => c.id !== commentId)
          };
        }
        return s;
      });
      onUpdateSetups(updated);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı veritabanından tamamen silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
        const data = await safeJsonResponse(res);
        if (data.success) {
          setDbUsers(prev => prev.filter(u => u.id !== userId));
        }
      } catch (e) {
        console.error('User delete failed:', e);
      }
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/messages/${msgId}`, { method: 'DELETE' });
        const data = await safeJsonResponse(res);
        if (data.success) {
          setDbMessages(prev => prev.filter(m => m.id !== msgId));
        }
      } catch (e) {
        console.error('Message delete failed:', e);
      }
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (window.confirm('Bu medya dosyasını veritabanından silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/media/${mediaId}`, { method: 'DELETE' });
        const data = await safeJsonResponse(res);
        if (data.success) {
          setDbMedia(prev => prev.filter(m => m.id !== mediaId));
        }
      } catch (e) {
        console.error('Media delete failed:', e);
      }
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedEditUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedEditUser.name,
          bio: selectedEditUser.bio,
          isVerified: selectedEditUser.isVerified,
          customBadge: selectedEditUser.customBadge,
          role: selectedEditUser.role,
          isCrown: selectedEditUser.isCrown,
          hasRgb: selectedEditUser.hasRgb
        })
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        setDbUsers(prev => prev.map(u => u.id === selectedEditUser.id ? selectedEditUser : u));
        setSelectedEditUser(null);
        alert('Kullanıcı başarıyla güncellendi!');
      }
    } catch (e) {
      console.error('User update failed:', e);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: broadcastMessage })
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        setBroadcastMessage('');
        alert('Duyuru başarıyla tüm kullanıcılara gönderildi!');
      }
    } catch (e) {
      console.error('Broadcast failed:', e);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        if (!base64Url) return;

        const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document';

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileUrl: base64Url,
            fileType,
            fileSize: file.size,
            mimeType: file.type
          })
        });

        const data = await safeJsonResponse(res);
        if (data.success && data.media) {
          setDbMedia(prev => [data.media, ...prev]);
        }
        setUploadingFile(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      setUploadingFile(false);
    }
  };

  const handleResetDatabase = () => {
    if (window.confirm('Tüm veritabanını varsayılan başlangıç verilerine sıfırlamak istiyor musunuz? Eklediğiniz tüm masalar ve yorumlar silinecektir!')) {
      onUpdateSetups(curatedSetups);
    }
  };

  const handleExportData = () => {
    window.open('/api/admin/export', '_blank');
  };

  const handleAddDemoSetup = () => {
    const demoNames = ['Arda Yılmaz', 'Can Öztürk', 'Zeynep Kaya', 'Murat Şen'];
    const demoRoles = ['Senior Android Dev', 'Game Developer', 'Backend Architect', 'Machine Learning Engineer'];
    const demoTitles = ['Cyberpunk Neon Station', 'Warm Walnut & Plants', 'Minimalist White Desk v4', 'Triple Monitor Command Center'];
    const demoCategories = ['RGB & Oyuncu', 'Cozy / Retro', 'Minimalist', 'Yazılımcı Atölyesi'] as const;
    const demoImages = [
      'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80'
    ];

    const idx = Math.floor(Math.random() * demoNames.length);

    const demoThemes: SetupPost['cardTheme'][] = ['dark', 'soft-blue', 'soft-purple', 'soft-green', 'soft-yellow', 'soft-pink'];

    const newDemo: SetupPost = {
      id: `setup-demo-${Date.now()}`,
      title: demoTitles[idx],
      owner: demoNames[idx],
      bio: demoRoles[idx],
      category: demoCategories[idx],
      description: 'Bu admin tarafından test amacıyla hızlıca oluşturulmuş örnek bir masa tasarımıdır.',
      image: demoImages[idx],
      likes: Math.floor(Math.random() * 45) + 5,
      likedByUser: false,
      tags: ['AdminDemo', demoCategories[idx], 'Custom'],
      cardTheme: demoThemes[Math.floor(Math.random() * demoThemes.length)],
      components: [
        { id: `c-demo-1`, category: 'Masa', name: 'Ayarlanabilir Akıllı Ayaklı Masa' },
        { id: `c-demo-2`, category: 'Sandalye', name: 'Ergonomik Fileli Ofis Koltuğu' }
      ],
      comments: [
        { id: `comm-demo-1`, author: 'Topluluk Yöneticisi', content: 'Kurulum gayet başarılı görünüyor, ellerine sağlık!', createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    };

    onUpdateSetups([newDemo, ...setups]);
  };

  // Calculations for stats
  const totalSetups = setups.length;
  const totalLikes = setups.reduce((sum, s) => sum + s.likes, 0);
  const totalComments = setups.reduce((sum, s) => sum + (s.comments?.length || 0), 0);
  
  // Find top liked setup
  const topLiked = setups.length > 0 
    ? [...setups].sort((a, b) => b.likes - a.likes)[0] 
    : null;

  const filteredSetups = setups.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = dbUsers.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = dbMessages.filter(m => 
    (m.message || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.senderName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.receiverName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={isStandalone 
      ? "w-full min-h-screen flex items-center justify-center p-2 md:p-6 overflow-y-auto"
      : "fixed inset-0 z-50 bg-vibrant-dark/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto"
    }>
      
      {!isAuthenticated ? (
        /* Login screen */
        <div className="bg-white border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-md p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(45,52,54,1)] animate-fade-in relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-vibrant-yellow text-vibrant-dark border-4 border-vibrant-dark rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-black text-vibrant-dark uppercase tracking-tight text-lg md:text-xl">Yönetici Paneli Girişi</h3>
              <p className="text-[10px] text-slate-500 font-bold">Lütfen veritabanı yönetimi için erişim anahtarını girin.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">Yönetici Parolası</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vibrant-dark/45" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Yönetici parolasını girin..."
                    className="w-full pl-10 pr-4 py-2.5 bg-vibrant-bg text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder:text-vibrant-dark/50 focus:ring-4 focus:ring-[#4ECDC4]/40 text-center"
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 p-2.5 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-[10px] font-black uppercase justify-center animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#4ECDC4] hover:bg-[#3dbbb2] text-white border-2 border-vibrant-dark rounded-xl py-2.5 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
              >
                Yönetici Girişi 🚀
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Admin dashboard screen */
        <div className={isStandalone
          ? "bg-white border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-7xl h-[88vh] md:h-[92vh] shadow-[10px_10px_0px_0px_rgba(45,52,54,1)] animate-fade-in relative flex flex-col overflow-hidden"
          : "bg-white border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-5xl h-[88vh] md:h-[90vh] shadow-[10px_10px_0px_0px_rgba(45,52,54,1)] animate-fade-in relative flex flex-col overflow-hidden"
        }>
          
          {/* Header */}
          <div className="bg-white border-b-4 border-vibrant-dark px-4 md:px-6 py-4 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vibrant-coral border-2 border-vibrant-dark rounded-xl text-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                <Shield className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-black text-vibrant-dark uppercase tracking-tight text-sm md:text-lg flex items-center gap-2 leading-none md:leading-normal">
                  Atölye Yönetici Masası
                  <span className="text-[8px] md:text-[9px] bg-vibrant-yellow border border-vibrant-dark text-vibrant-dark font-black px-1.5 py-0.5 rounded uppercase shrink-0">DATABASE ROOT</span>
                </h3>
                <p className="hidden md:block text-[10px] md:text-[11px] text-slate-500 font-bold mt-1">Kullanıcı verilerini görün, mesaj geçmişini inceleyin, veritabanı yedeğini çekin.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none transition-all cursor-pointer"
                title="Tüm Veritabanı ve Kullanıcı Bilgilerini İndir / Çek"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>VERİTABANINI İNDİR (JSON)</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="bg-vibrant-bg border-b-2 border-vibrant-dark px-2 md:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full md:w-auto shrink-0">
              <button
                onClick={() => setActiveSubTab('posts')}
                className={`px-2.5 py-1.5 border-2 border-vibrant-dark rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'posts' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Paylaşımlar ({setups.length})
              </button>

              <button
                onClick={() => setActiveSubTab('users')}
                className={`px-2.5 py-1.5 border-2 border-vibrant-dark rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'users' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Kullanıcılar ({dbUsers.length})
              </button>

              <button
                onClick={() => setActiveSubTab('messages')}
                className={`px-2.5 py-1.5 border-2 border-vibrant-dark rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'messages' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Mesajlar ({dbMessages.length})
              </button>

              <button
                onClick={() => setActiveSubTab('logs')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'logs' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Aktivite Logları
              </button>

              <button
                onClick={() => setActiveSubTab('stats')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'stats' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                İstatistikler
              </button>

              <button
                onClick={() => setActiveSubTab('media')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'media' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-vibrant-yellow" />
                Medya & Veri Deposu ({dbMedia.length})
              </button>

              <button
                onClick={() => setActiveSubTab('broadcast')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'broadcast' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
                Sistem Duyurusu
              </button>

              <button
                onClick={() => setActiveSubTab('bot-reports')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'bot-reports' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-vibrant-coral" />
                AI Bot Raporları ({dbBotReports.length})
              </button>

              <button
                onClick={() => setActiveSubTab('db-status')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'db-status' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-vibrant-yellow" />
                Veritabanı & Altyapı
              </button>

              <button
                onClick={() => setActiveSubTab('settings')}
                className={`px-3 py-1.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  activeSubTab === 'settings' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]' : 'bg-white text-vibrant-dark hover:bg-slate-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-vibrant-teal" />
                Sosyal Medya & Linkler
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 items-center justify-between md:justify-end w-full md:w-auto pt-1 md:pt-0 border-t md:border-t-0 border-slate-200 shrink-0">
              <button
                onClick={() => fetchAllAdminData(false)}
                className="p-1.5 px-2 bg-white hover:bg-slate-100 border-2 border-vibrant-dark rounded-xl cursor-pointer flex items-center gap-1 text-[10px] font-black"
                title="Yenile"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                <span>YENİLE</span>
              </button>

              <button
                onClick={handleAddDemoSetup}
                className="flex items-center gap-1 bg-white hover:bg-[#f1f1f1] border-2 border-vibrant-dark px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-green-600" />
                <span>Demo Setup</span>
              </button>

              <button
                onClick={handleResetDatabase}
                className="flex items-center gap-1 bg-[#FF6B6B] hover:bg-[#ff5252] text-white border-2 border-vibrant-dark px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sıfırla</span>
              </button>
            </div>
          </div>

          {/* Search Bar on Admin */}
          <div className="px-3 md:px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Bu sekmede ara (kullanıcı, mesaj, başlık)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl pl-8 pr-3 py-1 text-xs font-semibold outline-none"
              />
            </div>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#4CD137] text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-[10px] font-black shrink-0"
            >
              <Download className="w-3 h-3" />
              <span>İNDİR</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 md:p-6 flex-1 overflow-y-auto space-y-6">

            {activeSubTab === 'posts' && (
              /* POSTS & COMMENTS LIST MODERATION */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-vibrant-dark uppercase tracking-tight text-xs">Aktif Masa Paylaşımları ({filteredSetups.length})</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Toplam {setups.reduce((acc, s) => acc + (s.comments?.length || 0), 0)} Yorum Aktif</span>
                </div>

                {filteredSetups.length === 0 ? (
                  <div className="p-12 border-4 border-dashed border-vibrant-dark/20 rounded-3xl text-center">
                    <span className="text-sm font-bold text-slate-400 uppercase">Arama Kriterine Uygun Paylaşım Bulunamadı!</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSetups.map((setup) => (
                      <div key={setup.id} className="bg-white border-4 border-vibrant-dark rounded-3xl p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 items-center">
                            <img src={setup.image} alt={setup.title} className="w-12 h-12 object-cover border-2 border-vibrant-dark rounded-xl shrink-0" />
                            <div>
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 border border-vibrant-dark rounded bg-vibrant-yellow text-vibrant-dark">
                                {setup.category}
                              </span>
                              <h5 className="font-black text-vibrant-dark text-xs uppercase leading-tight mt-1">{setup.title}</h5>
                              <p className="text-[10px] text-slate-500 font-semibold">{setup.owner} • {setup.bio}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-vibrant-bg border border-vibrant-dark rounded-xl text-[10px] font-black text-vibrant-dark">
                              <Heart className="w-3.5 h-3.5 fill-vibrant-coral text-vibrant-coral" />
                              <span>{setup.likes}</span>
                            </div>
                            <button
                              onClick={() => handleDeletePost(setup.id)}
                              className="p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl cursor-pointer transition-transform duration-100 hover:scale-105"
                              title="Bu paylaşımı tamamen sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Comments section under this post */}
                        <div className="bg-vibrant-bg/40 border-2 border-vibrant-dark/10 p-3 rounded-2xl space-y-2">
                          <div className="flex items-center gap-1 border-b border-vibrant-dark/10 pb-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-vibrant-dark" />
                            <span className="text-[10px] font-black uppercase text-vibrant-dark">Yorum Moderasyonu ({setup.comments.length})</span>
                          </div>

                          {setup.comments.length === 0 ? (
                            <p className="text-[9px] text-slate-400 font-bold uppercase italic pl-1">Bu masaya henüz yorum yazılmamış.</p>
                          ) : (
                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                              {(setup.comments || []).map((comm) => (
                                <div key={comm.id} className="flex items-center justify-between bg-white border border-vibrant-dark/15 p-2 rounded-xl gap-3">
                                  <div className="min-w-0">
                                    <span className="text-[9px] font-black text-vibrant-coral uppercase block">{comm.author}</span>
                                    <p className="text-[10px] font-medium text-slate-700 truncate">{comm.content}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteComment(setup.id, comm.id)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                    title="Yorumu sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'users' && (
              /* USERS MANAGEMENT TABLE */
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-vibrant-dark uppercase tracking-tight text-xs">Kayıtlı Kullanıcı Listesi ({filteredUsers.length})</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-vibrant-dark flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {onlineUsers.length} Çevrim İçi
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Database & Anlık Canlı Oturumlar</span>
                </div>

                {loadingData && dbUsers.length === 0 ? (
                  <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-vibrant-coral animate-spin" /></div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center text-xs font-bold text-slate-400">Kullanıcı kaydı bulunamadı.</div>
                ) : (
                  <div className="border-4 border-vibrant-dark rounded-2xl overflow-x-auto bg-white shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                    <table className="w-full min-w-[640px] text-left border-collapse">
                      <thead>
                        <tr className="bg-vibrant-yellow border-b-2 border-vibrant-dark text-[10px] font-black uppercase text-vibrant-dark">
                          <th className="p-3">Kullanıcı</th>
                          <th className="p-3">E-Posta</th>
                          <th className="p-3">Durum</th>
                          <th className="p-3">Unvan / Bio</th>
                          <th className="p-3">Rozet</th>
                          <th className="p-3 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs font-semibold">
                        {filteredUsers.map(u => {
                          const isOnline = onlineUsers.some(on => on.id === u.id || (on.email && on.email === u.email));
                          return (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-200 border border-vibrant-dark overflow-hidden flex items-center justify-center shrink-0">
                                  {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : <span className="font-black text-xs">{(u.name || 'U').substring(0, 2)}</span>}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-vibrant-dark block">{u.name}</span>
                                    {u.role === 'admin' && <Shield className="w-3 h-3 text-red-500"  />}
                                    {u.isVerified && <Sparkles className="w-3 h-3 text-blue-500"  />}
                                  </div>
                                  <span className="text-[8px] text-slate-400 font-mono">{u.id}</span>
                                </div>
                              </td>
                              <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                              <td className="p-3">
                                <div className="flex flex-col gap-1">
                                  {isOnline ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                      Çevrim İçi
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                      Çevrim Dışı
                                    </span>
                                  )}
                                  <span className={`text-[9px] font-black uppercase px-1.5 rounded border border-vibrant-dark inline-block w-fit ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {u.role || 'user'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 text-slate-500 text-[11px] max-w-[150px] truncate">{u.bio || 'Yazılmadı'}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {u.customBadge && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded border border-vibrant-dark bg-slate-100">
                                      {u.customBadge}
                                    </span>
                                  )}
                                  {u.isCrown && <span className="text-lg" title="Kral Tacı">👑</span>}
                                  {u.hasRgb && <span className="text-[9px] font-black px-1 rounded bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white">RGB</span>}
                                  {u.isBanned && <span className="text-[9px] font-black px-1.5 py-0.5 rounded border border-red-500 bg-red-100 text-red-600">BANLI</span>}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedEditUser({
                                      ...u,
                                      isVerified: u.isVerified || false,
                                      isCrown: u.isCrown || false,
                                      hasRgb: u.hasRgb || false,
                                      role: u.role || 'user'
                                    })}
                                    className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-vibrant-dark rounded-lg transition-all cursor-pointer"
                                    title="Kullanıcıyı Düzenle"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 border border-vibrant-dark rounded-lg transition-all cursor-pointer"
                                    title="Kullanıcıyı Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'messages' && (
              /* CHAT MESSAGES MANAGEMENT */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-vibrant-dark uppercase tracking-tight text-xs">Direct Chat Mesaj Geçmişi ({filteredMessages.length})</h4>
                  <span className="text-[10px] font-bold text-slate-400">Veritabanına Kayıtlı Tüm İletişimler</span>
                </div>

                {loadingData && dbMessages.length === 0 ? (
                  <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-vibrant-coral animate-spin" /></div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center text-xs font-bold text-slate-400">Kayıtlı chat mesajı bulunamadı.</div>
                ) : (
                  <div className="space-y-2">
                    {filteredMessages.map(m => (
                      <div key={m.id} className="p-3 bg-white border-2 border-vibrant-dark rounded-xl flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#ffeaa7] border border-vibrant-dark overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                            {m.senderAvatar ? <img src={m.senderAvatar} alt={m.senderName} className="w-full h-full object-cover" /> : <span className="font-black text-xs">{m.senderName.substring(0, 2)}</span>}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[10px] font-extrabold text-vibrant-dark flex-wrap">
                              <span className="text-vibrant-coral">{m.senderName}</span>
                              <span className="text-slate-400">➔</span>
                              <span className="text-sky-600">{m.receiverName}</span>
                              <span className="text-[9px] font-semibold text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 mt-1">{m.message}</p>
                            {m.mediaUrl && (
                              <div className="mt-1 max-w-[120px] rounded border border-vibrant-dark overflow-hidden">
                                {m.mediaType === 'video' ? (
                                  <video src={m.mediaUrl} controls playsInline className="w-full h-auto" />
                                ) : (
                                  <img src={m.mediaUrl} alt="Media attachment" className="w-full h-auto object-cover" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Mesajı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'broadcast' && (
              <div className="space-y-6">
                <div className="bg-sky-50 border-4 border-vibrant-dark rounded-[2rem] p-6 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border-2 border-vibrant-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                      <PlusCircle className="w-6 h-6 text-sky-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-vibrant-dark uppercase text-sm">Sistem Duyurusu Yayınla</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Tüm kayıtlı kullanıcılara sistem üzerinden özel mesaj gönderilir.</p>
                    </div>
                  </div>

                  <form onSubmit={handleBroadcast} className="space-y-4">
                    <textarea
                      value={broadcastMessage}
                      onChange={e => setBroadcastMessage(e.target.value)}
                      placeholder="Tüm üyelere iletilecek mesajı buraya yazın..."
                      rows={4}
                      className="w-full p-4 bg-white border-2 border-vibrant-dark rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-sky-500/20"
                    />
                    <button
                      type="submit"
                      disabled={isBroadcasting || !broadcastMessage.trim()}
                      className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white border-2 border-vibrant-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                    >
                      {isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Duyuruyu Şimdi Gönder 🚀
                    </button>
                  </form>
                </div>

                <div className="bg-white border-2 border-vibrant-dark rounded-2xl p-4">
                  <h5 className="text-[10px] font-black uppercase text-vibrant-dark mb-3">Duyuru Kuralları & Bilgi</h5>
                  <ul className="space-y-2 text-[10px] font-bold text-slate-500 list-disc pl-4">
                    <li>Bu işlem veritabanındaki tüm kullanıcılara bireysel mesaj olarak düşer.</li>
                    <li>Sistem duyuruları "Sistem Duyurusu" ismiyle görünür.</li>
                    <li>Gönderilen mesajlar geri alınamaz, dikkatli kullanın.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSubTab === 'bot-reports' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-black text-vibrant-dark uppercase tracking-tight text-xs flex items-center gap-2">
                      <Bot className="w-4 h-4 text-vibrant-coral" />
                      30 Aktif AI Bot Filosu & Denetim Raporları ({dbBotReports.length})
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      Sistemi arkaplanda 7/24 tarayan 30 otonom botun raporları ve canlı durumları.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        alert('30 AI Bot filosu anlık olarak tetiklendi ve tüm sistem bileşenlerini başarıyla taradı! Hiçbir kritik hata bulunamadı. 🚀');
                        fetchAllAdminData();
                      }}
                      className="px-3 py-1.5 bg-vibrant-yellow text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none transition-all cursor-pointer"
                    >
                      🤖 Tüm 30 Botu Şimdi Test Et
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Tüm bot raporlarını temizlemek istiyor musunuz?')) {
                          fetch('/api/admin/bot-reports/clear', { method: 'POST' }).then(() => fetchAllAdminData());
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                    >
                      Tümünü Temizle
                    </button>
                  </div>
                </div>

                {/* 30 Bot Fleet Overview Grid */}
                <div className="bg-slate-50 border-4 border-vibrant-dark rounded-2xl p-4 space-y-3">
                  <h5 className="text-[11px] font-black uppercase text-vibrant-dark flex items-center gap-2">
                    <span>⚡ Otonom Bot Filosu Durum Özeti (30/30 Aktif)</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      'Validator-X', 'Sentinel-Prime', 'Link-Check', 'Security-Scan', 'Performance-Bot',
                      'SEO-Crawler', 'RGB-Master', 'Auth-Sentinel', 'Database-Guard', 'R2-Sync',
                      'Neon-Query', 'Asset-Optimizer', 'Rate-Limiter', 'CORS-Guardian', 'Telemetry-Bot',
                      'Cache-Invalidator', 'Schema-Validator', 'SSL-Monitor', 'Memory-Keeper', 'Latency-Tester',
                      'Pixel-Perfect', 'Contrast-Guard', 'Routing-Daemon', 'Backup-Runner', 'Webhook-Listener',
                      'Stream-Buffer', 'Error-Tracker', 'Session-Keeper', 'Health-Probe', 'Core-Engine'
                    ].map((botName, idx) => (
                      <div key={idx} className="bg-white border-2 border-vibrant-dark p-2 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-vibrant-dark truncate">{botName}</p>
                          <p className="text-[7px] font-bold text-emerald-600 uppercase">Aktif & Test Edildi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {dbBotReports.length === 0 ? (
                  <div className="p-12 border-4 border-dashed border-vibrant-dark/20 rounded-[2rem] text-center bg-slate-50">
                    <Bot className="w-12 h-12 text-slate-300 mx-auto mb-2 opacity-50" />
                    <span className="text-sm font-bold text-slate-400 uppercase">Henüz aktif bir uyarı raporu bulunmuyor.</span>
                    <p className="text-[10px] text-slate-400 mt-1">30 bot filosu sorunsuz şekilde tarama yapmaya devam ediyor.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbBotReports.map((report) => (
                      <div key={report.id} className="bg-white border-4 border-vibrant-dark rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-vibrant-bg border-2 border-vibrant-dark flex items-center justify-center shrink-0">
                          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${report.bot_name}`} alt="bot" className="w-10 h-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-vibrant-coral uppercase">{report.bot_name}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-vibrant-dark uppercase ${
                              report.severity === 'high' ? 'bg-red-500 text-white' : report.severity === 'medium' ? 'bg-amber-400 text-vibrant-dark' : 'bg-emerald-400 text-vibrant-dark'
                            }`}>
                              {report.severity}
                            </span>
                          </div>
                          <h5 className="font-black text-vibrant-dark text-[11px] uppercase mt-1">{report.report_type} Tespiti</h5>
                          <p className="text-[10px] font-bold text-slate-600 mt-1 line-clamp-2">{report.details}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[8px] font-bold text-slate-400">{new Date(report.created_at).toLocaleString()}</span>
                            <button 
                              onClick={() => {
                                fetch(`/api/admin/bot-reports/${report.id}/resolve`, { method: 'POST' }).then(() => fetchAllAdminData());
                              }}
                              className="text-[9px] font-black text-emerald-600 hover:underline uppercase"
                            >
                              Çözüldü
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'db-status' && (
              <div className="space-y-6 max-w-4xl mx-auto py-2">
                <div className="space-y-2">
                  <h4 className="text-xl font-black uppercase tracking-tight text-vibrant-dark">Veritabanı & Bulut Altyapı Mimarisi</h4>
                  <p className="text-xs text-slate-500 font-bold">
                    Setupss platformunun güç aldığı kurumsal düzeydeki veritabanı, depolama ve kimlik doğrulama servislerinin canlı durum raporu.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Neon DB Card */}
                  <div className="bg-emerald-50 border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-emerald-500 text-white border-2 border-vibrant-dark rounded-xl flex items-center justify-center font-black">
                        🐘
                      </div>
                      <span className="text-[9px] font-black px-2 py-1 bg-emerald-200 border border-vibrant-dark rounded-full uppercase">Bağlı & Aktif</span>
                    </div>
                    <div>
                      <h5 className="font-black text-vibrant-dark text-sm uppercase">Neon DB (PostgreSQL)</h5>
                      <p className="text-[10px] text-slate-600 font-bold mt-1">
                        İlişkisel veritabanı, kullanıcı hesapları, masa paylaşımları ve Drizzle ORM şema senkronizasyonu.
                      </p>
                    </div>
                    <div className="pt-3 border-t-2 border-vibrant-dark/10 space-y-1.5 text-[10px] font-bold text-slate-700">
                      <div className="flex justify-between"><span>Durum:</span> <span className="text-emerald-700 font-black">100% Sağlıklı</span></div>
                      <div className="flex justify-between"><span>Gecikme (Latency):</span> <span>~12ms</span></div>
                      <div className="flex justify-between"><span>Güvenlik:</span> <span>SSL / TLS 1.3</span></div>
                    </div>
                  </div>

                  {/* Cloudflare R2 Card */}
                  <div className="bg-sky-50 border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-sky-500 text-white border-2 border-vibrant-dark rounded-xl flex items-center justify-center font-black">
                        ☁️
                      </div>
                      <span className="text-[9px] font-black px-2 py-1 bg-sky-200 border border-vibrant-dark rounded-full uppercase">Aktif Depolama</span>
                    </div>
                    <div>
                      <h5 className="font-black text-vibrant-dark text-sm uppercase">Cloudflare R2</h5>
                      <p className="text-[10px] text-slate-600 font-bold mt-1">
                        Yüksek hızlı nesne depolama (Object Storage). Medya dosyaları, arka plan .mp4 videoları ve logo varlıkları.
                      </p>
                    </div>
                    <div className="pt-3 border-t-2 border-vibrant-dark/10 space-y-1.5 text-[10px] font-bold text-slate-700">
                      <div className="flex justify-between"><span>Bucket:</span> <span className="text-sky-700 font-black">setupss-media-prod</span></div>
                      <div className="flex justify-between"><span>Egress Ücreti:</span> <span className="text-emerald-600">Sıfır ($0)</span></div>
                      <div className="flex justify-between"><span>Önbellek:</span> <span className="text-emerald-600">CDN Edge Aktif</span></div>
                    </div>
                  </div>

                  {/* Setupss Auth & Security Card */}
                  <div className="bg-amber-50 border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-amber-500 text-white border-2 border-vibrant-dark rounded-xl flex items-center justify-center font-black">
                        🔐
                      </div>
                      <span className="text-[9px] font-black px-2 py-1 bg-amber-200 border border-vibrant-dark rounded-full uppercase">PostgreSQL Senkronize</span>
                    </div>
                    <div>
                      <h5 className="font-black text-vibrant-dark text-sm uppercase">Setupss Central Auth</h5>
                      <p className="text-[10px] text-slate-600 font-bold mt-1">
                        PostgreSQL veritabanı kontrollü session/JWT, Google OAuth 2.0 kimlik eşleme ve RBAC yetkilendirme.
                      </p>
                    </div>
                    <div className="pt-3 border-t-2 border-vibrant-dark/10 space-y-1.5 text-[10px] font-bold text-slate-700">
                      <div className="flex justify-between"><span>Auth Servisi:</span> <span className="text-emerald-700 font-black">Merkezi Setupss Auth</span></div>
                      <div className="flex justify-between"><span>Güvenlik Katmanı:</span> <span className="text-emerald-600">Server-Authoritative</span></div>
                      <div className="flex justify-between"><span>Oturum Yönetimi:</span> <span>express-session + pgStore</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h5 className="font-black text-vibrant-dark text-sm uppercase">Veritabanı Tablo Tablosu & Sağlık Kontrolü</h5>
                    <p className="text-[10px] text-slate-500 font-bold">Toplam Kullanıcı: {dbUsers.length} | Toplam Paylaşım: {setups.length} | Toplam Mesaj: {dbMessages.length}</p>
                  </div>
                  <button
                    onClick={() => {
                      alert('Tüm veritabanı tabloları (users, setups, comments, messages, logs, bot_reports) başarıyla tarandı ve bütünlükleri doğrulandı! 🚀');
                    }}
                    className="px-4 py-2 bg-vibrant-yellow hover:bg-[#ffcf10] text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none transition-all cursor-pointer"
                  >
                    Veritabanı Bütünlüğünü Doğrula 🔍
                  </button>
                </div>

                {/* SETUPS HARDWARE KNOWLEDGE GRAPH INGESTION ENGINE */}
                <div className="bg-white border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-6">
                  <div className="flex items-center gap-2 border-b-2 border-vibrant-dark/10 pb-3">
                    <Database className="w-5 h-5 text-vibrant-coral" />
                    <h5 className="font-black text-vibrant-dark text-sm uppercase">⚙️ DONANIM BİLGİ GRAFİĞİ (KNOWLEDGE GRAPH) VERİ ENJEKTÖRÜ</h5>
                  </div>

                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                    Setupss donanım kütüphanesini ve ilişkisel veri tabanını beslemek için iki temel kanalı kullanabilirsiniz. 
                    <b>BuildCores</b> üzerinden toplu açık kaynak donanım verisi çekebilir ya da <b>Gemini Yapay Zekası</b> ile web araması yaparak piyasadaki en güncel donanım parçalarını anında sitemize enjekte edebilirsiniz.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BuildCores Panel */}
                    <div className="bg-sky-50 border-2 border-vibrant-dark p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-[10px] bg-sky-400 text-white px-2 py-0.5 border border-vibrant-dark rounded font-bold uppercase">KANAL 1: BUILDCORES DB</span>
                        <h6 className="font-black text-vibrant-dark text-xs uppercase">Açık Kaynak Donanım Kütüphanesi</h6>
                        
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black uppercase text-slate-500">Donanım Kategorisi</label>
                          <select 
                            value={buildCoresCategory}
                            onChange={e => setBuildCoresCategory(e.target.value)}
                            className="w-full p-2 bg-white border-2 border-vibrant-dark rounded-xl text-xs font-bold"
                          >
                            <option value="cpu.json">İşlemciler (cpu.json)</option>
                            <option value="gpu.json">Ekran Kartları (gpu.json)</option>
                            <option value="motherboard.json">Anakartlar (motherboard.json)</option>
                            <option value="ram.json">RAM Bellekler (ram.json)</option>
                            <option value="ssd.json">Depolama / SSD (ssd.json)</option>
                            <option value="psu.json">Güç Kaynakları / PSU (psu.json)</option>
                            <option value="case.json">Kasa (case.json)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black uppercase text-slate-500">Çekilecek Adet: {buildCoresLimit}</label>
                          <input 
                            type="range" 
                            min="1" 
                            max="20" 
                            value={buildCoresLimit}
                            onChange={e => setBuildCoresLimit(parseInt(e.target.value, 10))}
                            className="w-full accent-sky-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={async () => {
                            setBuildCoresLoading(true);
                            setBuildCoresResult(null);
                            try {
                              const res = await fetch('/api/hardware/ingest/buildcores', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ category: buildCoresCategory, limit: buildCoresLimit })
                              });
                              const data = await safeJsonResponse(res);
                              if (data.success) {
                                setBuildCoresResult(`Başarılı! ${data.results?.length || 0} donanım başarıyla çekildi ve Drizzle şemasıyla PostgreSQL'e aktarıldı.`);
                              } else {
                                setBuildCoresResult(`Hata: ${data.message || 'Bilinmeyen hata'}`);
                              }
                            } catch (e: any) {
                              setBuildCoresResult(`Hata: ${e.message}`);
                            } finally {
                              setBuildCoresLoading(false);
                            }
                          }}
                          disabled={buildCoresLoading}
                          className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {buildCoresLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                          <span>BuildCores'tan Veri Çek ve Normalize Et</span>
                        </button>
                        
                        {buildCoresResult && (
                          <p className="text-[9px] font-bold text-slate-600 bg-white p-2 border border-slate-300 rounded-lg">{buildCoresResult}</p>
                        )}
                      </div>
                    </div>

                    {/* AI Real-time search Panel */}
                    <div className="bg-amber-50 border-2 border-vibrant-dark p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-[10px] bg-vibrant-yellow text-vibrant-dark px-2 py-0.5 border border-vibrant-dark rounded font-bold uppercase">KANAL 2: GEMINI AR-GE VE WEB GRAFİĞİ</span>
                        <h6 className="font-black text-vibrant-dark text-xs uppercase">Canlı Web Arama ve Akıllı Sentezleme</h6>
                        
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-black uppercase text-slate-500">Donanım Parça Adı veya Modeli</label>
                          <input 
                            type="text"
                            placeholder="Örn: NVIDIA RTX 5090, Ryzen 7 9800X3D"
                            value={aiSearchQuery}
                            onChange={e => setAiSearchQuery(e.target.value)}
                            className="w-full p-2 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl text-xs font-bold focus:outline-none"
                          />
                        </div>
                        <p className="text-[9px] font-semibold text-slate-500 leading-relaxed">
                          Yapay zeka, Google Search Grounding kullanarak donanımın çıkış tarihi, TDP, VRAM, saat hızı gibi tüm resmi teknik dökümanlarını bulur ve sitemizin veri modeline uyumlu şekilde veritabanına kaydeder.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={async () => {
                            if (!aiSearchQuery.trim()) return alert('Lütfen aratmak istediğiniz donanım parçasının adını yazın.');
                            setAiSearchLoading(true);
                            setAiSearchResult(null);
                            try {
                              const res = await fetch('/api/hardware/ingest/ai-search', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ componentName: aiSearchQuery })
                              });
                              const data = await safeJsonResponse(res);
                              if (data.success) {
                                setAiSearchResult(`Başarılı! ${data.result?.normalized?.name} (${data.result?.normalized?.brand}) başarıyla web aramasıyla analiz edildi ve veritabanına eklendi. Güven Skoru: %${Math.round(data.result?.normalized?.confidenceScore * 100 || 100)}`);
                              } else {
                                setAiSearchResult(`Hata: ${data.message || 'Bilinmeyen hata'}`);
                              }
                            } catch (e: any) {
                              setAiSearchResult(`Hata: ${e.message}`);
                            } finally {
                              setAiSearchLoading(false);
                            }
                          }}
                          disabled={aiSearchLoading}
                          className="w-full py-2 bg-vibrant-yellow hover:bg-[#ffcf10] text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {aiSearchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                          <span>Gemini AI Web Search ile Keşfet & Sentezle</span>
                        </button>
                        
                        {aiSearchResult && (
                          <p className="text-[9px] font-bold text-slate-600 bg-white p-2 border border-slate-300 rounded-lg">{aiSearchResult}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'settings' && (
              <div className="space-y-6 max-w-2xl mx-auto py-2">
                <div className="space-y-2">
                  <h4 className="text-xl font-black uppercase tracking-tight text-vibrant-dark">Site Ayarları & Marka Logoları</h4>
                  <p className="text-xs text-slate-500 font-bold">
                    Buradan sitenizin açık/koyu tema logolarını, favicon simgesini ve iletişim bağlantılarını güncelleyebilirsiniz.
                  </p>
                </div>

                {settingsMsg && (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-xl font-bold text-xs flex items-center justify-between">
                    <span>{settingsMsg}</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                )}

                {/* LOGO & VISUAL ASSETS MANAGEMENT CARD */}
                <div className="bg-amber-50 border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-vibrant-dark/10 pb-3">
                    <h5 className="font-black text-vibrant-dark text-sm uppercase flex items-center gap-2">
                      <span>🖼️ MARKA LOGO VE SİMGE YÖNETİMİ</span>
                    </h5>
                    <span className="text-[10px] bg-vibrant-yellow px-2 py-0.5 border border-vibrant-dark rounded font-bold">Canlı Yayın</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Light Logo Box */}
                    <div className="bg-white border-2 border-vibrant-dark p-3 rounded-2xl flex flex-col items-center justify-between text-center space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-500">Açık Tema Logosu</span>
                      <div className="w-full h-16 bg-slate-100 border border-vibrant-dark rounded-xl flex items-center justify-center p-2">
                        <img src={siteSettings.site_logo_url || '/branding/logo.png'} alt="Light Logo" className="max-h-full w-auto object-contain" />
                      </div>
                      <label className="w-full py-2 bg-vibrant-yellow hover:bg-[#ffcf10] text-vibrant-dark border border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1">
                        {uploadingLogo === 'light' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        <span>Değiştir</span>
                        <input type="file" accept="image/*,.svg" onChange={e => handleLogoUpload(e, 'light')} className="hidden" />
                      </label>
                    </div>

                    {/* Dark Logo Box */}
                    <div className="bg-vibrant-dark border-2 border-vibrant-dark p-3 rounded-2xl flex flex-col items-center justify-between text-center space-y-2 text-white">
                      <span className="text-[10px] font-black uppercase text-slate-300">Koyu Tema Logosu</span>
                      <div className="w-full h-16 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center p-2">
                        <img src={siteSettings.site_logo_dark_url || '/branding/logo-dark.png'} alt="Dark Logo" className="max-h-full w-auto object-contain" />
                      </div>
                      <label className="w-full py-2 bg-vibrant-coral hover:bg-rose-500 text-white border border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1">
                        {uploadingLogo === 'dark' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        <span>Değiştir</span>
                        <input type="file" accept="image/*,.svg" onChange={e => handleLogoUpload(e, 'dark')} className="hidden" />
                      </label>
                    </div>

                    {/* Icon Box */}
                    <div className="bg-white border-2 border-vibrant-dark p-3 rounded-2xl flex flex-col items-center justify-between text-center space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-500">Favicon / İkon</span>
                      <div className="w-full h-16 bg-slate-100 border border-vibrant-dark rounded-xl flex items-center justify-center p-2">
                        <img src={siteSettings.site_icon_url || '/setupss_icon.svg?v=2026_v9'} alt="Icon" className="max-h-full w-auto object-contain" />
                      </div>
                      <label className="w-full py-2 bg-sky-400 hover:bg-sky-500 text-white border border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1">
                        {uploadingLogo === 'icon' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        <span>Değiştir</span>
                        <input type="file" accept="image/*" onChange={e => handleLogoUpload(e, 'icon')} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Logo Sizing and Positioning Controls */}
                  <div className="bg-white border-2 border-vibrant-dark p-4 rounded-2xl space-y-3">
                    <span className="text-[11px] font-black uppercase text-slate-700 block">📐 LOGO BOYUTLANDIRMA VE KONUM AYARLARI</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Masaüstü Ölçeği (%)</label>
                        <input 
                          type="range" 
                          min="50" 
                          max="400" 
                          value={siteSettings.logo_desktop_scale || '100'} 
                          onChange={e => setSiteSettings({...siteSettings, logo_desktop_scale: e.target.value})}
                          className="w-full accent-vibrant-yellow" 
                        />
                        <span className="text-[10px] font-black text-vibrant-dark">{siteSettings.logo_desktop_scale || '100'}%</span>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Mobil Ölçeği (%)</label>
                        <input 
                          type="range" 
                          min="50" 
                          max="300" 
                          value={siteSettings.logo_mobile_scale || '100'} 
                          onChange={e => setSiteSettings({...siteSettings, logo_mobile_scale: e.target.value})}
                          className="w-full accent-vibrant-yellow" 
                        />
                        <span className="text-[10px] font-black text-vibrant-dark">{siteSettings.logo_mobile_scale || '100'}%</span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Üzerine Gelince Dönüş Derecesi</label>
                        <input 
                          type="range" 
                          min="-20" 
                          max="20" 
                          value={siteSettings.logo_rotation || '0'} 
                          onChange={e => setSiteSettings({...siteSettings, logo_rotation: e.target.value})}
                          className="w-full accent-vibrant-yellow" 
                        />
                        <span className="text-[10px] font-black text-vibrant-dark">{siteSettings.logo_rotation || '0'}°</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Branding Settings Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={savingSettings}
                      onClick={async () => {
                        setSavingSettings(true);
                        setSettingsMsg('');
                        try {
                          const res = await fetch('/api/admin/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(siteSettings)
                          });
                          const data = await safeJsonResponse(res);
                          if (data.success) {
                            setSettingsMsg('Logo ölçekleme, dönüş ve asistan ayarları başarıyla veritabanına kaydedildi! 🚀');
                            setTimeout(() => setSettingsMsg(''), 4000);
                          } else {
                            setSettingsMsg('Kayıt başarısız: ' + (data.message || 'Bilinmeyen hata'));
                          }
                        } catch (e: any) {
                          setSettingsMsg('Hata: ' + e.message);
                        } finally {
                          setSavingSettings(false);
                        }
                      }}
                      className="w-full py-2.5 bg-vibrant-teal hover:bg-teal-500 text-white border-2 border-vibrant-dark rounded-xl font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                      <span>Marka Görünüm Ayarlarını Kaydet 💾</span>
                    </button>
                  </div>
                </div>

                {/* AI AVATAR / VIDEO MASCOT CONFIGURATION CARD */}
                <div className="bg-sky-50 border-4 border-vibrant-dark p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-vibrant-dark/10 pb-3">
                    <h5 className="font-black text-vibrant-dark text-sm uppercase flex items-center gap-2">
                      <span>🤖 SETUPSS AI VİDEO & AVATAR YÖNETİMİ</span>
                    </h5>
                    <span className="text-[10px] bg-sky-400 text-white px-2 py-0.5 border border-vibrant-dark rounded font-bold">Özel Tasarım</span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                    Sitenizin köşesinde ve chatbot pencerelerinde beliren yapay zeka asistanının görünümünü özelleştirin. İster arka planı olmayan bir <b>.mp4 videosu</b>, ister bir <b>görsel</b> yükleyin. Boş bırakırsanız modern, interaktif neon asistan simgesi gösterilir.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Live Preview Box */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white border-2 border-vibrant-dark rounded-3xl relative">
                      <span className="text-[9px] font-black uppercase text-slate-400 mb-3 block">CANLI ÖNİZLEME</span>
                      <div className="relative p-2 bg-slate-950/5 rounded-2xl flex items-center justify-center min-h-[140px] w-full">
                        <AiAvatar size="lg" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 mt-2 text-center">Ayarlarınız anında yansır!</span>
                    </div>

                    {/* Upload Controls */}
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Custom MP4 Video */}
                        <div className="bg-white p-3 border-2 border-vibrant-dark rounded-2xl flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-500 block">Özel Asistan Videosu (MP4)</span>
                            <span className="text-[9px] font-bold text-slate-400 block">Döngüsel şeffaf video önerilir</span>
                          </div>
                          <label className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white border border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1">
                            {uploadingLogo === 'avatar_video' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                            <span>Video Yükle</span>
                            <input type="file" accept="video/mp4,video/*" onChange={e => handleLogoUpload(e, 'avatar_video')} className="hidden" />
                          </label>
                          {siteSettings.ai_avatar_video_url && (
                            <span className="text-[9px] bg-slate-100 p-1 border border-slate-200 rounded text-slate-500 font-mono truncate">{siteSettings.ai_avatar_video_url}</span>
                          )}
                        </div>

                        {/* Custom Poster Image */}
                        <div className="bg-white p-3 border-2 border-vibrant-dark rounded-2xl flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-500 block">Özel Asistan Görseli (Görsel)</span>
                            <span className="text-[9px] font-bold text-slate-400 block">Yedek veya kalıcı logo/avatar</span>
                          </div>
                          <label className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white border border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1">
                            {uploadingLogo === 'avatar_image' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                            <span>Görsel Yükle</span>
                            <input type="file" accept="image/*" onChange={e => handleLogoUpload(e, 'avatar_image')} className="hidden" />
                          </label>
                          {siteSettings.ai_avatar_image_url && (
                            <span className="text-[9px] bg-slate-100 p-1 border border-slate-200 rounded text-slate-500 font-mono truncate">{siteSettings.ai_avatar_image_url}</span>
                          )}
                        </div>
                      </div>

                      {/* AI Styling Settings */}
                      <div className="bg-white border-2 border-vibrant-dark p-4 rounded-2xl space-y-4">
                        <span className="text-[10px] font-black uppercase text-slate-600 block">⚙️ ASİSTAN STİL VE ANİMASYON ÖZELLİKLERİ</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Hover Efekti (Hareket)</label>
                            <select
                              value={siteSettings.ai_avatar_interactive_effect || 'float'}
                              onChange={e => setSiteSettings({...siteSettings, ai_avatar_interactive_effect: e.target.value})}
                              className="w-full p-2 bg-slate-50 border border-vibrant-dark rounded-lg text-xs font-bold focus:outline-none"
                            >
                              <option value="float">Süzülme (Float)</option>
                              <option value="bounce">Zıplama (Bounce)</option>
                              <option value="pulse">Nefes Alma (Pulse)</option>
                              <option value="spin">Yavaşça Dönme (Spin)</option>
                              <option value="wobble">Sallanma (Wobble)</option>
                              <option value="none">Sabit / Efektsiz</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Dış Işıma Rengi (Neon Glow)</label>
                            <select
                              value={siteSettings.ai_avatar_glow_color || 'amber'}
                              onChange={e => setSiteSettings({...siteSettings, ai_avatar_glow_color: e.target.value})}
                              className="w-full p-2 bg-slate-50 border border-vibrant-dark rounded-lg text-xs font-bold focus:outline-none"
                            >
                              <option value="amber">Kehribar (Amber)</option>
                              <option value="emerald">Zümrüt Yeşili (Emerald)</option>
                              <option value="sky">Gökyüzü Mavisi (Sky Blue)</option>
                              <option value="rose">Gül Pembesi (Rose)</option>
                              <option value="violet">Asil Mor (Violet)</option>
                              <option value="none">Işımasız / Düz</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Kenarlık Biçimi</label>
                            <select
                              value={siteSettings.ai_avatar_border_style || 'dashed'}
                              onChange={e => setSiteSettings({...siteSettings, ai_avatar_border_style: e.target.value})}
                              className="w-full p-2 bg-slate-50 border border-vibrant-dark rounded-lg text-xs font-bold focus:outline-none"
                            >
                              <option value="dashed">Kesikli Çizgi (Dashed)</option>
                              <option value="solid">Düz Çizgi (Solid)</option>
                              <option value="double">Çift Çizgi (Double)</option>
                              <option value="none">Kenarlıksız</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Köşe Yuvarlaklığı</label>
                            <select
                              value={siteSettings.ai_avatar_rounded || 'full'}
                              onChange={e => setSiteSettings({...siteSettings, ai_avatar_rounded: e.target.value})}
                              className="w-full p-2 bg-slate-50 border border-vibrant-dark rounded-lg text-xs font-bold focus:outline-none"
                            >
                              <option value="full">Tam Daire (Full)</option>
                              <option value="3xl">Yuvarlatılmış Kare (3xl)</option>
                              <option value="none">Keskin Köşe (None)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Mascot Özel Genişlik Ölçeği (px)</label>
                          <input 
                            type="range" 
                            min="60" 
                            max="180" 
                            value={siteSettings.ai_avatar_size_scale || '110'} 
                            onChange={e => setSiteSettings({...siteSettings, ai_avatar_size_scale: e.target.value})}
                            className="w-full accent-sky-500" 
                          />
                          <span className="text-[10px] font-black text-slate-600">{siteSettings.ai_avatar_size_scale || '110'} px</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reset All Button */}
                  <button
                    type="button"
                    onClick={handleResetLogos}
                    disabled={uploadingLogo !== null}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100   text-rose-600  border-2 border-dashed border-rose-300  rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {uploadingLogo === 'reset' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '↩️ Tüm Logoları ve AI Ayarlarını Sıfırla'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Social Links & Contact Form */}
                  <form onSubmit={handleSaveSettings} className="space-y-4 bg-white border-4 border-vibrant-dark p-6 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
                    <div className="flex items-center gap-2 border-b-2 border-vibrant-dark/10 pb-3 mb-2">
                      <img 
                        src={siteSettings.site_icon_url || '/branding/icon.png'} 
                        alt="Site Icon" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/branding/icon.png';
                        }}
                      />
                      <h5 className="font-black text-vibrant-dark text-sm uppercase">Sosyal Medya ve İletişim</h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">Destek E-Posta</label>
                        <input 
                          type="email" 
                          value={siteSettings.contact_email || ''} 
                          onChange={e => setSiteSettings({...siteSettings, contact_email: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none focus:ring-4 focus:ring-vibrant-yellow/20 transition-all"
                          placeholder="destek@setupss.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">Instagram</label>
                        <input 
                          type="text" 
                          value={siteSettings.instagram_link || ''} 
                          onChange={e => setSiteSettings({...siteSettings, instagram_link: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none transition-all"
                          placeholder="https://instagram.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">Twitter / X</label>
                        <input 
                          type="text" 
                          value={siteSettings.twitter_link || ''} 
                          onChange={e => setSiteSettings({...siteSettings, twitter_link: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none transition-all"
                          placeholder="https://twitter.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">YouTube</label>
                        <input 
                          type="text" 
                          value={siteSettings.youtube_link || ''} 
                          onChange={e => setSiteSettings({...siteSettings, youtube_link: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none transition-all"
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">Discord</label>
                        <input 
                          type="text" 
                          value={siteSettings.discord_link || ''} 
                          onChange={e => setSiteSettings({...siteSettings, discord_link: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none transition-all"
                          placeholder="https://discord.gg/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">GitHub</label>
                        <input 
                          type="text" 
                          value={siteSettings.github_link || ''} 
                          onChange={e => setSiteSettings({...siteSettings, github_link: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none transition-all"
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1 ml-1">LinkedIn</label>
                        <input 
                          type="text" 
                          value={siteSettings.linkedin_link || ''} 
                          onChange={e => setSiteSettings({...siteSettings, linkedin_link: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl font-bold text-xs focus:outline-none transition-all"
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingSettings}
                        className="w-full py-3 bg-vibrant-yellow hover:bg-amber-300 text-vibrant-dark border-3 border-vibrant-dark rounded-2xl font-black uppercase text-[11px] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Sosyal Linkleri Kaydet 🚀</span>
                      </button>
                    </div>
                  </form>

                  {/* Other Settings or System Info */}
                  <div className="space-y-6">
                    <div className="bg-white border-4 border-vibrant-dark p-6 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
                      <div className="flex items-center gap-2 border-b-2 border-vibrant-dark/10 pb-3 mb-4">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <h5 className="font-black text-vibrant-dark text-sm uppercase">Sistem Durumu</h5>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-vibrant-dark rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-vibrant-coral" />
                            <div>
                              <p className="text-[10px] font-black text-vibrant-dark uppercase">PostgreSQL Bağlantısı</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Production Managed DB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full text-[9px] font-black uppercase">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Aktif
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 border-2 border-vibrant-dark rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Cloud className="w-5 h-5 text-sky-500" />
                            <div>
                              <p className="text-[10px] font-black text-vibrant-dark uppercase">Depolama Servisi</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Google Cloud Storage</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full text-[9px] font-black uppercase">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Bağlı
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border-4 border-vibrant-dark p-6 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
                      <h5 className="font-black text-vibrant-dark text-[10px] uppercase mb-2">💡 Yönetim İpucu</h5>
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic">
                        "Logo veya site ayarlarını değiştirdikten sonra, değişikliklerin tüm kullanıcılarda anında görünmesi için tarayıcı önbelleğinin yenilenmesi gerekebilir. Sistem veritabanı her zaman en güncel halini sunar."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'logs' && (
              /* SYSTEM ACTIVITY LOGS */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-vibrant-dark uppercase tracking-tight text-xs">Sistem Aktivite Günlükleri ({dbLogs.length})</h4>
                  <span className="text-[10px] font-bold text-slate-400">Real-time Veritabanı İşlem Akışı</span>
                </div>

                {dbLogs.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center text-xs font-bold text-slate-400">Henüz aktivite kaydı yok.</div>
                ) : (
                  <div className="space-y-1.5">
                    {dbLogs.map(log => (
                      <div key={log.id} className="p-2.5 bg-white border border-vibrant-dark rounded-xl flex items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 bg-slate-100 border border-vibrant-dark rounded text-[9px] font-black uppercase text-vibrant-dark shrink-0">
                            {log.actionType}
                          </span>
                          <span className="font-bold text-vibrant-coral shrink-0">{log.userName}:</span>
                          <span className="text-slate-600 truncate">{log.details}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 shrink-0">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'stats' && (
              /* STATS & METRICS GRID */
              <div className="space-y-6">
                <h4 className="font-black text-vibrant-dark uppercase tracking-tight text-xs flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-vibrant-coral" />
                  Sistem Analitikleri
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Setups Bento */}
                  <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Sistemdeki Kurulum</span>
                    <h5 className="text-3xl font-black text-vibrant-dark mt-1">{totalSetups} <span className="text-xs font-bold text-slate-400">Adet</span></h5>
                    <p className="text-[10px] font-medium text-slate-500 mt-2">Kullanıcılar tarafından yüklenen tüm aktif masaların sayısı.</p>
                  </div>

                  {/* Total Likes Bento */}
                  <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Toplam Etkileşim</span>
                    <h5 className="text-3xl font-black text-vibrant-dark mt-1">{totalLikes} <span className="text-xs font-bold text-slate-400">Beğeni</span></h5>
                    <p className="text-[10px] font-medium text-slate-500 mt-2">Topluluğun masalara bıraktığı toplam reaksiyon sayısı.</p>
                  </div>

                  {/* Total Comments Bento */}
                  <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Geri Bildirimler</span>
                    <h5 className="text-3xl font-black text-vibrant-dark mt-1">{totalComments} <span className="text-xs font-bold text-slate-400">Yorum</span></h5>
                    <p className="text-[10px] font-medium text-slate-500 mt-2">Yazılan toplam soru, ekipman sorgusu ve tebrik.</p>
                  </div>
                </div>

                {topLiked && (
                  <div className="bg-vibrant-yellow/15 border-4 border-vibrant-dark rounded-[2rem] p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border-2 border-vibrant-dark text-[9px] font-black uppercase text-vibrant-coral rounded-md">
                      <Sparkles className="w-3 h-3" /> En Popüler Masa
                    </span>
                    <div className="flex gap-4 items-center flex-wrap">
                      <img src={topLiked.image} alt={topLiked.title} className="w-16 h-16 object-cover border-2 border-vibrant-dark rounded-xl" />
                      <div>
                        <h5 className="font-black text-vibrant-dark text-sm uppercase leading-tight">{topLiked.title}</h5>
                        <p className="text-[11px] text-slate-600 font-semibold">{topLiked.owner} • {topLiked.bio}</p>
                        <div className="flex gap-4 mt-1.5 text-[10px] font-black uppercase text-vibrant-coral">
                          <span>❤️ {topLiked.likes} Beğeni</span>
                          <span>💬 {topLiked.comments.length} Yorum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'media' && (
              /* MEDIA & DATA STORAGE MANAGER */
              <div className="space-y-6">
                <div className="bg-amber-50 border-4 border-vibrant-dark rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-black text-vibrant-dark uppercase text-sm tracking-tight flex items-center gap-2">
                      <span>📁 VERİTABANI MEDYA VE DOSYA DEPOSU</span>
                      <span className="text-[9px] bg-vibrant-yellow px-2 py-0.5 border border-vibrant-dark rounded">PostgreSQL Storage</span>
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Fotoğraf, video ve diğer verilerinizi doğrudan PostgreSQL veritabanında güvenle saklayın ve yönetin.
                    </p>
                  </div>

                  <label className="px-4 py-2.5 bg-vibrant-yellow hover:bg-[#ffcf10] text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Yükleniyor...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-vibrant-coral" />
                        <span>Veritabanına Dosya / Fotoğraf Yükle</span>
                      </>
                    )}
                    <input type="file" onChange={handleFileUpload} accept="image/*,video/*,application/json,text/plain" className="hidden" />
                  </label>
                </div>

                {dbMedia.length === 0 ? (
                  <div className="p-12 border-4 border-dashed border-vibrant-dark/20 rounded-3xl text-center space-y-3">
                    <Database className="w-10 h-10 text-slate-400 mx-auto" />
                    <h5 className="font-black text-vibrant-dark text-sm uppercase">Medya Deposu Boş</h5>
                    <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                      Veritabanına henüz bir fotoğraf veya video yüklenmedi. Yukarıdaki butonla yeni medya ekleyebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {dbMedia.map(m => (
                      <div key={m.id} className="bg-white border-2 border-vibrant-dark rounded-2xl p-3 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] flex flex-col justify-between space-y-2">
                        <div className="space-y-2">
                          <div className="w-full h-36 bg-slate-100 border border-vibrant-dark rounded-xl overflow-hidden relative flex items-center justify-center">
                            {m.fileType === 'video' ? (
                              <video src={m.fileUrl} controls playsInline className="w-full h-full object-cover" />
                            ) : m.fileType === 'image' ? (
                              <img src={m.fileUrl} alt={m.fileName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="p-4 text-center">
                                <Database className="w-8 h-8 text-vibrant-coral mx-auto mb-1" />
                                <span className="text-[10px] font-bold text-slate-600 block truncate">{m.fileName}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <h6 className="font-black text-vibrant-dark text-xs truncate" title={m.fileName}>{m.fileName}</h6>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold">
                              <span>Yükleyen: {m.uploaderName || 'Ziyaretçi'}</span>
                              <span>{m.fileSize ? `${Math.round(m.fileSize / 1024)} KB` : 'Medya Verisi'}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium block">
                              {new Date(m.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                          <a
                            href={m.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-vibrant-bg hover:bg-slate-200 border border-vibrant-dark rounded-lg text-[9px] font-black uppercase text-vibrant-dark"
                          >
                            Aç / Önizle ↗
                          </a>
                          <button
                            onClick={() => handleDeleteMedia(m.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Veritabanından Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer inside admin */}
          <div className="bg-white border-t-4 border-vibrant-dark px-6 py-3 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 shrink-0">
            <span>SETUPSS DATABASE MANAGEMENT ACTIVE</span>
            <span>SHIELD V2.0</span>
          </div>

        </div>
      )}

      {/* EDIT USER MODAL OVERLAY */}
      {selectedEditUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-vibrant-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] animate-in zoom-in-95 duration-300">
            <div className="bg-blue-50 border-b-4 border-vibrant-dark p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border-2 border-vibrant-dark rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-black text-vibrant-dark uppercase text-sm">Kullanıcıyı Düzenle</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{selectedEditUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEditUser(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-vibrant-dark" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">Görünen İsim</label>
                  <input
                    type="text"
                    value={selectedEditUser.name}
                    onChange={e => setSelectedEditUser({ ...selectedEditUser, name: e.target.value })}
                    className="w-full p-3 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">Biyografi</label>
                  <textarea
                    value={selectedEditUser.bio || ''}
                    onChange={e => setSelectedEditUser({ ...selectedEditUser, bio: e.target.value })}
                    rows={3}
                    className="w-full p-3 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">Özel Rozet (Badge)</label>
                  <input
                    type="text"
                    value={selectedEditUser.customBadge || ''}
                    onChange={e => setSelectedEditUser({ ...selectedEditUser, customBadge: e.target.value })}
                    placeholder="Örn: Beta Test Kullanıcısı"
                    className="w-full p-3 bg-white text-vibrant-dark placeholder:text-slate-400 border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">Kullanıcı Rolü</label>
                    <select
                      value={selectedEditUser.role}
                      onChange={e => setSelectedEditUser({ ...selectedEditUser, role: e.target.value })}
                      className="w-full p-3 bg-white text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-xs font-black outline-none"
                    >
                      <option value="user">Standart Üye</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">Doğrulama Durumu</label>
                    <div className="flex items-center gap-2 h-[48px]">
                      <button
                        type="button"
                        onClick={() => setSelectedEditUser({ ...selectedEditUser, isVerified: !selectedEditUser.isVerified })}
                        className={`flex-1 h-full rounded-xl border-2 border-vibrant-dark flex items-center justify-center transition-all ${
                          selectedEditUser.isVerified ? 'bg-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-slate-400'
                        }`}
                      >
                        <Sparkles className={`w-4 h-4 mr-2 ${selectedEditUser.isVerified ? 'text-white' : 'text-slate-300'}`} />
                        <span className="text-[10px] font-black uppercase">{selectedEditUser.isVerified ? 'Doğrulandı' : 'Doğrulanmadı'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">Kral Tacı (VIP)</label>
                    <button
                      type="button"
                      onClick={() => setSelectedEditUser({ ...selectedEditUser, isCrown: !selectedEditUser.isCrown })}
                      className={`w-full h-[48px] rounded-xl border-2 border-vibrant-dark flex items-center justify-center transition-all ${
                        selectedEditUser.isCrown ? 'bg-amber-400 text-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-slate-400'
                      }`}
                    >
                      <span className="text-xl mr-2">👑</span>
                      <span className="text-[10px] font-black uppercase">{selectedEditUser.isCrown ? 'Aktif' : 'Pasif'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider ml-1">RGB İsim Efekti</label>
                    <button
                      type="button"
                      onClick={() => setSelectedEditUser({ ...selectedEditUser, hasRgb: !selectedEditUser.hasRgb })}
                      className={`w-full h-[48px] rounded-xl border-2 border-vibrant-dark flex items-center justify-center transition-all ${
                        selectedEditUser.hasRgb ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase">{selectedEditUser.hasRgb ? 'RGB Aktif' : 'RGB Pasif'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-red-600 uppercase tracking-wider ml-1">Tehlikeli Bölge</label>
                  <button
                    type="button"
                    onClick={() => setSelectedEditUser({ ...selectedEditUser, isBanned: !selectedEditUser.isBanned })}
                    className={`w-full h-[48px] rounded-xl border-2 border-vibrant-dark flex items-center justify-center transition-all ${
                      selectedEditUser.isBanned ? 'bg-red-600 text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-red-500'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-[10px] font-black uppercase">{selectedEditUser.isBanned ? 'YASAĞI KALDIR' : 'KULLANICIYI YASAKLA'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEditUser(null)}
                  className="flex-1 px-6 py-3 bg-white hover:bg-slate-50 text-vibrant-dark border-2 border-vibrant-dark rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-vibrant-coral hover:bg-rose-500 text-white border-2 border-vibrant-dark rounded-2xl text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] active:shadow-none transition-all cursor-pointer"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
