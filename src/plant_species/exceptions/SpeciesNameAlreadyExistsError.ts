export class SpeciesNameAlreadyExistsError extends Error {
  constructor(speciesName: string) {
    super(`Species with name ${speciesName} already exists`);
  }
}
