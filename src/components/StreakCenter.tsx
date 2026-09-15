import React, { useState, useEffect } from 'react';
import { safeJsonResponse } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Bot, Shield, Smartphone, RefreshCw, Send, CheckCircle2, 
  User, Trophy, Heart, BellRing, Sparkles, Volume2, VolumeX, 
  Snowflake, AlertTriangle, ShieldAlert, MessageSquare, Zap 
} from 'lucide-react';

interface Companion {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  badge: string;
  color: string;
}

const COMPANIONS: Companion[] = [
  {
    id: 'sarcastic',
    name: 'Sarkastik Beşir Hanzo',
    title: 'Geyikçi & Alaycı 🧔',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&h=200&q=80',
    description: 'En ufak hatanda "Tuvalete mi düştün?" diye dalga geçer. Klavyendeki toz katmanına laf çarpmaya bayılır.',
    badge: 'Sarkastik',
    color: 'border-amber-400 text-amber-500 bg-amber-400/10'
  },
  {
    id: 'toxic_gamer',
    name: 'Toxic RGB Oyuncu',
    title: 'Salty Rank Kasacı 🎮',
    avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&h=200&q=80',
    description: 'Serini bozarsan sana "Noob" der, "Rank düştün ezik!" diye bağırır. Tek bildiği RGB, FPS ve report atmaktır.',
    badge: 'Toxic',
    color: 'border-red-500 text-red-500 bg-red-500/10'
  },
  {
    id: 'tsundere',
    name: 'Tsundere Zeynep',
    title: 'Soğuk ama Tatlı 🌸',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
    description: '"S-sana ihtiyacım olduğundan değil ama gel işte..." havasındadır. İçten içe serini bozmandan çok korkar.',
    badge: 'Tsundere',
    color: 'border-pink-500 text-pink-500 bg-pink-500/10'
  },
  {
    id: 'motivational',
    name: 'Setupss Koçu',
    title: 'Agresif Motivasyoncu ⚡',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&h=200&q=80',
    description: 'Duolingo kuşu gibi tehditkardır. "Yarın geç olacak, bugün o masaya otur!" diyerek seni her gün spora ve koda zorlar.',
    badge: 'Militan',
    color: 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
  }
];

interface StreakCenterProps {
  user: any;
  onAuthTrigger: () => void;
  onRefreshSetups?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'companion' | 'user';
  text: string;
  time: string;
}

export const StreakCenter: React.FC<StreakCenterProps> = ({ user, onAuthTrigger, onRefreshSetups }) => {
  const [streakData, setStreakData] = useState({
    streakCount: 0,
    lastActiveDate: null as string | null,
    streakCompanion: 'sarcastic',
    streakFreezes: 1,
    wasFrozenApplied: false,
    displayName: 'Ziyaretçi'
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedCompanion, setSelectedCompanion] = useState('sarcastic');
  const [notification, setNotification] = useState<{
    text: string;
    sender: string;
    avatar: string;
    time: string;
  } | null>(null);
  
  const [isBotPosting, setIsBotPosting] = useState(false);
  const [botSharedSetup, setBotSharedSetup] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushPermission, setPushPermission] = useState('default');
  
  // Interactive Chat Console states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize notification permission state
  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
    
    // Initial welcome message from companion in console
    const activeComp = COMPANIONS.find(c => c.id === selectedCompanion) || COMPANIONS[0];
    setChatMessages([
      {
        id: 'welcome',
        sender: 'companion',
        text: `Hey ${user?.displayName || user?.name || 'Kıral'}! Ben senin AI Seri koruyucunum. Sitede aktif kalmazsan canını fena yakarım, klavyeni tuzla buz ederim haberin olsun!`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedCompanion, user]);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Tarayıcınız masaüstü bildirimlerini desteklemiyor.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        playNotificationSound();
        // Show test notification
        const activeComp = COMPANIONS.find(c => c.id === selectedCompanion) || COMPANIONS[0];
        new Notification(activeComp.name, {
          body: "Masaüstü bildirimleri aktif edildi! Kaçmaya çalışırsan seni burada yakalayacağım!",
          icon: activeComp.avatar
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Play synthesized notification/warning tone using Web Audio API
  const playNotificationSound = (type: 'freeze' | 'alert' | 'success' = 'alert') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'freeze') {
        // Cold freezing wave sound (snowy)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else if (type === 'success') {
        // Happy success chime
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(audioCtx.destination);
        gain2.connect(audioCtx.destination);
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        
        gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.3);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.4);
      } else {
        // Sarcastic double beep
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.15);

        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
          gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.3);
        }, 80);
      }
    } catch (e) {
      console.warn("Audio Context blocked or not supported:", e);
    }
  };

  const loadStreakStatus = async () => {
    setLoading(true);
    try {
      const userIdParam = user?.id ? `?userId=${encodeURIComponent(user.id)}` : '';
      const response = await fetch(`/api/streak/status${userIdParam}`);
      const data = await safeJsonResponse(response);
      if (data.success) {
        setStreakData({
          streakCount: data.streakCount,
          lastActiveDate: data.lastActiveDate,
          streakCompanion: data.streakCompanion,
          streakFreezes: data.streakFreezes === undefined ? 1 : data.streakFreezes,
          wasFrozenApplied: !!data.wasFrozenApplied,
          displayName: data.displayName
        });
        setSelectedCompanion(data.streakCompanion || 'sarcastic');
      }
    } catch (e) {
      console.error("Streak load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreakStatus();
  }, [user]);

  const handleCompanionChange = async (compId: string) => {
    if (!user) {
      onAuthTrigger();
      return;
    }
    setSelectedCompanion(compId);
    try {
      const response = await fetch('/api/streak/update-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companion: compId, userId: user.id })
      });
      const data = await safeJsonResponse(response);
      if (data.success) {
        setStreakData(prev => ({ ...prev, streakCompanion: compId }));
        // Instantly generate a personalized greeting
        triggerNotification(0, compId);
        
        // Add chat welcome in console
        const selectedObj = COMPANIONS.find(c => c.id === compId) || COMPANIONS[0];
        setChatMessages(prev => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'companion',
            text: `[Sistem] Yeni Seri Koruyucun seçildi: ${selectedObj.name}!`,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyFreeze = async () => {
    if (!user) {
      onAuthTrigger();
      return;
    }
    try {
      const response = await fetch('/api/streak/buy-freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await safeJsonResponse(response);
      if (data.success) {
        setStreakData(prev => ({
          ...prev,
          streakFreezes: data.streakFreezes
        }));
        playNotificationSound('freeze');
        
        // Push notification or alert
        setNotification({
          text: `Harika! 1 adet Seri Dondurucu (Streak Freeze) ❄️ başarıyla envantere eklendi. Artık bir gün girmezsen serin dondurulup korunacak!`,
          sender: "Setupss Koruyucu",
          avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
          time: "Şimdi"
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateOffline = async (days: number) => {
    if (!user) {
      onAuthTrigger();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/streak/simulate-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, userId: user.id })
      });
      const data = await safeJsonResponse(response);
      if (data.success) {
        // Trigger notification generation
        await triggerNotification(days, selectedCompanion);
        // Reload status
        const statusRes = await fetch(`/api/streak/status?userId=${encodeURIComponent(user.id)}`);
        const statusData = await safeJsonResponse(statusRes);
        if (statusData.success) {
          setStreakData({
            streakCount: statusData.streakCount,
            lastActiveDate: statusData.lastActiveDate,
            streakCompanion: statusData.streakCompanion,
            streakFreezes: statusData.streakFreezes,
            wasFrozenApplied: !!statusData.wasFrozenApplied,
            displayName: statusData.displayName
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerNotification = async (days: number, companionId: string) => {
    try {
      const response = await fetch('/api/streak/generate-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days,
          companion: companionId,
          userName: user?.displayName || user?.name || 'Kıral'
        })
      });
      const data = await safeJsonResponse(response);
      if (data.success) {
        setNotification({
          text: data.message,
          sender: data.companionName,
          avatar: data.avatar,
          time: 'Şimdi'
        });
        
        // Trigger desktop browser push notification if active
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.companionName, {
            body: data.message,
            icon: data.avatar
          });
        }

        playNotificationSound();

        // Also output to the threat chat console log
        setChatMessages(prev => [
          ...prev,
          {
            id: `threat-${Date.now()}`,
            sender: 'companion',
            text: data.message,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Pre-coded funny replies the user can send to reply to the companion, and the companion's personalized comebacks!
  const USER_REPLIES = [
    { text: "Kusura bakma şef, kablolarla uğraşıyordum ya!", id: "cables" },
    { text: "Beni tehdit mi ediyorsun sen?! Silerim seni ha!", id: "threat" },
    { text: "RGB fanlarım yandı, ona ağlıyordum girmedim.", id: "rgb" },
    { text: "Hemen lüks bir setup paylaşıp seriyi kurtarıyorum!", id: "save" }
  ];

  const handleUserReply = (replyId: string, replyText: string) => {
    if (isTyping) return;
    
    // Append user's message
    const userMsgId = `user-${Date.now()}`;
    setChatMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: replyText,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    setIsTyping(true);
    
    // Companion responds matching their unique persona!
    setTimeout(() => {
      let botResponse = "";
      const name = user?.displayName || user?.name || "Kıral";
      
      switch (selectedCompanion) {
        case 'toxic_gamer':
          if (replyId === 'cables') botResponse = `Ulan ${name}, arkadaki kabloların spagettiye dönmüş hâlâ kablo diyorsun! Kablo düzeniyle rank atlasaydın Noob kalmazdın ezik! Çabuk git setup incele!`;
          else if (replyId === 'threat') botResponse = `Beni silmek mi? Sen anca tetris silersin! Ben olmasam serin 0 gündü, rüyamda görsem inanmam senin o 0'ına. Hemen reportluyorum seni!`;
          else if (replyId === 'rgb') botResponse = `RGB yanınca FPS'in mi düştü? Ağlama oyna! Git mahalleden ampul çal tak, o kadar kolsuzsun yani!`;
          else botResponse = `Görelim bakalım ne kadar lüks olacağını! Paylaştığın setup'ta kablo gizlenmemişse anında 1 yıldız verip report atıyorum!`;
          break;
          
        case 'tsundere':
          if (replyId === 'cables') botResponse = `K-kablo mu? S-sırf masanın arkası düzgün olsun diye uğraştın diye sana kızmayacağımı mı sandın?! H-hiç de bile! Ama... bittiyse bana da fotoğrafını at, merak ettiğimden değil ha!`;
          else if (replyId === 'threat') botResponse = `H-hey! Beni silmek falan... Nasıl böyle bir şey söyleyebilirsin b-aptal! S-seni merak eden de kabahat zaten! Git ne yaparsan yap... (Ama gitme lütfen...)`;
          else if (replyId === 'rgb') botResponse = `RGB fanların mı yandı? Ü-üzüldüm... Yani, sırf o yüzden girmedinse b-belki affedebilirim... Ama çabuk tamir et yoksa serini yine de bozarım!`;
          else botResponse = `S-sırf benim için lüks bir setup mı paylaşacaksın? S-sana bunu kim söyledi?! G-gereksiz şeyler yapma... Ama paylaşırsan ilk ben beğeneceğim, tamam mı?`;
          break;
          
        case 'motivational':
          if (replyId === 'cables') botResponse = `Bahaneler arkasına sığınmayı kes şampiyon! O kablolar masanın arkasında saklanır ama senin tembelliğin saklanamaz! Bugün o klavyeye basacaksın!`;
          else if (replyId === 'threat') botResponse = `Beni tehdit etmek enerjini boşa harcamaktır! Benim amacım seni o mükemmel workspace hayaline ulaştırmak. Şimdi sinirlenmeyi bırak ve bir setup paylaş!`;
          else if (replyId === 'rgb') botResponse = `Yanan fanlar yeniden alınır ama kaybedilen disiplin geri gelmez! Karanlıkta kal, yine de o seriyi tamamla! Akışını bozma!`;
          else botResponse = `İşte görmek istediğim şampiyon ruhu bu! En iyi ekipmanları süz, rüya masaüstünü kur ve topluluğa liderlik et! Başarı seninle!`;
          break;
          
        case 'sarcastic':
        default:
          if (replyId === 'cables') botResponse = `Ooo ${name} bey lütfettiniz! Kablo düzenliyormuş... Masanın altındaki toz tabakasından antik kent kurulmuş, arkeologlar yolda haberin olsun!`;
          else if (replyId === 'threat') botResponse = `Lan beni silsen ne olacak, yarın yine klavyendeki toza laf sokmaya geleceğim! Kaçışın yok kıral, o masaüstünü parlatana kadar buradayım!`;
          else if (replyId === 'rgb') botResponse = `Vah vah... RGB fanların mı yandı? Kasan pavyon havasından taziye evine dönmüş o zaman desene. Gel yasını birlikte tutalım, siteye gir de bir çay koyayım!`;
          else botResponse = `Ooo kıralım yeni setup paylaşıyor demek! Eskiciye vereceğim kasayı durduruyorum o zaman şimdilik. Bakalım Beşir Hanzo'dan tam not alabilecek misin?`;
          break;
      }
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `companion-reply-${Date.now()}`,
          sender: 'companion',
          text: botResponse,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
      playNotificationSound();
    }, 1200);
  };

  const handleBotAutoShare = async () => {
    setIsBotPosting(true);
    setBotSharedSetup(null);
    try {
      const response = await fetch('/api/bot/auto-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await safeJsonResponse(response);
      if (data.success && data.setup) {
        setBotSharedSetup(data.setup);
        playNotificationSound('success');
        if (onRefreshSetups) {
          onRefreshSetups();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBotPosting(false);
    }
  };

  const activeCompanionObj = COMPANIONS.find(c => c.id === selectedCompanion) || COMPANIONS[0];

  return (
    <div id="streak-center-container" className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* Top Slide-Down Banner Toast Notification inside the app */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-4 right-4 md:left-auto md:right-12 md:max-w-md z-50 bg-white  border-4 border-vibrant-dark  rounded-3xl p-5 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex gap-4 items-start"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-vibrant-dark shrink-0">
              <img src={notification.avatar} alt="Companion" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-vibrant-dark  uppercase tracking-tight">{notification.sender}</span>
                <button 
                  onClick={() => setNotification(null)}
                  className="text-xs font-black text-slate-400 hover:text-vibrant-coral"
                >
                  [Kapat]
                </button>
              </div>
              <p className="text-xs text-slate-700  font-bold leading-relaxed">
                {notification.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Heading */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-vibrant-coral/10 border-2 border-vibrant-coral rounded-full text-vibrant-coral text-xs font-black uppercase tracking-wider animate-pulse">
          <Flame className="w-3.5 h-3.5" />
          GERÇEK DUOLINGO-TARZI SİSTEMİ
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-vibrant-dark  uppercase tracking-tight leading-none">
          Kişiselleştirilmiş Seri & Bot Merkezi
        </h1>
        <p className="text-sm md:text-base text-slate-500  font-bold max-w-lg mx-auto leading-relaxed">
          Günlük aktifliğini koru. Bir gün bile girmezsen, seçtiğin AI Companion seni gerçek bildirimlerle uyarır! Dondurucu kullanarak serini koruyabilirsin.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Streak Flame & Simulators (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Flame Card */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            
            {/* Top right utility buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {/* Notification permission button */}
              <button
                onClick={requestNotificationPermission}
                className={`px-3 py-1.5 border-2 border-vibrant-dark  rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pushPermission === 'granted' 
                    ? 'bg-emerald-400 text-vibrant-dark' 
                    : 'bg-slate-100  hover:bg-slate-200  text-slate-500'
                }`}
                title="Masaüstü/Telefon Push Bildirimlerini Etkinleştir"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{pushPermission === 'granted' ? 'Masaüstü Bildirimleri Aktif' : 'Gerçek Bildirimleri Aç'}</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 border-2 border-vibrant-dark  bg-slate-100  rounded-xl hover:bg-slate-200  transition-colors"
                title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-vibrant-dark " /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                onClick={loadStreakStatus}
                className="p-1.5 border-2 border-vibrant-dark  bg-slate-100  rounded-xl hover:bg-slate-200  transition-colors"
                title="Yenile"
              >
                <RefreshCw className="w-4 h-4 text-vibrant-dark " />
              </button>
            </div>

            {/* Glowing Flame Graphics */}
            <div className="relative flex-shrink-0 mt-4 md:mt-0">
              <motion.div
                animate={{
                  scale: streakData.streakCount > 0 ? [1, 1.12, 1] : 1,
                  rotate: streakData.streakCount > 0 ? [0, 3, -3, 0] : 0,
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="relative z-10 w-32 h-32 md:w-36 md:h-36 flex items-center justify-center cursor-pointer"
                onClick={() => playNotificationSound('alert')}
              >
                {/* Neon Orange Pulse Effect */}
                {streakData.streakCount > 0 && (
                  <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
                )}
                
                {/* Double Border Outer Circle */}
                <div className="absolute inset-0 border-4 border-dashed border-orange-500/30 rounded-full animate-spin [animation-duration:20s]" />

                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(249,115,22,0.4)]">
                  <path
                    d="M50 95C68.5 95 80 81.5 80 62.5C80 43.5 65 30 50 5C35 30 20 43.5 20 62.5C20 81.5 31.5 95 50 95Z"
                    fill={streakData.streakCount > 0 ? "url(#fireGrad)" : "#94A3B8"}
                    stroke="#2D3436"
                    strokeWidth="4"
                  />
                  <path
                    d="M50 95C60 95 68 85 68 72.5C68 60 58 50 50 35C42 50 32 60 32 72.5C32 85 40 95 50 95Z"
                    fill={streakData.streakCount > 0 ? "url(#fireGradInner)" : "#64748B"}
                    stroke="#2D3436"
                    strokeWidth="3.5"
                  />
                </svg>

                {/* Flame Sparkles */}
                {streakData.streakCount > 0 && (
                  <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                )}
              </motion.div>
            </div>

            {/* Streak Info Text */}
            <div className="flex-1 text-center md:text-left space-y-3 mt-2 md:mt-0">
              <span className="text-xs font-black uppercase text-vibrant-coral tracking-wider flex items-center justify-center md:justify-start gap-1">
                <Flame className="w-3.5 h-3.5" />
                GÜNLÜK AKTİFLİK SERİNİZ
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-vibrant-dark  uppercase tracking-tight">
                {streakData.streakCount} GÜN SERİ!
              </h2>
              
              {/* Duolingo Protection Banner if Freeze applied */}
              {streakData.wasFrozenApplied && (
                <div className="bg-sky-100  border-2 border-sky-400 text-sky-600  px-3 py-2 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-tight animate-bounce">
                  <Snowflake className="w-4 h-4 text-sky-500 animate-spin" />
                  KORUMA AKTİF: Seri dondurucu devreye girdi ve serini kurtardı! ❄️
                </div>
              )}

              <p className="text-xs text-slate-500  font-bold max-w-sm">
                {streakData.streakCount > 0 
                  ? "Harika gidiyorsun! Her 24 saatte bir siteye girerek seriyi artırın. Bir gün bile atlarsanız koruma dondurucunuz yoksa seri sıfırlanır!" 
                  : "Seri henüz başlamadı veya bozuldu. Aktif kalıp 1. günü başlatmak için hemen bir işlem yapın!"}
              </p>
              
              {/* Streak Freeze Sub-section inside the Flame Card */}
              <div className="pt-3 border-t-2 border-dashed border-slate-100  flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50  border-2 border-sky-400 rounded-xl">
                  <Snowflake className="w-4 h-4 text-sky-500" />
                  <span className="text-[10px] font-black text-sky-600  uppercase">
                    SERİ DONDURUCU: {streakData.streakFreezes} ADET
                  </span>
                </div>
                
                <button
                  onClick={handleBuyFreeze}
                  className="px-3 py-1.5 bg-sky-400 hover:bg-sky-500 text-vibrant-dark border-2 border-vibrant-dark rounded-xl font-black uppercase text-[9px] tracking-wider shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Snowflake className="w-3 h-3 text-white" />
                  +1 Dondurucu Kazan
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Offlines Simulator */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-6">
            <div className="space-y-1">
              <h3 className="font-black uppercase text-lg text-vibrant-dark  tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Aktivite Simülatörü (Duolingo Tarzı Test) 🧪
              </h3>
              <p className="text-xs text-slate-500  font-bold">
                Birkaç gün siteye girmediğinizi simüle edin! Eğer <strong>Seri Dondurucun</strong> ❄️ varsa serin kurtulur (donar), yoksa 1 güne sıfırlanır ve AI Companion'dan gerçek bir uyarı/roast alırsınız!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: '1 Gün Girmedim', days: 1, color: 'bg-amber-400' },
                { label: '3 Gün Girmedim', days: 3, color: 'bg-orange-400' },
                { label: '7 Gün Girmedim', days: 7, color: 'bg-red-400' },
                { label: '15 Gün Girmedim', days: 15, color: 'bg-vibrant-coral' }
              ].map(sim => (
                <button
                  key={sim.days}
                  onClick={() => handleSimulateOffline(sim.days)}
                  disabled={loading}
                  className={`px-3 py-4 border-4 border-vibrant-dark text-vibrant-dark font-black uppercase text-xs rounded-2xl shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer ${sim.color} hover:opacity-90 disabled:opacity-50`}
                >
                  {sim.label}
                </button>
              ))}
            </div>

            {!user && (
              <div className="bg-[#FFEAA7] border-4 border-vibrant-dark p-4 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-black text-vibrant-dark">Simülasyonları çalıştırmak ve serinizi başlatmak için giriş yapmalısınız!</span>
                <button
                  onClick={onAuthTrigger}
                  className="px-4 py-2 bg-vibrant-coral text-white border-2 border-vibrant-dark rounded-xl font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]"
                >
                  Giriş Yap
                </button>
              </div>
            )}
          </div>

          {/* Setup Automation Bot Controller */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100  pb-4">
              <div className="space-y-1">
                <h3 className="font-black uppercase text-lg text-vibrant-dark  tracking-tight flex items-center gap-2">
                  <Bot className="w-5 h-5 text-vibrant-coral" />
                  Otomatik Küratör Botu (Setup Bot)
                </h3>
                <p className="text-xs text-slate-500  font-bold">
                  İnternet, Instagram ve Google Fotoğraflar'daki en iyi setup görsellerini kurcalayan botu tetikleyin!
                </p>
              </div>
              <button
                onClick={handleBotAutoShare}
                disabled={isBotPosting}
                className="px-5 py-3 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark border-4 border-vibrant-dark font-black uppercase text-xs rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isBotPosting ? 'animate-spin' : ''}`} />
                {isBotPosting ? "YÜKLENİYOR..." : "BOT SETUP PAYLAŞSIN"}
              </button>
            </div>

            {/* Animation and Success feedback block */}
            <AnimatePresence mode="wait">
              {isBotPosting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-50  p-4 rounded-2xl border-2 border-dashed border-slate-300  flex items-center justify-center gap-3 text-sm text-slate-500 font-bold"
                >
                  <Bot className="w-5 h-5 animate-bounce text-vibrant-coral" />
                  Bot internet üzerinde geziniyor, masaüstü görsellerini süzüyor ve video walkthrough arıyor...
                </motion.div>
              )}

              {botSharedSetup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-50  border-4 border-[#4CD137] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-vibrant-dark shrink-0">
                    <img src={botSharedSetup.image} alt={botSharedSetup.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="inline-block px-2 py-0.5 bg-emerald-500 text-white font-extrabold uppercase text-[8px] tracking-widest rounded">BAŞARILI</div>
                    <h4 className="font-black uppercase text-sm text-vibrant-dark  leading-none">{botSharedSetup.title}</h4>
                    <p className="text-xs text-slate-500  font-bold leading-relaxed">{botSharedSetup.description}</p>
                    <span className="text-[10px] bg-amber-400 border border-vibrant-dark font-black uppercase px-2 py-0.5 rounded">Video Linkiyle Birlikte Eklendi!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Column: Interactive Chat / Threat Console & Character Selector (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* AI Companion Interactive Dialog/Threat Console */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100  pb-3">
              <h3 className="font-black uppercase text-xs tracking-wider text-vibrant-coral flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Tehdit ve Geyik Konsolu
              </h3>
              <span className="text-[9px] bg-red-500 text-white font-black uppercase px-2 py-0.5 rounded animate-pulse">CANLI BAĞLANTI</span>
            </div>

            {/* Chat Messages Log Area */}
            <div className="w-full h-80 bg-slate-50  border-4 border-vibrant-dark  rounded-3xl p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                {chatMessages.map(msg => {
                  const isCompanion = msg.sender === 'companion';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-2.5 items-start max-w-[85%] ${isCompanion ? '' : 'ml-auto flex-row-reverse'}`}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-vibrant-dark shrink-0 bg-white">
                        <img 
                          src={isCompanion ? activeCompanionObj.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'} 
                          alt="Sender" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`p-3 rounded-2xl border-2 border-vibrant-dark relative ${
                        isCompanion 
                          ? 'bg-amber-100 text-slate-900 rounded-tl-none' 
                          : 'bg-vibrant-coral text-white rounded-tr-none'
                      }`}>
                        <div className="font-black text-[9px] opacity-80 uppercase leading-none mb-1">
                          {isCompanion ? activeCompanionObj.name : 'Siz'}
                        </div>
                        <p className="font-bold leading-normal text-[11px] break-words">
                          {msg.text}
                        </p>
                        <span className="text-[8px] opacity-60 block text-right mt-1 font-semibold">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-vibrant-dark shrink-0 bg-white">
                      <img src={activeCompanionObj.avatar} alt="Companion" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-200  p-2 rounded-xl text-[10px] font-black animate-pulse">
                      {activeCompanionObj.name} yazıyor...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick user reply selector */}
            <div className="space-y-2 pt-2">
              <span className="text-[9px] font-black text-slate-400  uppercase tracking-wider block">
                Cevap Vermek İçin Dokun (Geyik & Tehdit Çözüm):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {USER_REPLIES.map(reply => (
                  <button
                    key={reply.id}
                    onClick={() => handleUserReply(reply.id, reply.text)}
                    disabled={isTyping}
                    className="p-2 border-2 border-vibrant-dark  bg-white  hover:bg-slate-100  hover:border-vibrant-coral text-slate-800  font-extrabold text-[10px] text-center rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Companion Personality Selector */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-4">
            <h3 className="font-black uppercase text-sm tracking-tight text-vibrant-dark  border-b-2 border-slate-100  pb-3">
              AI Companion Karakterini Seç
            </h3>

            <div className="space-y-3">
              {COMPANIONS.map(comp => {
                const isSelected = selectedCompanion === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleCompanionChange(comp.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer hover:translate-x-1 ${
                      isSelected 
                        ? 'border-vibrant-coral bg-vibrant-coral/5 shadow-[4px_4px_0px_0px_rgba(255,107,107,0.3)]' 
                        : 'border-slate-150  hover:border-vibrant-dark  bg-white '
                    }`}
                  >
                    {/* Character Avatar */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-vibrant-dark shrink-0 relative bg-slate-100">
                      <img src={comp.avatar} alt={comp.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-vibrant-coral/10 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-vibrant-dark  truncate uppercase">{comp.name}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border shrink-0 ${comp.color}`}>
                          {comp.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-vibrant-coral font-black uppercase block mt-0.5">{comp.title}</span>
                      <p className="text-[10px] text-slate-500  font-bold leading-snug mt-1 truncate-2-lines">
                        {comp.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
