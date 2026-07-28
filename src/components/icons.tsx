// src/components/icons.tsx
import {
  Book,
  Bookmark,
  CheckCircle2,
  LayoutDashboard,
  LucideProps,
  Rocket,
  Settings,
  Target,
  TrendingUp,
  Flame,
  Zap,
  Clock,
  Check,
  MoreHorizontal,
  Plus,
  ChevronRight,
  Bell,
  Search,
  ArrowRight,
  Star,
  X,
} from 'lucide-react';

export const Icons = {
  Dashboard: LayoutDashboard,
  Decks: Book,
  Vocabulary: Rocket,
  Progress: TrendingUp,
  Goals: Target,
  Bookmarks: Bookmark,
  Settings: Settings,
  Streak: Flame,
  Accuracy: CheckCircle2,
  StudyTime: Clock,
  WordsLearned: Zap,
  Words: Rocket,
  Review: CheckCircle2,
  New: Zap,
  Check: Check,
  MoreHorizontal: MoreHorizontal,
  Plus: Plus,
  ChevronRight: ChevronRight,
  Bell: Bell,
  Search: Search,
  ArrowRight: ArrowRight,
  Star: Star,
  X: X,
};

export type Icon = keyof typeof Icons;

export const Icon = ({ name, ...props }: { name: Icon } & LucideProps) => {
  const LucideIcon = Icons[name];
  return <LucideIcon {...props} />;
};
