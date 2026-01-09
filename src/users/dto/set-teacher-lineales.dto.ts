import { IsArray, IsUUID } from "class-validator";

export class SetTeacherLinealesDto {
  @IsArray()
  @IsUUID("4", { each: true })
  linealIds: string[];
}
