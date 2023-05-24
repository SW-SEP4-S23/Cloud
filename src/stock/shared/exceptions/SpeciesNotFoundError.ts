export class SpeciesNotFoundError extends Error {
  constructor(speciesName: string) {
    super(`Species with name ${speciesName} not found`);
  }
}
