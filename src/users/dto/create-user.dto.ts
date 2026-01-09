import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @IsEmail()
  @MaxLength(220)
  email: string;

  @IsString()
  @MaxLength(220)
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsUUID()
  areaId?: string | null;

  @IsOptional()
  @IsUUID()
  programId?: string | null;

  // solo para DOCENTE (puede ser vacío, pero si llega debe ser uuid[])
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  linealIds?: string[];
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
