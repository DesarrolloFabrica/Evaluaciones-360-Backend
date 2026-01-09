import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  name: string;
}
