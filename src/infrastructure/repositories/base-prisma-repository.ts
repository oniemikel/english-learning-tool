import type { PrismaClient } from '@prisma/client';
import { toRepositoryError } from './repository-error';

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

  async create(data: CreateInput) {
    try { return await this.delegate.create({ data }); } catch (error) { throw toRepositoryError(error); }
  }
  async findById(id: string) {
    try { return await this.delegate.findFirst({ where: this.where({ id }) }); } catch (error) { throw toRepositoryError(error); }
  }
  findAll({ skip = 0, take = 20 }: { skip?: number; take?: number } = {}) {
    return this.delegate.findMany({ where: this.where(), skip, take }).catch((error) => { throw toRepositoryError(error); });
  }
  async update(id: string, data: UpdateInput) {
    try { return await this.delegate.update({ where: { id }, data }); } catch (error) { throw toRepositoryError(error); }
  }
  async delete(id: string) {
    try { return await this.delegate.update({ where: { id }, data: { deletedAt: new Date() } as UpdateInput }); } catch (error) { throw toRepositoryError(error); }
  }

  private where(where: Record<string, unknown> = {}) {
    return this.softDelete ? { ...where, deletedAt: null } : where;
  }
}
