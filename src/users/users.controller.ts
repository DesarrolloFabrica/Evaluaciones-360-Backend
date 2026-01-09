import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SetTeacherLinealesDto } from "./dto/set-teacher-lineales.dto";
import { UserRole } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(
    @Query("role") role?: UserRole,
    @Query("areaId") areaId?: string,
    @Query("programId") programId?: string,
    @Query("isActive") isActive?: string,
  ) {
    return this.users.list({
      role,
      areaId,
      programId,
      isActive: isActive === undefined ? undefined : isActive === "true",
    });
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.users.getById(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Put(":id/lineales")
  setLineales(@Param("id") id: string, @Body() dto: SetTeacherLinealesDto) {
    return this.users.setTeacherLineales(id, dto.linealIds);
  }
}
