import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(220)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  fullName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUUID()
  areaId?: string | null;

  @IsOptional()
  @IsUUID()
  programId?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
