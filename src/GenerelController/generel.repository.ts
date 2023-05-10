import { interval } from "rxjs";
import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GenerelRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAllInterval(interval: IntervalQuery) {
    return "TODO DATA";
  }
}
