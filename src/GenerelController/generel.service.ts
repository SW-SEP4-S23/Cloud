import { interval } from "rxjs";
import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";
import { GenerelRepository } from "./generel.repository";

@Injectable()
export class GenerelService {
  constructor(private readonly generelRepository: GenerelRepository) {}

  findAllInterval(interval: IntervalQuery) {
    return "TODO";
  }
}
