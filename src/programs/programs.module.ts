import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgramEntity } from "./entities/program.entity";
import { ProgramsController } from "./programs.controller";
import { ProgramsService } from "./programs.service";
import { AreaEntity } from "../areas/entities/area.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProgramEntity, AreaEntity])],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService, TypeOrmModule],
})
export class ProgramsModule {}
