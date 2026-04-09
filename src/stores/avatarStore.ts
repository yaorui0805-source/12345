import { create } from 'zustand';
import type { 
  PersonalityConfig, 
  LanguageStyleConfig, 
  MemoryItem, 
  Message,
  AvatarConfig 
} from '@/types/avatar';
import { DEFAULT_QUESTIONS } from '@/constants/tags';

interface AvatarStore {
  personality: PersonalityConfig;
  languageStyle: LanguageStyleConfig;
  selectedTags: string[];
  customTags: string[];
  memories: MemoryItem[];
  messages: Message[];
  currentQuestionIndex: number;
  isQAActive: boolean;
  douyinImported: boolean;

  updatePersonality: (key: keyof PersonalityConfig, value: number) => void;
  updateLanguageStyle: (key: keyof LanguageStyleConfig, value: number) => void;
  toggleTag: (tag: string) => void;
  addCustomTag: (tag: string) => void;
  removeCustomTag: (tag: string) => void;
  addMessage: (message: Message) => void;
  addMemory: (memory: MemoryItem) => void;
  removeMemory: (id: string) => void;
  startQA: () => void;
  endQA: () => void;
  generateNextQuestion: () => string;
  importFromDouyin: () => void;
  reset: () => void;
  getAvatarConfig: () => AvatarConfig;
}

const defaultPersonality: PersonalityConfig = {
  extraversion: 50,
  rationality: 50,
  seriousness: 50,
};

const defaultLanguageStyle: LanguageStyleConfig = {
  praiseCritical: 50,
  abstractLiterary: 50,
  coldShowy: 50,
};

export const useAvatarStore = create<AvatarStore>((set, get) => ({
  personality: { ...defaultPersonality },
  languageStyle: { ...defaultLanguageStyle },
  selectedTags: [],
  customTags: [],
  memories: [],
  messages: [],
  currentQuestionIndex: 0,
  isQAActive: false,
  douyinImported: false,

  updatePersonality: (key, value) => {
    set((state) => ({
      personality: { ...state.personality, [key]: value }
    }));
  },

  updateLanguageStyle: (key, value) => {
    set((state) => ({
      languageStyle: { ...state.languageStyle, [key]: value }
    }));
  },

  toggleTag: (tag) => {
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag]
    }));
  },

  addCustomTag: (tag) => {
    set((state) => ({
      customTags: state.customTags.includes(tag)
        ? state.customTags
        : [...state.customTags, tag],
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags
        : [...state.selectedTags, tag]
    }));
  },

  removeCustomTag: (tag) => {
    set((state) => ({
      customTags: state.customTags.filter((t) => t !== tag),
      selectedTags: state.selectedTags.filter((t) => t !== tag)
    }));
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  addMemory: (memory) => {
    set((state) => ({
      memories: [...state.memories, memory]
    }));
  },

  removeMemory: (id) => {
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id)
    }));
  },

  startQA: () => {
    const firstQuestion: Message = {
      id: Date.now().toString(),
      role: 'ai',
      content: DEFAULT_QUESTIONS[0],
      timestamp: Date.now(),
    };
    set({
      isQAActive: true,
      messages: [firstQuestion],
      currentQuestionIndex: 1,
    });
  },

  endQA: () => {
    set({ isQAActive: false });
  },

  generateNextQuestion: () => {
    const state = get();
    const index = state.currentQuestionIndex % DEFAULT_QUESTIONS.length;
    const question = DEFAULT_QUESTIONS[index];
    
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1
    }));
    
    return question;
  },

  importFromDouyin: () => {
    const mockImportedData = {
      personality: {
        extraversion: 70,
        rationality: 40,
        seriousness: 30,
      },
      languageStyle: {
        praiseCritical: 60,
        abstractLiterary: 45,
        coldShowy: 70,
      },
      selectedTags: ['二次元', '游戏', '社牛'],
      douyinImported: true,
    };
    
    set({
      ...mockImportedData,
      memories: [],
      messages: [],
      currentQuestionIndex: 0,
      isQAActive: false,
    });
  },

  reset: () => {
    set({
      personality: { ...defaultPersonality },
      languageStyle: { ...defaultLanguageStyle },
      selectedTags: [],
      customTags: [],
      memories: [],
      messages: [],
      currentQuestionIndex: 0,
      isQAActive: false,
      douyinImported: false,
    });
  },

  getAvatarConfig: () => {
    const state = get();
    return {
      personality: state.personality,
      languageStyle: state.languageStyle,
      tags: state.selectedTags,
      memories: state.memories,
      douyinImported: state.douyinImported,
    };
  },
}));
