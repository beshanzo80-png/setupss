import React, { useState, useEffect } from 'react';
import { safeJsonResponse } from '../lib/api';
import { X, LogIn, UserPlus, CheckCircle, Gift, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
  isForced?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, isForced = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    let timer: any;
    if (isVerifying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVerifying, timeLeft]);

  useEffect(() => {
    const pendingRef = sessionStorage.getItem('pending_referral') || localStorage.getItem('pending_referral');
    if (pendingRef) {
      setReferenceCode(pendingRef);
    } else {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setReferenceCode(refParam);
      }
    }
  }, []);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const res = await fetch('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data = await safeJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Giriş yapılamadı.');
      }
      
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Giriş penceresi kapatıldı.');
      } else {
        setError(err.message || 'Google ile giriş başarısız oldu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await safeJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Kod tekrar gönderilemedi.');
      }
      setTimeLeft(600); // Reset to 10 minutes
      setError(data.message || 'Yeni doğrulama kodu e-postanıza gönderildi.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isVerifying) {
        if (timeLeft <= 0) {
          throw new Error('Doğrulama kodunun 10 dakikalık süresi dolmuştur. Lütfen "Kodu Tekrar Gönder" butonuna basın.');
        }

        const res = await fetch('/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: verificationCode })
        });
        const data = await safeJsonResponse(res);
        
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Doğrulama başarısız.');
        }
        
        setIsVerifying(false);
        setIsLogin(true);
        setError('Hesap başarıyla doğrulandı! Lütfen giriş yapın.');
      } else {
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const body = isLogin ? { email, password, rememberMe } : { email, password, name, referenceCode };
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        
        const data = await safeJsonResponse(res);
        
        if (res.status === 403 && data.requiresVerification) {
          setTimeLeft(600);
          setIsVerifying(true);
          throw new Error(data.message || 'Lütfen hesabınızı doğrulayın. E-postanıza 6 haneli doğrulama kodu gönderildi.');
        }

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Bir hata oluştu.');
        }
        
        if (isLogin) {
          onSuccess(data.user);
        } else {
          setTimeLeft(600);
          setIsVerifying(true);
          setError(data.message || 'Kayıt başarılı! Lütfen e-postanıza gönderilen 6 haneli doğrulama kodunu girin.');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[380px] border-3 border-vibrant-dark rounded-3xl shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] overflow-hidden flex flex-col relative text-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-3 bg-vibrant-dark text-white flex justify-between items-center shrink-0 border-b-3 border-vibrant-dark">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-vibrant-yellow text-vibrant-dark font-black flex items-center justify-center text-xs">
              S
            </div>
            <span className="text-xs font-black uppercase tracking-wider">SETUPSS HESAP</span>
          </div>
          {!isForced && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tab Switcher (Giriş Yap / Kayıt Ol) */}
        {!isVerifying && (
          <div className="p-2 bg-slate-100 border-b-2 border-vibrant-dark flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                isLogin
                  ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <LogIn size={14} />
              <span>Giriş Yap</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                !isLogin
                  ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(255,217,61,1)]'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <UserPlus size={14} />
              <span>Kayıt Ol</span>
            </button>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className={`p-2.5 text-xs font-bold border-2 rounded-xl text-center leading-snug ${
              error.includes('başarılı') || error.includes('gönderildi') 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                : 'bg-rose-50 border-vibrant-coral text-vibrant-coral'
            }`}>
              {error}
            </div>
          )}

          {isVerifying ? (
            <div className="space-y-3 py-1">
              <div className="p-3 text-xs font-bold border-2 border-emerald-500 rounded-xl bg-emerald-50 text-emerald-900 leading-relaxed text-center">
                Lütfen <strong>{email}</strong> adresinize gönderilen 6 haneli doğrulama kodunu girin.
              </div>

              <div className="p-2 text-[11px] font-semibold bg-amber-50/80 border border-amber-300 text-amber-900 rounded-lg text-center leading-snug">
                📩 <strong>Gelen kutunuzda bulamadıysanız:</strong> Lütfen Gmail <strong>Spam (Gereksiz)</strong> veya <strong>Tanıtımlar (Promotions)</strong> sekmesini kontrol edin.
              </div>

              {/* 10 Dakika Geri Sayım Rozeti */}
              <div className={`p-2.5 rounded-xl border-2 flex items-center justify-between text-xs font-black tracking-wide ${
                timeLeft > 60 
                  ? 'bg-amber-50 border-amber-400 text-amber-900' 
                  : timeLeft > 0 
                    ? 'bg-rose-50 border-rose-400 text-rose-800 animate-pulse'
                    : 'bg-red-100 border-red-500 text-red-900'
              }`}>
                <span className="flex items-center gap-1.5">
                  ⏱️ Kalan Süre:
                </span>
                <span className="font-mono text-sm px-2 py-0.5 bg-white border border-slate-300 rounded-lg shadow-sm">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {timeLeft === 0 && (
                <div className="p-2 text-xs font-bold bg-rose-50 border-2 border-rose-500 text-rose-900 rounded-xl text-center">
                  ⚠️ Doğrulama kodunuzun 10 dakikalık süresi doldu. Lütfen aşağıdaki <strong>Kodu Tekrar Gönder</strong> butonuna tıklayın.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block text-center">Doğrulama Kodu</label>
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="6 Haneli Kod"
                  disabled={timeLeft === 0}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-vibrant-dark text-vibrant-dark rounded-xl text-center text-lg tracking-[0.4em] font-black outline-none focus:bg-white focus:ring-4 focus:ring-vibrant-yellow/30 min-h-[44px] disabled:opacity-50 disabled:bg-slate-200"
                  maxLength={6}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-2">
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg border-2 border-vibrant-dark font-black uppercase text-[11px] transition-all cursor-pointer ${
                    timeLeft === 0 
                      ? 'bg-vibrant-yellow text-vibrant-dark shadow-[2px_2px_0px_0px_#2D3436] hover:translate-y-[-1px]'
                      : 'bg-white text-sky-700 hover:bg-slate-50'
                  }`}
                >
                  {loading ? 'Gönderiliyor...' : 'Kodu Tekrar Gönder'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsVerifying(false); setError(''); }}
                  className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                >
                  Geri Dön
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isLogin && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                      <UserIcon size={12} /> Ad Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Adınız ve Soyadınız"
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-vibrant-dark text-vibrant-dark rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-vibrant-yellow/30 transition-all min-h-[42px]"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <Gift size={12} /> Davet Kodu (Opsiyonel)
                      </label>
                      {referenceCode && (
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                          Uygulandı
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={referenceCode}
                      onChange={e => setReferenceCode(e.target.value)}
                      placeholder="Varsa davet kodunuz"
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-vibrant-dark text-vibrant-dark rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-vibrant-yellow/30 transition-all min-h-[42px]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <Mail size={12} /> E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@setupss.com"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-vibrant-dark text-vibrant-dark rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-vibrant-yellow/30 transition-all min-h-[42px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <Lock size={12} /> Şifre
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-vibrant-dark text-vibrant-dark rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-vibrant-yellow/30 transition-all min-h-[42px]"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-vibrant-dark text-vibrant-dark focus:ring-vibrant-yellow cursor-pointer"
                    />
                    <span>Beni Hatırla</span>
                  </label>
                </div>
              )}
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-vibrant-yellow hover:bg-[#ffcf10] text-vibrant-dark border-2 border-vibrant-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-2 flex justify-center items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 min-h-[44px]"
          >
            {loading ? (
              <span>Lütfen bekleyin...</span>
            ) : isVerifying ? (
              <><CheckCircle size={16} /> Hesabı Doğrula</>
            ) : isLogin ? (
              <><LogIn size={16} /> Giriş Yap</>
            ) : (
              <><UserPlus size={16} /> Hesabı Oluştur</>
            )}
          </button>

          {!isVerifying && (
            <div className="pt-2 space-y-2 shrink-0">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2 text-[10px] font-black uppercase text-slate-400 absolute">veya</span>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-vibrant-dark border-2 border-vibrant-dark rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer min-h-[42px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.85 2.99c.9-2.7 3.41-4.51 6.76-4.51z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.79c2.1-1.94 3.31-4.8 3.31-8.42z"/>
                  <path fill="#FBBC05" d="M5.24 14.55c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.39 6.96C.5 8.75 0 10.74 0 12.83s.5 4.08 1.39 5.87l3.85-2.99c-.9-2.71-3.41-4.51-6.76-4.51z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.6-2.79c-.99.66-2.26 1.06-3.6 1.06-3.35 0-5.86-1.81-6.76-4.51L1.14 16.8C3.12 20.73 7.18 23 12 23z"/>
                </svg>
                <span>Google ile İşlem Yap</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
