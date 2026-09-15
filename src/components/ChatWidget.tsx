import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import remarkGfm from 'remark-gfm';
import { safeJsonResponse } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { SafeImage } from './SafeImage';
import { AiAvatar } from './AiAvatar';
import { UserAvatar } from './UserAvatar';
import { 
  MessageSquare, Send, X, Search, Loader2, MessageCircle, AlertCircle, Sparkles, 
  UserPlus, Users, Check, Trash2, Image, Video, Code2 as Github, Camera as Instagram, Globe as Linkedin, 
  ExternalLink, Paperclip, CheckCircle2, UserCheck, MessageSquarePlus, Globe,
  AlertTriangle, ShieldAlert, Cpu
} from 'lucide-react';

interface ChatWidgetProps {
  user: any;
  onAuthTrigger: () => void;
  startChatWithOwner?: string | null;
  onClearStartChat?: () => void;
}

interface ChatRoom {
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerHasRgb?: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  user,
  onAuthTrigger,
  startChatWithOwner,
  onClearStartChat
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activePartner, setActivePartner] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // New states for Friends System
  const [sidebarTab, setSidebarTab] = useState<'rooms' | 'friends'>('rooms');
  const [friendships, setFriendships] = useState<any[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState<string | null>(null);

  // Discover & Community Engagement States
  const [discoverUsers, setDiscoverUsers] = useState<any[]>([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);

  // Selected developer profile modal states
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);

  // Sentinel V900 Chat Moderation States
  const [sentinelAuditReport, setSentinelAuditReport] = useState<any | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  // Multimedia states
  const [attachedMedia, setAttachedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const AI_BOT = {
    id: 'ai-bot',
    name: 'Setupss AI',
    avatar: '/setupss_icon.svg?v=2026_v9'
  };

  const socketRef = useRef<WebSocket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  // Auto scroll to bottom of messages safely without page jumping
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Run after DOM has updated to ensure container scrollHeight is correct
    setTimeout(scrollToBottom, 80);
  }, [messages, isOpen]);

  // Handle WebSocket Connection
  const connectWebSocket = () => {
    if (!user) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsConnecting(true);
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketUrl = `${protocol}//${window.location.host}`;

    try {
      const ws = new WebSocket(socketUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        // Register current user session
        ws.send(JSON.stringify({
          type: 'join',
          userId: user.id
        }));
        console.log('Chat WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            const incomingMsg: ChatMessage = data.message;
            // Append to messages if it belongs to current active partner chat
            if (activePartner && 
               ((incomingMsg.senderId === activePartner.id && incomingMsg.receiverId === user.id) ||
                (incomingMsg.senderId === user.id && incomingMsg.receiverId === activePartner.id))) {
              setMessages(prev => {
                if (prev.some(m => m.id === incomingMsg.id)) return prev;
                return [...prev, incomingMsg];
              });
              // Mark as read immediately on server if active chat is open
              ws.send(JSON.stringify({
                type: 'read',
                senderId: activePartner.id
              }));
            }
            // Always refresh room previews
            fetchRooms();
          } else if (data.type === 'message_ack') {
            const ackMsg: ChatMessage = data.message;
            if (activePartner && ackMsg.receiverId === activePartner.id) {
              setMessages(prev => {
                if (prev.some(m => m.id === ackMsg.id)) return prev;
                return [...prev, ackMsg];
              });
            }
            fetchRooms();
          } else if (data.type === 'messages_read') {
            const readerId = data.readerId;
            if (activePartner && activePartner.id === readerId) {
              setMessages(prev => prev.map(m => m.receiverId === readerId ? { ...m, isRead: true } : m));
            }
            fetchRooms();
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        console.log('Chat WebSocket closed, reconnecting in 5s...');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (err) => {
        console.error('Chat WebSocket error:', err);
        ws.close();
      };
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      setIsConnecting(false);
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
    }
  };

  // Connect on login/mount
  useEffect(() => {
    if (user) {
      connectWebSocket();
      fetchRooms();
      fetchFriends();
      fetchDiscoverUsers();
    } else {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      setRooms([]);
      setActivePartner(null);
      setMessages([]);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [user]);

  // Fetch friendships list from DB
  const fetchFriends = async () => {
    if (!user) return;
    try {
      setLoadingFriends(true);
      const res = await fetch('/api/friends/list');
      const data = await safeJsonResponse(res);
      if (data.success) {
        setFriendships(data.friendships);
      }
    } catch (e) {
      console.error('Failed to fetch friends:', e);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Search users for adding friends
  const handleSearchUsers = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userSearchQuery.trim()) return;
    try {
      setIsSearchingUsers(true);
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(userSearchQuery.trim())}`);
      const data = await safeJsonResponse(res);
      if (data.success) {
        setUserSearchResults(data.users.filter((u: any) => u.id !== user.id));
      }
    } catch (e) {
      console.error('Failed to search users:', e);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  // Fetch Recommended/Top Active Users for Community Discovery
  const fetchDiscoverUsers = async () => {
    if (!user) return;
    try {
      setLoadingDiscover(true);
      const res = await fetch('/api/leaderboard');
      const data = await safeJsonResponse(res);
      if (data && Array.isArray(data)) {
        // Find users that are not me
        const filtered = data.filter((u: any) => u.id !== user.id);
        setDiscoverUsers(filtered.slice(0, 6)); // Top 6 active members
      }
    } catch (e) {
      console.error('Failed to load discover users:', e);
    } finally {
      setLoadingDiscover(false);
    }
  };

  // Send friend request
  const handleSendFriendRequest = async (friendId: string) => {
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId })
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        setFriendRequestMessage('İstek gönderildi! 🎉');
        setTimeout(() => setFriendRequestMessage(null), 3000);
        fetchFriends();
      } else {
        alert(data.message || 'İstek gönderilemedi.');
      }
    } catch (e) {
      console.error('Friend request error:', e);
    }
  };

  // Accept incoming friend request
  const handleAcceptFriendRequest = async (friendId: string) => {
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId })
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        fetchFriends();
        fetchRooms();
      }
    } catch (e) {
      console.error('Accept friendship error:', e);
    }
  };

  // Reject / Remove friend relationship
  const handleRejectFriendRequest = async (friendId: string) => {
    if (!confirm('Bu arkadaşlığı sonlandırmak veya isteği iptal etmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId })
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        fetchFriends();
        fetchRooms();
      }
    } catch (e) {
      console.error('Reject friendship error:', e);
    }
  };

  // View public profile of a user
  const handleViewProfile = async (userId: string) => {
    try {
      setLoadingProfileId(userId);
      const res = await fetch(`/api/users/profile/${userId}`);
      const data = await safeJsonResponse(res);
      if (data.success && data.profile) {
        setSelectedProfile(data.profile);
      } else {
        alert('Profil bilgileri yüklenemedi.');
      }
    } catch (e) {
      console.error('View profile error:', e);
    } finally {
      setLoadingProfileId(null);
    }
  };

  // Report chat message to Sentinel V900
  const handleReportMessage = async (msg: ChatMessage) => {
    const confirmReport = window.confirm(
      `Sohbet Mesajı Şikayeti:\n\n"${msg.message}"\n\nSentinel V900 güvenlik asistanı bu mesajı denetleyecek ve küfür/hakaret içermesi durumunda kullanıcıyı 24 saatliğine askıya alacaktır. Şikayet etmek istediğinize emin misiniz?`
    );
    if (!confirmReport) return;

    try {
      setIsReporting(true);
      const res = await fetch('/api/chat/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: msg.id,
          chatMessage: msg.message,
          senderId: msg.senderId,
          senderName: msg.senderName
        })
      });

      const data = await safeJsonResponse(res);
      if (data.success) {
        setSentinelAuditReport({
          senderName: msg.senderName,
          message: msg.message,
          isProfane: data.isProfane,
          reason: data.reason,
          messageResponse: data.message
        });
        // Remove reported message from state or update message text to redacted message
        setMessages(prev => prev.map(m => m.id === msg.id ? {
          ...m,
          message: data.isProfane ? "[Bu mesaj Sentinel V900 tarafından küfür/hakaret tespitiyle kaldırılmıştır. Kullanıcı uzaklaştırılmıştır.]" : m.message
        } : m));
      } else {
        alert(data.message || 'Şikayet iletilemedi.');
      }
    } catch (e) {
      console.error('Report error:', e);
      alert('Sistem hatası. Sentinel bağlantı kuramadı.');
    } finally {
      setIsReporting(false);
    }
  };

  // Upload photo/video media in chat
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Dosya boyutu en fazla 50MB olabilir.");
      return;
    }

    setIsUploadingMedia(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filename: `chat-${user.id}-${file.name}`, 
            base64Data,
            folder: 'chat',
            entityType: 'chat_media',
            entityId: activePartner?.id || 'room_general'
          })
        });
        const result = await safeJsonResponse(response);
        if (result.success) {
          const type = file.type.startsWith('video/') ? 'video' : 'image';
          setAttachedMedia({ url: result.url, type });
        } else {
          alert("Dosya yüklenemedi: " + result.message);
        }
      } catch (err) {
        console.error("Media upload error:", err);
        alert("Ağ hatası oluştu.");
      } finally {
        setIsUploadingMedia(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Fetch Rooms via REST API
  const fetchRooms = async () => {
    if (!user) return;
    try {
      setLoadingRooms(true);
      const res = await fetch('/api/chat/rooms');
      const data = await safeJsonResponse(res);
      if (data.success) {
        // Ensure AI Bot is always at the top if it has history or as a suggested chat
        const botRoom = data.rooms.find((r: any) => r.partnerId === AI_BOT.id);
        if (!botRoom && !searchQuery) {
          const aiRoomPlaceholder: ChatRoom = {
            partnerId: AI_BOT.id,
            partnerName: AI_BOT.name,
            partnerAvatar: AI_BOT.avatar,
            lastMessage: 'Setupss AI ile tanışın! Sitenin işleyişi hakkında her şeyi sorabilirsiniz.',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0
          };
          setRooms([aiRoomPlaceholder, ...data.rooms]);
        } else {
          setRooms(data.rooms);
        }
      }
    } catch (e) {
      console.error('Failed to fetch rooms:', e);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch History with partner
  const fetchHistory = async (partnerId: string) => {
    if (!user) return;
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/chat/history/${partnerId}`);
      const data = await safeJsonResponse(res);
      if (data.success) {
        setMessages(data.history);
        // Mark as read
        await fetch(`/api/chat/read/${partnerId}`, { method: 'POST' });
        // Also tell WS server to notify partner
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            type: 'read',
            senderId: partnerId
          }));
        }
        // Refresh room badges
        fetchRooms();
      }
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Triggered when selecting a room
  const handleSelectPartner = (partner: { id: string; name: string; avatar?: string }) => {
    setActivePartner(partner);
    setMessages([]); // Clear previous messages instantly to avoid cross-user bleeding
    fetchHistory(partner.id);
  };

  // Start chat with user from friends list or profile card
  const startChatWithUser = (partner: { id: string; name: string; avatar?: string }) => {
    setActivePartner(partner);
    setSidebarTab('rooms');
    setMessages([]); // Clear previous messages instantly
    fetchHistory(partner.id);
  };

  // Triggered when clicking "Sohbet Et" from setup detail or AI widget
  useEffect(() => {
    if (startChatWithOwner) {
      if (!user) {
        onAuthTrigger();
        return;
      }

      // First find or create partner
      const startChat = async () => {
        // Special check for AI Bot
        if (startChatWithOwner === 'ai-bot') {
          setIsOpen(true);
          handleSelectPartner(AI_BOT);
          if (onClearStartChat) onClearStartChat();
          return;
        }

        try {
          const res = await fetch(`/api/users/find-by-owner/${encodeURIComponent(startChatWithOwner)}`);
          const data = await safeJsonResponse(res);
          if (data.success && data.user) {
            setIsOpen(true);
            handleSelectPartner(data.user);
          }
        } catch (e) {
          console.error('Error starting chat with owner:', e);
        } finally {
          if (onClearStartChat) onClearStartChat();
        }
      };
      startChat();
    }
  }, [startChatWithOwner, user]);

  // Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!messageText.trim() && !attachedMedia) || !activePartner || !user) return;

    if (activePartner.id === 'ai-bot') {
      const tempText = messageText;
      setMessageText('');
      setAttachedMedia(null);
      
      const userMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const aiMsgId = `msg-ai-${Date.now()}`;
      
      const newMessages = [...messages, {
        id: userMsgId,
        senderId: user.id,
        senderName: user.displayName || user.name || "Siz",
        senderAvatar: user.avatar,
        receiverId: activePartner.id,
        receiverName: activePartner.name,
        receiverAvatar: activePartner.avatar,
        message: tempText,
        createdAt: new Date().toISOString(),
        isRead: true
      }, {
        id: aiMsgId,
        senderId: activePartner.id,
        senderName: "Setupss AI",
        senderAvatar: "/setupss_icon.svg?v=2026_v9",
        receiverId: user.id,
        receiverName: user.displayName || user.name || "Siz",
        receiverAvatar: user.avatar,
        message: "",
        createdAt: new Date().toISOString(),
        isRead: false
      }];
      
      setMessages(newMessages as any);
      
      // format for gemini:
      const recentMessages = newMessages.slice(-21, -1);
      const formattedHistory = recentMessages.map(m => ({
        role: m.senderId === user.id ? 'user' : 'model',
        parts: [{ text: m.message }]
      }));
      
      let aiText = "";
      try {
        setIsStreaming(true);
        abortControllerRef.current = new AbortController();
        const response = await fetch('/api/ai/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortControllerRef.current.signal,
          body: JSON.stringify({
            messages: formattedHistory,
            pageContext: {
              url: window.location.href,
              pathname: window.location.pathname,
            }
          })
        });
        
        if (!response.body) throw new Error('No body');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '');
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  aiText += parsed.text;
                  setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, message: aiText } : m));
                }
              } catch (e) {}
            }
          }
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error(e);
          if (!aiText) {
            const errorMsg = !navigator.onLine 
              ? "⚠️ İnternet bağlantınız koptu. Lütfen bağlantınızı kontrol edip tekrar deneyin."
              : e.message?.includes('rate limit')
                ? "⚠️ Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin."
                : "⚠️ Üzgünüm, şu anda yanıt veremiyorum. Bir bağlantı veya sunucu hatası oluştu. Lütfen tekrar deneyin.";
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, message: errorMsg } : m));
          }
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
      return;
    }


    const tempText = messageText;
    const tempMedia = attachedMedia;
    setMessageText('');
    setAttachedMedia(null);

    // Optimistically render the sent message immediately
    const tempId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      senderId: user.id,
      senderName: user.displayName || user.name || "Siz",
      senderAvatar: user.avatar,
      receiverId: activePartner.id,
      receiverName: activePartner.name,
      receiverAvatar: activePartner.avatar,
      message: tempText,
      createdAt: new Date().toISOString(),
      isRead: false,
      mediaUrl: tempMedia?.url || undefined,
      mediaType: tempMedia?.type || undefined
    };

    setMessages(prev => {
      if (prev.some(m => m.id === tempId)) return prev;
      return [...prev, optimisticMsg];
    });

    // If WebSocket is active, send via WS
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        receiverId: activePartner.id,
        receiverName: activePartner.name,
        receiverAvatar: activePartner.avatar,
        senderName: user.displayName || user.name,
        senderAvatar: user.avatar,
        message: tempText,
        mediaUrl: tempMedia?.url || undefined,
        mediaType: tempMedia?.type || undefined
      }));
    } else {
      // Fallback to HTTP POST
      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: activePartner.id,
            receiverName: activePartner.name,
            receiverAvatar: activePartner.avatar,
            message: tempText,
            mediaUrl: tempMedia?.url || undefined,
            mediaType: tempMedia?.type || undefined
          })
        });
        const data = await safeJsonResponse(res);
        if (data.success && data.message) {
          fetchRooms();
          // After 1.3s re-fetch history to pick up automated community response
          setTimeout(() => {
            fetchHistory(activePartner.id);
          }, 1300);
        }
      } catch (e) {
        console.error('Failed to send fallback message:', e);
        // Re-add text/media so user doesn't lose it
        setMessageText(tempText);
        setAttachedMedia(tempMedia);
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Count total unread messages
  const totalUnread = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);

  const filteredRooms = rooms.filter(room => 
    room.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map friendships lists safely
  const acceptedFriends = friendships.filter(f => f.status === 'accepted').map(f => {
    const isSender = f.userId === user.id;
    return {
      friendshipId: f.id,
      id: isSender ? f.friendId : f.userId,
      name: isSender ? f.receiverName : f.senderName,
      avatar: isSender ? f.receiverAvatar : f.senderAvatar,
      avatarFrame: isSender ? f.receiverFrame : f.senderFrame,
    };
  });

  const pendingIncoming = friendships.filter(f => f.status === 'pending' && f.friendId === user.id).map(f => {
    return {
      friendshipId: f.id,
      id: f.userId,
      name: f.senderName,
      avatar: f.senderAvatar,
      avatarFrame: f.senderFrame,
    };
  });

  const pendingOutgoing = friendships.filter(f => f.status === 'pending' && f.userId === user.id).map(f => {
    return {
      friendshipId: f.id,
      id: f.friendId,
      name: f.receiverName,
      avatar: f.receiverAvatar,
      avatarFrame: f.receiverFrame,
    };
  });

  // Check relationship status for searched users
  const getFriendshipStatusForUser = (userId: string) => {
    const found = friendships.find(f => 
      (f.userId === user.id && f.friendId === userId) || 
      (f.userId === userId && f.friendId === user.id)
    );
    if (!found) return null;
    return found;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        id="setupss-chat-toggle-btn"
        whileHover={{ scale: 1.1, rotate: -3, y: -2 }}
        whileTap={{ scale: 0.95, rotate: 3 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => {
          if (!user) {
            onAuthTrigger();
            return;
          }
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchRooms();
            fetchFriends();
          }
        }}
        className="fixed bottom-6 right-6 z-40 p-4 bg-[#FFD93D] text-vibrant-dark border-4 border-vibrant-dark rounded-full shadow-[5px_5px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer hidden md:flex items-center justify-center group"
      >
        <MessageSquare className="w-7 h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
        
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-vibrant-dark animate-pulse shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
            {totalUnread}
          </span>
        )}
      </motion.button>

      {/* Chat window panel */}
      <AnimatePresence>
        {isOpen && user && (
          <motion.div 
            id="setupss-chat-panel"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-16 sm:bottom-24 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-full max-w-[360px] md:max-w-[800px] h-[500px] max-h-[calc(100vh-100px)] min-h-[360px] bg-vibrant-bg border-4 border-vibrant-dark rounded-3xl shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex flex-col md:flex-row overflow-hidden"
          >
          {/* Left Sidebar (Rooms or Friends) */}
          <div className={`w-full md:w-[320px] bg-white border-b-4 md:border-b-0 md:border-r-4 border-vibrant-dark flex flex-col h-full ${activePartner ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Sidebar Top Header with Title and Close Button */}
            <div className="p-3 bg-vibrant-yellow border-b-4 border-vibrant-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-vibrant-dark text-vibrant-yellow border-2 border-vibrant-dark rounded-xl flex items-center justify-center font-black text-xs">
                  SS
                </div>
                <div>
                  <h3 className="font-black text-xs text-vibrant-dark uppercase tracking-tight">SETUPSS SOHBET</h3>
                  <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Topluluk Çevrimiçi
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-white border-2 border-vibrant-dark rounded-xl hover:bg-slate-100 transition-transform shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                title="Kapat"
              >
                <X className="w-4 h-4 text-vibrant-dark stroke-[2.5]" />
              </button>
            </div>

            {/* Sidebar Tab Header */}
            <div className="p-1 bg-[#2d3454] text-white flex border-b-4 border-vibrant-dark gap-1">
              <button
                onClick={() => setSidebarTab('rooms')}
                className={`flex-1 py-2 px-1 text-center font-black text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'rooms' ? 'bg-[#FFD93D] text-[#2d3454]' : 'hover:bg-white/10 text-white'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                SOHBETLER
              </button>
              <button
                onClick={() => {
                  setSidebarTab('friends');
                  fetchFriends();
                  fetchDiscoverUsers();
                }}
                className={`flex-1 py-2 px-1 text-center font-black text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'friends' ? 'bg-[#FFD93D] text-[#2d3454]' : 'hover:bg-white/10 text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                ARKADAŞLAR
                {(pendingIncoming.length > 0) && (
                  <span className="bg-[#FF6B6B] text-white px-1.5 py-0.2 text-[8px] font-black rounded-full border border-vibrant-dark animate-pulse">
                    {pendingIncoming.length}
                  </span>
                )}
              </button>
            </div>

            {/* Render Rooms Tab Content */}
            {sidebarTab === 'rooms' && (
              <>
                {/* Search Bar */}
                <div className="p-3 border-b-2 border-slate-150 relative bg-slate-50">
                  <input
                    type="text"
                    placeholder="Sohbet geçmişinde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-vibrant-dark rounded-xl px-3 py-1.5 pl-8 text-xs font-semibold focus:outline-none focus:border-vibrant-yellow"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-6 top-5" />
                </div>

                {/* Rooms List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50">
                  {loadingRooms && rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                      <Loader2 className="w-6 h-6 text-vibrant-coral animate-spin" />
                      <span className="text-[10px] font-bold text-slate-400">YÜKLENİYOR...</span>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                      <MessageCircle className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                      <span className="text-xs font-bold text-slate-400">Sohbet bulunamadı</span>
                      <p className="text-[10px] text-slate-400 mt-1">Geliştiricileri bulup arkadaş ekleyebilir ya da tasarımlarından "Sohbet Et" diyebilirsin!</p>
                    </div>
                  ) : (
                    filteredRooms.map((room) => (
                      <button
                        key={room.partnerId}
                        onClick={() => handleSelectPartner({ id: room.partnerId, name: room.partnerName, avatar: room.partnerAvatar })}
                        className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center gap-3 cursor-pointer ${
                          activePartner?.id === room.partnerId
                            ? 'bg-vibrant-yellow border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]'
                            : 'bg-white border-transparent hover:border-vibrant-dark hover:shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl border-2 border-vibrant-dark bg-[#ffeaa7] flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                          {room.partnerAvatar ? (
                            <SafeImage src={room.partnerAvatar} alt={room.partnerName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="font-black text-sm text-vibrant-dark uppercase">
                              {room.partnerName.substring(0, 2)}
                            </div>
                          )}
                        </div>

                        {/* Room Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-extrabold text-xs truncate ${room.partnerHasRgb ? 'rgb-text' : 'text-vibrant-dark'}`}>{room.partnerName}</span>
                            <span className="text-[8px] font-bold text-slate-400">
                              {new Date(room.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{room.lastMessage}</p>
                        </div>

                        {/* Unread badge */}
                        {room.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-[#FF6B6B] text-white text-[9px] font-black rounded-full border-2 border-vibrant-dark flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] animate-bounce">
                            {room.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Render Friends Tab Content */}
            {sidebarTab === 'friends' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                {/* Find Developers Search Area */}
                <div className="p-3 border-b border-slate-200 bg-white">
                  <span className="text-[9px] font-extrabold text-slate-400 block mb-1.5 uppercase">SETUPSS Topluluğunda Ara</span>
                  <form onSubmit={handleSearchUsers} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Kullanıcı adı yazın..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="flex-1 bg-slate-50 border-2 border-vibrant-dark rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSearchingUsers}
                      className="px-3 bg-vibrant-yellow hover:bg-[#FFE57F] text-vibrant-dark border-2 border-vibrant-dark rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                    >
                      {isSearchingUsers ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'ARA'}
                    </button>
                  </form>

                  {friendRequestMessage && (
                    <div className="mt-2 text-[10px] font-bold text-[#4CD137] bg-[#4CD137]/10 p-1.5 rounded-lg border border-[#4CD137]/20 text-center animate-fade-in">
                      {friendRequestMessage}
                    </div>
                  )}

                  {/* Search Results */}
                  {userSearchResults.length > 0 && (
                    <div className="mt-2 max-h-[140px] overflow-y-auto border-2 border-dashed border-slate-300 rounded-xl p-1 bg-slate-50 space-y-1">
                      {userSearchResults.map((u) => {
                        const rel = getFriendshipStatusForUser(u.id);
                        return (
                          <div key={u.id} className="flex items-center justify-between p-1.5 bg-white border border-slate-150 rounded-lg text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-md bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 border border-vibrant-dark">
                                {u.avatar ? <SafeImage src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : <span className="font-extrabold text-[10px]">{u.name.substring(0, 2)}</span>}
                              </div>
                              <span className="font-bold text-[11px] truncate text-vibrant-dark">{u.name}</span>
                            </div>

                            {rel ? (
                              <span className="text-[8px] font-black uppercase text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded border">
                                {rel.status === 'accepted' ? 'ARKADAŞSINIZ' : rel.userId === user.id ? 'İSTEK GÖNDERİLDİ' : 'BEKLEMEDE'}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSendFriendRequest(u.id)}
                                className="p-1 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark border border-vibrant-dark rounded shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] active:shadow-none transition-all"
                                title="Arkadaş Ekle"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                  {/* Incoming Pending Requests */}
                  {pendingIncoming.length > 0 && (
                    <div>
                      <span className="text-[9px] font-black text-vibrant-coral block px-1 mb-1.5 uppercase tracking-wider">Gelen İstekler ({pendingIncoming.length})</span>
                      <div className="space-y-1">
                        {pendingIncoming.map(item => (
                          <div key={item.id} className="p-2 bg-rose-50 border-2 border-[#FF6B6B] rounded-xl flex items-center justify-between text-xs animate-pulse-subtle">
                            <div className="flex items-center gap-2 min-w-0">
                              <UserAvatar
                                src={item.avatar}
                                name={item.name}
                                frame={item.avatarFrame}
                                size="xs"
                              />
                              <span className="font-bold text-[11px] text-vibrant-dark truncate">{item.name}</span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => handleAcceptFriendRequest(item.id)}
                                className="p-1 bg-[#4CD137] text-vibrant-dark border border-vibrant-dark rounded hover:scale-105 transition-transform"
                                title="Kabul Et"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRejectFriendRequest(item.id)}
                                className="p-1 bg-white text-vibrant-coral border border-vibrant-dark rounded hover:scale-105 transition-transform"
                                title="Reddet"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Friends List */}
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block px-1 mb-1.5 uppercase tracking-wider">Arkadaşlarım ({acceptedFriends.length})</span>
                    {loadingFriends ? (
                      <div className="flex items-center justify-center p-6"><Loader2 className="w-4 h-4 text-vibrant-coral animate-spin" /></div>
                    ) : acceptedFriends.length === 0 ? (
                      <div className="text-center p-4 bg-white border border-dashed border-slate-200 rounded-xl">
                        <Users className="w-6 h-6 text-slate-300 mx-auto mb-1 stroke-[1.5]" />
                        <p className="text-[10px] text-slate-400 font-bold">Henüz arkadaşınız yok.</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {acceptedFriends.map(friend => (
                          <div key={friend.id} className="p-2 bg-white border-2 border-vibrant-dark rounded-xl flex items-center justify-between text-xs hover:shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] transition-shadow">
                            <div className="flex items-center gap-2 min-w-0">
                              <UserAvatar
                                src={friend.avatar}
                                name={friend.name}
                                frame={friend.avatarFrame}
                                size="xs"
                              />
                              <span className="font-bold text-[11px] text-vibrant-dark truncate">{friend.name}</span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => startChatWithUser({ id: friend.id, name: friend.name, avatar: friend.avatar })}
                                className="p-1.5 bg-[#FFD93D] text-vibrant-dark border border-vibrant-dark rounded hover:scale-105 transition-transform"
                                title="Sohbet Et"
                              >
                                <MessageSquarePlus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleViewProfile(friend.id)}
                                className="p-1.5 bg-sky-100 text-sky-800 border border-vibrant-dark rounded hover:scale-105 transition-transform"
                                title="Profili Gör"
                              >
                                {loadingProfileId === friend.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleRejectFriendRequest(friend.id)}
                                className="p-1.5 bg-rose-50 text-vibrant-coral border border-vibrant-dark rounded hover:bg-rose-100 hover:scale-105 transition-transform"
                                title="Arkadaşlığı Bitir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Topluluğu Keşfet (Community Discovery) Section */}
                  <div className="border-t-2 border-slate-100 pt-3 mt-3">
                    <span className="text-[9px] font-black text-vibrant-teal block px-1 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                      <span>Topluluğu Keşfet 🧭</span>
                      <span className="bg-vibrant-teal/10 text-vibrant-teal px-1 rounded-md text-[7px] font-bold">Önerilenler</span>
                    </span>
                    
                    {loadingDiscover ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 text-vibrant-teal animate-spin" />
                      </div>
                    ) : discoverUsers.length === 0 ? (
                      <div className="text-center p-3 bg-slate-50 border border-dashed rounded-xl">
                        <p className="text-[9px] text-slate-400 font-bold">Önerilecek başka üye bulunamadı.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-1.5">
                        {discoverUsers.map((u: any) => {
                          const rel = getFriendshipStatusForUser(u.id);
                          return (
                            <div key={u.id} className="p-1.5 bg-slate-50 border border-slate-200 hover:border-vibrant-dark/20 rounded-xl flex items-center justify-between text-xs transition-all">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <UserAvatar
                                  src={u.avatar}
                                  name={u.name}
                                  frame={u.avatarFrame}
                                  isCrown={u.isCrown}
                                  hasRgb={u.hasRgb}
                                  size="xs"
                                />
                                <div className="min-w-0">
                                  <span className="font-extrabold text-[10px] text-vibrant-dark block truncate leading-none">{u.name}</span>
                                  {u.score > 0 && (
                                    <span className="text-[7px] font-black text-amber-500 uppercase">Skor: {u.score} pts</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-1 shrink-0">
                                {/* View profile button */}
                                <button
                                  onClick={() => handleViewProfile(u.id)}
                                  className="p-1 bg-white hover:bg-slate-100 text-vibrant-dark border border-slate-200 rounded transition-transform hover:scale-105"
                                  title="Profili İncele"
                                >
                                  <Globe className="w-3 h-3 text-sky-600" />
                                </button>

                                {/* Send friend request or status */}
                                {rel ? (
                                  <span className="text-[7px] font-black uppercase text-slate-400 px-1 py-0.5 bg-slate-100 rounded border self-center">
                                    {rel.status === 'accepted' ? 'ARKADAŞ' : rel.userId === user.id ? 'GÖNDERİLDİ' : 'BEKLİYOR'}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSendFriendRequest(u.id)}
                                    className="p-1 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark border border-vibrant-dark rounded shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] active:shadow-none transition-all hover:scale-105"
                                    title="Arkadaş Ekle"
                                  >
                                    <UserPlus className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Connection Status Footer */}
            <div className="p-2 border-t border-slate-150 bg-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full border border-vibrant-dark ${isConnected ? 'bg-[#4CD137]' : isConnecting ? 'bg-amber-400' : 'bg-[#FF6B6B]'}`} />
                {isConnected ? 'BAĞLANTI AKTİF' : isConnecting ? 'BAĞLANILIYOR...' : 'ÇEVRİMDIŞI'}
              </span>
              <button onClick={() => { fetchRooms(); fetchFriends(); }} className="text-vibrant-coral hover:underline uppercase">YENİLE</button>
            </div>
          </div>

          {/* Conversation Panel (Right) */}
          <div className={`flex-1 flex flex-col h-full bg-vibrant-bg ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
            {activePartner ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b-4 border-vibrant-dark flex items-center justify-between z-10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActivePartner(null)}
                      className="md:hidden p-1 bg-slate-100 border-2 border-vibrant-dark rounded-lg hover:bg-slate-200"
                    >
                      <X className="w-4 h-4 text-vibrant-dark" />
                    </button>
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl border-2 border-vibrant-dark bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                      {activePartner.id === AI_BOT.id ? (
                        <AiAvatar size="full" disableHoverEffect={true} className="w-full h-full" />
                      ) : activePartner.avatar ? (
                        <SafeImage 
                          src={activePartner.avatar} 
                          alt={activePartner.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="font-black text-sm text-vibrant-dark uppercase">{activePartner.name.substring(0, 2)}</span>
                      )}
                    </div>
                    {/* Partner Name */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className={`font-black text-xs uppercase tracking-tight ${activePartner.id === AI_BOT.id ? 'text-vibrant-coral' : (activePartner as any).partnerHasRgb || (activePartner as any).hasRgb ? 'rgb-text' : 'text-vibrant-dark'}`}>{activePartner.name}</h4>
                        {activePartner.id !== AI_BOT.id && (
                          <button
                            onClick={() => handleViewProfile(activePartner.id)}
                            className="text-[9px] font-extrabold text-[#4CD137] hover:underline"
                          >
                            (Profili Gör)
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${activePartner.id === AI_BOT.id ? 'bg-vibrant-coral animate-pulse' : 'bg-[#4CD137]'}`} />
                        {activePartner.id === AI_BOT.id ? 'Yapay Zeka Asistanı' : 'Geliştirici Odası'}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 bg-white border-2 border-vibrant-dark rounded-xl hover:bg-slate-50 transition-transform shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none cursor-pointer"
                  >
                    <X className="w-4 h-4 text-vibrant-dark" />
                  </button>
                </div>

                {/* Messages Panel */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f3f4f6]">
                  {loadingHistory ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <Loader2 className="w-6 h-6 text-vibrant-coral animate-spin" />
                      <span className="text-[10px] font-bold text-slate-400">GEÇMİŞ YÜKLENİYOR...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                      <Sparkles className="w-8 h-8 text-[#FFD93D] mb-2 animate-pulse" />
                      <span className="text-xs font-black uppercase text-vibrant-dark">SETUPSS İletişim Hattı</span>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1 max-w-[200px]">
                        İlk mesajını yazıp fotoğraf veya video göndererek harika bir sohbet başlat!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === user.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl p-3 border-2 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] ${
                             isMe 
                               ? 'bg-[#FFD93D] border-vibrant-dark rounded-tr-none' 
                               : `bg-white ${msg.senderHasRgb ? 'rgb-modal-border' : 'border-vibrant-dark'} rounded-tl-none`
                          }`}>
                            <div className="flex items-center justify-between gap-2 mb-1">
                               <span className={`text-[9px] font-black uppercase ${isMe ? 'text-vibrant-dark/70' : msg.senderHasRgb ? 'rgb-text' : 'text-slate-400'}`}>
                                 {isMe ? 'SİZ' : msg.senderName}
                               </span>
                               {!isMe && msg.senderId !== 'ai-bot' && (
                                 <button
                                   onClick={() => handleReportMessage(msg)}
                                   disabled={isReporting}
                                   className="p-0.5 text-slate-400 hover:text-vibrant-coral disabled:opacity-50 transition-colors flex items-center gap-0.5 text-[8px] font-black uppercase cursor-pointer"
                                   title="Küfür/Hakaret Bildir"
                                 >
                                   <AlertTriangle className="w-3 h-3" /> Şikayet
                                 </button>
                               )}
                            </div>
                            {/* Render Inline Media attachment */}
                            {msg.mediaUrl && (
                              <div className="mb-2 max-w-full rounded-lg overflow-hidden border border-vibrant-dark bg-slate-100 flex items-center justify-center">
                                {msg.mediaType === 'video' ? (
                                  <video src={msg.mediaUrl} controls playsInline className="max-h-[180px] w-auto rounded object-contain" />
                                ) : (
                                  <img 
                                    src={msg.mediaUrl} 
                                    alt="Chat Media" 
                                    referrerPolicy="no-referrer"
                                    className="max-h-[180px] w-auto rounded object-contain hover:scale-[1.02] cursor-zoom-in transition-transform" 
                                    onClick={() => window.open(msg.mediaUrl, '_blank')}
                                  />
                                )}
                              </div>
                            )}

                            {msg.message && (
                              msg.senderId === 'ai-bot' ? (
                                (() => {
                                  let mainContent = msg.message;
                                  let suggestions: string[] = [];
                                  
                                  const parts = msg.message.split('---');
                                  if (parts.length > 1) {
                                    const possibleSuggestions = parts[parts.length - 1];
                                    if (possibleSuggestions.includes('Önerilen Sorular:')) {
                                      mainContent = parts.slice(0, -1).join('---');
                                      // parse lines starting with 1., 2., 3. or - 
                                      const lines = possibleSuggestions.split('\n');
                                      suggestions = lines
                                        .map(l => l.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
                                        .filter(l => l.length > 5 && !l.includes('Önerilen Sorular'));
                                    }
                                  }

                                  return (
                                    <div className="w-full flex flex-col gap-2">
                                      <div className="text-xs font-medium text-vibrant-dark leading-normal prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 marker:text-vibrant-dark overflow-hidden break-words     ">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainContent}</ReactMarkdown>
                                      </div>
                                      {suggestions.length > 0 && (
                                        <div className="flex flex-col gap-1.5 mt-2">
                                          <span className="text-[10px] font-bold text-slate-500 uppercase">Öneriler</span>
                                          {suggestions.map((sug, idx) => (
                                            <button 
                                              key={idx}
                                              onClick={() => {
                                                setMessageText(sug);
                                                // Optional: automatically send
                                                // setTimeout(() => handleSendMessage(), 100);
                                              }}
                                              className="text-left text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-vibrant-dark/20 bg-white/50 hover:bg-vibrant-yellow/20 hover:border-vibrant-yellow transition-colors     "
                                            >
                                              {sug}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <p className="text-xs font-semibold text-vibrant-dark leading-normal whitespace-pre-wrap break-words ">{msg.message}</p>
                              )
                            )}

                            <div className="flex items-center justify-end gap-1.5 mt-1">
                              <span className="text-[8px] font-bold text-slate-500">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                <span className={`text-[8px] font-extrabold uppercase ${msg.isRead ? 'text-[#4CD137]' : 'text-slate-400'}`}>
                                  {msg.isRead ? 'OKUNDU' : 'İLETİLDİ'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Media Attachment Preview (Above text input) */}
                {attachedMedia && (
                  <div className="p-2.5 bg-slate-50 border-t-2 border-vibrant-dark flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 border border-vibrant-dark rounded bg-white overflow-hidden flex items-center justify-center">
                        {attachedMedia.type === 'video' ? (
                          <Video className="w-5 h-5 text-vibrant-coral" />
                        ) : (
                          <img src={attachedMedia.url} alt="Ekli resim" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-vibrant-dark uppercase tracking-tight">Medya Eklendi ({attachedMedia.type})</span>
                    </div>
                    <button
                      onClick={() => setAttachedMedia(null)}
                      className="p-1 text-vibrant-coral hover:bg-slate-100 rounded-full border-2 border-transparent hover:border-vibrant-dark transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Input Panel with Attachment Action */}
                {isStreaming && (
                  <div className="absolute bottom-[65px] left-0 right-0 flex justify-center z-10 pointer-events-none">
                    <button
                      type="button"
                      aria-label="Yanıtı Durdur"
                      onClick={() => abortControllerRef.current?.abort()}
                      className="pointer-events-auto bg-vibrant-dark text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5 hover:bg-black transition-colors"
                    >
                      <span className="w-2 h-2 bg-vibrant-coral rounded-sm animate-pulse" />
                      Üretimi Durdur
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t-4 border-vibrant-dark flex items-center gap-2 relative">
                  
                  {/* File Uploader Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMediaUpload}
                    accept="image/*,video/*"
                    className="hidden"
                  />

                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-vibrant-dark border-2 border-vibrant-dark rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-50 transition-all cursor-pointer"
                    title="Fotoğraf veya Video Ekle"
                  >
                    {isUploadingMedia ? (
                      <Loader2 className="w-4 h-4 animate-spin text-vibrant-coral" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-vibrant-dark" />
                    )}
                  </button>

                  <TextareaAutosize aria-label="Mesaj yazın"
                    minRows={1}
                    maxRows={5}
                    placeholder="Mesajınızı buraya yazın..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 bg-slate-50 border-2 border-vibrant-dark rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white resize-none custom-scrollbar"
                  />
                  
                  <button
                    type="submit"
                    aria-label="Mesaj Gönder"
                    disabled={!messageText.trim() && !attachedMedia}
                    className="p-2.5 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark border-2 border-vibrant-dark rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-4 h-4 text-vibrant-dark" />
                  </button>
                </form>
              </>
            ) : (
              // Empty State (No active room selected)
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f3f4f6]">
                <MessageCircle className="w-16 h-16 text-[#FFD93D] stroke-[1.5] mb-4 animate-bounce" />
                <h3 className="font-black text-vibrant-dark uppercase text-sm tracking-wide">MESAJLAŞMA SİSTEMİ</h3>
                <p className="text-xs text-slate-500 font-bold max-w-[280px] mt-2 leading-relaxed">
                  Geliştiriciler ile gerçek zamanlı sohbet edin, arkadaş ekleyin ve birbirinize anında fotoğraf ve video gönderin!
                </p>
                <div className="mt-6 p-4 bg-white border-4 border-vibrant-dark rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] max-w-xs">
                  <div className="flex gap-2 items-start text-left">
                    <AlertCircle className="w-4 h-4 text-vibrant-coral shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-vibrant-dark block">Nasıl Başlanır?</span>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1">
                        Sohbet sekmesinden ya da <b>Arkadaşlar</b> sekmesinden arama yapıp arkadaş isteklerinizi yönetebilirsiniz!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Selected User Public Profile Modal Overlay */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-white border-4 border-vibrant-dark rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex flex-col relative"
            style={{ borderColor: selectedProfile.customColor || '#2d3454' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 border-2 border-vibrant-dark rounded-full hover:bg-rose-50 transition-all shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <X className="w-4 h-4 text-vibrant-dark" />
            </button>

            {/* Custom Cover Photo Banner */}
            <div className="h-32 bg-slate-100 relative overflow-hidden border-b-4 border-vibrant-dark" style={{ borderColor: selectedProfile.customColor || '#2d3454' }}>
              {selectedProfile.coverPhoto ? (
                <img src={selectedProfile.coverPhoto} alt="Kapak" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-amber-200 to-amber-400" />
              )}
            </div>

            {/* Avatar & Title Overlapping Banner */}
            <div className="px-6 pb-6 pt-12 relative flex flex-col items-center text-center">
              <div 
                className="w-20 h-20 rounded-2xl border-4 border-vibrant-dark bg-white overflow-hidden flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 shadow-[4px_4px_0px_0px_rgba(45,52,54,0.15)]"
                style={{ borderColor: selectedProfile.customColor || '#2d3454' }}
              >
                {selectedProfile.avatar ? (
                  <SafeImage 
                    src={selectedProfile.avatar} 
                    alt={selectedProfile.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="font-black text-2xl uppercase">{selectedProfile.name.substring(0, 2)}</span>
                )}
              </div>

              {/* Badges & Name */}
              <div className="mt-2 flex items-center gap-1.5 justify-center flex-wrap">
                <h3 className="font-black text-xl text-vibrant-dark uppercase tracking-tight">{selectedProfile.name}</h3>
                {selectedProfile.customBadge && (
                  <span 
                    className="px-2 py-0.5 bg-vibrant-yellow text-vibrant-dark font-black text-[9px] uppercase rounded border-2 border-vibrant-dark shadow-[1px_1px_0px_0px_rgba(45,52,54,1)]"
                    style={{ backgroundColor: selectedProfile.customColor || '#FFD93D' }}
                  >
                    {selectedProfile.customBadge}
                  </span>
                )}
              </div>

              {/* Bio block */}
              <div className="mt-4 bg-slate-50 border-2 border-vibrant-dark p-3.5 rounded-2xl max-w-sm w-full text-left">
                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Geliştirici Hakkında</span>
                <p className="text-xs font-semibold text-vibrant-dark leading-relaxed whitespace-pre-wrap">
                  {selectedProfile.bio || 'Bu geliştirici henüz bir biyografi eklememiş.'}
                </p>
              </div>

              {/* Clickable Social icons block */}
              <div className="mt-5 flex gap-3 justify-center w-full">
                {selectedProfile.githubLink && (
                  <a
                    href={selectedProfile.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border-2 border-vibrant-dark rounded-xl shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-vibrant-dark"
                    title="Github"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {selectedProfile.instagramLink && (
                  <a
                    href={selectedProfile.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border-2 border-vibrant-dark rounded-xl shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-vibrant-dark"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {selectedProfile.linkedinLink && (
                  <a
                    href={selectedProfile.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border-2 border-vibrant-dark rounded-xl shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-vibrant-dark"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Send direct message action inside profile */}
              <div className="mt-6 w-full max-w-sm flex gap-2">
                <button
                  onClick={() => {
                    startChatWithUser({ id: selectedProfile.id, name: selectedProfile.name, avatar: selectedProfile.avatar });
                    setSelectedProfile(null);
                  }}
                  className="flex-1 py-3 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark font-black text-xs uppercase border-2 border-vibrant-dark rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sentinel V900 Audit Result Modal */}
      {sentinelAuditReport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] relative text-left">
            <button 
              onClick={() => setSentinelAuditReport(null)}
              className="absolute top-4 right-4 w-8 h-8 border-2 border-vibrant-dark rounded-full flex items-center justify-center bg-slate-100 hover:bg-vibrant-yellow cursor-pointer"
            >
              <X className="w-5 h-5 text-vibrant-dark" />
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white font-black text-[10px] uppercase rounded-full">
                <ShieldAlert className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>SENTINEL V900 GÜVENLİK RAPORU</span>
              </div>

              <div className="p-3 bg-slate-50 border-2 border-vibrant-dark rounded-xl font-mono text-[11px] space-y-1">
                <p><span className="text-slate-400">ŞÜPHELİ:</span> @{sentinelAuditReport.senderName}</p>
                <p className="line-clamp-2"><span className="text-slate-400">MESAJ:</span> "{sentinelAuditReport.message}"</p>
              </div>

              <div className="p-4 bg-slate-900 text-emerald-400 border-2 border-vibrant-dark rounded-2xl font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Sentinel V900 AI İnceleme Sonucu:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {sentinelAuditReport.reason}
                </p>
                <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span>DURUM:</span>
                  <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${
                    sentinelAuditReport.isProfane ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {sentinelAuditReport.isProfane ? 'YASAKLANDI (BANNED)' : 'TEMİZ (CLEAN)'}
                  </span>
                </div>
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase text-center">
                {sentinelAuditReport.messageResponse}
              </p>

              <button
                onClick={() => setSentinelAuditReport(null)}
                className="w-full py-3 bg-vibrant-dark hover:bg-slate-800 text-white font-black uppercase text-xs rounded-xl border-2 border-vibrant-dark transition-all cursor-pointer"
              >
                Sentinel Kararını Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
