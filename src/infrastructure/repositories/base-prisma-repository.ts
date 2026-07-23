import type { PrismaClient } from '@prisma/client';

export abstract class BasePrismaRepository<T, CreateInput, UpdateInput> {
  protected readonly softDelete: boolean = true;
  constructor(protected readonly db: PrismaClient) {}

  protected abstract get delegate(): {
    create(args: { data: CreateInput }): Promise<T>;
    findFirst(args: { where: Record<string, unknown> }): Promise<T | null>;
    findMany(args: { where: Record<string, unknown>; skip: number; take: number }): Promise<T[]>;
    update(args: { where: { id: string }; data: UpdateInput }): Promise<T>;
    updateMany(args: { where: { id: string; deletedAt: null }; data: Record<string, unknown> }): Promise<{ count: number }>;
  };

  create(data: CreateInput) { return this.delegate.create({ data }); }
  findById(id: string) { return this.delegate.findFirst({ where: this.where({ id }) }); }
  findAll({ skip = 0, take = 20 }: { skip?: number; take?: number } = {}) {
    return this.delegate.findMany({ where: this.where(), skip, take });
  }
  update(id: string, data: UpdateInput) { return this.delegate.update({ where: { id }, data }); }
  delete(id: string) {
    return this.delegate.update({ where: { id }, data: { deletedAt: new Date() } as UpdateInput });
  }

  private where(where: Record<string, unknown> = {}) {
    return this.softDelete ? { ...where, deletedAt: null } : where;
  }
}
