import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Datapoint {
  @PrimaryColumn()
  timestamp: string;

  @Column()
  Co2: number;

  @Column()
  temp: number;

  @Column()
  humidity: number;
}