export type ActiveTab =
  | "dashboard"
  | "script"
  | "image"
  | "hook"
  | "story"
  | "caption"
  | "hashtag"
  | "title"
  | "description"
  | "prompt"
  | "history"
  | "favorites"
  | "settings"
  | "support"
  | "pricing";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  memberSince: string;
  plan: "Free" | "Pro" | "Enterprise";
}

export interface HistoryItem {
  id: string;
  tool: string;
  title: string;
  timestamp: string;
  inputs: any;
  output: any;
  isFavorite: boolean;
}

export type PlatformType = "YouTube" | "Instagram" | "Facebook" | "X" | "LinkedIn";
export type LanguageType = "Hindi" | "English" | "Hinglish";
export type ToneType = "Professional" | "Casual" | "Witty" | "Bold" | "Excited" | "Informative" | "Dramatic";
export type LengthType = "Short" | "Medium" | "Long";

export interface AppSettings {
  theme: "dark" | "light";
  language: string;
  notifications: boolean;
  autoSave: boolean;
}
