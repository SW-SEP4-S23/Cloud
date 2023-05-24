export class PlantNotFoundError extends Error {
  constructor(plantId: number) {
    super(`Plant with id ${plantId} not found`);
  }
}
