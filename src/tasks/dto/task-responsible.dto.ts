import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TaskResponsibleDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  task_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  responsible_id: string;
}
