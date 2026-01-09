import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLinealDto } from "./dto/create-lineal.dto";
import { ProgramEntity } from "../programs/entities/program.entity";
import { LinesEntity } from "./entities/lines.entity";

@Injectable()
export class LinesService {
  constructor(
    @InjectRepository(LinesEntity)
    private readonly linealesRepo: Repository<LinesEntity>,
    @InjectRepository(ProgramEntity)
    private readonly programsRepo: Repository<ProgramEntity>,
  ) {}

  async findAll(programId?: string) {
    const where = programId ? { programId } : {};
    return this.linealesRepo.find({
      where,
      order: { name: "ASC" },
    });
  }

  async create(dto: CreateLinealDto) {
    const programExists = await this.programsRepo.exists({
      where: { id: dto.programId },
    });
    if (!programExists) throw new NotFoundException("Programa no existe.");

    const exists = await this.linealesRepo.exists({
      where: { programId: dto.programId, name: dto.name },
    });
    if (exists) throw new ConflictException("Ya existe esa línea en el programa.");

    const lineal = this.linealesRepo.create({
      programId: dto.programId,
      name: dto.name.trim(),
    });

    return this.linealesRepo.save(lineal);
  }
}
