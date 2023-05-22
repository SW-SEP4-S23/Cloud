import { Injectable } from "@nestjs/common";

@Injectable()
export class SpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}
}
