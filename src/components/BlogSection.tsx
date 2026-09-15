import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Cpu, 
  ChevronRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Zap,
  ThumbsUp,
  ThumbsDown,
  PenTool,
  Send,
  AlertCircle,
  Award,
  Wand2,
  Eye,
  FileText,
  Lightbulb
} from 'lucide-react';
import { BlogPost, SEED_BLOG_POSTS } from '../data/seedBlogPosts';
import { formatPriceInTL, getHardwareBySlug } from '../utils/hardwareEngine';

interface BlogSectionProps {
  initialSlug?: string | null;
  onNavigateToHardware?: (slug: string) => void;
  onSelectSetup?: (setupId: string) => void;
  user?: any;
  onAuthTrigger?: () => void;
}

interface AiSuggestion {
  type: string;
  title: string;
  message: string;
}

interface AiAuditResult {
  approved: boolean;
  grade: string;
  grammarRating: string;
  seoScore: number;
  feedback: string;
  recommendedTags: string[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  initialSlug,
  onNavigateToHardware,
  onSelectSetup,
  user,
  onAuthTrigger
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(SEED_BLOG_POSTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Open Editor Auth Gate
  const handleOpenEditor = () => {
    if (!user) {
      if (onAuthTrigger) onAuthTrigger();
      setToastMessage('🔒 Blog yazısı oluşturabilmek için lütfen giriş yapın veya kayıt olun!');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    setShowEditor(true);
  };

  // Voting & XP state
  const [votedPosts, setVotedPosts] = useState<Record<string, 'like' | 'dislike'>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Blog Editor Workspace State
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editorTitle, setEditorTitle] = useState<string>('');
  const [editorCategory, setEditorCategory] = useState<string>('Ergonomi & Mobilya');
  const [editorSummary, setEditorSummary] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [editorCoverImage, setEditorCoverImage] = useState<string>('https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80');
  const [editorTags, setEditorTags] = useState<string>('setup, rehber, donanim');
  const [editorAuthorName, setEditorAuthorName] = useState<string>('Siz (Setupss Yazarı)');

  // AI Real-time Assistant State (Right Side Panel)
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [aiSeoScore, setAiSeoScore] = useState<number>(60);
  const [aiReadability, setAiReadability] = useState<string>('Analiz Ediliyor...');
  const [isAiAnalysing, setIsAiAnalysing] = useState<boolean>(false);

  // Pre-Publish AI Audit Modal State
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AiAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Fetch blog posts from backend API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      }
    } catch {
      // Fallback to local posts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle initialSlug or route changes
  useEffect(() => {
    if (initialSlug) {
      const found = posts.find(p => p.slug === initialSlug || p.id === initialSlug);
      if (found) {
        setActivePost(found);
      } else {
        fetch(`/api/blog/${encodeURIComponent(initialSlug)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.title) setActivePost(data);
          })
          .catch(() => {});
      }
    } else {
      setActivePost(null);
    }
  }, [initialSlug, posts]);

  // Real-time AI Copilot Debounced Analysis as user types
  useEffect(() => {
    if (!showEditor) return;

    const timer = setTimeout(async () => {
      if (!editorContent || editorContent.length < 15) return;
      setIsAiAnalysing(true);
      try {
        const res = await fetch('/api/ai/blog-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editorTitle,
            summary: editorSummary,
            category: editorCategory,
            content: editorContent
          })
        });
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.suggestions)) setAiSuggestions(data.suggestions);
          if (typeof data.seoScore === 'number') setAiSeoScore(data.seoScore);
          if (data.readabilityLevel) setAiReadability(data.readabilityLevel);
        }
      } catch (err) {
        // Fallback
      } finally {
        setIsAiAnalysing(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [editorTitle, editorSummary, editorContent, editorCategory, showEditor]);

  // Trigger Pre-Publish AI Audit
  const handlePrePublishAudit = async () => {
    if (!editorTitle.trim() || !editorContent.trim()) {
      alert('Lütfen en azından bir başlık ve içerik yazın!');
      return;
    }

    setIsAuditing(true);
    setShowAuditModal(true);

    try {
      const tagsArray = editorTags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch('/api/ai/blog-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editorTitle,
          summary: editorSummary,
          category: editorCategory,
          content: editorContent,
          tags: tagsArray
        })
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data);
      }
    } catch {
      // Local fallback profanity filter check
      const fullText = (editorTitle + ' ' + editorSummary + ' ' + editorContent).toLowerCase();
      const profanityRegex = /(amk|aq|sik|orospu|pic|pıç|yavsak|yavşak|göt|yarrak|yarrak|ibne|kahpe|pezevenk)/i;
      const hasProfanity = profanityRegex.test(fullText);

      setAuditResult({
        approved: !hasProfanity,
        grade: hasProfanity ? 'F' : 'A',
        grammarRating: hasProfanity ? 'Kurallara Aykırı' : 'Mükemmel',
        seoScore: hasProfanity ? 10 : 90,
        feedback: hasProfanity 
          ? 'Yazınız küfür, hakaret veya topluluk kurallarına aykırı ifadeler içerdiği için yayınlanamaz. Lütfen içeriğinizi düzenleyin.'
          : 'Yazınız yayınlamaya hazırdır.',
        recommendedTags: ['setupss', 'donanım', 'rehber']
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Finalize Manual Post Publication
  const handleFinalPublish = async () => {
    const slug = editorTitle
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöç\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + `-${Date.now().toString().slice(-4)}`;

    const tagsArray = editorTags.split(',').map(t => t.trim()).filter(Boolean);

    const newPost: Partial<BlogPost> = {
      title: editorTitle,
      slug,
      summary: editorSummary || editorContent.slice(0, 160) + '...',
      content: editorContent,
      category: editorCategory,
      coverImage: editorCoverImage || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
      authorName: editorAuthorName,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      readTimeMinutes: Math.max(2, Math.ceil(editorContent.split(' ').length / 180)),
      tags: tagsArray.length > 0 ? tagsArray : ['rehber', 'donanim'],
      hardwareSlugs: [],
      isPublished: true,
      likesCount: 1,
      dislikesCount: 0
    };

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        const saved = await res.json();
        setPosts(prev => [saved, ...prev]);
        setActivePost(saved);
      } else {
        // Local add
        const createdPost: BlogPost = {
          ...newPost as BlogPost,
          id: `blog-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setPosts(prev => [createdPost, ...prev]);
        setActivePost(createdPost);
      }
    } catch {
      const createdPost: BlogPost = {
        ...newPost as BlogPost,
        id: `blog-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPosts(prev => [createdPost, ...prev]);
      setActivePost(createdPost);
    } finally {
      setShowAuditModal(false);
      setShowEditor(false);
      setToastMessage('🎉 Tebrikler! Blog yazınız başarıyla yayınlandı ve hesabınıza +50 XP eklendi!');
      setTimeout(() => setToastMessage(null), 5000);
      // Reset editor
      setEditorTitle('');
      setEditorSummary('');
      setEditorContent('');
    }
  };

  // Handle Like & Dislike Voting
  const handleVote = async (postId: string, type: 'like' | 'dislike', e: React.MouseEvent) => {
    e.stopPropagation();

    if (votedPosts[postId] === type) {
      setToastMessage('Bu yazı için oyunuzu zaten verdiniz!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setVotedPosts(prev => ({ ...prev, [postId]: type }));

    // Optimistic UI update
    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId || p.slug === postId) {
          return {
            ...p,
            likesCount: type === 'like' ? (p.likesCount || 0) + 1 : p.likesCount,
            dislikesCount: type === 'dislike' ? (p.dislikesCount || 0) + 1 : p.dislikesCount
          };
        }
        return p;
      })
    );

    if (activePost && (activePost.id === postId || activePost.slug === postId)) {
      setActivePost(prev => prev ? {
        ...prev,
        likesCount: type === 'like' ? (prev.likesCount || 0) + 1 : prev.likesCount,
        dislikesCount: type === 'dislike' ? (prev.dislikesCount || 0) + 1 : prev.dislikesCount
      } : null);
    }

    try {
      const res = await fetch(`/api/blog/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (data.success && type === 'like') {
        setToastMessage('👍 Beğeni gönderildi! Yazara +10 XP kazandırıldı!');
        setTimeout(() => setToastMessage(null), 3500);
      } else if (type === 'dislike') {
        setToastMessage('👎 Geri bildiriminiz için teşekkürler.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      // Keep optimistic update
    }
  };

  const categories = [
    'Tümü',
    'Ergonomi & Mobilya',
    'Klavye & Mouse',
    'Kablo Yönetimi & Işık',
    'Donanım & Kasa',
    'Rehber'
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'Tümü' || post.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[9999] bg-[#FFD93D] text-[#2D3436] font-black px-5 py-3 rounded-2xl border-3 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] animate-bounce flex items-center gap-2 text-sm">
          <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
          {toastMessage}
        </div>
      )}

      {/* MANUAL BLOG EDITOR WORKSPACE */}
      {showEditor ? (
        <div className="w-full bg-white border-4 border-[#2D3436] rounded-3xl p-4 sm:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-3 border-[#2D3436] mb-6">
            <button
              onClick={() => setShowEditor(false)}
              className="neo-btn-transition flex items-center gap-2 font-black text-sm bg-slate-100 hover:bg-slate-200 text-[#2D3436] px-4 py-2.5 rounded-xl border-2 border-[#2D3436]"
            >
              <ArrowLeft className="w-4 h-4" /> Düzenleyiciden Çık
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-[#FFEAA7] text-[#2D3436] px-3 py-1 rounded-full border border-[#2D3436] flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-[#FF6B6B]" /> Manuel Yazı Atölyesi
              </span>
            </div>

            <button
              onClick={handlePrePublishAudit}
              className="neo-btn-transition flex items-center gap-2 font-black text-sm bg-[#FFD93D] hover:bg-[#ffe056] text-[#2D3436] px-6 py-3 rounded-2xl border-3 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]"
            >
              <Wand2 className="w-4 h-4 text-[#FF6B6B]" /> AI Denetimi & Yayınla
            </button>
          </div>

          {/* Main Workspace Layout (Left: Form Editor, Right: AI Copilot) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Editor Inputs */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2">
                  Yazı Başlığı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Örn: 2026'da En Ergonomik Masaüstü Düzeni & Kablo Gizleme Taktikleri"
                  className="w-full text-lg font-black bg-[#FFF8E1] text-[#2D3436] p-4 rounded-2xl border-3 border-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#FFD93D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2">
                    Kategori
                  </label>
                  <select
                    value={editorCategory}
                    onChange={(e) => setEditorCategory(e.target.value)}
                    className="w-full font-bold bg-[#FFF8E1] text-[#2D3436] p-3.5 rounded-2xl border-3 border-[#2D3436] focus:outline-none"
                  >
                    {categories.filter(c => c !== 'Tümü').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2">
                    Yazar İsmi
                  </label>
                  <input
                    type="text"
                    value={editorAuthorName}
                    onChange={(e) => setEditorAuthorName(e.target.value)}
                    className="w-full font-bold bg-[#FFF8E1] text-[#2D3436] p-3.5 rounded-2xl border-3 border-[#2D3436] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2">
                  Kapak Görseli URL
                </label>
                <input
                  type="text"
                  value={editorCoverImage}
                  onChange={(e) => setEditorCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full font-mono text-xs bg-[#FFF8E1] text-[#2D3436] p-3 rounded-xl border-2 border-[#2D3436]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2">
                  Kısa Özet (Meta Description)
                </label>
                <textarea
                  value={editorSummary}
                  onChange={(e) => setEditorSummary(e.target.value)}
                  rows={2}
                  placeholder="Okuyucuların kartta ve arama motorlarında göreceği dikkat çekici 1-2 cümle..."
                  className="w-full text-sm font-semibold bg-[#FFF8E1] text-[#2D3436] p-3 rounded-2xl border-3 border-[#2D3436] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Detaylı İçerik (Markdown Destekli) <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {editorContent.split(' ').filter(Boolean).length} kelime | ~{Math.ceil(editorContent.split(' ').length / 180)} dk okuma
                  </span>
                </label>
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  rows={12}
                  placeholder="# Başlık 1&#10;&#10;Yazınıza buradan başlayın. Paragraf aralarına alt başlıklar (##) ve liste işaretleri (*) koyabilirsiniz..."
                  className="w-full text-sm font-medium bg-[#FFF8E1] text-[#2D3436] p-4 rounded-2xl border-3 border-[#2D3436] focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-2">
                  Etiketler (Virgülle Ayırın)
                </label>
                <input
                  type="text"
                  value={editorTags}
                  onChange={(e) => setEditorTags(e.target.value)}
                  placeholder="oyuncukoltuğu, ergonomi, hermanmiller, setup"
                  className="w-full text-xs font-bold bg-[#FFF8E1] text-[#2D3436] p-3 rounded-xl border-2 border-[#2D3436]"
                />
              </div>
            </div>

            {/* Right Column: AI Real-Time Copilot Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FFF8E1] border-3 border-[#2D3436] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] sticky top-24">
                <div className="flex items-center justify-between border-b-2 border-[#2D3436] pb-3 mb-4">
                  <h3 className="font-black text-sm text-[#2D3436] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF6B6B]" /> Setupss AI Copilot
                  </h3>
                  {isAiAnalysing && (
                    <span className="text-[10px] font-bold bg-[#4ECDC4] text-[#2D3436] px-2 py-0.5 rounded-md animate-pulse">
                      Canlı Analiz...
                    </span>
                  )}
                </div>

                {/* Live Scores */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white border-2 border-[#2D3436] p-3 rounded-2xl text-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">SEO Skoru</div>
                    <div className="text-xl font-black text-[#4ECDC4] mt-0.5">{aiSeoScore}/100</div>
                  </div>
                  <div className="bg-white border-2 border-[#2D3436] p-3 rounded-2xl text-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Okunabilirlik</div>
                    <div className="text-xs font-black text-[#FF6B6B] mt-1">{aiReadability}</div>
                  </div>
                </div>

                {/* AI Recommendations List */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-[#FFD93D]" /> Anlık İçerik Önerileri
                  </div>

                  {aiSuggestions.length === 0 ? (
                    <p className="text-xs text-slate-600 font-bold italic bg-white p-3 rounded-xl border border-[#2D3436]">
                      Yazmaya başladığınızda Setupss AI Copilot metninizi anlık olarak inceleyip öneriler sunacaktır...
                    </p>
                  ) : (
                    aiSuggestions.map((sug, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#2D3436] p-3 rounded-2xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#2D3436] mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ECDC4]" /> {sug.title}
                        </div>
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          {sug.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Fast AI Helper Action Buttons */}
                <div className="mt-5 pt-4 border-t-2 border-[#2D3436] space-y-2">
                  <button
                    onClick={() => {
                      if (!editorTitle) return;
                      setEditorTitle(`2026 Rehberi: ${editorTitle}`);
                    }}
                    className="w-full text-xs font-black bg-white hover:bg-[#FFEAA7] text-[#2D3436] py-2 px-3 rounded-xl border-2 border-[#2D3436] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#FF6B6B]" /> Başlığa 2026 Model Yılı Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activePost ? (
        /* SINGLE DETAILED BLOG ARTICLE VIEW */
        <div className="w-full bg-white border-4 border-[#2D3436] rounded-3xl p-4 sm:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)]">
          {/* Back Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-3 border-[#2D3436]">
            <button
              onClick={() => setActivePost(null)}
              className="neo-btn-transition flex items-center gap-2 font-black text-sm bg-[#FFD93D] text-[#2D3436] px-4 py-2.5 rounded-xl border-2 border-[#2D3436] shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]"
            >
              <ArrowLeft className="w-4 h-4" /> Tüm Blog & Rehberlere Dön
            </button>

            <div className="flex items-center gap-3">
              {/* Like / Dislike Vote Buttons */}
              <button
                onClick={(e) => handleVote(activePost.id, 'like', e)}
                className={`neo-btn-transition flex items-center gap-1.5 font-black text-xs px-3.5 py-2 rounded-xl border-2 border-[#2D3436] ${
                  votedPosts[activePost.id] === 'like' ? 'bg-[#4ECDC4] text-[#2D3436]' : 'bg-white hover:bg-slate-100 text-[#2D3436]'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-[#2D3436]" />
                <span>{activePost.likesCount || 0}</span>
              </button>

              <button
                onClick={(e) => handleVote(activePost.id, 'dislike', e)}
                className={`neo-btn-transition flex items-center gap-1.5 font-black text-xs px-3.5 py-2 rounded-xl border-2 border-[#2D3436] ${
                  votedPosts[activePost.id] === 'dislike' ? 'bg-[#FF6B6B] text-white' : 'bg-white hover:bg-slate-100 text-[#2D3436]'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{activePost.dislikesCount || 0}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setToastMessage('Bağlantı kopyalandı!');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="neo-btn-transition flex items-center gap-1.5 font-black text-xs bg-[#FFEAA7] text-[#2D3436] px-3.5 py-2 rounded-xl border-2 border-[#2D3436]"
              >
                <Share2 className="w-4 h-4" /> Paylaş
              </button>
            </div>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="inline-block bg-[#FFD93D] text-[#2D3436] font-black text-xs px-3 py-1 rounded-lg border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] mb-3">
              {activePost.category}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#2D3436] leading-tight mb-4 tracking-tight">
              {activePost.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 bg-[#FFF8E1] p-3 rounded-2xl border-2 border-[#2D3436]">
              <div className="flex items-center gap-2">
                <img
                  src={activePost.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                  alt={activePost.authorName}
                  className="w-7 h-7 rounded-full border border-[#2D3436] object-cover"
                />
                <span className="font-black text-[#2D3436]">{activePost.authorName}</span>
              </div>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF6B6B]" /> {activePost.readTimeMinutes} dk okuma
              </div>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1 text-[#4ECDC4] font-black">
                <Award className="w-3.5 h-3.5" /> Yazara Topluluk XP Katkısı
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="w-full h-64 sm:h-96 rounded-2xl border-3 border-[#2D3436] overflow-hidden mb-8 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
            <img
              src={activePost.coverImage}
              alt={activePost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Summary Box */}
          <div className="bg-[#FFEAA7] border-3 border-[#2D3436] p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] mb-8">
            <h3 className="font-black text-sm text-[#2D3436] mb-2 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B6B]" /> Özet & Ana Fikir
            </h3>
            <p className="text-sm font-semibold text-[#2D3436] leading-relaxed">
              {activePost.summary}
            </p>
          </div>

          {/* Article Markdown / Content */}
          <div className="prose prose-slate max-w-none text-[#2D3436] font-medium leading-relaxed mb-8 space-y-4">
            {activePost.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={pIdx} className="text-2xl font-black text-[#2D3436] mt-6 mb-3 border-b-2 border-[#2D3436] pb-2">{paragraph.replace('# ', '')}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={pIdx} className="text-xl font-black text-[#2D3436] mt-5 mb-2">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={pIdx} className="text-lg font-black text-[#2D3436] mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
              }
              return <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium">{paragraph}</p>;
            })}
          </div>

          {/* Related Tags */}
          {activePost.tags && activePost.tags.length > 0 && (
            <div className="pt-6 border-t-3 border-[#2D3436] flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-[#2D3436] flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5 text-[#FF6B6B]" /> Etiketler:
              </span>
              {activePost.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs font-bold bg-[#FFF8E1] text-[#2D3436] px-3 py-1 rounded-lg border border-[#2D3436]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MAIN BLOG LISTING & COMMUNITY DASHBOARD */
        <div>
          {/* Header Section */}
          <div className="bg-white border-4 border-[#2D3436] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFD93D] text-[#2D3436] font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] mb-3">
                <BookOpen className="w-4 h-4 text-[#FF6B6B]" /> Setupss Hardware & Blog Atölyesi
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#2D3436] tracking-tight">
                Topluluk Rehberleri & İncelemeler
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 max-w-xl">
                Kendi rehberinizi yazın, toplulukla paylaşın, beğeniler aldıkça XP puanı kazanın!
              </p>
            </div>

            {/* Action Buttons: "Yazı Oluştur" */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenEditor}
                className="neo-btn-transition flex items-center gap-2 font-black text-sm bg-[#FFD93D] hover:bg-[#ffe056] text-[#2D3436] px-5 py-3 rounded-2xl border-3 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]"
              >
                <PenTool className="w-4 h-4 text-[#FF6B6B]" /> Kendi Yazını Oluştur
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white border-3 border-[#2D3436] rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rehber, koltuk, klavye, kablo yönetimi ara..."
                  className="w-full text-xs font-bold bg-[#FFF8E1] text-[#2D3436] pl-10 pr-4 py-3 rounded-xl border-2 border-[#2D3436] focus:outline-none"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-black whitespace-nowrap px-4 py-2 rounded-xl border-2 border-[#2D3436] transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FFD93D] text-[#2D3436] shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]'
                      : 'bg-white hover:bg-[#FFF8E1] text-[#2D3436]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-white border-3 border-[#2D3436] rounded-3xl animate-pulse p-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white border-4 border-[#2D3436] rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
              <AlertCircle className="w-10 h-10 text-[#FF6B6B] mx-auto mb-3" />
              <h3 className="font-black text-lg text-[#2D3436]">Aradığınız Kriterlerde Yazı Bulunamadı</h3>
              <p className="text-xs font-bold text-slate-500 mt-1 mb-4">Arama terimini değiştirebilir veya ilk rehberi kendiniz yazabilirsiniz!</p>
              <button
                onClick={handleOpenEditor}
                className="neo-btn-transition font-black text-xs bg-[#FFD93D] text-[#2D3436] px-5 py-2.5 rounded-xl border-2 border-[#2D3436]"
              >
                İlk Yazıyı Yaz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="neo-btn-transition bg-white border-3 border-[#2D3436] rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                >
                  <div>
                    {/* Card Cover Image */}
                    <div className="relative h-48 w-full border-b-3 border-[#2D3436] overflow-hidden bg-slate-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#FFD93D] text-[#2D3436] font-black text-[10px] px-2.5 py-1 rounded-md border border-[#2D3436] shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                        {post.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-black text-base text-[#2D3436] group-hover:text-[#FF6B6B] transition-colors leading-snug line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t-2 border-[#2D3436]/10 mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                        alt={post.authorName}
                        className="w-6 h-6 rounded-full border border-[#2D3436] object-cover"
                      />
                      <span className="text-[11px] font-black text-[#2D3436] truncate max-w-[100px]">{post.authorName}</span>
                    </div>

                    {/* Like / Dislike Vote Section */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleVote(post.id, 'like', e)}
                        className={`flex items-center gap-1 font-black text-[11px] px-2.5 py-1 rounded-lg border border-[#2D3436] transition-colors ${
                          votedPosts[post.id] === 'like' ? 'bg-[#4ECDC4] text-[#2D3436]' : 'bg-[#FFF8E1] hover:bg-[#FFD93D] text-[#2D3436]'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{post.likesCount || 0}</span>
                      </button>

                      <button
                        onClick={(e) => handleVote(post.id, 'dislike', e)}
                        className={`flex items-center gap-1 font-black text-[11px] px-2 py-1 rounded-lg border border-[#2D3436] transition-colors ${
                          votedPosts[post.id] === 'dislike' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8E1] hover:bg-[#FF6B6B] hover:text-white text-[#2D3436]'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{post.dislikesCount || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRE-PUBLISH AI AUDIT REPORT MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border-4 border-[#2D3436] rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)]">
            <div className="flex items-center justify-between border-b-3 border-[#2D3436] pb-4 mb-4">
              <h3 className="text-lg font-black text-[#2D3436] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B6B]" /> Setupss AI Editör Raporu
              </h3>
              <button
                onClick={() => setShowAuditModal(false)}
                className="font-black text-xs bg-slate-100 hover:bg-slate-200 text-[#2D3436] px-3 py-1.5 rounded-xl border-2 border-[#2D3436]"
              >
                Kapat
              </button>
            </div>

            {isAuditing ? (
              <div className="py-12 text-center space-y-4">
                <RefreshCw className="w-10 h-10 text-[#FF6B6B] animate-spin mx-auto" />
                <p className="font-black text-sm text-[#2D3436]">
                  Setupss AI Baş Editörü yazınızı gramer, SEO ve okunabilirlik açısından denetliyor...
                </p>
              </div>
            ) : auditResult ? (() => {
              const isApproved = Boolean(
                auditResult && 
                (auditResult.approved === true || String(auditResult.approved).toLowerCase() === 'true') && 
                auditResult.grade !== 'F' && 
                auditResult.grammarRating !== 'Kurallara Aykırı'
              );

              return (
                <div className="space-y-4">
                  {/* Approval / Rejection Badge */}
                  <div className={`border-3 border-[#2D3436] p-4 rounded-2xl flex items-center gap-4 ${
                    isApproved ? 'bg-[#FFEAA7]' : 'bg-rose-50 border-rose-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl border-2 border-[#2D3436] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] ${
                      isApproved ? 'bg-[#4ECDC4] text-[#2D3436]' : 'bg-rose-500 text-white'
                    }`}>
                      {auditResult.grade || 'F'}
                    </div>
                    <div>
                      <div className={`text-xs font-black uppercase tracking-wider ${
                        isApproved ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {isApproved ? 'Yayın Onayı Verildi' : 'YAYIN REDDEDİLDİ (TOPLULUK KURALLARI)'}
                      </div>
                      <div className="text-sm font-black text-[#2D3436] leading-snug">{auditResult.feedback}</div>
                    </div>
                  </div>

                  {/* Audit Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#2D3436]">
                    <div className="bg-[#FFF8E1] p-3 rounded-xl border-2 border-[#2D3436]">
                      <span className="text-slate-500 uppercase block text-[10px]">Gramer & Uyumluluk</span>
                      <span className={`text-sm font-black ${
                        isApproved ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {auditResult.grammarRating}
                      </span>
                    </div>
                    <div className="bg-[#FFF8E1] p-3 rounded-xl border-2 border-[#2D3436]">
                      <span className="text-slate-500 uppercase block text-[10px]">SEO Skor Derecesi</span>
                      <span className="text-sm font-black text-[#FF6B6B]">{auditResult.seoScore}/100</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex gap-3">
                    {isApproved ? (
                      <button
                        onClick={handleFinalPublish}
                        className="w-full neo-btn-transition font-black text-sm bg-[#FFD93D] hover:bg-[#ffe056] text-[#2D3436] py-3.5 rounded-2xl border-3 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-[#FF6B6B]" /> Doğrula ve Doğrudan Yayınla (+50 XP)
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowAuditModal(false)}
                        className="w-full neo-btn-transition font-black text-sm bg-[#FFD93D] hover:bg-[#ffe056] text-[#2D3436] py-3.5 rounded-2xl border-3 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PenTool className="w-4 h-4 text-[#FF6B6B]" /> Yazınızı Kurallara Uygun Şekilde Düzenleyin
                      </button>
                    )}
                  </div>
                </div>
              );
            })() : null}
          </div>
        </div>
      )}
    </div>
  );
};
