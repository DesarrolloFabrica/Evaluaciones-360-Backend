import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AreaEntity } from "./entities/area.entity";
import { AreasController } from "./areas.controller";
import { AreasService } from "./areas.service";

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService, TypeOrmModule],
})
export class AreasModule {}
