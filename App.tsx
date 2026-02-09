
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { Scene, Message, WorkspaceView } from './types';
import { generateSceneContent, generateSceneImage, chatWithAssistant } from './services/geminiService';

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [view, setView] = useState<WorkspaceView>(WorkspaceView.STORYBOARD);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMsg: Message = { id: uuidv4(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsAssistantLoading(true);

    try {
      const isRequestingScene = content.includes('生成') || content.includes('场景') || content.includes('创建') || content.includes('写一个');
      
      const assistantResponse = await chatWithAssistant(
        messages.map(m => ({ role: m.role, parts: m.content })),
        content
      );

      const assistantMsg: Message = { 
        id: uuidv4(), 
        role: 'assistant', 
        content: assistantResponse || "抱歉，我无法处理该请求。" 
      };
      setMessages(prev => [...prev, assistantMsg]);

      if (isRequestingScene) {
        handleAddNewScene(content);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: uuidv4(), 
        role: 'assistant', 
        content: "连接 Aura 服务时出错。请检查您的 API 配置。" 
      }]);
    } finally {
      setIsAssistantLoading(false);
    }
  }, [messages]);

  const handleAddNewScene = async (promptHint?: string) => {
    setIsGeneratingScene(true);
    const sceneId = uuidv4();
    
    const newScene: Scene = {
      id: sceneId,
      title: "正在构思场景...",
      description: "正在构建视觉氛围与叙事结构...",
      dialogue: "...",
      isGenerating: true
    };
    
    setScenes(prev => [...prev, newScene]);

    try {
      const jsonStr = await generateSceneContent(promptHint || "一段充满戏剧冲突的新场景。");
      const sceneData = JSON.parse(jsonStr);

      setScenes(prev => prev.map(s => s.id === sceneId ? {
        ...s,
        title: sceneData.title,
        description: sceneData.description,
        dialogue: sceneData.dialogue,
      } : s));

      const imageUrl = await generateSceneImage(sceneData.description);
      
      setScenes(prev => prev.map(s => s.id === sceneId ? {
        ...s,
        imageUrl,
        isGenerating: false
      } : s));
    } catch (error) {
      console.error("Scene generation error:", error);
      setScenes(prev => prev.filter(s => s.id !== sceneId));
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: "在创建场景时遇到了点小麻烦，让我们换个思路吧。"
      }]);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  const handleSelectScene = (id: string) => {
    console.log("Selected scene:", id);
  };

  return (
    <div className="flex h-screen w-full bg-white text-zinc-900 overflow-hidden font-sans">
      {/* 1. 左侧导航栏 - 兄弟节点 1 */}
      <nav className="w-16 border-r border-zinc-200 flex flex-col items-center py-6 gap-6 bg-zinc-50/50 z-30">
        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 cursor-pointer">
          <i className="fa-solid fa-crown text-white text-xl"></i>
        </div>
        <div className="flex-1 space-y-4">
           <button title="分镜" className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white hover:text-violet-600 transition-all hover:shadow-sm border border-transparent hover:border-zinc-200">
              <i className="fa-solid fa-theater-masks"></i>
           </button>
           <button title="资产" className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white hover:text-violet-600 transition-all hover:shadow-sm border border-transparent hover:border-zinc-200">
              <i className="fa-solid fa-layer-group"></i>
           </button>
           <button title="影片" className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white hover:text-violet-600 transition-all hover:shadow-sm border border-transparent hover:border-zinc-200">
              <i className="fa-solid fa-clapperboard"></i>
           </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center overflow-hidden">
           <i className="fa-solid fa-user text-[10px] text-zinc-500"></i>
        </div>
      </nav>

      {/* 2. 中间画布区域 - 兄弟节点 2 */}
      <Canvas 
        scenes={scenes} 
        onSelectScene={handleSelectScene} 
        onAddScene={() => handleAddNewScene()}
        isGenerating={isGeneratingScene}
      />

      {/* 3. 右侧助手面板 - 兄弟节点 3 */}
      <Sidebar 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isLoading={isAssistantLoading} 
      />
    </div>
  );
};

export default App;
