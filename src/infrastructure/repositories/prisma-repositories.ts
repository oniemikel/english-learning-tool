import type { PrismaClient } from '@prisma/client';
import { BasePrismaRepository } from './base-prisma-repository';
import type {
  IUserRepository, IUserSettingRepository, IDeckRepository, IWordRepository,
  ICardRepository, IReviewRepository, IStatisticRepository,
  UserCreateInput, UserUpdateInput, UserSettingCreateInput, UserSettingUpdateInput,
  DeckCreateInput, DeckUpdateInput, WordCreateInput, WordUpdateInput,
  CardCreateInput, CardUpdateInput, ReviewLogCreateInput, ReviewLogUpdateInput,
  DailyStatisticCreateInput, DailyStatisticUpdateInput,
} from '@/domain/repositories';

export class UserRepository extends BasePrismaRepository<import('@prisma/client').User, UserCreateInput, UserUpdateInput> implements IUserRepository {
  protected get delegate() { return this.db.user; }
}
export class UserSettingRepository extends BasePrismaRepository<import('@prisma/client').UserSetting, UserSettingCreateInput, UserSettingUpdateInput> implements IUserSettingRepository {
  protected readonly softDelete = false;
  protected get delegate() { return this.db.userSetting; }
  override delete(id: string) { return this.db.userSetting.delete({ where: { id } }); }
}
export class DeckRepository extends BasePrismaRepository<import('@prisma/client').Deck, DeckCreateInput, DeckUpdateInput> implements IDeckRepository {
  protected get delegate() { return this.db.deck; }
}
export class WordRepository extends BasePrismaRepository<import('@prisma/client').Word, WordCreateInput, WordUpdateInput> implements IWordRepository {
  protected get delegate() { return this.db.word; }
}
export class CardRepository extends BasePrismaRepository<import('@prisma/client').Card, CardCreateInput, CardUpdateInput> implements ICardRepository {
  protected get delegate() { return this.db.card; }
}
export class ReviewRepository extends BasePrismaRepository<import('@prisma/client').ReviewLog, ReviewLogCreateInput, ReviewLogUpdateInput> implements IReviewRepository {
  protected get delegate() { return this.db.reviewLog; }
}
export class StatisticRepository extends BasePrismaRepository<import('@prisma/client').DailyStatistic, DailyStatisticCreateInput, DailyStatisticUpdateInput> implements IStatisticRepository {
  protected get delegate() { return this.db.dailyStatistic; }
}

export const repositories = (db: PrismaClient) => ({
  users: new UserRepository(db),
  userSettings: new UserSettingRepository(db),
  decks: new DeckRepository(db),
  words: new WordRepository(db),
  cards: new CardRepository(db),
  reviews: new ReviewRepository(db),
  statistics: new StatisticRepository(db),
});
