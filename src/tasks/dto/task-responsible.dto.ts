import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TaskResponsibleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  task_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  responsible_id: string;
}
