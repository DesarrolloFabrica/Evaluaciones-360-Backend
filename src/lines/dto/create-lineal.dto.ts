import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateLinealDto {
  @IsUUID()
  programId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  name: string;
}
