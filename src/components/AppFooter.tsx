import React from 'react';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { ROUTES } from '../utils/routes';
import { navigateTo } from '../utils/navigation';

interface AppFooterProps {
  siteSettings: Record<string, string>;
}

export const AppFooter: React.FC<AppFooterProps> = React.memo(({ siteSettings }) => {
  return (
    <footer className="mt-24 pb-12 border-t-4 border-vibrant-dark bg-white relative overflow-hidden">
      {/* Decorative elements for footer */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,#2d3436,#2d3436_10px,#fff_10px,#fff_20px)] opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Column */}
        <div className="space-y-6">
          <Logo size="2xl" className="opacity-100 my-2 origin-left" />
          <p className="text-sm font-bold text-slate-600  leading-relaxed max-w-xs">
            Yazılımcılar, tasarımcılar ve teknoloji meraklıları için küratörlü çalışma alanı atölyesi. 
            Masanı sanata dönüştür, topluluğa ilham ver.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {siteSettings.instagram_link ? (
              <a href={siteSettings.instagram_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-vibrant-yellow shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black text-xs" title="Instagram">IG</a>
            ) : (
              <div className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-vibrant-yellow shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                <Sparkles className="w-5 h-5" />
              </div>
            )}

            {siteSettings.twitter_link ? (
              <a href={siteSettings.twitter_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-vibrant-teal text-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black text-xs" title="Twitter / X">X</a>
            ) : (
              <div className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-vibrant-coral text-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            )}

            {siteSettings.youtube_link ? (
              <a href={siteSettings.youtube_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-rose-500 text-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black text-xs" title="YouTube">YT</a>
            ) : null}

            {siteSettings.github_link ? (
              <a href={siteSettings.github_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-vibrant-dark text-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black text-xs" title="GitHub">GH</a>
            ) : null}

            {siteSettings.discord_link ? (
              <a href={siteSettings.discord_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-indigo-500 text-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black text-xs" title="Discord">DC</a>
            ) : null}

            {siteSettings.linkedin_link ? (
              <a href={siteSettings.linkedin_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-vibrant-dark rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black text-xs" title="LinkedIn">IN</a>
            ) : null}
          </div>
        </div>

        {/* Contact Column */}
        <div className="space-y-6">
          <h4 className="text-lg font-black uppercase tracking-tighter text-vibrant-dark flex items-center gap-2">
            <span className="w-2 h-6 bg-vibrant-yellow inline-block" />
            Destek ve İletişim
          </h4>
          <div className="space-y-4">
            <div className="bg-vibrant-bg border-2 border-vibrant-dark rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
              <p className="text-[11px] font-black uppercase text-slate-600 mb-2 tracking-widest">Resmi E-Posta</p>
              <a 
                href={`mailto:${siteSettings.contact_email || 'setupss.support@gmail.com'}`} 
                className="text-sm md:text-base font-black text-vibrant-dark hover:text-vibrant-coral transition-colors flex items-center gap-2 group"
              >
                <Mail className="w-5 h-5 group-hover:animate-bounce" />
                {siteSettings.contact_email || 'setupss.support@gmail.com'}
              </a>
            </div>
            <p className="text-xs font-bold text-slate-700 italic">
              Soru, öneri veya iş birlikleri için dilediğiniz zaman bize ulaşabilirsiniz.
            </p>
          </div>
        </div>

        {/* Links Column */}
        <div className="space-y-6">
          <h4 className="text-lg font-black uppercase tracking-tighter text-vibrant-dark flex items-center gap-2">
            <span className="w-2 h-6 bg-vibrant-coral inline-block" />
            Yasal & Keşfet
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <a href="/privacy?v=2026_v5" target="_blank" className="text-sm font-black text-vibrant-dark hover:bg-vibrant-yellow px-4 py-2 border-2 border-vibrant-dark rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
              Gizlilik Politikası
            </a>
            <a href="/terms?v=2026_v5" target="_blank" className="text-sm font-black text-vibrant-dark hover:bg-vibrant-teal hover:text-white px-4 py-2 border-2 border-vibrant-dark rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
              Kullanım Koşulları
            </a>
            <button onClick={() => navigateTo(ROUTES.LEADERBOARD)} className="text-left text-sm font-black text-vibrant-dark hover:bg-amber-300 px-4 py-2 border-2 border-vibrant-dark rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
              Liderlik Tablosu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 pt-8 border-t-2 border-vibrant-dark/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <span className="text-[10px] font-mono font-black text-vibrant-dark/80 uppercase tracking-[0.2em]">
            © 2026 SETUPSS • MASAÜSTÜ SETUP PAYLAŞIM ATÖLYESİ
          </span>
          <a 
            href="https://www.instagram.com/ismail_ozcann_35/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-black text-vibrant-dark hover:text-vibrant-coral transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-vibrant-yellow px-3 py-1 border-2 border-vibrant-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            <span>Yapımcı ve Geliştirici: İsmail Özcan</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span 
            onClick={() => window.open('/admin', '_blank', 'noopener,noreferrer')} 
            className="w-10 h-10 border-2 border-vibrant-dark rounded-full flex items-center justify-center cursor-pointer hover:bg-vibrant-dark hover:text-white transition-all text-xs font-black shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            title="Secret Entrance"
          >
            •
          </span>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 border-2 border-vibrant-dark rounded-full text-[10px] font-black uppercase tracking-wider text-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistem Durumu: Aktif
          </div>
        </div>
      </div>
    </footer>
  );
});
AppFooter.displayName = 'AppFooter';
