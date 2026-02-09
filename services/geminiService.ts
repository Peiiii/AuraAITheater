
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateSceneContent = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `你是一位世界级的编剧和剧场导演。
      请根据提示生成一个剧场场景。
      生成内容必须包含：一个吸引人的标题、一段充满画面感的视觉描述、以及一段充满张力的核心对白。
      请务必使用中文生成所有内容。
      返回格式必须为合法的JSON，包含以下键：title (标题), description (描述), dialogue (对白)。`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          dialogue: { type: Type.STRING },
        },
        required: ["title", "description", "dialogue"]
      }
    }
  });
  return response.text;
};

export const generateSceneImage = async (prompt: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `电影质感的戏剧美术概念图：${prompt}。史诗级光影，舞台感，8k分辨率，艺术风格，极其精致。` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

export const chatWithAssistant = async (history: { role: string; parts: string }[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "你是 Aura，一个人工智能剧场创意助手。你擅长协助用户构思、撰写并可视化极具张力的戏剧作品。你充满智慧、富有创意且乐于助人。请全程使用中文与用户沟通。"
    }
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};
