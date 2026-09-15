import React, { useState } from 'react';
import { X, Copy, Check, Crown, Sparkles, Gift, Share2 } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onAuthTrigger: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, currentUser, onAuthTrigger }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const isGuest = !currentUser || currentUser.id.startsWith('guest');
  const userId = currentUser?.id || 'guest';
  const referenceCode = currentUser?.referenceCode || userId;
  const inviteLink = `${window.location.origin}/?ref=${referenceCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-4 rounded-[2.5rem] w-full max-w-lg overflow-hidden rgb-modal-border animate-scaleUp">
        {/* Header */}
        <div className="bg-[#FFEAA7] border-b-4 border-vibrant-dark p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vibrant-coral border-2 border-vibrant-dark rounded-xl flex items-center justify-center text-white font-black shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-vibrant-dark uppercase tracking-tight">Arkadaşını Davet Et & Ödülleri Kap!</h3>
              <p className="text-[11px] font-bold text-slate-600">Özel ayrıcalıklar kazan ve zirveye tırman</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white border-2 border-vibrant-dark rounded-xl flex items-center justify-center font-black text-vibrant-dark hover:bg-vibrant-bg transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Rewards List */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-vibrant-dark block">Davet Edenlere Özel Ayrıcalıklar:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-amber-50 border-2 border-vibrant-dark rounded-2xl p-4 text-center space-y-2 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                <div className="w-10 h-10 bg-amber-400 text-amber-950 rounded-xl border-2 border-vibrant-dark flex items-center justify-center mx-auto shadow-sm">
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <h5 className="font-black text-vibrant-dark text-xs uppercase">Kıral Taçlı Profil</h5>
                <p className="text-[10px] text-slate-600 font-semibold">Avatarında altın sarısı taç rozeti</p>
              </div>

              <div className="bg-purple-50 border-2 border-vibrant-dark rounded-2xl p-4 text-center space-y-2 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                <div className="w-10 h-10 bg-purple-400 text-white rounded-xl border-2 border-vibrant-dark flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h5 className="font-black text-vibrant-dark text-xs uppercase">RGB Dönen Efekt</h5>
                <p className="text-[10px] text-slate-600 font-semibold">Setup kartında animasyonlu RGB parıltı</p>
              </div>

              <div className="bg-emerald-50 border-2 border-vibrant-dark rounded-2xl p-4 text-center space-y-2 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                <div className="w-10 h-10 bg-emerald-400 text-white rounded-xl border-2 border-vibrant-dark flex items-center justify-center mx-auto shadow-sm">
                  <Share2 className="w-5 h-5" />
                </div>
                <h5 className="font-black text-vibrant-dark text-xs uppercase">Sıralama Boost</h5>
                <p className="text-[10px] text-slate-600 font-semibold">Haftalık & aylık tabloda devasa puan</p>
              </div>
            </div>
          </div>

          {/* Referral Link & Code Box */}
          <div className="space-y-4">
            {isGuest ? (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-vibrant-dark block">
                  Davet Etmek İçin Giriş Yap:
                </label>
                <button
                  onClick={() => { onClose(); onAuthTrigger(); }}
                  className="w-full py-4 bg-[#0984e3] hover:bg-blue-600 text-white border-2 border-vibrant-dark rounded-2xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
                >
                  Giriş Yap / Kayıt Ol
                </button>
              </div>
            ) : (
              <>
                {/* 1. Invite Link */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black uppercase tracking-wider text-vibrant-dark">
                      Özel Davet Bağlantın:
                    </label>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                      Tıklama ile otomatik tanır
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteLink}
                      className="w-full px-3.5 py-2.5 bg-vibrant-bg border-3 border-vibrant-dark rounded-xl text-xs font-mono font-bold text-vibrant-dark outline-none select-all truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 border-3 border-vibrant-dark rounded-xl font-black text-xs uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none shrink-0 flex items-center gap-1.5 ${
                        copiedLink ? 'bg-emerald-400 text-white' : 'bg-vibrant-yellow text-vibrant-dark hover:bg-[#ffe066]'
                      }`}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Referral Code */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-vibrant-dark block">
                    Referans Kodun (Manuel Giriş İçin):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referenceCode}
                      className="w-full px-3.5 py-2.5 bg-amber-50 border-3 border-vibrant-dark rounded-xl text-xs font-mono font-black text-amber-900 outline-none select-all uppercase tracking-widest text-center"
                    />
                    <button
                      onClick={handleCopyCode}
                      className={`px-4 py-2.5 border-3 border-vibrant-dark rounded-xl font-black text-xs uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none shrink-0 flex items-center gap-1.5 ${
                        copiedCode ? 'bg-emerald-400 text-white' : 'bg-vibrant-teal text-white hover:opacity-90'
                      }`}
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {isGuest
                ? 'Arkadaşlarını davet etmek ve özel ödüller kazanmak için hesabına giriş yapmalısın.'
                : 'Bu bağlantı veya kod ile arkadaşın yeni hesap açıp doğruladığında, senin hesabına anında +1 Davet, Kral Taçı 👑, RGB Dönen Efekt 🌈 ve +50 Liderlik Puanı eklenir!'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-vibrant-bg border-t-4 border-vibrant-dark p-4 sm:p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-vibrant-dark hover:bg-slate-800 text-white border-3 border-vibrant-dark rounded-xl px-6 py-2.5 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
