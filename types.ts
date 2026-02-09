
export interface Scene {
  id: string;
  title: string;
  description: string;
  dialogue: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'scene_suggestion' | 'image_gen';
  metadata?: any;
}

export enum WorkspaceView {
  STORYBOARD = 'STORYBOARD',
  EDITOR = 'EDITOR',
  PLAYBACK = 'PLAYBACK'
}
