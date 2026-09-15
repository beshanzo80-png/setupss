import React, { useState, useEffect } from 'react';
import { safeJsonResponse } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, Sparkles, Heart, MessageSquare, Share2, Users, Flame, ExternalLink, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { UserPublicProfileModal } from './UserPublicProfileModal';
import { SetupPost } from '../types';
import { SafeImage } from './SafeImage';
import { UserAvatar } from './UserAvatar';

interface LeaderboardProps {
  onOpenInviteModal: () => void;
  currentUser: any;
  allSetups?: SetupPost[];
  onSelectSetup?: (setup: SetupPost) => void;
  onStartChat?: (user: { id: string; name: string; avatar?: string }) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  onOpenInviteModal,
  currentUser,
  allSetups = [],
  onSelectSetup,
  onStartChat
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly' | 'all'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<any | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const fetchLeaderboard = async (tf: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?timeframe=${tf}`);
      const data = await safeJsonResponse(res);
      if (data.success && Array.isArray(data.leaderboard)) {
        setLeaderboardData(data.leaderboard);
      }
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(timeframe);
  }, [timeframe]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#FFEAA7]  border-4 border-vibrant-dark  rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors">
        <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-vibrant-yellow/30 rounded-full opacity-40 blur-2xl pointer-events-none"></div>
        <div className="space-y-3 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-vibrant-coral text-white font-black text-[10px] uppercase rounded-full border-2 border-vibrant-dark  shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
            <Trophy className="w-3.5 h-3.5" /> Şöhretler & Sıralama Salonu
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-vibrant-dark  uppercase tracking-tight">
            En Çok Etkileşim Alan Kral 👑
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-vibrant-dark/80  max-w-xl">
            Beğeniler, yorumlar, paylaşılan setup'lar ve arkadaş davetleriyle puanları topla! Haftalık, aylık ve yıllık şampiyonlar taç giyiyor.
          </p>
        </div>
        <button
          onClick={onOpenInviteModal}
          className="bg-vibrant-dark hover:bg-slate-800 text-white border-4 border-vibrant-dark  rounded-2xl px-6 py-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 z-10"
        >
          <Sparkles className="w-4 h-4 text-vibrant-yellow" />
          <span>Arkadaşını Davet Et & Taç Kazan</span>
        </button>
      </div>

      {/* Leaderboard & Boost Explanation Box */}
      <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-5 sm:p-7 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100  pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-vibrant-yellow  p-3 rounded-2xl border-3 border-vibrant-dark  shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
              <Zap className="w-6 h-6 text-vibrant-dark  fill-vibrant-yellow" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-vibrant-dark  uppercase tracking-tight">
                Liderlik Sistemimiz Nasıl Çalışıyor?
              </h3>
              <p className="text-xs font-semibold text-slate-500 ">
                Sıralamada yükselmek, gerçek zamanlı puan toplamak ve Boost kazanmak için rehberiniz!
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs font-black uppercase text-vibrant-dark  bg-slate-100  hover:bg-vibrant-yellow  px-4 py-2.5 rounded-xl border-2 border-vibrant-dark  transition-all cursor-pointer flex items-center gap-2 self-start sm:self-center shrink-0"
          >
            <span>{showGuide ? 'Rehberi Daralt' : 'Nasıl Puan Kazanırım?'}</span>
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden pt-1"
            >
              {/* Points Breakdown Grid */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-vibrant-dark mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-vibrant-coral" /> Gerçek Zamanlı Puan Kazanma Formülü
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-amber-50 border-3 border-vibrant-dark rounded-2xl p-3.5 text-center shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                    <span className="block text-2xl font-black text-amber-600 mb-0.5">+50 Puan</span>
                    <span className="text-[11px] font-extrabold text-vibrant-dark uppercase block">Arkadaş Daveti</span>
                    <span className="text-[9px] font-bold text-slate-500">En hızlı zirveye tırmanma yolu!</span>
                  </div>

                  <div className="bg-blue-50 border-3 border-vibrant-dark rounded-2xl p-3.5 text-center shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                    <span className="block text-2xl font-black text-blue-600 mb-0.5">+20 Puan</span>
                    <span className="text-[11px] font-extrabold text-vibrant-dark uppercase block">Setup Paylaşımı</span>
                    <span className="text-[9px] font-bold text-slate-500">Yayınladığın her çalışma alanı</span>
                  </div>

                  <div className="bg-rose-50 border-3 border-vibrant-dark rounded-2xl p-3.5 text-center shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                    <span className="block text-2xl font-black text-rose-600 mb-0.5">+10 Puan</span>
                    <span className="text-[11px] font-extrabold text-vibrant-dark uppercase block">Setup Beğenisi</span>
                    <span className="text-[9px] font-bold text-slate-500">Masanıza gelen her gerçek beğeni</span>
                  </div>

                  <div className="bg-emerald-50 border-3 border-vibrant-dark rounded-2xl p-3.5 text-center shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                    <span className="block text-2xl font-black text-emerald-600 mb-0.5">+5 Puan</span>
                    <span className="text-[11px] font-extrabold text-vibrant-dark uppercase block">Gelen Yorum</span>
                    <span className="text-[9px] font-bold text-slate-500">Kurulumlarınıza gelen yorumlar</span>
                  </div>
                </div>
              </div>

              {/* Boost System Banner */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 border-4 border-vibrant-dark shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-[10px] uppercase rounded-full border border-vibrant-dark shadow-sm">
                      <Crown className="w-3.5 h-3.5 fill-current" /> SÜPER BOOST SİSTEMİ
                    </div>
                    <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-vibrant-yellow">
                      Profilinize Boost Alarak Zirveye İlerleyin! 🚀
                    </h4>
                    <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
                      Boost aktif olduğunda adınızın yanında <strong className="text-amber-300">Kral Taçı 👑</strong> ve <strong className="text-purple-300">Dinamik RGB Efekti 🌈</strong> açılır. Arkadaş daveti yaptığınızda ve masalarınızı paylaştığınızda profiliniz liderlik tablosunda hemen göz alıcı şekilde parlar!
                    </p>
                  </div>

                  <button
                    onClick={onOpenInviteModal}
                    className="bg-vibrant-yellow hover:bg-amber-300 text-vibrant-dark border-3 border-vibrant-dark rounded-xl px-5 py-3 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 fill-vibrant-dark" />
                    <span>Boost Kazan & Davet Et</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeframe Tabs */}
      <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] p-4 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-vibrant-coral" />
          <span className="text-xs font-black uppercase tracking-wider text-vibrant-dark">Dönem Seçimi:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'weekly', label: 'Haftalık' },
            { id: 'monthly', label: 'Aylık' },
            { id: 'yearly', label: 'Yıllık' },
            { id: 'all', label: 'Tüm Zamanlar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id as any)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-vibrant-dark transition-all cursor-pointer ${
                timeframe === tab.id
                  ? 'bg-vibrant-yellow text-vibrant-dark shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] -translate-y-0.5'
                  : 'bg-white text-vibrant-dark hover:bg-vibrant-bg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white border-4 border-vibrant-dark rounded-[2.5rem] p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-vibrant-dark border-t-vibrant-coral rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sıralama Hesaplanıyor...</p>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-lg font-black text-vibrant-dark uppercase">Bu Dönemde Henüz Veri Bulunmuyor</h4>
            <p className="text-xs text-slate-500">Masanı paylaş, beğeni al veya arkadaşını davet ederek zirveye yerleş!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboardData.map((user, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const rankBg =
                rank === 1 ? 'bg-amber-300 text-amber-950 border-amber-600' :
                rank === 2 ? 'bg-slate-200 text-slate-800 border-slate-400' :
                rank === 3 ? 'bg-amber-700/20 text-amber-900 border-amber-600/40' :
                'bg-slate-100 text-slate-600 border-slate-300';

              return (
                <motion.div
                  key={user.id || index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  onClick={() => setSelectedUserForProfile({ ...user, rank })}
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-5 rounded-2xl border-3 border-vibrant-dark gap-4 transition-all cursor-pointer group ${
                    rank === 1 ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]' : 'bg-white hover:bg-slate-50'
                  }`}
                  title={`${user.name} kullanıcısının profilini gör`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 border-vibrant-dark font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] ${rankBg}`}>
                      {rank === 1 ? '👑 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : `#${rank}`}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        src={user.avatar}
                        name={user.name}
                        frame={user.avatarFrame || user.avatar_frame || 'none'}
                        isCrown={user.isCrown || user.inviteCount > 0}
                        hasRgb={user.hasRgb || user.inviteCount > 0}
                        size="sm"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-black text-sm sm:text-base group-hover:text-vibrant-coral transition-colors flex items-center gap-1 ${user.hasRgb || user.inviteCount > 0 ? 'rgb-text' : 'text-vibrant-dark'}`}>
                            {user.name}
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-vibrant-coral ml-1" />
                          </h4>
                          {user.inviteCount > 0 && (
                            <span className="text-[9px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-300">
                              {user.inviteCount} Davet
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold line-clamp-1">{user.bio || 'Setup Tutkunu'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Score */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-vibrant-dark/10">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs font-black text-vibrant-dark">
                      <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-xl border border-red-200" title="Toplam Beğeni">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{user.totalLikes}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-xl border border-blue-200" title="Paylaşılan Setup">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{user.setupsCount}</span>
                      </div>
                    </div>

                    <div className="bg-vibrant-yellow px-4 py-2 rounded-2xl border-2 border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] text-center shrink-0">
                      <span className="text-[9px] font-black uppercase tracking-wider text-vibrant-dark block">Puan</span>
                      <span className="text-sm font-black text-vibrant-dark">{user.score}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Public Profile Modal */}
      <AnimatePresence>
        {selectedUserForProfile && (
          <UserPublicProfileModal
            user={selectedUserForProfile}
            allSetups={allSetups}
            onClose={() => setSelectedUserForProfile(null)}
            onSelectSetup={onSelectSetup}
            onStartChat={onStartChat}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

