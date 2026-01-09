import { Body, Controller, Get, Post } from "@nestjs/common";
import { AreasService } from "./areas.service";
import { CreateAreaDto } from "./dto/create-area.dto";

@Controller("areas")
export class AreasController {
  constructor(private readonly areas: AreasService) {}

  @Get()
  list() {
    return this.areas.findAll();
  }

  @Post()
  create(@Body() dto: CreateAreaDto) {
    return this.areas.create(dto);
  }
}
