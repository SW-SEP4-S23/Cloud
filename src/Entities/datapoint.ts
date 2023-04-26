import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Datapoint {
  @PrimaryColumn()
  timestamp: string;

  @Column()
  co2: number;

  @Column()
  temp: number;

  @Column()
  humidity: number;
}