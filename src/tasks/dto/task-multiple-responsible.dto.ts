import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TaskMultipleResponsibleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  task_id: string;

  @IsNotEmpty()
  @ApiProperty()
  responsible_id: string[];
}
