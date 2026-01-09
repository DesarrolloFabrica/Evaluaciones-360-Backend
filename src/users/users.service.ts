import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { UserEntity, UserRole } from "./entities/user.entity";
import { AreaEntity } from "../areas/entities/area.entity";
import { ProgramEntity } from "../programs/entities/program.entity";
import { LinesEntity } from "../lines/entities/lines.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(AreaEntity)
    private readonly areasRepo: Repository<AreaEntity>,
    @InjectRepository(ProgramEntity)
    private readonly programsRepo: Repository<ProgramEntity>,
    @InjectRepository(LinesEntity)
    private readonly linealesRepo: Repository<LinesEntity>,
  ) {}

  // ---------- helpers ----------
  private async ensureAreaExists(areaId: string) {
    const ok = await this.areasRepo.exists({ where: { id: areaId } });
    if (!ok) throw new NotFoundException("Área no existe.");
  }

  private async ensureProgramExists(programId: string) {
    const ok = await this.programsRepo.exists({ where: { id: programId } });
    if (!ok) throw new NotFoundException("Programa no existe.");
  }

  private validateScopeOrThrow(role: UserRole, areaId?: string | null, programId?: string | null) {
    const a = areaId ?? null;
    const p = programId ?? null;

    if (role === UserRole.ADMIN || role === UserRole.DIRECTOR) {
      if (a !== null || p !== null) {
        throw new BadRequestException("ADMIN/DIRECTOR no deben tener área ni programa.");
      }
      return;
    }

    if (role === UserRole.COORDINADOR) {
      if (!a) throw new BadRequestException("COORDINADOR requiere areaId.");
      if (p !== null) throw new BadRequestException("COORDINADOR no debe tener programId.");
      return;
    }

    if (role === UserRole.LIDER) {
      if (!a) throw new BadRequestException("LIDER requiere areaId.");
      if (!p) throw new BadRequestException("LIDER requiere programId.");
      return;
    }

    if (role === UserRole.DOCENTE) {
      if (!a) throw new BadRequestException("DOCENTE requiere areaId.");
      if (!p) throw new BadRequestException("DOCENTE requiere programId.");
      return;
    }

    throw new BadRequestException("Rol inválido.");
  }

  // ---------- queries ----------
  async list(filters: {
    role?: UserRole;
    areaId?: string;
    programId?: string;
    isActive?: boolean;
  }) {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.areaId) where.areaId = filters.areaId;
    if (filters.programId) where.programId = filters.programId;
    if (typeof filters.isActive === "boolean") where.isActive = filters.isActive;

    return this.usersRepo.find({
      where,
      order: { fullName: "ASC" },
      relations: ["area", "program", "lineales"],
    });
  }

  async getById(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ["area", "program", "lineales"],
    });
    if (!user) throw new NotFoundException("Usuario no existe.");
    return user;
  }

  // ---------- create/update ----------
  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    const exists = await this.usersRepo.exists({ where: { email } });
    if (exists) throw new ConflictException("Ya existe un usuario con ese email.");

    this.validateScopeOrThrow(dto.role, dto.areaId ?? null, dto.programId ?? null);

    if (dto.areaId) await this.ensureAreaExists(dto.areaId);
    if (dto.programId) await this.ensureProgramExists(dto.programId);

    const user = this.usersRepo.create({
      email,
      fullName: dto.fullName.trim(),
      role: dto.role,
      isActive: dto.isActive ?? true,
      areaId: dto.areaId ?? null,
      programId: dto.programId ?? null,
    });

    // si es docente y vienen lineales, los cargamos
    if (dto.role === UserRole.DOCENTE && dto.linealIds?.length) {
      const lineales = await this.linealesRepo.find({
        where: { id: In(dto.linealIds) },
      });

      if (lineales.length !== dto.linealIds.length) {
        throw new BadRequestException("Uno o más linealIds no existen.");
      }

      // opcional: validar que pertenezcan al mismo programId del docente
      const wrong = lineales.find((l) => l.programId !== user.programId);
      if (wrong) {
        throw new BadRequestException("Hay lineales que no pertenecen al programId del docente.");
      }

      user.lineales = lineales;
    }

    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ["lineales"],
    });
    if (!user) throw new NotFoundException("Usuario no existe.");

    const nextRole = dto.role ?? user.role;
    const nextAreaId = dto.areaId !== undefined ? dto.areaId : user.areaId;
    const nextProgramId = dto.programId !== undefined ? dto.programId : user.programId;

    this.validateScopeOrThrow(nextRole, nextAreaId, nextProgramId);

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      const exists = await this.usersRepo.exists({ where: { email } });
      if (exists && email !== user.email) throw new ConflictException("Ese email ya está en uso.");
      user.email = email;
    }

    if (dto.fullName) user.fullName = dto.fullName.trim();
    if (dto.isActive !== undefined) user.isActive = dto.isActive;

    user.role = nextRole;
    user.areaId = (nextAreaId ?? null) as any;
    user.programId = (nextProgramId ?? null) as any;

    // Si deja de ser DOCENTE, limpiamos lineales
    if (user.role !== UserRole.DOCENTE && user.lineales?.length) {
      user.lineales = [];
    }

    return this.usersRepo.save(user);
  }

  // ---------- docente: set lineales ----------
  async setTeacherLineales(userId: string, linealIds: string[]) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ["lineales"],
    });
    if (!user) throw new NotFoundException("Usuario no existe.");

    if (user.role !== UserRole.DOCENTE) {
      throw new BadRequestException("Solo DOCENTE puede tener lineales.");
    }

    const uniqueIds = Array.from(new Set(linealIds));
    const lineales = uniqueIds.length
      ? await this.linealesRepo.find({ where: { id: In(uniqueIds) } })
      : [];

    if (lineales.length !== uniqueIds.length) {
      throw new BadRequestException("Uno o más linealIds no existen.");
    }

    // validar que todas pertenezcan al program del docente
    const wrong = lineales.find((l) => l.programId !== user.programId);
    if (wrong) {
      throw new BadRequestException("Hay lineales que no pertenecen al programId del docente.");
    }

    user.lineales = lineales;
    return this.usersRepo.save(user);
  }
}
