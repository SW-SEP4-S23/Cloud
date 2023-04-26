import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Datapoint {
  @PrimaryColumn()
  timestamp: string;

  @Column()
  co2: number;

  @Column()
  temperature: number;

  @Column()
  humidity: number;
}
