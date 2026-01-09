import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProgramsService } from "./programs.service";
import { CreateProgramDto } from "./dto/create-program.dto";

@Controller("programs")
export class ProgramsController {
  constructor(private readonly programs: ProgramsService) {}

  @Get()
  list(@Query("areaId") areaId?: string) {
    return this.programs.findAll(areaId);
  }

  @Post()
  create(@Body() dto: CreateProgramDto) {
    return this.programs.create(dto);
  }
}
