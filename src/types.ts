export interface EmojiItem {
  id: string;
  customId: string; // e.g. "EGG-6188", "DIS-102", "DCD-201"
  title: string;
  name: string;
  category: string;
  imageUrl: string;
  isAnimated: boolean;
  source: 'Emoji.gg' | 'Discadia' | 'Discords.com';
  slug?: string;
  submittedBy?: string;
  faves?: number;
  tags?: string[];
}

export interface BotStatus {
  status: 'online' | 'offline' | 'connecting' | 'error';
  ping?: number;
  uptime?: number;
  guildsCount?: number;
  emojisAdded?: number;
  currentToken?: string;
  botName?: string;
  botTag?: string;
  botAvatar?: string | null;
  botId?: string;
  keepAliveActive?: boolean;
  lastHeartbeat?: string;
  errorMessage?: string;
}

export interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  emojiCount?: number;
  maxEmojis?: number;
  canManageEmojis?: boolean;
}

export interface KeepAliveLog {
  id: string;
  timestamp: string;
  status: 'ok' | 'reconnected' | 'ping';
  botPingMs?: number | null;
  memoryMb?: number;
  activeGuilds?: number;
}
