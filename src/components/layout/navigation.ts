import { BarChart3, BookMarked, Clock3, Globe2, Home, Settings2, Sparkles, SquarePlay, Table2 } from 'lucide-react';

export const navigation = [
  { href: '/dashboard', label: 'ダッシュボード', icon: Home },
  { href: '/study', label: '学習開始', icon: SquarePlay },
  { href: '/decks', label: 'デッキ', icon: BookMarked },
  { href: '/words', label: '単語', icon: Table2 },
  { href: '/public-decks', label: '公開デッキ', icon: Globe2 },
  { href: '/history', label: '履歴', icon: Clock3 },
  { href: '/statistics', label: '統計', icon: BarChart3 },
  { href: '/settings', label: '設定', icon: Settings2 },
] as const;

export const mobileNavigation = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: Sparkles },
  { href: '/decks', label: 'Decks', icon: BookMarked },
  { href: '/words', label: 'Words', icon: Table2 },
  { href: '/settings', label: 'Settings', icon: Settings2 },
] as const;
