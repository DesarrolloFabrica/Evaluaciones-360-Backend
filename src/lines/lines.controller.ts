import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { LinesService } from "./lines.service";
import { CreateLinealDto } from "./dto/create-lineal.dto";

@Controller("lineales")
export class LinesController {
  constructor(private readonly lineales: LinesService) {}

  @Get()
  list(@Query("programId") programId?: string) {
    return this.lineales.findAll(programId);
  }

  @Post()
  create(@Body() dto: CreateLinealDto) {
    return this.lineales.create(dto);
  }
}
