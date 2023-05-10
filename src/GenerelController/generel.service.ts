import { interval } from "rxjs";
import { Injectable } from "@nestjs/common";
import { IntervalQuery } from "../shared/interval-query";

@Injectable()
export class GenerelService {
  constructor() {}

  findAllInterval(interval: IntervalQuery) {
    return "TODO";
  }
}
