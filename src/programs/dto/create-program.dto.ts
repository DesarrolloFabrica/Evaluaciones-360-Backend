import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateProgramDto {
  @IsUUID()
  areaId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
}
