import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, Send, Users, 
  Link as LinkIcon, Smile, Image as ImageIcon, Sparkles, 
  Tv, Headphones, ShieldAlert, Check, Copy, MessageSquare, Plus, ArrowLeft,
  Lock, Unlock, Volume2, Compass, HelpCircle, User, Activity, Flame, Shield, Play,
  Maximize2, Minimize2, Share2
} from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface ChatssProps {
  currentUser: any;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  activeCount: number;
}

export function SetupssChatss({ currentUser }: ChatssProps) {
  // Lobby and rooms list state
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomId, setRoomId] = useState<string>('');
  const [inRoom, setInRoom] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
  // Fullscreen mode toggle & Mobile View control
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'rooms' | 'video' | 'chat'>('video');
  const [lobbyMobileTab, setLobbyMobileTab] = useState<'channels' | 'join' | 'guide'>('channels');

  // Real browser-level F11 style Fullscreen API handler
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen API error, falling back to CSS overlay:", err);
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Create Room Form state
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomDesc, setNewRoomDesc] = useState<string>('');
  const [newRoomPrivate, setNewRoomPrivate] = useState<boolean>(false);

  // Active Session state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<{ [id: string]: { stream: MediaStream, details: any } }>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [roomUsers, setRoomUsers] = useState<any[]>([]); // [socketId, userDetails][]
  const [chatInput, setChatInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic references to solve stale closure bugs in socket listeners
  const joinRoomDirectRef = useRef<((id: string) => Promise<void>) | undefined>(undefined);

  // Direct join room (lobby double click or join button)
  const joinRoomDirect = async (targetRoomId: string) => {
    if (!targetRoomId.trim() || !currentUser) return;
    
    // Set target roomId in state
    setRoomId(targetRoomId);

    // Get media streams
    const stream = await startStream();
    setInRoom(true);
    setAudioMuted(false);
    setVideoMuted(false);

    if (socketRef.current) {
      socketRef.current.emit("join-room", targetRoomId, currentUser.id, {
        name: currentUser.name || currentUser.displayName,
        avatar: currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.id}`
      });

      // Clear existing listeners to prevent leaks
      socketRef.current.off("user-joined");
      socketRef.current.on("user-joined", async (socketId: string, userId: string, details: any) => {
        const pc = createPeerConnection(socketId, stream, details);
        if (stream) {
          stream.getTracks().forEach(track => pc.addTrack(track, stream));
        }
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current?.emit("offer", socketId, offer);
        } catch (err) {
          console.error("WebRTC offer hatası:", err);
        }
      });

      socketRef.current.off("offer");
      socketRef.current.on("offer", async (socketId: string, offer: any) => {
        const pc = createPeerConnection(socketId, stream, { name: "Bağlanıyor..." });
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          if (stream) {
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
          }
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current?.emit("answer", socketId, answer);
        } catch (err) {
          console.error("WebRTC offer işleme hatası:", err);
        }
      });

      socketRef.current.off("answer");
      socketRef.current.on("answer", async (socketId: string, answer: any) => {
        const pc = peerConnections.current[socketId];
        if (pc) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (err) {
            console.error("WebRTC answer işleme hatası:", err);
          }
        }
      });

      socketRef.current.off("ice-candidate");
      socketRef.current.on("ice-candidate", (socketId: string, candidate: any) => {
        const pc = peerConnections.current[socketId];
        if (pc) {
          pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(err => {
            console.error("ICE candidate ekleme hatası:", err);
          });
        }
      });

      socketRef.current.off("user-left");
      socketRef.current.on("user-left", (socketId: string) => {
        if (peerConnections.current[socketId]) {
          peerConnections.current[socketId].close();
          delete peerConnections.current[socketId];
        }
        setPeers(prev => {
          const next = { ...prev };
          delete next[socketId];
          return next;
        });
      });
    }
  };

  // Sync latest joinRoomDirect reference
  useEffect(() => {
    joinRoomDirectRef.current = joinRoomDirect;
  });

  // Check URL query parameters for auto-joining room on mount
  useEffect(() => {
    if (!currentUser) return;
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room') || params.get('roomId');
    if (roomFromUrl) {
      const timer = setTimeout(() => {
        joinRoomDirectRef.current?.(roomFromUrl);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  // Initialize socket and lobby listeners on mount
  useEffect(() => {
    if (!currentUser) return;

    // Connect socket
    const socket = io(window.location.origin, { path: "/socket.io" });
    socketRef.current = socket;

    // Join lobby room to receive room updates
    socket.emit("join-lobby");

    socket.on("rooms-update", (updatedRooms: ChatRoom[]) => {
      setRooms(updatedRooms);
    });

    socket.on("room-created", (createdRoomId: string) => {
      setShowCreateModal(false);
      joinRoomDirectRef.current?.(createdRoomId);
    });

    socket.on("room-history", (history: any[]) => {
      setMessages(history);
    });

    socket.on("room-message", (msg: any) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("room-users", (users: any[]) => {
      setRoomUsers(users);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser]);

  // REST fallback polling for room messages in Serverless (Vercel) environment
  useEffect(() => {
    if (!inRoom || !roomId) return;

    let isSubscribed = true;
    const pollMessages = async () => {
      try {
        const res = await fetch(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages`);
        if (res.ok && isSubscribed) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMessages(prev => {
              const prevIds = new Set(prev.map(m => m.id));
              const newIncoming = data.filter(m => !prevIds.has(m.id));
              if (newIncoming.length === 0) return prev;
              return [...prev, ...newIncoming];
            });
          }
        }
      } catch {
        // Silent catch for background polling
      }
    };

    // Initial fetch when entering room
    pollMessages();

    // 4-second gentle polling interval
    const interval = setInterval(pollMessages, 4000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [inRoom, roomId]);

  // Scroll to bottom of chat *only* inside scroll container (no window jumping!)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle local video element binding
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, inRoom]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: true 
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.warn("Kamera/Mikrofon izni verilemedi veya aygıt bulunamadı, yalnızca ses kanalı denenecek...", err);
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(audioStream);
        return audioStream;
      } catch (e) {
        console.error("Yalnızca ses akışı da başlatılamadı:", e);
        return null;
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const targetMute = !audioMuted;
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !targetMute;
      });
      setAudioMuted(targetMute);
      socketRef.current?.emit("update-media-state", { audioMuted: targetMute, videoMuted });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const targetMute = !videoMuted;
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !targetMute;
      });
      setVideoMuted(targetMute);
      socketRef.current?.emit("update-media-state", { audioMuted, videoMuted: targetMute });
    }
  };

  const createPeerConnection = (socketId: string, stream: MediaStream | null, details: any) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ]
    });

    peerConnections.current[socketId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", socketId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      setPeers(prev => ({
        ...prev,
        [socketId]: {
          stream: event.streams[0],
          details
        }
      }));
    };

    return pc;
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("get-rooms"); // Refresh lobby rooms list
    }
    Object.values(peerConnections.current).forEach(pc => pc.close());
    peerConnections.current = {};
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setPeers({});
    setMessages([]);
    setRoomUsers([]);
    setInRoom(false);
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !socketRef.current) return;

    // Generate a unique room slug/id
    const generatedId = newRoomName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const uniqueRoomId = `${generatedId}-${Math.floor(1000 + Math.random() * 9000)}`;

    socketRef.current.emit("create-room", {
      id: uniqueRoomId,
      name: newRoomName,
      description: newRoomDesc || `${newRoomName} sesli ve görüntülü sohbet odası`,
      isPrivate: newRoomPrivate
    });

    setNewRoomName('');
    setNewRoomDesc('');
    setNewRoomPrivate(false);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;

    const msg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: chatInput,
      sender: currentUser.name || currentUser.displayName,
      senderId: currentUser.id,
      avatar: currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.id}`,
      timestamp: new Date().toISOString()
    };
    socketRef.current.emit("room-message", roomId, msg);

    // Fallback: also persist message via REST endpoint for guaranteed delivery in serverless environments
    fetch(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: msg.text,
        sender: msg.sender,
        senderId: msg.senderId,
        avatar: msg.avatar
      })
    }).catch(() => {
      // Socket will handle delivery if connected
    });

    setChatInput('');
    setShowEmoji(false);
  };

  const generateRandomRoomId = () => {
    const prefixes = ['SETUP', 'GAMING', 'RGB', 'ROOM', 'TALK', 'BATTLE'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setRoomId(`${randomPrefix}-${randomNum}`);
  };

  const copyInviteLink = () => {
    const directLink = `${window.location.origin}/chatss?room=${encodeURIComponent(roomId)}`;
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ----------------------------------------------------
  // RENDER: LOBBY / ROOM LIST SCREEN (NEO-BRUTALIST LIGHT)
  // ----------------------------------------------------
  if (!inRoom) {
    const globalRooms = rooms.filter(r => !r.isPrivate && ['global', 'hardware', 'setup-critiques', 'rgb-gaming'].includes(r.id));
    const memberRooms = rooms.filter(r => !r.isPrivate && !['global', 'hardware', 'setup-critiques', 'rgb-gaming'].includes(r.id));

    return (
      <div className={`max-w-6xl mx-auto my-6 px-4 animate-in fade-in duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] bg-[#FFF8E1] w-screen h-screen overflow-y-auto p-6 md:p-8' : ''}`}>
        <div className="bg-white border-3 border-[#2D3436] rounded-[2rem] p-6 md:p-8 neo-shadow-lg text-[#2D3436]">
          
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-3 border-[#2D3436] pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FFD93D] border-3 border-[#2D3436] rounded-2xl flex items-center justify-center neo-shadow-sm shrink-0">
                <Tv className="w-7 h-7 text-[#2D3436]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#2D3436] uppercase tracking-tight">Setupss Chatss</h2>
                <p className="text-slate-600 text-[10px] md:text-xs font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse border border-[#2D3436]" />
                  Gamer Sesli ve Görüntülü Sohbet Odaları
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={toggleFullscreen}
                className="flex-1 md:flex-initial px-4 py-3 bg-white hover:bg-slate-50 text-[#2D3436] border-2 border-[#2D3436] font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 neo-shadow-sm cursor-pointer"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                <span>{isFullscreen ? "PENCERE MODU" : "TAM EKRAN YAP"}</span>
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 md:flex-initial px-5 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb3] text-[#2D3436] border-2 border-[#2D3436] font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 neo-shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>YENİ ODA</span>
              </button>
            </div>
          </div>

          {/* Dedicated Neobrutalist Mobile Tab Selector for Lobby */}
          <div className="md:hidden flex border-3 border-[#2D3436] rounded-2xl bg-[#FFEAA7] font-black text-xs shrink-0 select-none overflow-hidden mb-6 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
            <button
              type="button"
              onClick={() => setLobbyMobileTab('channels')}
              className={`flex-1 py-3 px-1 text-center border-r-2 border-[#2D3436] transition-all flex items-center justify-center gap-1.5 ${lobbyMobileTab === 'channels' ? 'bg-[#FFD93D] text-[#2D3436]' : 'text-slate-700 bg-white'}`}
            >
              <Compass size={14} />
              <span>Odalar</span>
            </button>
            <button
              type="button"
              onClick={() => setLobbyMobileTab('join')}
              className={`flex-1 py-3 px-1 text-center border-r-2 border-[#2D3436] transition-all flex items-center justify-center gap-1.5 ${lobbyMobileTab === 'join' ? 'bg-[#FFD93D] text-[#2D3436]' : 'text-slate-700 bg-white'}`}
            >
              <Lock size={14} />
              <span>Kodla Katıl</span>
            </button>
            <button
              type="button"
              onClick={() => setLobbyMobileTab('guide')}
              className={`flex-1 py-3 px-1 text-center transition-all flex items-center justify-center gap-1.5 ${lobbyMobileTab === 'guide' ? 'bg-[#FFD93D] text-[#2D3436]' : 'text-slate-700 bg-white'}`}
            >
              <Activity size={14} />
              <span>Nasıl Çalışır?</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rooms Listing area */}
            <div className={`lg:col-span-2 space-y-8 ${lobbyMobileTab === 'channels' ? 'block' : 'hidden md:block'}`}>
              
              {/* Category: Global Channels */}
              <div>
                <h3 className="text-[#2D3436] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Compass size={16} className="text-purple-600" />
                  Global Genel Kanallar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {globalRooms.length > 0 ? (
                    globalRooms.map((room) => (
                      <div 
                        key={room.id}
                        onClick={() => joinRoomDirect(room.id)}
                        className="group p-5 bg-[#FFF8E1] hover:bg-[#FFEAA7] border-2 border-[#2D3436] rounded-2xl transition-all cursor-pointer relative overflow-hidden neo-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-md"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-extrabold text-[#2D3436] text-base group-hover:text-purple-700 transition-colors">
                            # {room.name}
                          </h4>
                          <span className="flex items-center gap-1 text-[11px] bg-[#4ECDC4] text-[#2D3436] border-2 border-[#2D3436] px-2 py-0.5 rounded-full font-black">
                            <Users size={12} />
                            {room.activeCount} aktif
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                          {room.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-700 font-extrabold opacity-90 group-hover:opacity-100">
                          <span>Kanala Katıl</span>
                          <Play size={10} className="fill-current" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-8 text-center text-xs font-bold text-slate-500 border-2 border-dashed border-[#2D3436] rounded-2xl bg-white">
                      Kanal listesi yükleniyor...
                    </div>
                  )}
                </div>
              </div>

              {/* Category: Member Created Rooms */}
              <div>
                <h3 className="text-[#2D3436] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Flame size={16} className="text-[#FF6B6B]" />
                  Aktif Üye Odaları (Herkese Açık)
                </h3>
                {memberRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {memberRooms.map((room) => (
                      <div 
                        key={room.id}
                        onClick={() => joinRoomDirect(room.id)}
                        className="group p-5 bg-white hover:bg-[#FFEAA7] border-2 border-[#2D3436] rounded-2xl transition-all cursor-pointer relative overflow-hidden neo-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow-md"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-extrabold text-[#2D3436] text-base group-hover:text-purple-700 transition-colors flex items-center gap-1.5">
                            <Volume2 size={16} className="text-[#2D3436]" />
                            {room.name}
                          </h4>
                          <span className="flex items-center gap-1 text-[11px] bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] px-2 py-0.5 rounded-full font-black">
                            <Users size={12} />
                            {room.activeCount} kişi var
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                          {room.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-700 font-extrabold">
                          <span>Odaya Bağlan</span>
                          <Play size={10} className="fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#FFF8E1] border-2 border-dashed border-[#2D3436] rounded-2xl">
                    <Headphones className="w-8 h-8 text-[#2D3436] mx-auto mb-2" />
                    <p className="text-xs font-black text-[#2D3436]">Şu an aktif bir üye odası bulunmuyor.</p>
                    <p className="text-[10px] text-slate-600 mt-1 font-bold">Yukarıdaki &quot;Yeni Oda Oluştur&quot; butonu ile ilk odayı sen aç!</p>
                  </div>
                )}
              </div>

            </div>

            {/* Quick manual entry sidebar */}
            <div className={`space-y-6 lg:block ${lobbyMobileTab === 'join' || lobbyMobileTab === 'guide' ? 'block' : 'hidden'}`}>
              <div className={`bg-[#FFF8E1] border-3 border-[#2D3436] rounded-2xl p-5 space-y-4 neo-shadow-sm ${lobbyMobileTab === 'join' ? 'block' : 'hidden md:block'}`}>
                <div className="flex items-center gap-2">
                  <Lock className="text-purple-700 w-5 h-5" />
                  <h4 className="font-black text-sm text-[#2D3436] uppercase tracking-wider">KODLA ODAYA KATIL</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Arkadaşlarının paylaştığı gizli oda kodunu (ID) buraya girerek direkt ses kanalına bağlanabilirsin.
                </p>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Örn: RGB-Gaming, DeskTalk" 
                    className="w-full bg-white border-2 border-[#2D3436] rounded-xl px-4 py-3 text-xs font-bold text-[#2D3436] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => joinRoomDirect(roomId)}
                      disabled={!roomId.trim()}
                      className="flex-1 py-3 bg-[#FFD93D] hover:bg-[#FFEAA7] border-2 border-[#2D3436] disabled:opacity-55 disabled:cursor-not-allowed text-[#2D3436] font-black text-xs rounded-xl transition-all cursor-pointer"
                    >
                      KANALA BAĞLAN
                    </button>
                    <button 
                      onClick={generateRandomRoomId}
                      className="px-4 bg-white border-2 border-[#2D3436] hover:bg-slate-50 text-[#2D3436] rounded-xl text-xs font-bold"
                      title="Rastgele Kod"
                    >
                      🎲
                    </button>
                  </div>
                </div>
              </div>

              <div className={`bg-[#FFEAA7] border-3 border-[#2D3436] rounded-2xl p-5 neo-shadow-sm ${lobbyMobileTab === 'guide' ? 'block' : 'hidden md:block'}`}>
                <h5 className="font-black text-xs text-[#2D3436] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity size={14} className="text-[#FF6B6B]" />
                  NASIL ÇALIŞIR?
                </h5>
                <ul className="text-[11px] text-slate-800 space-y-2 list-disc list-inside font-bold">
                  <li>İstediğin kanala tıklayarak mikrofon ve kameranla yayına başlayabilirsin.</li>
                  <li>Oda chat sistemi <span className="text-purple-700 font-extrabold">tamamen hafızalıdır</span>. Senden önce yazılmış tüm teknik soruları ve donanım yorumlarını görebilirsin.</li>
                  <li>Grup olarak toplanıp donanım performansı tartışmak için kendi odanı açıp kodunu veya linkini paylaşabilirsin!</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* CREATE ROOM MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#FFF8E1] border-3 border-[#2D3436] rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#2D3436] uppercase">YENİ ODA OLUŞTUR</h3>
                <p className="text-slate-700 text-xs font-bold mt-1">Setupss Donanım & Sohbet Topluluğu</p>
              </div>

              <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#2D3436] uppercase mb-1.5">Oda Adı</label>
                  <input 
                    type="text" 
                    placeholder="Örn: RX 7900 XTX Tartışma" 
                    className="w-full bg-white border-2 border-[#2D3436] rounded-xl px-4 py-3 text-xs font-bold text-[#2D3436] focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#2D3436] uppercase mb-1.5">Açıklama</label>
                  <input 
                    type="text" 
                    placeholder="Donanım sıcaklık ve performans sohbet odası" 
                    className="w-full bg-white border-2 border-[#2D3436] rounded-xl px-4 py-3 text-xs font-bold text-[#2D3436] focus:outline-none focus:ring-1 focus:ring-purple-500"
                    value={newRoomDesc}
                    onChange={e => setNewRoomDesc(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white border-2 border-[#2D3436] rounded-xl">
                  <div>
                    <span className="block text-xs font-black text-[#2D3436]">Gizli Oda</span>
                    <span className="text-[10px] text-slate-500 font-bold">Yalnızca kodu bilenler katılabilir</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 bg-white border-2 border-[#2D3436]"
                    checked={newRoomPrivate}
                    onChange={e => setNewRoomPrivate(e.target.checked)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-white hover:bg-slate-50 text-[#2D3436] border-2 border-[#2D3436] font-bold text-xs rounded-xl transition-all"
                  >
                    İPTAL
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb3] text-[#2D3436] border-2 border-[#2D3436] font-black text-xs rounded-xl transition-all"
                  >
                    ODA OLUŞTUR VE KATIL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: ACTIVE VOICE/VIDEO ROOM (NEO-BRUTALIST LIVE SYSTEM)
  // ----------------------------------------------------
  const currentRoomDetails = rooms.find(r => r.id === roomId) || {
    id: roomId,
    name: roomId,
    description: "Sesli & Görüntülü Sohbet Odası",
    isPrivate: false
  };

  return (
    <div className={`my-2 bg-[#FFF8E1] rounded-[2rem] border-3 border-[#2D3436] overflow-hidden flex flex-col md:flex-row shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] relative animate-in zoom-in-95 duration-200 text-[#2D3436] ${isFullscreen ? 'fixed inset-0 z-[100] bg-[#FFF8E1] w-screen h-screen rounded-none border-none my-0 p-4 md:p-6 shadow-none' : 'h-[calc(100dvh-120px)] md:h-[calc(100vh-140px)] min-h-[500px] md:min-h-[620px]'}`}>
      
      {/* Mobile-Only Neobrutalist Tab Bar Selector */}
      <div className="md:hidden flex border-b-3 border-[#2D3436] bg-[#FFEAA7] font-black text-xs shrink-0 select-none">
        <button
          type="button"
          onClick={() => setMobileTab('rooms')}
          className={`flex-1 py-3 px-1 text-center border-r-2 border-[#2D3436] transition-all flex items-center justify-center gap-1.5 ${mobileTab === 'rooms' ? 'bg-[#FFD93D] text-[#2D3436] font-black' : 'text-slate-600 font-bold'}`}
        >
          <Compass size={14} />
          <span>Odalar</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('video')}
          className={`flex-1 py-3 px-1 text-center border-r-2 border-[#2D3436] transition-all flex items-center justify-center gap-1.5 ${mobileTab === 'video' ? 'bg-[#FFD93D] text-[#2D3436] font-black' : 'text-slate-600 font-bold'}`}
        >
          <Tv size={14} />
          <span>Yayın / Görüntü</span>
          {Object.keys(peers).length > 0 && (
            <span className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-pulse border border-[#2D3436]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-3 px-1 text-center transition-all flex items-center justify-center gap-1.5 ${mobileTab === 'chat' ? 'bg-[#FFD93D] text-[#2D3436] font-black' : 'text-slate-600 font-bold'}`}
        >
          <MessageSquare size={14} />
          <span>Sohbet</span>
          {messages.length > 0 && (
            <span className="bg-[#4ECDC4] text-[#2D3436] border border-[#2D3436] text-[8px] px-1 py-0.2 rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>

      {/* 1. LEFT SIDEBAR: CHANNELS & MEMBERS */}
      <div className={`w-full md:w-[260px] bg-[#FFF8E1] border-b md:border-b-0 md:border-r-3 border-[#2D3436] flex-col shrink-0 ${mobileTab === 'rooms' ? 'flex' : 'hidden md:flex'}`}>
        {/* Header (Server Name) */}
        <div className="p-4 border-b-2 border-[#2D3436] flex items-center justify-between bg-[#FFEAA7]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#FFD93D] border-2 border-[#2D3436] flex items-center justify-center text-[#2D3436] font-black text-xs">
              S
            </div>
            <h3 className="font-black text-xs uppercase tracking-wider truncate max-w-[150px] text-[#2D3436]">Setupss Odaları</h3>
          </div>
          <Compass size={14} className="text-[#2D3436]" />
        </div>

        {/* Scrollable Room List & Voice Channels */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          
          {/* CATEGORY: GLOBAL KANALLAR */}
          <div className="space-y-1">
            <span className="block px-2 text-[9px] font-black tracking-widest text-slate-600 uppercase">Global Kanallar</span>
            {rooms.filter(r => !r.isPrivate && ['global', 'hardware', 'setup-critiques', 'rgb-gaming'].includes(r.id)).map(r => {
              const isCurrent = r.id === roomId;
              return (
                <div key={r.id} className="space-y-0.5">
                  <button
                    onClick={() => joinRoomDirect(r.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-black transition-all group ${isCurrent ? 'bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] neo-shadow-sm' : 'text-[#2D3436] hover:bg-[#FFEAA7]/60'}`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Tv size={14} className="text-[#2D3436]" />
                      <span className="truncate">{r.name}</span>
                    </span>
                    {r.activeCount > 0 && (
                      <span className="text-[9px] bg-white border border-[#2D3436] px-1.5 py-0.5 rounded-full text-[#2D3436] font-black">
                        {r.activeCount}
                      </span>
                    )}
                  </button>
                  {/* List members inside this channel if joined */}
                  {isCurrent && roomUsers.map(([sid, user]) => (
                    <div key={sid} className="pl-7 pr-2 py-1 flex items-center justify-between text-[11px] text-slate-800 font-bold">
                      <div className="flex items-center gap-1.5 truncate">
                        <img src={user.avatar} className="w-4 h-4 rounded-full bg-white border border-[#2D3436] object-cover" alt="" />
                        <span className="truncate">{user.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {user.audioMuted && <MicOff size={10} className="text-red-500" />}
                        {user.videoMuted && <VideoOff size={10} className="text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* CATEGORY: ÜYE ODALARI */}
          <div className="space-y-1">
            <span className="block px-2 text-[9px] font-black tracking-widest text-slate-600 uppercase">Üye Odaları</span>
            {rooms.filter(r => !['global', 'hardware', 'setup-critiques', 'rgb-gaming'].includes(r.id)).map(r => {
              const isCurrent = r.id === roomId;
              return (
                <div key={r.id} className="space-y-0.5">
                  <button
                    onClick={() => joinRoomDirect(r.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-black transition-all group ${isCurrent ? 'bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] neo-shadow-sm' : 'text-[#2D3436] hover:bg-[#FFEAA7]/60'}`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Volume2 size={14} className="text-[#2D3436]" />
                      <span className="truncate">{r.name}</span>
                    </span>
                    {r.activeCount > 0 && (
                      <span className="text-[9px] bg-white border border-[#2D3436] px-1.5 py-0.5 rounded-full text-[#2D3436] font-black">
                        {r.activeCount}
                      </span>
                    )}
                  </button>
                  {/* Members inside */}
                  {isCurrent && roomUsers.map(([sid, user]) => (
                    <div key={sid} className="pl-7 pr-2 py-1 flex items-center justify-between text-[11px] text-slate-800 font-bold">
                      <div className="flex items-center gap-1.5 truncate">
                        <img src={user.avatar} className="w-4 h-4 rounded-full bg-white border border-[#2D3436] object-cover" alt="" />
                        <span className="truncate">{user.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {user.audioMuted && <MicOff size={10} className="text-red-500" />}
                        {user.videoMuted && <VideoOff size={10} className="text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Panel: Current User Info */}
        <div className="p-3.5 bg-[#FFEAA7] border-t-2 border-[#2D3436] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate min-w-0">
            <img 
              src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.id}`} 
              className="w-8 h-8 rounded-full border-2 border-[#2D3436] bg-[#FFD93D] shrink-0 object-cover"
              alt="avatar" 
            />
            <div className="min-w-0">
              <span className="block text-xs font-black text-[#2D3436] truncate">{currentUser.name || currentUser.displayName}</span>
              <span className="block text-[9px] font-black text-slate-600 truncate uppercase tracking-widest">Çevrimiçi</span>
            </div>
          </div>

          <div className="flex gap-0.5 shrink-0">
            <button 
              onClick={toggleAudio}
              className={`p-1.5 rounded-md hover:bg-white/40 transition-colors ${audioMuted ? 'text-red-600' : 'text-[#2D3436]'}`}
              title={audioMuted ? "Sesi Aç" : "Sesi Kapat"}
            >
              {audioMuted ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            <button 
              onClick={toggleVideo}
              className={`p-1.5 rounded-md hover:bg-white/40 transition-colors ${videoMuted ? 'text-red-600' : 'text-[#2D3436]'}`}
              title={videoMuted ? "Kamerayı Aç" : "Kamerayı Kapat"}
            >
              {videoMuted ? <VideoOff size={14} /> : <Video size={14} />}
            </button>
            <button 
              onClick={leaveRoom}
              className="p-1.5 rounded-md hover:bg-red-200 text-red-600 transition-colors"
              title="Bağlantıyı Kes"
            >
              <PhoneOff size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* 2. CENTER PANEL: LIVE VIDEO GRID & SCREENSHARE AREA */}
      <div className={`flex-1 bg-white p-4 flex-col relative overflow-hidden ${mobileTab === 'video' ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Call Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#FFF8E1] p-3 rounded-2xl mb-4 border-2 border-[#2D3436] gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={leaveRoom}
              className="p-1.5 bg-white hover:bg-slate-50 text-[#2D3436] rounded-lg transition-colors border-2 border-[#2D3436] neo-shadow-sm"
              title="Lobiye Dön"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-[#FF6B6B] text-white px-2 py-0.5 rounded border-2 border-[#2D3436] text-[9px] font-black uppercase tracking-widest animate-pulse">CANLI</span>
              <span className="text-[#2D3436] font-black text-sm truncate max-w-[150px] sm:max-w-[200px]">{currentRoomDetails.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 border-2 border-[#2D3436] bg-white hover:bg-[#FFF8E1] text-[#2D3436] rounded-xl transition-all neo-shadow-sm flex items-center gap-1"
              title={isFullscreen ? "Küçült" : "Tam Ekran Yap"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span className="hidden sm:inline font-bold text-[10px]">{isFullscreen ? "Pencere" : "Geniş Ekran"}</span>
            </button>
            
            <button 
              onClick={copyInviteLink} 
              className="text-[#2D3436] hover:bg-slate-50 font-black text-xs bg-white px-3 py-1.5 rounded-xl transition-all border-2 border-[#2D3436] flex items-center gap-1.5 neo-shadow-sm cursor-pointer"
            >
              {copiedLink ? <Check size={12} className="text-emerald-600" /> : <LinkIcon size={12} />}
              <span>{copiedLink ? 'Link Kopyalandı' : 'Davet Linki'}</span>
            </button>
          </div>
        </div>

        {/* 🌟 USER REQUEST: CLEAR FRIEND INVITATION SYSTEM & ROOM CODE DISPLAY */}
        <div className="bg-[#FFEAA7] border-2 border-[#2D3436] rounded-2xl p-4 mb-4 neo-shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            <h4 className="font-black text-xs text-[#2D3436] flex items-center gap-1.5">
              <Share2 size={14} className="text-[#FF6B6B]" />
              ARKADAŞLARINI DAVET ET (ODA KATILIM SİSTEMİ)
            </h4>
            <p className="text-[11px] text-slate-800 font-semibold leading-tight">
              Arkadaşlarının bu odaya katılması için aşağıdaki <span className="font-black text-purple-700">Oda Kodu (ID)</span> veya <span className="font-black text-purple-700">Davet Linkini</span> kopyalayarak onlara gönder!
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Room code badge */}
            <div className="flex items-center bg-white border-2 border-[#2D3436] rounded-xl pl-3 pr-1.5 py-1 gap-2">
              <span className="text-[10px] font-black uppercase text-slate-500">ODA KODU:</span>
              <span className="text-xs font-black text-purple-700 font-mono tracking-wider">{roomId}</span>
              <button 
                onClick={copyInviteCode}
                className="p-1 bg-[#FFD93D] hover:bg-[#FFEAA7] border border-[#2D3436] rounded-lg transition-colors text-[#2D3436]"
                title="Kodu Kopyala"
              >
                {copiedCode ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
              </button>
            </div>

            {/* Link copier button */}
            <button 
              onClick={copyInviteLink}
              className="px-3.5 py-1.5 bg-[#4ECDC4] hover:bg-[#3dbdb3] text-[#2D3436] border-2 border-[#2D3436] rounded-xl font-black text-[11px] flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copiedLink ? <Check size={12} /> : <Share2 size={12} />}
              <span>{copiedLink ? 'Kopyalandı!' : 'Hızlı Davet Linki'}</span>
            </button>
          </div>
        </div>

        {/* Video Grid layout */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto content-start pb-24 pr-1">
          {/* Local Participant Card */}
          <div className="relative aspect-video bg-[#2D3436] rounded-2xl overflow-hidden border-2 border-[#2D3436] group neo-shadow-sm">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
            {!localStream?.getVideoTracks()[0]?.enabled && (
              <div className="absolute inset-0 bg-[#2D3436] flex flex-col items-center justify-center text-slate-200 gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center border-2 border-white">
                  <VideoOff className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-xs font-black">Kameran Kapalı</span>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute bottom-3 left-3 bg-[#FFF8E1] px-2.5 py-1.5 rounded-xl text-[#2D3436] text-[11px] font-black flex items-center gap-2 border-2 border-[#2D3436]">
              <img 
                src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.id}`} 
                alt="avatar" 
                className="w-4.5 h-4.5 rounded-full object-cover bg-[#FFD93D] border border-[#2D3436]" 
              />
              <span>Sen</span>
              {(audioMuted || videoMuted) && (
                <div className="flex gap-1 ml-2 text-red-600">
                  {audioMuted && <MicOff size={10} />}
                  {videoMuted && <VideoOff size={10} />}
                </div>
              )}
            </div>
          </div>

          {/* Remote Participants Cards */}
          {Object.entries(peers).map(([id, peer]) => (
            <div key={id} className="relative aspect-video bg-[#2D3436] rounded-2xl overflow-hidden border-2 border-[#2D3436] neo-shadow-sm">
              <VideoPlayer stream={peer.stream} />
              <div className="absolute bottom-3 left-3 bg-[#FFF8E1] px-2.5 py-1.5 rounded-xl text-[#2D3436] text-[11px] font-black flex items-center gap-2 border-2 border-[#2D3436]">
                {peer.details?.avatar ? (
                  <img src={peer.details.avatar} alt="avatar" className="w-4.5 h-4.5 rounded-full object-cover border border-[#2D3436]" />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center text-[8px] font-black border border-[#2D3436]">
                    {peer.details?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                )}
                <span>{peer.details?.name || "Katılımcı"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Video Session Control Overlay Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border-3 border-[#2D3436] shadow-2xl z-30">
          <button 
            onClick={toggleAudio} 
            className={`p-3 rounded-xl transition-all border-2 border-[#2D3436] cursor-pointer ${audioMuted ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFD93D] hover:bg-[#FFEAA7] text-[#2D3436]'}`}
            title={audioMuted ? "Mikrofonu Aç" : "Sesi Sessize Al"}
          >
            {audioMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          
          <button 
            onClick={toggleVideo} 
            className={`p-3 rounded-xl transition-all border-2 border-[#2D3436] cursor-pointer ${videoMuted ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFD93D] hover:bg-[#FFEAA7] text-[#2D3436]'}`}
            title={videoMuted ? "Kamerayı Aç" : "Kamerayı Kapat"}
          >
            {videoMuted ? <VideoOff size={18} /> : <Video size={18} />}
          </button>
          
          <div className="h-6 w-[2px] bg-[#2D3436]" />

          <button 
            onClick={leaveRoom} 
            className="p-3 rounded-xl bg-[#FF6B6B] text-white hover:bg-red-600 border-2 border-[#2D3436] shadow-lg transition-all cursor-pointer active:translate-y-0.5"
            title="Odadan Ayrıl"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR: RICH CHAT SYSTEM */}
      <div className={`w-full md:w-[320px] bg-[#FFF8E1] border-t md:border-t-0 md:border-l-3 border-[#2D3436] flex-col relative z-20 ${mobileTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b-2 border-[#2D3436] flex items-center justify-between bg-[#FFEAA7]">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#2D3436]" />
            <h3 className="text-[#2D3436] font-black uppercase text-xs tracking-wider">Oda Sohbeti</h3>
          </div>
          <span className="text-[10px] bg-white border border-[#2D3436] text-[#2D3436] px-2.5 py-0.5 rounded-full font-black">
            {messages.length} mesaj
          </span>
        </div>
        
        {/* Messages list with history retrieval support - targeted scroll container */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 h-full md:max-h-none">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare className="w-10 h-10 mb-2 stroke-[1.5] text-[#2D3436] animate-bounce-subtle" />
              <p className="text-xs font-black text-[#2D3436]">Grup Sohbeti Boş</p>
              <p className="text-[10px] text-slate-600 mt-1 font-bold">Soru veya fikirlerini buraya yaz, odadaki herkes görsün!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id || idx} className="flex gap-2.5 animate-in fade-in slide-in-from-bottom-2">
                  <img 
                    src={msg.avatar} 
                    alt="" 
                    className="w-7 h-7 rounded-lg object-cover border border-[#2D3436] shrink-0 mt-0.5 bg-white" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-black text-[11px] truncate max-w-[120px] ${isMe ? 'text-purple-700' : 'text-slate-800'}`}>{msg.sender}</span>
                      <span className="text-[8px] text-slate-500 font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`text-[#2D3436] text-xs mt-0.5 break-words p-2.5 rounded-xl rounded-tl-none border-2 border-[#2D3436] inline-block max-w-full font-semibold ${isMe ? 'bg-[#FFEAA7] neo-shadow-sm' : 'bg-white'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Emoji picker container */}
        {showEmoji && (
          <div className="absolute bottom-20 right-4 z-50 shadow-2xl">
            <EmojiPicker onEmojiClick={(e) => setChatInput(prev => prev + e.emoji)} theme={Theme.LIGHT} />
          </div>
        )}

        {/* Chat input form */}
        <form onSubmit={sendMessage} className="p-4 bg-[#FFEAA7] border-t-2 border-[#2D3436]">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border-2 border-[#2D3436] focus-within:border-purple-600 transition-colors">
            <button 
              type="button" 
              onClick={() => setShowEmoji(!showEmoji)} 
              className="p-1.5 text-slate-600 hover:text-[#2D3436] transition-colors cursor-pointer"
            >
              <Smile size={18} />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent text-[#2D3436] focus:outline-none text-xs px-1 placeholder-slate-400 font-bold"
              placeholder="Yazmaya başla..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button 
              type="submit" 
              className="p-2 bg-[#FFD93D] border-2 border-[#2D3436] text-[#2D3436] rounded-lg hover:bg-[#FFEAA7] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" 
              disabled={!chatInput.trim()}
            >
              <Send size={12} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />;
};
