
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface SidebarProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <aside className="w-[420px] border-l border-zinc-200 bg-white flex flex-col h-full shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-20">
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
        <h2 className="font-bold text-zinc-900 text-lg flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-[0_0_12px_rgba(124,58,237,0.4)]"></span>
          Aura 剧场助手
        </h2>
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <i className="fa-solid fa-ellipsis-h"></i>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50/20">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-violet-100 shadow-sm">
              <i className="fa-solid fa-masks-theater text-violet-500 text-3xl"></i>
            </div>
            <h3 className="text-zinc-900 font-bold text-lg mb-2">舞台已就绪</h3>
            <p className="text-zinc-500 text-sm max-w-[240px] mx-auto leading-relaxed">
              告诉我你的剧作想法，或者让我为你生成一个全新的视觉创意。
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[88%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-violet-600 text-white rounded-tr-none' 
                : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none font-medium'
            }`}>
              {msg.content}
            </div>
            <span className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-widest px-1">
              {msg.role === 'user' ? '导演' : '助手'}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 rounded-tl-none shadow-sm w-48">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-violet-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-violet-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-violet-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-zinc-100">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="描述一个场景或提出问题..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-[15px] focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 pr-14 transition-all text-zinc-900 placeholder-zinc-400"
          />
          <button 
            disabled={isLoading}
            className="absolute right-3 top-2 bottom-2 px-4 bg-zinc-900 hover:bg-violet-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30 shadow-md"
          >
            <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-arrow-up'}`}></i>
          </button>
        </form>
        <div className="flex justify-center gap-4 mt-4">
           <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">剧场模式</span>
           <span className="text-[11px] text-zinc-300">|</span>
           <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">由 GEMINI 提供动力</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
