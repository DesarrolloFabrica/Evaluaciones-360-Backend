import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

import { UserEntity } from "./entities/user.entity";
import { AreaEntity } from "../areas/entities/area.entity";
import { ProgramEntity } from "../programs/entities/program.entity";
import { LinesEntity } from "../lines/entities/lines.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AreaEntity, ProgramEntity, LinesEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
