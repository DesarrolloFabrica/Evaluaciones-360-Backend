import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinesController } from "./lines.controller";
import { LinesService } from "./lines.service";

import { ProgramEntity } from "../programs/entities/program.entity";
import { UserEntity } from "../users/entities/user.entity"; // ✅
import { LinesEntity } from "./entities/lines.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LinesEntity, ProgramEntity, UserEntity])], // ✅
  controllers: [LinesController],
  providers: [LinesService],
  exports: [LinesService, TypeOrmModule],
})
export class LinesModule {}
