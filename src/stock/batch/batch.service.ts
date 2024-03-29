import { Injectable } from "@nestjs/common";
import {
  IntervalQuery,
  validate,
  isDefined,
} from "../../shared/dto/interval-query";
import { BatchRepository, HarvestedCondition } from "./batch.repository";
import { CreateBatch } from "./dto/create-batch";
import { PatchHarvestDate } from "./dto/patch-batch";
import { IsHarvested } from "./dto/query-harvested";

@Injectable()
export class BatchService {
  constructor(private readonly batchRepository: BatchRepository) {}

  createBatch(createBatch: CreateBatch) {
    return this.batchRepository.createBatch(createBatch);
  }

  updateBatch(id: number, harvestDate: PatchHarvestDate) {
    return this.batchRepository.updateBatch(id, harvestDate);
  }

  getBatch(interval: IntervalQuery, harvested: IsHarvested) {
    let harvestedCondition: HarvestedCondition = undefined;

    if (harvested.isHarvested)
      harvestedCondition = { harvestDate: { not: null } };
    if (harvested.isHarvested === false)
      harvestedCondition = { harvestDate: null };

    if (!isDefined(interval))
      return this.batchRepository.findAll(harvestedCondition);

    validate(interval);
    return this.batchRepository.findAllInterval(interval, harvestedCondition);
  }

  findOne(id: number) {
    return this.batchRepository.findOne(id);
  }
}
