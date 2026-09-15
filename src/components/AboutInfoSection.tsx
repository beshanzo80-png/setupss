import React from 'react';
import { Sparkles } from 'lucide-react';

interface AboutInfoSectionProps {
  siteSettings: Record<string, string>;
}

export const AboutInfoSection: React.FC<AboutInfoSectionProps> = React.memo(({ siteSettings }) => {
  return (
    <div className="mt-12 bg-white border-4 border-vibrant-dark rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-vibrant-yellow border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider text-vibrant-dark">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setupss Platform Rehberi / Guide</span>
          </span>
          <h2 className="text-xl md:text-2xl font-black text-vibrant-dark tracking-tight">
            Setupss Nedir? <span className="text-slate-600 font-bold text-lg">/ What is Setupss?</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-950 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
            ⚡ Akakçe & Cimri Fiyat Entegrasyonlu
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* TÜRKÇE (TR) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-vibrant-yellow px-2.5 py-1 border-2 border-vibrant-dark rounded-lg text-xs font-black text-vibrant-dark">TR</span>
            <h3 className="text-base font-black text-vibrant-dark uppercase tracking-tight">
              Setupss Nedir ve Ne İşe Yarar?
            </h3>
          </div>

          <p className="text-xs font-semibold leading-relaxed text-vibrant-dark">
            <strong>Setupss</strong>; yazılımcılar, tasarımcılar, oyuncular ve içerik üreticileri için geliştirilmiş Türkiye’nin ilk akıllı masaüstü kurulumu (setup) paylaşım, donanım inceleme ve AI destekli bütçe planlama platformudur.
          </p>

          {/* Özellikler Grid TR */}
          <div className="grid grid-cols-1 gap-2 text-xs font-bold text-vibrant-dark">
            <div className="bg-amber-50/80 border-2 border-vibrant-dark rounded-xl p-3 space-y-1">
              <h4 className="font-black text-amber-950 uppercase text-[11px] flex items-center gap-1.5">
                🤖 Yapay Zeka & Akakçe - Cimri Karşılaştırma
              </h4>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Bütçenizi belirleyin; Gemini AI size en uyumlu ekipman kombinasyonunu hazırlasın. Akakçe, Cimri, Amazon TR ve tüm pazaryerlerindeki anlık en ucuz fiyatları tek tıkla analiz edin.
              </p>
            </div>

            <div className="bg-sky-50/80 border-2 border-vibrant-dark rounded-xl p-3 space-y-1">
              <h4 className="font-black text-sky-950 uppercase text-[11px] flex items-center gap-1.5">
                📸 Masaüstü İlhama & Topluluk Paylaşımı
              </h4>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Kendi çalışma alanınızın fotoğraflarını yükleyin, kullandığınız monitör, klavye, mouse ve masa detaylarını ekleyin, toplulukla fikir alışverişi yapıp mesajlaşın.
              </p>
            </div>

            <div className="bg-emerald-50/80 border-2 border-vibrant-dark rounded-xl p-3 space-y-1">
              <h4 className="font-black text-emerald-950 uppercase text-[11px] flex items-center gap-1.5">
                🔒 Hesabınız ve Veri Güvenliği
              </h4>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Giriş yaptığınızda e-posta ve adınız sadece profil oluşturma, kendi masanızı ve istek listenizi (wishlist) kaydetme amacıyla kullanılır. Verileriniz gizli tutulur ve pazarlama amaçlı paylaşılmaz.
              </p>
            </div>
          </div>
        </div>

        {/* ENGLISH (EN) */}
        <div className="space-y-4 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-vibrant-dark/20 pt-6 md:pt-0 md:pl-8">
          <div className="flex items-center gap-2">
            <span className="bg-[#014886] text-white px-2.5 py-1 border-2 border-vibrant-dark rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">EN</span>
            <h3 className="text-base font-black text-vibrant-dark uppercase tracking-tight">
              What is Setupss and How Does It Work?
            </h3>
          </div>

          <p className="text-xs font-semibold leading-relaxed text-vibrant-dark font-sans">
            <strong>Setupss</strong> is an AI-powered desk setup sharing, hardware review, and budget planning platform tailored for developers, gamers, designers, and tech enthusiasts.
          </p>

          {/* Features Grid EN */}
          <div className="grid grid-cols-1 gap-2 text-xs font-bold text-vibrant-dark font-sans">
            <div className="bg-amber-50/80 border-2 border-vibrant-dark rounded-xl p-3 space-y-1">
              <h4 className="font-black text-amber-950 uppercase text-[11px] flex items-center gap-1.5">
                🤖 AI Budget Planner & Real-time Price Comparison
              </h4>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Enter your budget and let Gemini AI curate the optimal hardware setup. Compare lowest live prices across Akakçe, Cimri, Amazon, and top e-commerce platforms.
              </p>
            </div>

            <div className="bg-sky-50/80 border-2 border-vibrant-dark rounded-xl p-3 space-y-1">
              <h4 className="font-black text-sky-950 uppercase text-[11px] flex items-center gap-1.5">
                📸 Workspace Inspiration & Community
              </h4>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                Showcase your physical desk setup, itemize your gear (monitors, audio, lighting, peripherals), chat with creators, and get inspired by others.
              </p>
            </div>

            <div className="bg-emerald-50/80 border-2 border-vibrant-dark rounded-xl p-3 space-y-1">
              <h4 className="font-black text-emerald-950 uppercase text-[11px] flex items-center gap-1.5">
                🔒 Account Usage & Privacy Assurance
              </h4>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                When you log in, your display name and email are strictly used to save your custom setups and hardware wishlists. Your personal data is never sold or shared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
AboutInfoSection.displayName = 'AboutInfoSection';
