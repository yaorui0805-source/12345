export interface PersonalityConfig {
  extraversion: number;
  rationality: number;
  seriousness: number;
}

export interface LanguageStyleConfig {
  praiseCritical: number;
  abstractLiterary: number;
  coldShowy: number;
}

export interface MemoryItem {
  id: string;
  category: 'interest' | 'value' | 'attitude' | 'relationship';
  content: string;
  source: 'qa' | 'manual';
  createdAt: number;
}

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
}

export interface AvatarConfig {
  personality: PersonalityConfig;
  languageStyle: LanguageStyleConfig;
  tags: string[];
  memories: MemoryItem[];
  douyinImported: boolean;
}

export interface SliderConfig {
  key: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
}

export interface TagCategory {
  id: string;
  name: string;
  icon: string;
  tags: string[];
}
