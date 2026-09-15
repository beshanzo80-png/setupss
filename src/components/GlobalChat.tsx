import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Globe, Users, MessageSquare, Loader2, User } from 'lucide-react';
import { safeJsonResponse } from '../lib/api';
import { ChatMessage } from '../types';

interface GlobalChatProps {
  user: any;
  onAuthTrigger: () => void;
}

export const GlobalChat: React.FC<GlobalChatProps> = ({ user, onAuthTrigger }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial fetch of recent global messages
    fetch('/api/chat/global/history')
      .then(res => safeJsonResponse(res))
      .then(data => {
        if (data.success) {
          setMessages(data.history);
        }
      })
      .catch(console.error);

    // WebSocket connection for global chat
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join_global', userId: user?.id || 'guest' }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'global_message') {
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'presence_update') {
          setOnlineCount(data.count);
        }
      } catch (e) {
        console.error('WS Error:', e);
      }
    };

    return () => {
      socket.close();
    };
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const msgText = inputText;
    setInputText('');

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'global_send',
        message: msgText,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar
      }));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-white border-4 border-vibrant-dark rounded-3xl p-8 text-center">
        <Globe className="w-16 h-16 text-vibrant-coral mb-4 animate-spin-slow" />
        <h2 className="text-2xl font-black text-vibrant-dark mb-2">DÜNYA SOHBETİNE KATIL</h2>
        <p className="text-slate-500 font-bold mb-6">Diğer kullanıcılarla gerçek zamanlı sohbet etmek için giriş yapmalısın.</p>
        <button 
          onClick={onAuthTrigger}
          className="px-8 py-3 bg-vibrant-yellow text-vibrant-dark border-4 border-vibrant-dark rounded-2xl font-black shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
        >
          GİRİŞ YAP
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] bg-white border-4 border-vibrant-dark rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(45,52,54,1)]">
      {/* Header */}
      <div className="bg-vibrant-yellow border-b-4 border-vibrant-dark p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-vibrant-dark text-vibrant-yellow rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-lg text-vibrant-dark leading-none">SAIOS DÜNYA SOHBETİ</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{onlineCount} KİŞİ ÇEVRİMİÇİ</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-xl border-2 border-vibrant-dark/10">
          <Users className="w-4 h-4 text-vibrant-dark" />
          <span className="text-xs font-black text-vibrant-dark">GLOBAL KANAL</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            key={msg.id || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-3 ${msg.senderId === user.id ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl border-2 border-vibrant-dark bg-white overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              {msg.senderAvatar ? (
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>
            <div className={`max-w-[70%] ${msg.senderId === user.id ? 'items-end' : 'items-start'} flex flex-col`}>
              <span className="text-[10px] font-black text-slate-400 mb-1 px-1">{msg.senderName}</span>
              <div className={`p-3 rounded-2xl border-2 border-vibrant-dark font-bold text-sm shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] ${
                msg.senderId === user.id ? 'bg-[#FFD93D] text-vibrant-dark rounded-tr-none' : 'bg-white text-vibrant-dark rounded-tl-none'
              }`}>
                {msg.message}
              </div>
              <span className="text-[8px] font-bold text-slate-400 mt-1.5 px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t-4 border-vibrant-dark">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tüm dünya seni dinliyor..."
            className="flex-1 bg-slate-50 border-3 border-vibrant-dark rounded-2xl px-5 py-3 font-bold text-vibrant-dark focus:outline-none focus:ring-4 focus:ring-vibrant-yellow/30 placeholder:text-slate-400"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-4 bg-vibrant-coral text-white border-4 border-vibrant-dark rounded-2xl shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:grayscale transition-all cursor-pointer"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
