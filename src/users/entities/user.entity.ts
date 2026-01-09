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
  JoinTable,
} from "typeorm";
import { AreaEntity } from "../../areas/entities/area.entity";
import { ProgramEntity } from "../../programs/entities/program.entity";
import { LinesEntity } from "src/lines/entities/lines.entity";

export enum UserRole {
  ADMIN = "ADMIN",
  DIRECTOR = "DIRECTOR",
  COORDINADOR = "COORDINADOR",
  LIDER = "LIDER",
  DOCENTE = "DOCENTE",
}

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 220 })
  email: string;

  @Column({ name: "full_name", type: "varchar", length: 220 })
  fullName: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  // Scope (según rol)
  @Index()
  @Column({ name: "area_id", type: "uuid", nullable: true })
  areaId: string | null;

  @ManyToOne(() => AreaEntity, { nullable: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "area_id" })
  area?: AreaEntity | null;

  @Index()
  @Column({ name: "program_id", type: "uuid", nullable: true })
  programId: string | null;

  @ManyToOne(() => ProgramEntity, { nullable: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "program_id" })
  program?: ProgramEntity | null;

  // Auth (lo mínimo para empezar; se puede ajustar luego)
  @Column({ name: "google_sub", type: "varchar", length: 255, nullable: true })
  googleSub?: string | null;

  @Column({ name: "password_hash", type: "text", nullable: true })
  passwordHash?: string | null;

  @Column({ name: "must_reset_password", type: "boolean", default: false })
  mustResetPassword: boolean;

  @Column({ name: "password_updated_at", type: "timestamptz", nullable: true })
  passwordUpdatedAt?: Date | null;

  // Lineales (solo aplica a DOCENTE): many-to-many por tabla puente
  @ManyToMany(() => LinesEntity, (l) => l.teachers, { cascade: false })
  @JoinTable({
    name: "teacher_lineales",
    joinColumn: { name: "teacher_user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "lineal_id", referencedColumnName: "id" },
  })
  lineales: LinesEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
