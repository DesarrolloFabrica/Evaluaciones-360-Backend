import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AreaEntity } from "./entities/area.entity";
import { CreateAreaDto } from "./dto/create-area.dto";

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areasRepo: Repository<AreaEntity>,
  ) {}

  async findAll() {
    return this.areasRepo.find({
      order: { name: "ASC" },
    });
  }

  async create(dto: CreateAreaDto) {
    const exists = await this.areasRepo.exists({ where: { name: dto.name } });
    if (exists) throw new ConflictException("Ya existe un área con ese nombre.");

    const area = this.areasRepo.create({ name: dto.name.trim() });
    return this.areasRepo.save(area);
  }
}
