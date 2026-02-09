
import React from 'react';
import { Scene } from '../types';

interface CanvasProps {
  scenes: Scene[];
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  isGenerating: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ scenes, onSelectScene, onAddScene, isGenerating }) => {
  return (
    <main className="flex-1 bg-zinc-50 overflow-y-auto relative p-10 h-full">
      <div className="max-w-6xl mx-auto pb-24">
        <header className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-4xl font-serif italic text-zinc-900 tracking-tight">剧作分镜画布</h1>
            <p className="text-zinc-500 text-base mt-2 font-medium">逐帧构思、导演并可视化你的剧场表演。</p>
          </div>
          <button 
            onClick={onAddScene}
            disabled={isGenerating}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all flex items-center gap-3 shadow-xl shadow-violet-100"
          >
            <i className={`fa-solid ${isGenerating ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
            创建新场景
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {scenes.map((scene, index) => (
            <div 
              key={scene.id}
              onClick={() => onSelectScene(scene.id)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-violet-300 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                {scene.imageUrl ? (
                  <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 bg-[radial-gradient(circle_at_center,_#fafafa_0%,_#f4f4f5_100%)]">
                    {scene.isGenerating ? (
                       <i className="fa-solid fa-wand-magic-sparkles animate-pulse text-3xl text-violet-500"></i>
                    ) : (
                       <i className="fa-solid fa-image text-4xl opacity-30"></i>
                    )}
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[11px] font-bold text-zinc-900 uppercase tracking-widest border border-zinc-200/50 shadow-sm">
                  场次 {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-zinc-900 text-xl line-clamp-1 mb-2 tracking-tight">{scene.title}</h3>
                <p className="text-zinc-600 text-sm line-clamp-3 leading-relaxed mb-4">
                  {scene.description}
                </p>
                <div className="mt-2 pt-5 border-t border-zinc-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center text-[11px] text-violet-600 border border-violet-100">
                        <i className="fa-solid fa-user"></i>
                     </div>
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">角色 A</span>
                   </div>
                   <span className="text-[10px] text-zinc-300 font-mono font-bold">编号：{scene.id.slice(0, 6)}</span>
                </div>
              </div>

              {scene.isGenerating && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] flex items-center justify-center">
                   <div className="bg-white px-6 py-3 rounded-full border border-zinc-200 flex items-center gap-3 shadow-2xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping"></div>
                      <span className="text-sm font-black text-zinc-900">导演构思中...</span>
                   </div>
                </div>
              )}
            </div>
          ))}

          {scenes.length === 0 && !isGenerating && (
            <div 
              onClick={onAddScene}
              className="aspect-[4/3] border-3 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center group hover:border-violet-300 hover:bg-white transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-violet-50 transition-all">
                <i className="fa-solid fa-plus text-zinc-400 group-hover:text-violet-500 text-xl"></i>
              </div>
              <p className="text-zinc-500 text-base font-bold group-hover:text-zinc-900">开启你的艺术创作</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 悬浮导航 */}
      <div className="fixed bottom-10 left-[calc(50%-210px)] -translate-x-1/2 bg-white/95 backdrop-blur-2xl border border-zinc-200 px-8 py-4 rounded-3xl flex items-center gap-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] z-50">
        <button className="text-violet-600 flex flex-col items-center gap-1.5 group">
          <i className="fa-solid fa-grid-2 text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-widest">分镜画布</span>
        </button>
        <button className="text-zinc-400 hover:text-zinc-900 flex flex-col items-center gap-1.5 group transition-all">
          <i className="fa-solid fa-pen-nib text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-widest">剧本撰写</span>
        </button>
        <div className="w-px h-8 bg-zinc-200"></div>
        <button className="text-zinc-400 hover:text-zinc-900 flex flex-col items-center gap-1.5 group transition-all">
          <i className="fa-solid fa-play text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-widest">演出预览</span>
        </button>
        <button className="text-zinc-400 hover:text-zinc-900 flex flex-col items-center gap-1.5 group transition-all">
          <i className="fa-solid fa-gear text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-widest">配置选项</span>
        </button>
      </div>
    </main>
  );
};

export default Canvas;
