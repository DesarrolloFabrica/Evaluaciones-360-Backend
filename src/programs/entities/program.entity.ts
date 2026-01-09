import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { AreaEntity } from "../../areas/entities/area.entity";
import { LinesEntity } from "src/lines/entities/lines.entity";

@Entity("programs")
@Index(["areaId", "name"], { unique: true })
export class ProgramEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "area_id", type: "uuid" })
  areaId: string;

  @ManyToOne(() => AreaEntity, (a) => a.programs, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "area_id" })
  area: AreaEntity;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @OneToMany(() => LinesEntity, (l) => l.program)
  lineales: LinesEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
