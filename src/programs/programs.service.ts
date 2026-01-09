import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProgramEntity } from "./entities/program.entity";
import { CreateProgramDto } from "./dto/create-program.dto";
import { AreaEntity } from "../areas/entities/area.entity";

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programsRepo: Repository<ProgramEntity>,
    @InjectRepository(AreaEntity)
    private readonly areasRepo: Repository<AreaEntity>,
  ) {}

  async findAll(areaId?: string) {
    const where = areaId ? { areaId } : {};
    return this.programsRepo.find({
      where,
      order: { name: "ASC" },
    });
  }

  async create(dto: CreateProgramDto) {
    const areaExists = await this.areasRepo.exists({ where: { id: dto.areaId } });
    if (!areaExists) throw new NotFoundException("Área no existe.");

    // @Index(["areaId","name"], unique) ya protege en DB,
    // pero damos error amigable:
    const exists = await this.programsRepo.exists({
      where: { areaId: dto.areaId, name: dto.name },
    });
    if (exists) throw new ConflictException("Ya existe ese programa en el área.");

    const program = this.programsRepo.create({
      areaId: dto.areaId,
      name: dto.name.trim(),
    });

    return this.programsRepo.save(program);
  }
}
