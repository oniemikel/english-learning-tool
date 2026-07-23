import type {
  Card, DailyStatistic, Deck, ReviewLog, User, UserSetting, Word,
} from '@prisma/client';

export type UserEntity = User;
export type UserSettingEntity = UserSetting;
export type DeckEntity = Deck;
export type WordEntity = Word;
export type CardEntity = Card;
export type ReviewLogEntity = ReviewLog;
export type DailyStatisticEntity = DailyStatistic;
