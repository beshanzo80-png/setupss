import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Heart, Share2, MessageCircle, Crown, Award, Sparkles, Code2 as Github, Camera as Instagram, Globe as Linkedin, ShieldCheck, Flame, Zap, Layers, Trophy } from 'lucide-react';
import { SetupPost } from '../types';
import { SafeImage } from './SafeImage';
import { UserAvatar } from './UserAvatar';

interface UserPublicProfileModalProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    avatarFrame?: string;
    avatar_frame?: string;
    bio?: string;
    score?: number;
    totalLikes?: number;
    setupsCount?: number;
    inviteCount?: number;
    isCrown?: boolean;
    hasRgb?: boolean;
    createdAt?: string;
    githubLink?: string;
    instagramLink?: string;
    linkedinLink?: string;
    coverPhoto?: string;
    customBadge?: string;
    customColor?: string;
    rank?: number;
  };
  allSetups?: SetupPost[];
  onClose: () => void;
  onSelectSetup?: (setup: SetupPost) => void;
  onStartChat?: (user: { id: string; name: string; avatar?: string }) => void;
}

export const UserPublicProfileModal: React.FC<UserPublicProfileModalProps> = ({
  user,
  allSetups = [],
  onClose,
  onSelectSetup,
  onStartChat
}) => {
  // Format registration date nicely
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "Doğrulanmış SETUPSS Üyesi";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Doğrulanmış SETUPSS Üyesi";
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + " tarihinde katıldı";
    } catch {
      return "Doğrulanmış SETUPSS Üyesi";
    }
  };

  // Filter user's setups
  const userSetups = allSetups.filter(
    s => (s.owner && s.owner.toLowerCase() === user.name.toLowerCase()) || (s.ownerId && s.ownerId === user.id)
  );

  // Compute ranks / badges
  const badges = [];
  if (user.rank === 1 || user.isCrown) {
    badges.push({ title: 'Topluluk Şampiyonu 👑', desc: 'Sıralama Lideri & Taç Sahibi', bg: 'bg-amber-300 text-amber-950 border-amber-500' });
  }
  if ((user.inviteCount || 0) > 0) {
    badges.push({ title: 'Davet Elçisi 🚀', desc: `${user.inviteCount} arkadaşını davet etti`, bg: 'bg-purple-200 text-purple-900 border-purple-400' });
  }
  if (userSetups.length > 0 || (user.setupsCount || 0) > 0) {
    badges.push({ title: 'Setup Mimarı 💻', desc: `${userSetups.length || user.setupsCount} harika kurulum paylaştı`, bg: 'bg-blue-200 text-blue-900 border-blue-400' });
  }
  if ((user.totalLikes || 0) >= 5) {
    badges.push({ title: 'Trend Yapıcı 🔥', desc: `${user.totalLikes} beğeni topladı`, bg: 'bg-rose-200 text-rose-900 border-rose-400' });
  }
  if (user.hasRgb) {
    badges.push({ title: 'RGB Ustası 🌈', desc: 'Atölye RGB Işık Efekti Aktif', bg: 'bg-emerald-200 text-emerald-900 border-emerald-400' });
  }
  if (user.customBadge) {
    badges.push({ title: user.customBadge, desc: 'Özel Kullanıcı Ünvanı', bg: 'bg-vibrant-yellow text-vibrant-dark border-vibrant-dark' });
  }
  // Default verified badge
  badges.push({ title: 'SETUPSS Üyesi 🛡️', desc: 'Doğrulanmış Topluluk Üyesi', bg: 'bg-slate-100 text-slate-800 border-slate-300' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-vibrant-dark/75 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto pt-6 sm:pt-12 pb-12"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-vibrant-bg border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] sm:max-h-[88vh] overflow-hidden shadow-[12px_12px_0px_0px_rgba(45,52,54,1)] relative flex flex-col my-auto shrink-0"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: user.customColor || '#2d3454' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 border-2 border-vibrant-dark rounded-full hover:bg-rose-50 transition-all shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <X className="w-4 h-4 text-vibrant-dark" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">

          {/* Cover Banner */}
          <div 
            className="h-36 sm:h-44 relative overflow-hidden border-b-4 border-vibrant-dark shrink-0" 
            style={{ borderColor: user.customColor || '#2d3454' }}
          >
          {user.coverPhoto ? (
            <img src={user.coverPhoto} alt="Kapak" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 relative">
              <div className="absolute inset-0 bg-[radial-gradient(#2d3454_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
            </div>
          )}

          {/* Rank Badge Header */}
          {user.rank && (
            <div className="absolute top-4 left-4 bg-vibrant-dark text-vibrant-yellow font-black text-xs uppercase px-3 py-1 rounded-xl border-2 border-vibrant-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Sıralama #{user.rank}</span>
            </div>
          )}
        </div>

        {/* Profile Content Body */}
        <div className="px-5 sm:px-8 pb-8 pt-12 relative flex flex-col items-center">
          
          {/* Avatar Overlapping Banner */}
          <div className="absolute -top-12 sm:-top-14">
            <UserAvatar
              src={user.avatar}
              name={user.name}
              frame={user.avatarFrame || user.avatar_frame || 'none'}
              isCrown={user.isCrown}
              hasRgb={user.hasRgb}
              size="lg"
              className="sm:scale-110"
            />
          </div>

          {/* User Name & Handle */}
          <div className="text-center mt-2 space-y-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h3 className={`font-black text-2xl sm:text-3xl tracking-tight ${user.hasRgb ? 'rgb-text' : 'text-vibrant-dark'}`}>
                {user.name}
              </h3>
              {user.isCrown && <Crown className="w-6 h-6 text-amber-500 fill-amber-400 shrink-0" />}
            </div>

            {/* Registration Date / üyelik tarihi */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-vibrant-dark/20 rounded-full text-xs font-bold text-slate-600 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-vibrant-coral" />
              <span>{formatJoinDate(user.createdAt)}</span>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-md mx-auto mt-2 leading-relaxed whitespace-pre-wrap">
              {user.bio || 'SETUPSS topluluğunda masaüstü ve teknoloji tutkunu geliştirici.'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-2.5 justify-center mt-4">
            {user.githubLink && (
              <a
                href={user.githubLink.startsWith('http') ? user.githubLink : `https://github.com/${user.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border-2 border-vibrant-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-vibrant-dark"
                title="GitHub Profili"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {user.instagramLink && (
              <a
                href={user.instagramLink.startsWith('http') ? user.instagramLink : `https://instagram.com/${user.instagramLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border-2 border-vibrant-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-vibrant-dark"
                title="Instagram Profili"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {user.linkedinLink && (
              <a
                href={user.linkedinLink.startsWith('http') ? user.linkedinLink : `https://linkedin.com/in/${user.linkedinLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border-2 border-vibrant-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-vibrant-dark"
                title="LinkedIn Profili"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6">
            <div className="bg-vibrant-yellow p-3.5 rounded-2xl border-2 border-vibrant-dark shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark block">Etkileşim Puanı</span>
              <span className="text-xl font-black text-vibrant-dark">{user.score || 0}</span>
            </div>
            <div className="bg-red-100 p-3.5 rounded-2xl border-2 border-vibrant-dark shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-900 block flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 fill-red-500 text-red-500" /> Toplam Beğeni
              </span>
              <span className="text-xl font-black text-red-950">{user.totalLikes || 0}</span>
            </div>
            <div className="bg-blue-100 p-3.5 rounded-2xl border-2 border-vibrant-dark shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block flex items-center justify-center gap-1">
                <Share2 className="w-3 h-3 text-blue-600" /> Setuplar
              </span>
              <span className="text-xl font-black text-blue-950">{userSetups.length || user.setupsCount || 0}</span>
            </div>
            <div className="bg-purple-100 p-3.5 rounded-2xl border-2 border-vibrant-dark shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" /> Davet Edilen
              </span>
              <span className="text-xl font-black text-purple-950">{user.inviteCount || 0}</span>
            </div>
          </div>

          {/* Badges / Rütbeler Section */}
          <div className="w-full mt-6 bg-white border-3 border-vibrant-dark rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-vibrant-coral" />
              <h4 className="font-black text-sm uppercase text-vibrant-dark tracking-wider">Kullanıcı Rütbeleri & Rozetleri</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map((b, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border-2 font-black text-xs flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] ${b.bg}`}
                >
                  <div>
                    <span className="block text-xs font-black">{b.title}</span>
                    <span className="block text-[10px] opacity-80 font-semibold">{b.desc}</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 shrink-0 opacity-70" />
                </div>
              ))}
            </div>
          </div>

          {/* User's Setups Section */}
          <div className="w-full mt-6 bg-white border-3 border-vibrant-dark rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-vibrant-teal" />
                <h4 className="font-black text-sm uppercase text-vibrant-dark tracking-wider">
                  {user.name} 'in Setupları ({userSetups.length})
                </h4>
              </div>
            </div>

            {userSetups.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 border-2 border-dashed border-vibrant-dark/20 rounded-xl space-y-1">
                <p className="text-xs font-bold text-slate-500">Henüz paylaşılan bir masaüstü setup'ı yok.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userSetups.map((setup) => (
                  <div
                    key={setup.id}
                    onClick={() => {
                      if (onSelectSetup) {
                        onClose();
                        onSelectSetup(setup);
                      }
                    }}
                    className="bg-vibrant-bg border-2 border-vibrant-dark rounded-xl overflow-hidden hover:border-vibrant-coral transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 group"
                  >
                    <div className="h-36 overflow-hidden relative border-b-2 border-vibrant-dark bg-slate-200">
                      <img 
                        src={setup.image} 
                        alt={setup.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-2 right-2 bg-vibrant-dark text-white font-black text-[9px] uppercase px-2 py-0.5 rounded border border-white">
                        {setup.category}
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <h5 className="font-black text-xs text-vibrant-dark line-clamp-1 group-hover:text-vibrant-coral transition-colors">
                        {setup.title}
                      </h5>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 pt-1 border-t border-vibrant-dark/10">
                        <span className="flex items-center gap-1 text-red-600">
                          <Heart className="w-3 h-3 fill-current" /> {setup.likes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <MessageCircle className="w-3 h-3" /> {Array.isArray(setup.comments) ? setup.comments.length : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 w-full flex flex-col sm:flex-row gap-3">
            {onStartChat && (
              <button
                onClick={() => {
                  onStartChat({ id: user.id, name: user.name, avatar: user.avatar });
                  onClose();
                }}
                className="flex-1 py-3 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark font-black text-xs uppercase border-3 border-vibrant-dark rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mesaj Gönder</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-vibrant-dark font-black text-xs uppercase border-3 border-vibrant-dark rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>

        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
