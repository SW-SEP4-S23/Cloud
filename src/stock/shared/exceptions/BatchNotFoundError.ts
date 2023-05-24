export class BatchNotFoundError extends Error {
  constructor(batchId: number) {
    super(`Batch with id ${batchId} not found`);
  }
}
