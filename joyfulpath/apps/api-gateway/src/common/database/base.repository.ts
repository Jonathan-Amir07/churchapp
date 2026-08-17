import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export abstract class BaseRepository<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  async findAll(include?: any): Promise<T[]> {
    return this.model.findMany({
      where: { deletedAt: null },
      include,
    });
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findFirst({
      where: { id, deletedAt: null },
      include,
    });
  }

  async create(data: CreateDto): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    // Soft delete
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
