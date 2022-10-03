import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @ApiProperty()
  task_id: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: string;
}
