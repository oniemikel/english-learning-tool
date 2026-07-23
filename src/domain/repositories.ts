import type { Prisma, User, UserSetting, Deck, Word, Card, ReviewLog, DailyStatistic } from '@prisma/client';

export interface Repository<T, CreateInput, UpdateInput> {
  create(data: CreateInput): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: { skip?: number; take?: number }): Promise<T[]>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
}

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserSettingCreateInput = Prisma.UserSettingCreateInput;
export type UserSettingUpdateInput = Prisma.UserSettingUpdateInput;
export type DeckCreateInput = Prisma.DeckCreateInput;
export type DeckUpdateInput = Prisma.DeckUpdateInput;
export type WordCreateInput = Prisma.WordCreateInput;
export type WordUpdateInput = Prisma.WordUpdateInput;
export type CardCreateInput = Prisma.CardCreateInput;
export type CardUpdateInput = Prisma.CardUpdateInput;
export type ReviewLogCreateInput = Prisma.ReviewLogCreateInput;
export type ReviewLogUpdateInput = Prisma.ReviewLogUpdateInput;
export type DailyStatisticCreateInput = Prisma.DailyStatisticCreateInput;
export type DailyStatisticUpdateInput = Prisma.DailyStatisticUpdateInput;

export type IUserRepository = Repository<User, UserCreateInput, UserUpdateInput>;
export type IUserSettingRepository = Repository<UserSetting, UserSettingCreateInput, UserSettingUpdateInput>;
export type IDeckRepository = Repository<Deck, DeckCreateInput, DeckUpdateInput>;
export type IWordRepository = Repository<Word, WordCreateInput, WordUpdateInput>;
export type ICardRepository = Repository<Card, CardCreateInput, CardUpdateInput>;
export type IReviewRepository = Repository<ReviewLog, ReviewLogCreateInput, ReviewLogUpdateInput>;
export type IStatisticRepository = Repository<DailyStatistic, DailyStatisticCreateInput, DailyStatisticUpdateInput>;
