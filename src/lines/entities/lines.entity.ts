import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
} from "typeorm";
import { ProgramEntity } from "../../programs/entities/program.entity";
import { UserEntity } from "src/users/entities/user.entity";

@Entity("lines")
@Index(["programId", "name"], { unique: true })
export class LinesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "program_id", type: "uuid" })
  programId: string;

  @ManyToOne(() => ProgramEntity, (p) => p.lineales, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "program_id" })
  program: ProgramEntity;

  @Column({ type: "varchar", length: 220 })
  name: string;

  // Docentes que dictan esta línea/materia
  @ManyToMany(() => UserEntity, (u) => u.lineales)
  teachers: UserEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
