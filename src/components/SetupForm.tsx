import React, { useState, useRef } from 'react';
import { safeJsonResponse } from '../lib/api';
import { SetupPost, SetupCategory, SetupComponent } from '../types';
import { X, Plus, Trash2, CheckCircle, Info, Upload, Video, Image, Loader2 } from 'lucide-react';
import { validateBuild } from '../utils/aiValidationEngine';

const isVideo = (url: string) => {
  if (!url) return false;
  if (url.startsWith('data:video/')) return true;
  const extensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return extensions.some(ext => url.toLowerCase().includes(ext));
};

interface SetupFormProps {
  user?: any;
  onClose: () => void;
  onSave: (setup: Omit<SetupPost, 'id' | 'likes' | 'comments' | 'createdAt'> & { draftId?: string }) => void;
}

const IMAGE_PRESETS = [
  { name: "Sade Ahşap", url: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80" },
  { name: "Neon RGB Oyuncu", url: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80" },
  { name: "Klasik Cozy Kitaplık", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" },
  { name: "Modern Apple Kreatif", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80" },
  { name: "Çift Monitör Ofis", url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80" }
];

export const SetupForm: React.FC<SetupFormProps> = ({ user, onClose, onSave }) => {
  const draftSetupIdRef = useRef<string>(`setup-draft-${Date.now()}`);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState<SetupCategory>('Minimalist');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageSource, setImageSource] = useState<'preset' | 'url' | 'upload'>('preset');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [cardTheme, setCardTheme] = useState<SetupPost['cardTheme']>('soft-blue');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const THEME_OPTIONS: { id: SetupPost['cardTheme']; color: string; label: string }[] = [
    { id: 'soft-blue', color: 'bg-[#EBF5FF]', label: 'Buz Mavisi' },
    { id: 'soft-purple', color: 'bg-[#F8EFFF]', label: 'Lavanta' },
    { id: 'soft-green', color: 'bg-[#EFFBF2]', label: 'Nane' },
    { id: 'soft-yellow', color: 'bg-[#FFFDEB]', label: 'Güneş' },
    { id: 'soft-pink', color: 'bg-[#FFF0F5]', label: 'Şeker' },
    { id: 'dark', color: 'bg-[#F4F5F8]', label: 'Sade Açık' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Dosya boyutu çok büyük (Maksimum 50MB).");
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
            filename: file.name, 
            base64Data,
            folder: 'setup',
            entityType: 'setup_image',
            entityId: draftSetupIdRef.current
          })
        });
        const result = await safeJsonResponse(response);
        if (result.success) {
          setUploadedFileUrl(result.url);
          setUploadProgress('success');
        } else {
          setUploadProgress('error');
          alert("Dosya yüklenemedi: " + result.message);
        }
      } catch (err) {
        console.error("File upload error:", err);
        setUploadProgress('error');
        alert("Dosya yüklenirken bir ağ hatası oluştu.");
      }
    };
    reader.onerror = () => {
      setUploadProgress('error');
    };
    reader.readAsDataURL(file);
  };

  // Dynamic list of components
  const [components, setComponents] = useState<{ category: string; name: string }[]>([
    { category: 'Masa', name: 'Masif Kayın Ağacı Tabla' },
    { category: 'Monitör', name: 'LG 27\" UltraGear' },
    { category: 'Klavye', name: 'Mekanik Custom Klavye' }
  ]);

  const handleAddComponent = () => {
    setComponents([...components, { category: 'Donanım', name: '' }]);
  };

  const handleUpdateComponent = (index: number, field: 'category' | 'name', value: string) => {
    const updated = [...components];
    updated[index][field] = value;
    setComponents(updated);
  };

  const handleRemoveComponent = (index: number) => {
    if (components.length <= 1) return; // Keep at least one
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !owner || !description) {
      alert("Lütfen Başlık, Sahip ve Açıklama alanlarını doldurun.");
      return;
    }

    // Filter valid non-empty components
    const validComponents: SetupComponent[] = components
      .filter(c => c.name.trim() !== '')
      .map((c, idx) => ({
        id: `custom-c-${Date.now()}-${idx}`,
        category: c.category.trim() || 'Donanım',
        name: c.name.trim()
      }));

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    let imageUrl = selectedPresetImage;
    if (imageSource === 'url') {
      imageUrl = customImageUrl || IMAGE_PRESETS[0].url;
    } else if (imageSource === 'upload') {
      if (!uploadedFileUrl) {
        alert("Lütfen önce kendi cihazınızdan fotoğraf veya video yükleyin.");
        return;
      }
      imageUrl = uploadedFileUrl;
    }

    onSave({
      draftId: draftSetupIdRef.current,
      title,
      owner,
      bio: bio || "Geliştirici",
      category,
      description,
      image: imageUrl,
      tags: tags.length > 0 ? tags : ["Setup", category],
      components: validComponents,
      cardTheme
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-vibrant-dark/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-4 border-vibrant-dark rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-[10px_10px_0px_0px_rgba(45,52,54,1)] animate-fade-in relative flex flex-col my-auto shrink-0">
        
        {/* Header */}
        <div className="bg-white border-b-4 border-vibrant-dark px-6 py-4 flex items-center justify-between z-20 shrink-0">
          <div>
            <h3 className="font-black text-vibrant-dark uppercase tracking-tight text-lg md:text-xl">Masanı Toplulukla Paylaş</h3>
            <p className="text-[11px] text-slate-500 font-bold">Kendi setup felsefeni ve kullandığın ekipmanları buraya girerek ilham ver.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* General Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Setup Başlığı</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Örn: Minimalist Kod Odası v2"
                className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as SetupCategory)}
                className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-[#4ECDC4]/40"
              >
                <option value="Minimalist">Minimalist</option>
                <option value="RGB & Oyuncu">RGB & Oyuncu</option>
                <option value="Yazılımcı Atölyesi">Yazılımcı Atölyesi</option>
                <option value="Kreatif Stüdyo">Kreatif Stüdyo</option>
                <option value="Cozy / Retro">Cozy / Retro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral font-sans">Adınız Soyadınız</label>
              <input
                type="text"
                required
                readOnly={!!user}
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Örn: Melis Demir"
                className={`w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40 ${user ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
              />
              {user && <p className="text-[9px] text-slate-400 font-bold italic">Giriş yaptığınız için isminiz otomatik atanır.</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Ünvanınız / Rolünüz (Biyografi)</label>
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Örn: UI Designer / Illustrator"
                className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Masa Kurulumu Açıklaması / Hikayesi</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Masayı kurarken neyi amaçladın? Kablo yönetimi, ışıklandırma veya masa tablası seçim kriterlerin neler oldu? Detaylıca yaz..."
              className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-medium outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40 resize-none"
            />
          </div>

          {/* Card Theme Selection */}
          <div className="space-y-3 bg-vibrant-bg/30 p-4 rounded-3xl border-2 border-vibrant-dark/10">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Kart Teması Seçimi</label>
              <span className="text-[8px] font-bold text-slate-400 italic">Kartın arka plan rengini belirler</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setCardTheme(theme.id)}
                  className={`group relative flex flex-col items-center gap-1.5 cursor-pointer transition-all ${cardTheme === theme.id ? 'scale-105' : 'hover:scale-105 opacity-70'}`}
                >
                  <div className={`w-10 h-10 rounded-2xl border-3 ${theme.color} ${cardTheme === theme.id ? 'border-vibrant-dark shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]' : 'border-vibrant-dark/20'}`}>
                    {cardTheme === theme.id && (
                      <div className="absolute -top-1 -right-1 bg-vibrant-teal text-white rounded-full p-0.5 border-2 border-vibrant-dark">
                        <CheckCircle className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase ${cardTheme === theme.id ? 'text-vibrant-dark' : 'text-slate-400'}`}>{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Showcase Config */}
          <div className="bg-vibrant-bg/40 border-2 border-vibrant-dark p-4 rounded-3xl space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark block">Görsel veya Video Seçimi</span>
            
            <div className="flex flex-wrap gap-2 border-b border-vibrant-dark/10 pb-3">
              <button
                type="button"
                onClick={() => setImageSource('preset')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border-2 border-vibrant-dark transition-all cursor-pointer ${
                  imageSource === 'preset' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-vibrant-dark hover:bg-white/60'
                }`}
              >
                Hazır Şablon Görseller
              </button>
              <button
                type="button"
                onClick={() => setImageSource('url')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border-2 border-vibrant-dark transition-all cursor-pointer ${
                  imageSource === 'url' ? 'bg-vibrant-dark text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-vibrant-dark hover:bg-white/60'
                }`}
              >
                Özel Görsel Bağlantısı (URL)
              </button>
              <button
                type="button"
                onClick={() => setImageSource('upload')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border-2 border-vibrant-dark transition-all cursor-pointer ${
                  imageSource === 'upload' ? 'bg-[#4ECDC4] text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'bg-white text-vibrant-dark hover:bg-white/60'
                }`}
              >
                Cihazından Dosya Yükle 🚀
              </button>
            </div>

            {imageSource === 'preset' && (
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Katalogtan bir şablon görseli seçin:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {IMAGE_PRESETS.map(preset => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setSelectedPresetImage(preset.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                        selectedPresetImage === preset.url ? 'border-vibrant-coral scale-95 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]' : 'border-vibrant-dark hover:border-vibrant-coral'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-vibrant-dark/30 flex items-end p-1.5 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black text-white bg-vibrant-dark px-1.5 py-0.5 rounded-md uppercase">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {imageSource === 'url' && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">Görsel URL Adresi</label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={e => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-white border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40"
                />
              </div>
            )}

            {imageSource === 'upload' && (
              <div className="space-y-3">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Cihazınızdan bir fotoğraf (.png, .jpg, .webp) veya video (.mp4, .mov, .webm) seçin:</span>
                
                <div className="border-4 border-dashed border-vibrant-dark/35 rounded-3xl bg-white p-6 text-center hover:border-vibrant-teal transition-colors relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className="p-3 bg-vibrant-bg border-2 border-vibrant-dark rounded-2xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                      <Upload className="w-6 h-6 text-vibrant-coral" />
                    </div>
                    <p className="text-xs font-black text-vibrant-dark uppercase tracking-tight">Tıklayın veya Dosyayı Sürükleyin</p>
                    <p className="text-[10px] text-slate-500 font-bold">Maksimum Boyut: 50MB • Video veya Fotoğraf</p>
                  </div>
                </div>

                {uploadProgress === 'uploading' && (
                  <div className="flex items-center justify-center gap-2 py-3 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl">
                    <Loader2 className="w-5 h-5 text-vibrant-coral animate-spin" />
                    <span className="text-xs font-black uppercase text-vibrant-dark tracking-wider">Yükleniyor, lütfen bekleyin...</span>
                  </div>
                )}

                {uploadProgress === 'success' && uploadedFileUrl && (
                  <div className="space-y-3 bg-green-50 border-2 border-green-500 rounded-3xl p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-wider">Dosya Başarıyla Yüklendi!</span>
                    </div>
                    
                    <div className="border-2 border-vibrant-dark rounded-2xl overflow-hidden bg-white max-h-48 flex justify-center items-center">
                      {isVideo(uploadedFileUrl) ? (
                        <video
                          ref={(el) => {
                            if (el) {
                              el.muted = true;
                              el.defaultMuted = true;
                              el.play().catch(() => {});
                            }
                          }}
                          src={uploadedFileUrl}
                          controls
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="max-h-44 w-auto object-contain"
                        />
                      ) : (
                        <img
                          src={uploadedFileUrl}
                          alt="Yüklenen görsel"
                          className="max-h-44 w-auto object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}

                {uploadProgress === 'error' && (
                  <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-xs font-bold text-center">
                    Yükleme sırasında hata oluştu. Lütfen tekrar deneyin.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Components dynamic editor */}
          <div className="bg-white border-4 border-vibrant-dark rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-vibrant-dark pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark">Donanım & Ekipman Kalemleri</span>
              <button
                type="button"
                onClick={handleAddComponent}
                className="flex items-center gap-1 bg-vibrant-yellow hover:bg-[#ffd32a] border-2 border-vibrant-dark px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-transform duration-100 hover:-translate-y-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Ekle</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {components.map((comp, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Masa, Monitör, Klavye..."
                    value={comp.category}
                    onChange={e => handleUpdateComponent(idx, 'category', e.target.value)}
                    className="w-1/3 px-2 py-1.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-lg text-xs font-black placeholder-vibrant-dark/30 outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Marka & Model bilgisi..."
                    value={comp.name}
                    onChange={e => handleUpdateComponent(idx, 'name', e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-lg text-xs font-bold placeholder-vibrant-dark/30 outline-none"
                  />
                  {components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live AI Build Validator (SAIOS v1.0) */}
          {(() => {
            const report = validateBuild(components.map((c, i) => ({ id: `c-${i}`, category: c.category, name: c.name })));
            return (
              <div className="bg-white border-4 border-vibrant-dark rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-vibrant-dark pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-vibrant-yellow border-2 border-vibrant-dark rounded-xl text-xs">🤖</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark block">SAIOS v1.0 Akıllı Donanım Denetleyici</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block mt-0.5">Yapay Zeka Donanım Analizi & Sinerji Testi</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-[#4ECDC4] animate-pulse">Canlı Analiz</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Score Card */}
                  <div className="border-2 border-vibrant-dark rounded-2xl p-3 bg-vibrant-bg flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Kurulum Uyum Puanı</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-black text-vibrant-dark">{report.compatibilityScore}%</span>
                        <span className="text-[10px] font-bold text-slate-500">Uyum Oranı</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-3 border-2 border-vibrant-dark rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full transition-all duration-300 ${report.compatibilityScore >= 90 ? 'bg-[#4ECDC4]' : report.compatibilityScore >= 70 ? 'bg-vibrant-yellow' : 'bg-[#FF6B6B]'}`}
                        style={{ width: `${report.compatibilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Power Simulation */}
                  <div className="border-2 border-vibrant-dark rounded-2xl p-3 bg-vibrant-bg space-y-1.5 text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Güç Tüketimi Simülasyonu</span>
                    <div className="flex justify-between items-center text-xs font-black text-vibrant-dark">
                      <span>Tahmini Tepe TDP:</span>
                      <span>{report.power.estimatedPeakTdp}W</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Transient Pik (Anlık Sıçrama):</span>
                      <span>{report.power.transientSpikePeak}W</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-vibrant-dark/5 pt-1">
                      <span>Önerilen Güç Kaynağı:</span>
                      <span className="text-vibrant-coral font-black">Min {report.power.recommendedPsuWattage}W</span>
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 leading-none italic">
                      {report.power.details}
                    </p>
                  </div>
                </div>

                {/* Bottleneck indicator */}
                {report.bottleneck.cpuBottleneckPct > 0 && (
                  <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <span className="text-xs font-black uppercase tracking-wider">⚠ Darboğaz Uyarısı ({report.bottleneck.cpuBottleneckPct}%)</span>
                    </div>
                    <p className="text-[10px] text-amber-950 font-bold leading-relaxed">{report.bottleneck.description}</p>
                  </div>
                )}

                {/* Dynamic Messages & Warnings */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {report.items.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-2.5 border-2 rounded-xl text-left text-[11px] leading-relaxed font-bold ${
                        item.status === 'error' 
                          ? 'bg-red-50 border-red-500 text-red-900' 
                          : item.status === 'warning' 
                            ? 'bg-amber-50 border-amber-500 text-amber-900' 
                            : item.status === 'info'
                              ? 'bg-blue-50 border-blue-500 text-blue-900'
                              : 'bg-green-50 border-green-500 text-green-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-tight mb-0.5">
                        <span>{item.status === 'error' ? '❌' : item.status === 'warning' ? '⚠' : item.status === 'info' ? 'ℹ' : '✅'}</span>
                        <span>{item.title}</span>
                        <span className="ml-auto text-[9px] text-slate-400 font-bold">Güven: {item.confidenceScore}%</span>
                      </div>
                      <p className="font-medium text-[10px]">{item.message}</p>
                      {item.recommendation && (
                        <div className="mt-1 text-[9px] font-black text-vibrant-coral uppercase">
                          💡 Öneri: {item.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                  {report.items.length === 0 && (
                    <div className="text-center py-4 text-xs font-bold text-slate-400 italic">
                      Sistem dengeli görünüyor. CPU, GPU veya Anakart marka ve modelini girdikçe canlı siber-denetimler tetiklenecektir.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral">Arama Etiketleri (Virgülle Ayırın)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Örn: ahşap, minimalist, keychron, dualmonitor"
              className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-bold outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40"
            />
          </div>

          {/* Footer action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-vibrant-dark/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-vibrant-bg text-vibrant-dark border-2 border-vibrant-dark rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4ECDC4] hover:bg-[#3dbbb2] text-white border-2 border-vibrant-dark rounded-xl font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
            >
              Yayınla 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
