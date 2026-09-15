import React, { useState } from 'react';
import { safeJsonResponse } from '../lib/api';
import { X, Upload, Loader2, CheckCircle2, User, LogOut } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface ProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdate: (updatedUser: any) => void;
  onLogout?: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=150&h=150&q=80"
];

const GRADIENTS = [
  { name: 'Siberpunk 💜', from: '#FF007F', to: '#7B2CBF' },
  { name: 'Gün Batımı 🧡', from: '#FF416C', to: '#FF4B2B' },
  { name: 'Okyanus 💙', from: '#2193b0', to: '#6dd5ed' },
  { name: 'Zümrüt 💚', from: '#11998e', to: '#38ef7d' },
  { name: 'Retro Güneş 💛', from: '#FFE000', to: '#799F0C' },
  { name: 'Kozmik 🌌', from: '#8A2387', to: '#E94057' },
  { name: 'Buzul ❄️', from: '#00F260', to: '#0575E6' },
  { name: 'Rüya Pembe ✨', from: '#FF5F6D', to: '#FFC371' },
];

const DICEBEAR_STYLES = [
  { id: 'avataaars', name: 'İnsan 🧑‍💼' },
  { id: 'bottts', name: 'Robot 🤖' },
  { id: 'pixel-art', name: 'Piksel 👾' },
  { id: 'adventurer', name: 'Maceracı 🧭' },
  { id: 'lorelei', name: 'Sevimli 🌸' },
  { id: 'identicon', name: 'Desen 🌀' },
];

const generateInitialsSvg = (letters: string, fromColor: string, toColor: string) => {
  const cleanLetters = (letters || '').toUpperCase().slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fromColor}" />
        <stop offset="100%" stop-color="${toColor}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#grad)" stroke="#2d3436" stroke-width="4" />
    <text x="50%" y="56%" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${cleanLetters}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=800&q=80"
];

const PRESET_BADGES = [
  "Setup Paylaşımcısı 🚀",
  "Minimalist Meraklısı 🪵",
  "RGB Savaşçısı 🌈",
  "Klavye Koleksiyoneri ⌨️",
  "Yazılım Mühendisi 💻",
  "Kreatif Sanatçı 🎨",
  "Kral Oyuncu 🎮"
];

const PRESET_COLORS = [
  { name: 'Teal 💚', value: '#4ECDC4' },
  { name: 'Koral ❤️', value: '#FF6B6B' },
  { name: 'Sarı 💛', value: '#FFE66D' },
  { name: 'Mor 💜', value: '#7B2CBF' },
  { name: 'Mavi 💙', value: '#3A86C8' },
  { name: 'Koyu Metal 🖤', value: '#2D3436' }
];

const PRESET_FRAMES = [
  { id: 'none', name: 'Sade (Yok) ❌', desc: 'Dekorasyonsuz düz sade görünüm' },
  { id: 'cyberpunk', name: 'Siberpunk HUD ⚡', desc: 'Holografik neon halka ve siber radar tarayıcı' },
  { id: 'royal', name: 'Altın Taç / Soylu 👑', desc: 'Yumuşak salınımlı altın asalet tacı ve mistik ışık dalgası' },
  { id: 'rgb', name: 'RGB Lazer / Nitro 🌈', desc: 'Discord Nitro tarzı kesintisiz renk döngüsü ve parlak RGB neon' },
  { id: 'pixel', name: 'Retro Piksel Kalp 👾', desc: 'Süzülen 8-bit sevimli kırmızı kalpler ve nostalji' },
  { id: 'flame', name: 'Alev Alev 🔥', desc: 'Yükselen ateş kıvılcımları ve hararetli köz efekti' },
  { id: 'sakura', name: 'Sakura Esintisi 🌸', desc: 'Düşen pembe kiraz çiçeği yaprakları ve soft parıltı' },
  { id: 'cosmic', name: 'Kozmik Nebula 🌌', desc: 'Dönen galaksi yıldız tozu ve parıldayan takımyıldızları' },
  { id: 'lightning', name: 'Yıldırım Fırtınası ⚡', desc: 'Periyodik çakan mor yıldırımlar ve elektrik dalgaları' },
  { id: 'diamond', name: 'Elmas Kraliyet 💎', desc: 'Pırıl pırıl parlayan elmas kristal halkası ve beyaz ışıltılar' },
  { id: 'minimal', name: 'Mat Siyah 🖤', desc: 'Zarif çift katlı koyu minimalist çerçeve' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate, onLogout }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [avatar, setAvatar] = useState(user.avatar || PRESET_AVATARS[0]);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Profile Customization Fields
  const [bio, setBio] = useState(user.bio || '');
  const [githubLink, setGithubLink] = useState(user.githubLink || '');
  const [instagramLink, setInstagramLink] = useState(user.instagramLink || '');
  const [linkedinLink, setLinkedinLink] = useState(user.linkedinLink || '');
  const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto || PRESET_COVERS[0]);
  const [customBadge, setCustomBadge] = useState(user.customBadge || PRESET_BADGES[0]);
  const [customColor, setCustomColor] = useState(user.customColor || PRESET_COLORS[0].value);
  const [avatarFrame, setAvatarFrame] = useState(user.avatarFrame || user.avatar_frame || 'none');

  // Modal Level Tab Navigation
  const [modalTab, setModalTab] = useState<'basic' | 'design' | 'social'>('basic');

  // Custom Avatar Workshop States
  const [activeTab, setActiveTab] = useState<'presets' | 'initials' | 'dicebear' | 'upload'>('presets');
  
  const getInitials = (name: string) => {
    if (!name) return 'ME';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [customInitials, setCustomInitials] = useState(getInitials(user.displayName || 'ME'));
  const [selectedGradient, setSelectedGradient] = useState(0);

  const [dbStyle, setDbStyle] = useState('avataaars');
  const [dbSeed, setDbSeed] = useState(user.id ? user.id.slice(0, 6) : 'oyuncu');

  const generateRandomSeed = () => {
    const words = ['setup', 'masa', 'kodcu', 'oyuncu', 'developer', 'gamer', 'workspace', 'cozy', 'neon', 'led', 'keybd', 'retro'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomWord}-${randomNum}`;
  };

  const handleInitialsChange = (text: string, gradIndex: number) => {
    const letters = text.toUpperCase().slice(0, 2);
    setCustomInitials(letters);
    setSelectedGradient(gradIndex);
    const grad = GRADIENTS[gradIndex];
    const svgUrl = generateInitialsSvg(letters, grad.from, grad.to);
    setAvatar(svgUrl);
  };

  const handleDicebearChange = (style: string, seed: string) => {
    setDbStyle(style);
    setDbSeed(seed);
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
    setAvatar(url);
  };

  const handleDicebearRandomize = () => {
    const randomSeed = generateRandomSeed();
    handleDicebearChange(dbStyle, randomSeed);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Avatar boyutu en fazla 50MB olabilir.");
      return;
    }

    setUploadProgress('uploading');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filename: `avatar-${user.id}-${file.name}`, 
            base64Data,
            folder: 'avatars',
            entityType: 'user_avatar',
            entityId: user.id 
          })
        });
        const result = await safeJsonResponse(response);
        if (result.success) {
          setAvatar(result.url);
          setUploadProgress('success');
        } else {
          setUploadProgress('error');
          alert("Dosya yüklenemedi: " + result.message);
        }
      } catch (err) {
        console.error("Avatar upload error:", err);
        setUploadProgress('error');
        alert("Ağ hatası oluştu.");
      }
    };
    reader.onerror = () => {
      setUploadProgress('error');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      alert("Lütfen bir isim girin.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          displayName: displayName.trim(), 
          avatar,
          bio: bio.trim(),
          githubLink: githubLink.trim(),
          instagramLink: instagramLink.trim(),
          linkedinLink: linkedinLink.trim(),
          coverPhoto,
          customBadge,
          customColor,
          avatarFrame
        })
      });
      const result = await safeJsonResponse(response);
      if (result.success) {
        setShowSuccess(true);
        onUpdate(result.user);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 1500);
      } else {
        alert("Profil güncellenemedi: " + result.message);
      }
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Ağ hatası oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-vibrant-dark/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 py-8 overflow-y-auto">
      <div className="bg-white border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-xl shadow-[10px_10px_0px_0px_rgba(45,52,54,1)] animate-fade-in relative overflow-hidden flex flex-col max-h-[88vh] my-auto">
        
        {/* Header */}
        <div className="bg-white border-b-4 border-vibrant-dark px-6 py-4 flex items-center justify-between z-20">
          <div>
            <h3 className="font-black text-vibrant-dark uppercase tracking-tight text-lg">Profilini Düzenle</h3>
            <p className="text-[10px] text-slate-500 font-bold">Profil bilgilerini, tasarımını ve sosyal bağlantılarını özelleştir.</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Main Navigation Tabs */}
        <div className="flex border-b-4 border-vibrant-dark bg-vibrant-bg">
          <button
            type="button"
            onClick={() => setModalTab('basic')}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center border-r-2 border-vibrant-dark transition-all cursor-pointer ${
              modalTab === 'basic' ? 'bg-[#FFE66D] text-vibrant-dark font-black' : 'bg-white text-vibrant-dark hover:bg-slate-50'
            }`}
          >
            Temel Bilgiler 📝
          </button>
          <button
            type="button"
            onClick={() => setModalTab('design')}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center border-r-2 border-vibrant-dark transition-all cursor-pointer ${
              modalTab === 'design' ? 'bg-[#4ECDC4] text-white font-black' : 'bg-white text-vibrant-dark hover:bg-slate-50'
            }`}
          >
            Tasarım & Görünüm 🎨
          </button>
          <button
            type="button"
            onClick={() => setModalTab('social')}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center transition-all cursor-pointer ${
              modalTab === 'social' ? 'bg-[#FF6B6B] text-white font-black' : 'bg-white text-vibrant-dark hover:bg-slate-50'
            }`}
          >
            Sosyal Medya 🔗
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          
          {/* TAB 1: BASIC INFORMATION */}
          {modalTab === 'basic' && (
            <div className="space-y-4">
              
              {/* Display Name Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Profil Adınız</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Profilinizde görünecek isim"
                  className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-vibrant-teal/30"
                />
              </div>

              {/* Reference Code Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark">Benzersiz Referans Kodunuz:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={user.referenceCode || 'KOD-YOK'}
                    className="w-full px-3 py-2 bg-slate-100 border-2 border-vibrant-dark rounded-xl text-sm font-mono font-bold text-vibrant-dark outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(user.referenceCode || '');
                      alert("Kod kopyalandı!");
                    }}
                    className="px-3 py-2 bg-vibrant-yellow hover:bg-[#ffe066] border-2 border-vibrant-dark rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
                  >
                    Kopyala
                  </button>
                </div>
              </div>

              {/* Special Badge / Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-teal">Özel Rozet / Ünvan</label>
                <input
                  type="text"
                  value={customBadge}
                  onChange={e => setCustomBadge(e.target.value)}
                  placeholder="Örn: Yazılım Geliştiricisi 💻"
                  className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-vibrant-teal/30"
                />
                
                {/* Preset badges list */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {PRESET_BADGES.map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomBadge(b)}
                      className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                        customBadge === b 
                          ? 'bg-vibrant-teal text-white border-vibrant-dark' 
                          : 'bg-white text-vibrant-dark border-vibrant-dark/20 hover:border-vibrant-dark'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Hakkımda / Biyografi</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Kendinizden ve setup felsefenizden bahsedin..."
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none resize-none focus:ring-4 focus:ring-vibrant-teal/30"
                />
                <div className="text-right text-[9px] text-slate-400 font-bold">
                  {bio.length}/160 karakter
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">E-posta Adresiniz (Değiştirilemez)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 bg-slate-100 border-2 border-slate-300 text-slate-500 rounded-xl text-xs font-bold outline-none cursor-not-allowed opacity-75"
                />
              </div>

            </div>
          )}

          {/* TAB 2: DESIGN & APPEARANCE */}
          {modalTab === 'design' && (
            <div className="space-y-5">
              
              {/* Profile Accent Color Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-teal block">Profil Tema Rengi</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    className="w-10 h-10 border-2 border-vibrant-dark rounded-xl cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {PRESET_COLORS.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomColor(c.value)}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                        className={`w-6 h-6 rounded-lg border-2 cursor-pointer transition-all ${
                          customColor === c.value ? 'border-vibrant-dark scale-110 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'border-vibrant-dark/20 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Frame Selector (SITE FRAMES SYSTEM) */}
              <div className="space-y-2 border-t-2 border-vibrant-dark/10 pt-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark block">Profil Çerçevesi Seç 🎭</span>
                  <p className="text-[9px] text-slate-500 font-bold">Profil resmine özel hareketli neon, RGB veya asalet çerçeveleri ekle!</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {PRESET_FRAMES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAvatarFrame(f.id)}
                      className={`p-2 rounded-xl border-2 text-left transition-all flex items-center gap-2 cursor-pointer ${
                        avatarFrame === f.id
                          ? 'border-vibrant-teal bg-vibrant-bg/30 shadow-[2px_2px_0px_0px_rgba(78,205,196,1)] font-black'
                          : 'border-vibrant-dark/10 bg-white hover:border-vibrant-dark/30'
                      }`}
                    >
                      <UserAvatar
                        src={avatar}
                        name={displayName || 'U'}
                        frame={f.id}
                        size="xs"
                        className="shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] font-black text-vibrant-dark truncate">{f.name}</div>
                        <div className="text-[8px] text-slate-500 font-bold truncate leading-tight">{f.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Photo Selection */}
              <div className="space-y-1.5 border-t-2 border-vibrant-dark/10 pt-4">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">Profil Kapak Fotoğrafı Banner'ı</label>
                
                {/* Cover Preview */}
                <div className="h-16 w-full rounded-xl border-2 border-vibrant-dark overflow-hidden relative mb-2">
                  <img src={coverPhoto} alt="Kapak Önizleme" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-[9px] font-black uppercase text-white bg-vibrant-dark px-2 py-0.5 rounded-lg border border-white">Önizleme</span>
                  </div>
                </div>

                <input
                  type="text"
                  value={coverPhoto}
                  onChange={e => setCoverPhoto(e.target.value)}
                  placeholder="Kapak fotoğrafı görsel URL'si"
                  className="w-full px-3 py-1.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-vibrant-teal/30"
                />

                {/* Preset cover selection */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {PRESET_COVERS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverPhoto(url)}
                      className={`h-8 rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                        coverPhoto === url ? 'border-vibrant-coral scale-95 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)]' : 'border-vibrant-dark/20'
                      }`}
                    >
                      <img src={url} alt={`Kapak ${i+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Original Avatar Workshop Section */}
              <div className="border-t-2 border-vibrant-dark/10 pt-4 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">Avatar Atölyesi 🛠️</span>
                
                {/* Display Current Avatar */}
                <div className="flex items-center gap-4">
                  <UserAvatar
                    src={avatar}
                    name={displayName || 'User'}
                    frame={avatarFrame}
                    isCrown={user.isCrown || user.is_crown}
                    hasRgb={user.hasRgb || user.has_rgb}
                    size="md"
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-vibrant-dark">Şu Anki Avatar</span>
                    {uploadProgress === 'uploading' && (
                      <div className="flex items-center gap-1 text-[9px] font-black text-vibrant-coral uppercase animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Yükleniyor...</span>
                      </div>
                    )}
                    {uploadProgress === 'success' && (
                      <span className="text-[9px] font-black text-green-600 uppercase flex items-center gap-1">Yüklendi!</span>
                    )}
                  </div>
                </div>

                {/* Avatar Tab Headers */}
                <div className="flex flex-wrap gap-1.5 border-b border-vibrant-dark/10 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('presets');
                      setAvatar(PRESET_AVATARS[0]);
                    }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                      activeTab === 'presets'
                        ? 'bg-vibrant-coral text-white border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white text-vibrant-dark border-transparent hover:border-vibrant-dark/30'
                    }`}
                  >
                    Hazır Seçim 🖼️
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('initials');
                      const grad = GRADIENTS[selectedGradient];
                      setAvatar(generateInitialsSvg(customInitials, grad.from, grad.to));
                    }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                      activeTab === 'initials'
                        ? 'bg-vibrant-yellow text-vibrant-dark border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white text-vibrant-dark border-transparent hover:border-vibrant-dark/30'
                    }`}
                  >
                    Baş Harf & Renk 🔠
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('dicebear');
                      setAvatar(`https://api.dicebear.com/7.x/${dbStyle}/svg?seed=${encodeURIComponent(dbSeed)}`);
                    }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                      activeTab === 'dicebear'
                        ? 'bg-[#4ECDC4] text-white border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white text-vibrant-dark border-transparent hover:border-vibrant-dark/30'
                    }`}
                  >
                    Karakter 🤖
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                      activeTab === 'upload'
                        ? 'bg-vibrant-dark text-white border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white text-vibrant-dark border-transparent hover:border-vibrant-dark/30'
                    }`}
                  >
                    Yükle 📤
                  </button>
                </div>

                {/* Tab Contents Panel */}
                <div className="bg-vibrant-bg/50 p-3 border-2 border-vibrant-dark rounded-2xl min-h-[100px] flex flex-col justify-center">
                  
                  {/* 1. Presets */}
                  {activeTab === 'presets' && (
                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Bir görsel seçin:</span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {PRESET_AVATARS.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAvatar(url)}
                            className={`aspect-square rounded-lg border-2 overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                              avatar === url ? 'border-vibrant-coral scale-95 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)]' : 'border-vibrant-dark/20'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${i+1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Initials */}
                  {activeTab === 'initials' && (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Baş Harfler:</span>
                          <input
                            type="text"
                            maxLength={2}
                            value={customInitials}
                            onChange={(e) => handleInitialsChange(e.target.value, selectedGradient)}
                            className="w-full px-2 py-1 bg-white border-2 border-vibrant-dark rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-vibrant-dark"
                            placeholder="ME"
                          />
                        </div>
                        <div className="flex-[2] space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Gradyan Seçimi:</span>
                          <div className="grid grid-cols-4 gap-1">
                            {GRADIENTS.map((grad, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleInitialsChange(customInitials, idx)}
                                style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                                title={grad.name}
                                className={`h-6 rounded-lg border cursor-pointer transition-all ${
                                  selectedGradient === idx 
                                    ? 'border-vibrant-dark scale-105' 
                                    : 'border-vibrant-dark/20 hover:scale-102'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. DiceBear */}
                  {activeTab === 'dicebear' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Karakter Paketi:</span>
                          <select
                            value={dbStyle}
                            onChange={(e) => handleDicebearChange(e.target.value, dbSeed)}
                            className="w-full px-2 py-1 bg-white border-2 border-vibrant-dark rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-vibrant-dark"
                          >
                            {DICEBEAR_STYLES.map(style => (
                              <option key={style.id} value={style.id}>{style.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Seed Değeri:</span>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={dbSeed}
                              onChange={(e) => handleDicebearChange(dbStyle, e.target.value)}
                              className="flex-1 px-2 py-1 bg-white border-2 border-vibrant-dark rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-vibrant-dark"
                            />
                            <button
                              type="button"
                              onClick={handleDicebearRandomize}
                              className="px-2 py-1 bg-white hover:bg-vibrant-bg border-2 border-vibrant-dark rounded-lg text-[9px] font-black uppercase transition-all shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                            >
                              🎲
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Upload */}
                  {activeTab === 'upload' && (
                    <div className="flex items-center justify-center">
                      <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-vibrant-dark rounded-xl bg-white hover:bg-vibrant-bg/30 cursor-pointer transition-all">
                        <div className="flex flex-col items-center justify-center py-2">
                          <Upload className="w-4 h-4 text-vibrant-coral mb-0.5 stroke-[2.5]" />
                          <p className="text-[9px] font-black text-vibrant-dark uppercase">Görsel Seç (Max 50MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA LINKS */}
          {modalTab === 'social' && (
            <div className="space-y-4">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Sizi diğer sosyal mecralarda da bulabilmeleri için profillerinizi bağlayın:</span>
              
              {/* GitHub Link */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark block">GitHub Kullanıcı Adı veya Link</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={githubLink}
                    onChange={e => setGithubLink(e.target.value)}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-1.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-vibrant-teal/30"
                  />
                </div>
              </div>

              {/* Instagram Link */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">Instagram Kullanıcı Adı veya Link</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={instagramLink}
                    onChange={e => setInstagramLink(e.target.value)}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-1.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-vibrant-teal/30"
                  />
                </div>
              </div>

              {/* LinkedIn Link */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-teal block">LinkedIn Profil Linki veya Kullanıcı Adı</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={linkedinLink}
                    onChange={e => setLinkedinLink(e.target.value)}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-1.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-vibrant-teal/30"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-vibrant-dark/10">
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white border-2 border-vibrant-dark rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış Yap</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 bg-white hover:bg-vibrant-bg text-vibrant-dark border-2 border-vibrant-dark rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-[#4ECDC4] hover:bg-[#3dbbb2] text-white border-2 border-vibrant-dark rounded-xl font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Kaydediliyor</span>
                  </>
                ) : (
                  <span>Kaydet 💾</span>
                )}
              </button>
            </div>
          </div>

          {showSuccess && (
            <div className="flex items-center justify-center gap-1.5 p-2.5 bg-green-50 border-2 border-green-500 rounded-xl text-green-700 text-[10px] font-black uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Profiliniz Başarıyla Güncellendi!</span>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
